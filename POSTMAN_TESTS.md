# Complete Postman Testing Guide - Step by Step

This guide provides **detailed, beginner-friendly instructions** for testing every API endpoint. Follow each step exactly as written.

---

## 📋 Prerequisites

1. **Postman installed** - Download from [postman.com](https://www.postman.com/downloads/)
2. **Backend running** - Run `npm run dev` in terminal
3. **Database seeded** - Run `npm run seed` to create demo users
4. **Notepad ready** - You'll need to save tokens

---

## 🔑 Understanding Tokens (READ THIS FIRST!)

**What is a token?**
A token is like a digital key that proves who you are. When you login or register, the server gives you a token. You must include this token in every request to access protected endpoints.

**What does a token look like?**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzRhZjg5ZTRiMmMxMDA1YTNkNjQyZiIsImlhdCI6MTcxNDU2NzU2MSwiZXhwIjoxNzE3MTU5NTYxfQ.K8vZ9mXqYwH3jK5nL2pM4rT6sU8vW0xY1zA2bC3dE4f
```
(It's a long string with dots in it)

**How to use a token in Postman?**
1. Go to the **Headers** tab
2. Add a header with:
   - **Key:** `Authorization`
   - **Value:** `Bearer YOUR_TOKEN_HERE` (note the space after "Bearer")

**Why do we save multiple tokens?**
In these tests, you'll create 3 different users (Analyst, Admin, Viewer). Each user gets their own token. You'll save all 3 tokens so you can test different permission levels.

**Token Cheat Sheet:**
- **ANALYST TOKEN** (from Test 1.1) = testuser@example.com = Can create/update records = NEW USER (minimal data)
- **ADMIN TOKEN** (from Test 1.2) = admin@demo.com = Can do everything including delete = DEMO USER (6 months of data)
- **VIEWER TOKEN** (from Test 1.3) = viewer@demo.com = Can only view, cannot create/update/delete = DEMO USER (6 months of data)

**💡 Pro Tip: Which token to use for testing?**
- **For permission testing** (RBAC): Use any token to test if permissions work correctly
- **For viewing realistic analytics**: Use ADMIN TOKEN or VIEWER TOKEN (demo users have lots of sample data)
- **For testing with fresh data**: Use ANALYST TOKEN (testuser@example.com has only what you create)

---

## 🎯 Part 1: AUTHENTICATION TESTS

### Test 1.1: Register a New User

**💡 What you're doing:** Creating a brand new user account (testuser@example.com) with no data yet

**Step 1:** Open Postman and click the **"+"** button to create a new request

**Step 2:** Set up the request:
- **Method:** Select `POST` from dropdown
- **URL:** `http://localhost:5000/api/v1/auth/register`

**Step 3:** Add the request body:
- Click the **"Body"** tab (below the URL bar)
- Select **"raw"** radio button
- Select **"JSON"** from the dropdown (right side)
- Paste this JSON:
```json
{
  "email": "testuser@example.com",
  "password": "test123",
  "name": "Test User",
  "role": "analyst"
}
```

**Step 4:** Click the blue **"Send"** button

**✅ Expected Response:**
- Status: `201 Created` (bottom right)
- Response body:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "testuser@example.com",
      "name": "Test User",
      "role": "analyst"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Step 5:** **🔑 SAVE THIS TOKEN** - You'll need it for Test 1.4 and other tests!
- Look at the response body in Postman
- Find the line that says `"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`
- **Double-click** on the token value (the long string) to select it
- Press **Ctrl+C** (Windows) or **Cmd+C** (Mac) to copy
- Open Notepad or any text editor
- Paste the token
- Add a label above it: **"ANALYST TOKEN (from Test 1.1)"**
- Your notepad should look like:
```
ANALYST TOKEN (from Test 1.1):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzRhZjg5ZTRiMmMxMDA...
```

---

### Test 1.2: Login with Demo User

**💡 What you're doing:** Logging in as admin@demo.com (a pre-seeded user with 6 months of sample data)

**Step 1:** Create a new request (click "+")

**Step 2:** Set up the request:
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/v1/auth/login`

**Step 3:** Add the request body:
- Click **"Body"** tab
- Select **"raw"** and **"JSON"**
- Paste:
```json
{
  "email": "admin@demo.com",
  "password": "admin123"
}
```

**Step 4:** Click **"Send"**

**✅ Expected Response:**
- Status: `200 OK`
- Response includes `token`

**Step 5:** **🔑 SAVE THIS TOKEN**
- Copy the token from the response (same way as Test 1.1)
- Paste in your notepad
- Label it: **"ADMIN TOKEN (from Test 1.2)"**

---

### Test 1.3: Login as Viewer

**💡 What you're doing:** Logging in as viewer@demo.com (a pre-seeded user with 6 months of sample data)

**Repeat Test 1.2 with:**
```json
{
  "email": "viewer@demo.com",
  "password": "viewer123"
}
```

**Step 5:** **🔑 SAVE THIS TOKEN**
- Copy the token from the response
- Paste in your notepad  
- Label it: **"VIEWER TOKEN (from Test 1.3)"**

**📝 Your notepad should now have 3 tokens:**
```
ANALYST TOKEN (from Test 1.1):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzRhZjg5...

ADMIN TOKEN (from Test 1.2):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzRhZjg5...

VIEWER TOKEN (from Test 1.3):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzRhZjg5...
```

---

### Test 1.4: Get Current User Info

**🎯 WHICH TOKEN TO USE:** Use the **ANALYST TOKEN** from Test 1.1 (the one labeled "ANALYST TOKEN" in your notepad)

**Step 1:** Create a new request

**Step 2:** Set up the request:
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/v1/auth/me`

**Step 3:** Add authentication:
- Click the **"Headers"** tab (below the URL bar)
- Click in the **"Key"** field and type: `Authorization`
- Click in the **"Value"** field and type: `Bearer ` (with a space after Bearer)
- Then paste your ANALYST TOKEN right after the space
- **Final result should look like:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2M...`

**📝 Example of what to type in the Value field:**
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzRhZjg5ZTRiMmMxMDA...
```
(Your token will be different - copy it from your notepad where you saved "ANALYST TOKEN")

**Step 4:** Click **"Send"**

**✅ Expected Response:**
- Status: `200 OK`
- Response shows YOUR user information (the testuser@example.com you created in Test 1.1):
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "email": "testuser@example.com",
      "name": "Test User",
      "role": "analyst"
    }
  }
}
```

**💡 Understanding this endpoint:**
This endpoint tells you "who am I?" based on the token you send:
- Send ADMIN TOKEN (from Test 1.2) → Returns admin@demo.com info
- Send ANALYST TOKEN (from Test 1.1) → Returns testuser@example.com info  
- Send VIEWER TOKEN (from Test 1.3) → Returns viewer@demo.com info

**🔄 Try it yourself:** Change the token in the Authorization header to ADMIN TOKEN or VIEWER TOKEN and see how the response changes!

---

## 📊 Part 2: FINANCIAL RECORDS TESTS

### Test 2.1: Create a Record (as Analyst)

**🔑 TOKEN TO USE:** ANALYST TOKEN (from Test 1.1)

**Step 1:** Create a new request

**Step 2:** Set up the request:
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/v1/records`

**Step 3:** Add headers:
- Click **"Headers"** tab
- Add header:
  - **Key:** `Authorization`
  - **Value:** `Bearer YOUR_ANALYST_TOKEN` (paste your ANALYST TOKEN after "Bearer ")

**Step 4:** Add the request body:
- Click **"Body"** tab
- Select **"raw"** and **"JSON"**
- Paste:
```json
{
  "amount": 5000,
  "type": "expense",
  "category": "Food",
  "date": "2026-04-06",
  "notes": "Grocery shopping"
}
```

**Step 5:** Click **"Send"**

**✅ Expected Response:**
- Status: `201 Created`
- Response includes the created record with an `_id`

**Step 6:** **IMPORTANT** - Copy the `_id` from the response and save it as "RECORD ID" in your notepad

---

### Test 2.2: Create Record as Viewer (Should Fail)

**🔑 TOKEN TO USE:** VIEWER TOKEN (from Test 1.3)

**Repeat Test 2.1 but:**
- Use **VIEWER TOKEN** in the Authorization header instead of ANALYST TOKEN
- Same body as Test 2.1

**✅ Expected Response:**
- Status: `403 Forbidden`
- Error message: "Insufficient permissions"

**🎯 This proves RBAC is working!** Viewers cannot create records. ✅

---

### Test 2.3: Get All Records

**🔑 TOKEN TO USE:** ANALYST TOKEN (from Test 1.1)

**Step 1:** Create a new request

**Step 2:** Set up the request:
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/v1/records`

**Step 3:** Add headers:
- **Key:** `Authorization` | **Value:** `Bearer YOUR_ANALYST_TOKEN`

**Step 4:** Click **"Send"**

**✅ Expected Response:**
- Status: `200 OK`
- List of records (only YOUR records, not other users' records)
- Pagination info

---

### Test 2.4: Filter Records by Type

**Step 1:** Create a new request

**Step 2:** Set up the request:
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/v1/records?type=expense`
  - Notice the `?type=expense` at the end

**Step 3:** Add headers:
- **Key:** `Authorization` | **Value:** `Bearer YOUR_ANALYST_TOKEN`

**Step 4:** Click **"Send"**

**✅ Expected Response:**
- Status: `200 OK`
- Only expense records returned

---

### Test 2.5: Filter by Category

**URL:** `http://localhost:5000/api/v1/records?category=Food`

**✅ Expected:** Only Food category records

---

### Test 2.6: Filter by Amount Range

**URL:** `http://localhost:5000/api/v1/records?minAmount=1000&maxAmount=10000`

**✅ Expected:** Only records between ₹1,000 and ₹10,000

---

### Test 2.7: Multiple Filters Combined

**URL:** `http://localhost:5000/api/v1/records?type=expense&category=Food&minAmount=500`

**✅ Expected:** Expense records in Food category with amount >= ₹500

---

### Test 2.8: Update a Record (as Analyst)

**🔑 TOKEN TO USE:** ANALYST TOKEN (from Test 1.1)

**Step 1:** Create a new request

**Step 2:** Set up the request:
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/v1/records/YOUR_RECORD_ID`
  - Replace `YOUR_RECORD_ID` with the ID you saved from Test 2.1

**Step 3:** Add headers:
- **Key:** `Authorization` | **Value:** `Bearer YOUR_ANALYST_TOKEN`

**Step 4:** Add body:
```json
{
  "amount": 6000,
  "notes": "Updated amount"
}
```

**Step 5:** Click **"Send"**

**✅ Expected Response:**
- Status: `200 OK`
- Updated record returned

---

### Test 2.9: Delete a Record (as Analyst - Should Fail)

**🔑 TOKEN TO USE:** ANALYST TOKEN (from Test 1.1)

**Step 1:** Create a new request

**Step 2:** Set up the request:
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/v1/records/YOUR_RECORD_ID`

**Step 3:** Add headers:
- **Key:** `Authorization` | **Value:** `Bearer YOUR_ANALYST_TOKEN`

**Step 4:** Click **"Send"**

**✅ Expected Response:**
- Status: `403 Forbidden`
- Error: "Insufficient permissions"

**🎯 This proves only Admin can delete!** ✅

---

### Test 2.10: Delete a Record (as Admin - Should Work)

**🔑 TOKEN TO USE:** ADMIN TOKEN (from Test 1.2)

**⚠️ IMPORTANT:** You need to delete an ADMIN's record, not the Analyst's record from Test 2.1!

**Step 1:** First, create a record as Admin:
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/v1/records`
- **Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`
- **Body:**
```json
{
  "amount": 10000,
  "type": "expense",
  "category": "Bills",
  "date": "2026-04-06",
  "notes": "Test record for deletion"
}
```
- **Save the `_id` from the response as "ADMIN RECORD ID"**

**Step 2:** Now delete this admin record:
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/v1/records/YOUR_ADMIN_RECORD_ID`
- **Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**✅ Expected Response:**
- Status: `204 No Content`
- Empty response body (this is normal for successful delete)

**💡 Why can't Admin delete Analyst's record?**
This system enforces user-level data isolation. Even though Admin has DELETE permission, they can only delete their own records. This prevents accidental or malicious deletion of other users' data. Each user's financial data is completely isolated.

---

### Test 2.11: Export Records to CSV

**Step 1:** Create a new request

**Step 2:** Set up the request:
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/v1/records/export`

**Step 3:** Add headers:
- **Key:** `Authorization` | **Value:** `Bearer YOUR_ANALYST_TOKEN`

**Step 4:** Click **"Send"**

**✅ Expected Response:**
- Status: `200 OK`
- Response body shows CSV data
- You can copy this and save as .csv file

---

## 📈 Part 3: ANALYTICS TESTS

### Test 3.1: Get Dashboard Summary

**🔑 TOKEN TO USE:** ADMIN TOKEN (from Test 1.2) - Use demo user to see realistic data

**Step 1:** Create a new request

**Step 2:** Set up the request:
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/v1/analytics/dashboard`

**Step 3:** Add headers:
- **Key:** `Authorization` | **Value:** `Bearer YOUR_ADMIN_TOKEN`

**Step 4:** Click **"Send"**

**✅ Expected Response:**
- Status: `200 OK`
- Response with realistic data (demo users have 6 months of sample data):
```json
{
  "success": true,
  "data": {
    "totalIncome": 1500000,
    "totalExpenses": 500000,
    "netBalance": 1000000,
    "period": {
      "startDate": "all time",
      "endDate": "present"
    }
  }
}
```

**💡 Note:** If you use ANALYST TOKEN (testuser@example.com), you'll see minimal data because that's a new user with only the records you created in the tests. Demo users (admin@demo.com, analyst@demo.com, viewer@demo.com) have 6 months of sample data generated by the seed script.

---

### Test 3.2: Get Category Breakdown

**🔑 TOKEN TO USE:** ADMIN TOKEN (from Test 1.2)

**URL:** `http://localhost:5000/api/v1/analytics/category-breakdown`

**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**✅ Expected Response:**
- Status: `200 OK`
- Breakdown by category with totals (demo users have diverse categories)

---

### Test 3.3: Get Monthly Trends

**🔑 TOKEN TO USE:** ADMIN TOKEN (from Test 1.2)

**URL:** `http://localhost:5000/api/v1/analytics/monthly-trends`

**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**✅ Expected Response:**
- Status: `200 OK`
- Monthly data for last 6 months (demo users have 6 months of data)

---

### Test 3.4: Get Financial Insights (as Analyst)

**🔑 TOKEN TO USE:** ANALYST TOKEN (from Test 1.1)

**URL:** `http://localhost:5000/api/v1/analytics/insights/summary`

**Headers:** 
- **Key:** `Authorization` | **Value:** `Bearer YOUR_ANALYST_TOKEN`

**✅ Expected Response:**
- Status: `200 OK`
- Array of insights with messages

---

### Test 3.5: Get Financial Insights (as Viewer - Should Fail)

**🔑 TOKEN TO USE:** VIEWER TOKEN (from Test 1.3)

**Same as Test 3.4 but use VIEWER TOKEN**

**✅ Expected Response:**
- Status: `403 Forbidden`
- Error: "Insufficient permissions"

**🎯 This proves Viewers cannot access insights!** ✅

---

## 💰 Part 4: BUDGET TESTS

### Test 4.1: Create a Budget (as Analyst)

**🔑 TOKEN TO USE:** ANALYST TOKEN (from Test 1.1)

**Step 1:** Create a new request

**Step 2:** Set up the request:
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/v1/budgets`

**Step 3:** Add headers:
- **Key:** `Authorization` | **Value:** `Bearer YOUR_ANALYST_TOKEN`

**Step 4:** Add body:
```json
{
  "category": "Food",
  "limitAmount": 50000,
  "month": 4,
  "year": 2026
}
```

**Step 5:** Click **"Send"**

**✅ Expected Response:**
- Status: `201 Created`
- Budget created with ID

**Step 6:** Save the budget `_id` as "BUDGET ID"

**💡 Understanding Budget Constraints:**
The system prevents duplicate budgets - you can only have ONE budget per category per month. If you try to create another "Food" budget for April 2026, you'll get a duplicate error. This is by design to prevent confusion.

---

### Test 4.2: Get Budget Status

**🔑 TOKEN TO USE:** ANALYST TOKEN (from Test 1.1) - Use the token that created the budget

**Step 1:** Create a new request

**Step 2:** Set up the request:
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/v1/budgets/status`

**Step 3:** Add headers:
- **Key:** `Authorization` | **Value:** `Bearer YOUR_ANALYST_TOKEN`

**Step 4:** Click **"Send"**

**✅ Expected Response:**
- Status: `200 OK`
- Shows budget vs actual spending
- Status: OK, WARNING, or EXCEEDED

**💡 Note:** Use the same token that created the budget in Test 4.1. If you want to see budgets with actual spending data, use ADMIN TOKEN or login as analyst@demo.com (you'll need to get a fresh token for analyst@demo.com).

---

### Test 4.3: Get All Budgets

**🔑 TOKEN TO USE:** ANALYST TOKEN (from Test 1.1)

**Step 1:** Create a new request

**Step 2:** Set up the request:
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/v1/budgets`

**Step 3:** Add headers:
- **Key:** `Authorization` | **Value:** `Bearer YOUR_ANALYST_TOKEN`

**Step 4:** Click **"Send"**

**✅ Expected Response:**
- Status: `200 OK`
- List of all your budgets (only budgets you created)

---

### Test 4.4: Update a Budget

**🔑 TOKEN TO USE:** ANALYST TOKEN (from Test 1.1)

**Step 1:** Create a new request

**Step 2:** Set up the request:
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/v1/budgets/YOUR_BUDGET_ID`
  - Replace `YOUR_BUDGET_ID` with the ID you saved from Test 4.1

**Step 3:** Add headers:
- **Key:** `Authorization` | **Value:** `Bearer YOUR_ANALYST_TOKEN`

**Step 4:** Add body:
- Click **"Body"** tab
- Select **"raw"** and **"JSON"**
- Paste:
```json
{
  "limitAmount": 60000
}
```

**Step 5:** Click **"Send"**

**✅ Expected Response:**
- Status: `200 OK`
- Updated budget with new limitAmount

---

### Test 4.5: Delete a Budget (as Admin)

**🔑 TOKEN TO USE:** ADMIN TOKEN (from Test 1.2)

**⚠️ IMPORTANT:** You need to delete an ADMIN's budget, not the Analyst's budget!

**Step 1:** First, create a budget as Admin:
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/v1/budgets`
- **Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`
- **Body:**
```json
{
  "category": "Shopping",
  "limitAmount": 25000,
  "month": 5,
  "year": 2026
}
```
- **Save the `_id` from the response as "ADMIN BUDGET ID"**

**💡 Note:** We use May 2026 and Shopping category to avoid duplicate budget errors. The database prevents creating multiple budgets for the same category in the same month.

**Step 2:** Now delete this admin budget:
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/v1/budgets/YOUR_ADMIN_BUDGET_ID`
- **Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Step 3:** Click **"Send"**

**✅ Expected Response:**
- Status: `204 No Content`
- Empty response body

**💡 Why can't Admin delete Analyst's budget?**
Same as records - user-level data isolation. Admin can only delete their own budgets.

**🐛 Troubleshooting:**
If you get "Duplicate value" error, it means a budget already exists for that category/month/year. Change the category (e.g., "Healthcare", "Transport") or month (e.g., 6, 7) in Step 1.

---

## 🚦 Part 5: RATE LIMITING TESTS

### Test 5.1: Hit Auth Rate Limit

**Step 1:** Create a login request (see Test 1.2)

**Step 2:** In Postman, click the three dots (...) next to your request name

**Step 3:** Select **"Run"** or use Collection Runner

**Step 4:** Set **Iterations** to `6`

**Step 5:** Click **"Run"**

**✅ Expected Result:**
- First 5 requests: `200 OK` or `401 Unauthorized`
- 6th request: `429 Too Many Requests`
- Error message: "Too many authentication attempts"

---

### Test 5.2: Verify Rate Limit Resets

**Step 1:** After hitting the limit, wait **1 minute**

**Step 2:** Try login again

**✅ Expected Result:**
- Request works normally (200 or 401)
- Rate limit counter has reset

---

## ❌ Part 6: ERROR HANDLING TESTS

### Test 6.1: Invalid Token

**URL:** `http://localhost:5000/api/v1/records`

**Headers:**
- **Key:** `Authorization` | **Value:** `Bearer invalid_token_here`

**✅ Expected Response:**
- Status: `401 Unauthorized`
- Error: "Invalid token"

---

### Test 6.2: Missing Token

**URL:** `http://localhost:5000/api/v1/records`

**Headers:** Don't add Authorization header

**✅ Expected Response:**
- Status: `401 Unauthorized`
- Error: "Authentication required"

---

### Test 6.3: Invalid Data Validation

**Method:** `POST`
**URL:** `http://localhost:5000/api/v1/records`

**Headers:** Use ANALYST TOKEN

**Body:**
```json
{
  "amount": -500,
  "type": "invalid_type",
  "category": "",
  "date": "not-a-date"
}
```

**✅ Expected Response:**
- Status: `400 Bad Request`
- Validation errors for each field

---

### Test 6.4: Record Not Found

**Method:** `GET`
**URL:** `http://localhost:5000/api/v1/records/507f1f77bcf86cd799439011`

**Headers:** Use ANALYST TOKEN

**✅ Expected Response:**
- Status: `404 Not Found`
- Error: "Record not found"

---

## 🔒 Part 7: SECURITY & RBAC TESTS

### Test 7.1: User Data Isolation

**🎯 Purpose:** Verify that users can only access their own records, not other users' records

**Step 1:** Login as ANALYST and create a record (you already did this in Test 2.1)
- Note the RECORD ID from Test 2.1

**Step 2:** Login as VIEWER (use VIEWER TOKEN from Test 1.3)

**Step 3:** Try to access the analyst's record:
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/v1/records/ANALYST_RECORD_ID`
  - Use the record ID from Test 2.1
- **Headers:** `Authorization: Bearer YOUR_VIEWER_TOKEN`

**✅ Expected Response:**
- Status: `404 Not Found`
- Error: "Record not found"

**💡 What this proves:**
Even though the record exists in the database, the Viewer cannot see it because it belongs to the Analyst. The system returns 404 (not found) instead of 403 (forbidden) to prevent information disclosure - the Viewer doesn't even know the record exists!

**Step 4:** Try to delete the analyst's record as Admin:
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/v1/records/ANALYST_RECORD_ID`
- **Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**✅ Expected Response:**
- Status: `404 Not Found`
- Error: "Record not found"

**💡 What this proves:**
Even Admin cannot delete another user's records! This system enforces strict user-level data isolation. Each user's financial data is completely private and isolated from all other users, including admins.

---

### Test 7.2: Permission Matrix

**Test each combination to verify RBAC works correctly:**

| Action | Viewer | Analyst | Admin | Notes |
|--------|--------|---------|-------|-------|
| Create Record | ❌ 403 | ✅ 201 | ✅ 201 | Viewer lacks permission |
| Read Own Records | ✅ 200 | ✅ 200 | ✅ 200 | All roles can read their own |
| Read Other's Records | ❌ 404 | ❌ 404 | ❌ 404 | Data isolation enforced |
| Update Own Record | ❌ 403 | ✅ 200 | ✅ 200 | Viewer lacks permission |
| Update Other's Record | ❌ 403 | ❌ 404 | ❌ 404 | Cannot access others' data |
| Delete Own Record | ❌ 403 | ❌ 403 | ✅ 204 | Only Admin can delete |
| Delete Other's Record | ❌ 403 | ❌ 403 | ❌ 404 | Cannot access others' data |
| View Analytics | ✅ 200 | ✅ 200 | ✅ 200 | All roles can view analytics |
| View Insights | ❌ 403 | ✅ 200 | ✅ 200 | Viewer lacks permission |
| Create Budget | ❌ 403 | ✅ 201 | ✅ 201 | Viewer lacks permission |
| Delete Budget | ❌ 403 | ❌ 403 | ✅ 204 | Only Admin can delete |

**Key Security Features:**
1. **RBAC (Role-Based Access Control):** Controls WHO can perform actions
   - Viewer: Read-only access
   - Analyst: Can create and update
   - Admin: Full access including delete

2. **User-Level Data Isolation:** Controls WHAT data users can access
   - Users can ONLY access their own records
   - Even Admin cannot see/modify other users' records
   - Returns 404 (not 403) to prevent information disclosure

**Test each combination to verify!**

---

## 📝 COMPLETE TESTING CHECKLIST

### Authentication ✅
- [ ] Register new user works
- [ ] Login with correct credentials works
- [ ] Login with wrong credentials fails (401)
- [ ] Get current user info works
- [ ] Invalid token returns 401
- [ ] Missing token returns 401

### Financial Records ✅
- [ ] Create record (Analyst/Admin) works
- [ ] Create record (Viewer) fails with 403
- [ ] Get all records works
- [ ] Get single record works
- [ ] Filter by type works
- [ ] Filter by category works
- [ ] Filter by amount range works
- [ ] Filter by date range works
- [ ] Multiple filters combined work
- [ ] Pagination works
- [ ] Update record (Analyst/Admin) works
- [ ] Update record (Viewer) fails with 403
- [ ] Delete record (Admin) works
- [ ] Delete record (Analyst/Viewer) fails with 403
- [ ] Export CSV works
- [ ] User can only see own records

### Analytics ✅
- [ ] Dashboard summary works
- [ ] Category breakdown works
- [ ] Monthly trends works
- [ ] Recent transactions works
- [ ] Financial insights (Analyst/Admin) works
- [ ] Financial insights (Viewer) fails with 403
- [ ] Date range filtering works

### Budgets ✅
- [ ] Create budget (Analyst/Admin) works
- [ ] Create budget (Viewer) fails with 403
- [ ] Get all budgets works
- [ ] Get budget status works
- [ ] Budget calculations are correct
- [ ] Status thresholds work (OK/WARNING/EXCEEDED)
- [ ] Update budget works
- [ ] Delete budget (Admin) works
- [ ] Delete budget (Analyst/Viewer) fails with 403
- [ ] User can only see own budgets

### Rate Limiting ✅
- [ ] Auth rate limit (5/min) works
- [ ] Global rate limit (1000/15min in dev) works
- [ ] Rate limit returns 429 status
- [ ] Rate limit resets after time window
- [ ] Rate limit headers present

### Error Handling ✅
- [ ] Validation errors return 400
- [ ] Authentication errors return 401
- [ ] Permission errors return 403
- [ ] Not found errors return 404
- [ ] Rate limit errors return 429
- [ ] Server errors return 500
- [ ] Error format is consistent
- [ ] Stack traces hidden in production

### Security ✅
- [ ] JWT authentication works
- [ ] Passwords are hashed
- [ ] User data isolation enforced
- [ ] RBAC permissions enforced
- [ ] Input validation works
- [ ] Soft deletes work
- [ ] No SQL injection possible
- [ ] No unauthorized access possible

---

## 🎯 QUICK REFERENCE

### Base URL
```
http://localhost:5000/api/v1
```

### Demo Credentials
```
Admin:   admin@demo.com / admin123
Analyst: analyst@demo.com / analyst123
Viewer:  viewer@demo.com / viewer123
```

### Common Headers
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

### HTTP Status Codes
- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Success (no body)
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Auth required/invalid
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limited
- `500 Internal Server Error` - Server error

---

## 💡 TIPS

1. **Save your tokens** - You'll use them repeatedly
2. **Use Collections** - Organize tests in Postman collections
3. **Use Variables** - Store tokens as Postman variables
4. **Check status codes** - They tell you what went wrong
5. **Read error messages** - They're descriptive
6. **Test systematically** - Follow the checklist
7. **Document issues** - Note any failures

---

## 🐛 TROUBLESHOOTING

**Problem:** "Cannot POST /api/v1/auth/login"
- **Solution:** Check URL spelling, make sure backend is running

**Problem:** "Authentication required"
- **Solution:** Add Authorization header with Bearer token

**Problem:** "Invalid token"
- **Solution:** Get a fresh token by logging in again

**Problem:** "Too many requests"
- **Solution:** Wait for rate limit to reset, or restart backend

**Problem:** "Record not found"
- **Solution:** Make sure you're using the correct record ID

**Problem:** "Insufficient permissions"
- **Solution:** Use correct role token (Admin for delete, etc.)

---

**You're now ready to test the entire API! Follow each test step-by-step and check off the checklist as you go.** ✅
