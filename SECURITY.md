# Security Design Documentation

## User-Level Data Isolation

### Overview
This application implements **strict user-level data isolation** as a core security principle. Every user can ONLY access their own financial records, regardless of their role.

### Design Decision
**All database queries MUST filter by `userId`** to prevent unauthorized access to other users' data.

### Implementation

#### 1. Service Layer Enforcement
All service methods require `userId` as the first parameter and use it in every database query.

**Record Service** (`src/services/recordService.js`):
```javascript
// ✅ CORRECT: Every query includes userId filter
async getRecords(userId, filters, pagination, includeDeleted) {
  const query = { userId }; // REQUIRED: userId filter
  // ... additional filters
  return FinancialRecord.find(query);
}

async getRecordById(userId, recordId, includeDeleted) {
  const query = { 
    _id: recordId,
    userId  // REQUIRED: Prevents accessing other users' records
  };
  return FinancialRecord.findOne(query);
}

async updateRecord(userId, recordId, updateData) {
  // REQUIRED: Both _id AND userId must match
  return FinancialRecord.findOneAndUpdate(
    { _id: recordId, userId, isDeleted: false },
    updateData
  );
}

async deleteRecord(userId, recordId) {
  // REQUIRED: Both _id AND userId must match
  return FinancialRecord.findOneAndUpdate(
    { _id: recordId, userId, isDeleted: false },
    { isDeleted: true }
  );
}
```

**Analytics Service** (`src/services/analyticsService.js`):
```javascript
// ✅ CORRECT: All aggregations filter by userId
async getDashboardSummary(userId, startDate, endDate) {
  const summary = await FinancialRecord.aggregate([
    {
      $match: {
        userId: userId,  // REQUIRED: First filter in aggregation
        isDeleted: false,
        ...dateFilter
      }
    }
  ]);
}

async getCategoryBreakdown(userId, type, startDate, endDate) {
  const matchFilter = {
    userId: userId,  // REQUIRED: Always present
    isDeleted: false,
    ...dateFilter
  };
  return FinancialRecord.aggregate([{ $match: matchFilter }]);
}

async getMonthlyTrends(userId, months) {
  return FinancialRecord.aggregate([
    {
      $match: {
        userId: userId,  // REQUIRED: Isolates user data
        isDeleted: false,
        date: { $gte: startDate }
      }
    }
  ]);
}

async getRecentTransactions(userId, limit) {
  return FinancialRecord.find({ 
    userId,  // REQUIRED: User-specific query
    isDeleted: false 
  });
}

async getTopSpendingInsight(userId, startDate, endDate) {
  return FinancialRecord.aggregate([
    {
      $match: {
        userId: userId,  // REQUIRED: First aggregation stage
        type: 'expense',
        isDeleted: false,
        ...dateFilter
      }
    }
  ]);
}
```

#### 2. Controller Layer
Controllers extract `userId` from `req.user` (set by authentication middleware) and pass it to services.

```javascript
// ✅ CORRECT: Always use req.user._id
async getRecords(req, res, next) {
  const result = await recordService.getRecords(
    req.user._id,  // REQUIRED: Authenticated user's ID
    filters,
    pagination,
    includeDeleted
  );
}

async updateRecord(req, res, next) {
  const record = await recordService.updateRecord(
    req.user._id,  // REQUIRED: Ensures user owns the record
    req.params.id,
    req.body
  );
}
```

#### 3. Authentication Middleware
The `authenticate` middleware (`src/middleware/auth.js`) verifies JWT and attaches user to request:

```javascript
const authenticate = async (req, res, next) => {
  // Extract and verify JWT token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  // Fetch user from database
  const user = await User.findById(decoded.userId);
  
  // Attach to request for downstream use
  req.user = user;  // Contains user._id, role, etc.
  next();
};
```

### Security Guarantees

#### ✅ What This Prevents
1. **Horizontal Privilege Escalation**: User A cannot access User B's records
2. **Data Leakage**: Analytics only show authenticated user's data
3. **Unauthorized Modifications**: Users cannot update/delete others' records
4. **Enumeration Attacks**: Guessing record IDs returns 404 if not owned by user

#### ✅ Attack Scenarios Prevented

**Scenario 1: Direct Record Access**
```bash
# User A tries to access User B's record
GET /api/v1/records/507f1f77bcf86cd799439012
Authorization: Bearer <user_a_token>

# Query executed:
FinancialRecord.findOne({ 
  _id: "507f1f77bcf86cd799439012",
  userId: user_a_id  // ← Prevents access if record belongs to user_b
})

# Result: 404 Not Found (even if record exists)
```

**Scenario 2: Update Attempt**
```bash
# User A tries to update User B's record
PATCH /api/v1/records/507f1f77bcf86cd799439012
Authorization: Bearer <user_a_token>

# Query executed:
FinancialRecord.findOneAndUpdate(
  { 
    _id: "507f1f77bcf86cd799439012",
    userId: user_a_id  // ← Prevents update if not owner
  },
  updateData
)

# Result: 404 Not Found
```

**Scenario 3: Analytics Isolation**
```bash
# User A requests dashboard
GET /api/v1/analytics/dashboard
Authorization: Bearer <user_a_token>

# Aggregation executed:
FinancialRecord.aggregate([
  { $match: { userId: user_a_id } }  // ← Only user_a's data
])

# Result: Only User A's financial summary
```

### Database-Level Protection

**Compound Indexes** enforce efficient user-scoped queries:
```javascript
// From FinancialRecord model
financialRecordSchema.index({ userId: 1, date: -1 });
financialRecordSchema.index({ userId: 1, type: 1, category: 1 });
financialRecordSchema.index({ userId: 1, isDeleted: 1 });
```

These indexes ensure:
- Fast queries when filtering by userId
- Encourages userId-first query patterns
- Performance optimization for user-scoped operations

### Role-Based Access Control (RBAC) vs Data Isolation

**Important Distinction:**
- **RBAC** controls what actions users can perform (create, update, delete)
- **Data Isolation** ensures users only access their own data

**Both work together:**
```javascript
// Example: Delete endpoint
router.delete('/:id',
  authenticate,                          // 1. Verify user identity
  authorize(PERMISSIONS.DELETE_RECORDS), // 2. Check if role allows deletion
  recordController.deleteRecord          // 3. Service ensures userId match
);
```

Even if a user has `DELETE_RECORDS` permission, they can only delete their own records.

### Admin Considerations

**Current Implementation:**
- Admins have elevated permissions (delete, manage users)
- Admins still only see their own financial records
- `includeDeleted` parameter only works for admin's own deleted records

**Future Enhancement (if needed):**
If admins need to view all users' data (e.g., for support), add explicit admin bypass:
```javascript
// Example: Admin override (NOT currently implemented)
async getRecords(userId, filters, pagination, includeDeleted, isAdminOverride = false) {
  const query = isAdminOverride ? {} : { userId };
  // ... rest of query
}
```

**⚠️ Security Warning:** Admin override should:
- Be explicitly documented
- Require additional permission check
- Log all admin access for audit trail
- Only be used for legitimate support cases

### Testing Data Isolation

**Manual Testing:**
1. Create two users (User A and User B)
2. Create records for both users
3. Login as User A
4. Try to access User B's record by ID → Should return 404
5. Check analytics → Should only show User A's data

**Example Test:**
```bash
# Register User A
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"usera@test.com","password":"test123","name":"User A","role":"analyst"}'

# Register User B
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"userb@test.com","password":"test123","name":"User B","role":"analyst"}'

# Login as User A, create record, note the record ID
# Login as User B, try to access User A's record ID
# Expected: 404 Not Found
```

### Code Review Checklist

When adding new features, ensure:
- [ ] All service methods accept `userId` as first parameter
- [ ] All database queries include `userId` filter
- [ ] Controllers pass `req.user._id` to services
- [ ] Aggregation pipelines have `userId` in first `$match` stage
- [ ] No direct database queries in controllers
- [ ] No hardcoded user IDs or admin bypasses without explicit documentation

### Anti-Patterns to Avoid

**❌ WRONG: Query without userId filter**
```javascript
// SECURITY VULNERABILITY!
async getAllRecords() {
  return FinancialRecord.find({}); // Returns ALL users' data
}
```

**❌ WRONG: Optional userId parameter**
```javascript
// SECURITY VULNERABILITY!
async getRecords(userId = null, filters) {
  const query = userId ? { userId } : {}; // Allows querying all data
  return FinancialRecord.find(query);
}
```

**❌ WRONG: Using req.params.userId instead of req.user._id**
```javascript
// SECURITY VULNERABILITY!
async getRecords(req, res) {
  // Attacker can manipulate userId in URL
  const result = await recordService.getRecords(req.params.userId);
}
```

**✅ CORRECT: Always use authenticated user's ID**
```javascript
async getRecords(req, res) {
  // userId comes from verified JWT token
  const result = await recordService.getRecords(req.user._id);
}
```

### Summary

**Core Principle:** Every database query MUST filter by `userId` from the authenticated user's JWT token.

**Implementation Status:** ✅ Fully implemented across all services
- Record Service: 5/5 methods enforce userId filtering
- Analytics Service: 5/5 methods enforce userId filtering
- Controllers: All use `req.user._id` from authenticated session

**Security Level:** High - Prevents horizontal privilege escalation and data leakage

**Audit Status:** All code reviewed and verified for user-level data isolation

---

**Last Updated:** 2026-04-05  
**Reviewed By:** Backend Engineering Team  
**Next Review:** When adding new features or endpoints
