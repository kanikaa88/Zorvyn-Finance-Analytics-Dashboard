# Automated API Test Suite

Comprehensive automated testing for the Finance Analytics Dashboard API covering Rate Limiting, Error Handling, Security, and RBAC.

## 📋 Test Coverage

### Test 5: Rate Limiting
- ✅ Auth endpoint rate limit (5 requests/minute)
- ✅ Rate limit headers verification
- ✅ Rate limit reset after time window
- ✅ Global rate limit configuration check

### Test 6: Error Handling
- ✅ Invalid token returns 401
- ✅ Missing token returns 401
- ✅ Invalid data validation returns 400
- ✅ Record not found returns 404
- ✅ Wrong credentials return 401
- ✅ Error format consistency across endpoints

### Test 7: Security & RBAC
- ✅ User data isolation (cannot read other users' records)
- ✅ RBAC - Create records permission (Viewer ❌, Analyst ✅, Admin ✅)
- ✅ RBAC - Update records permission (Viewer ❌, Analyst ✅, Admin ✅)
- ✅ RBAC - Delete records permission (Viewer ❌, Analyst ❌, Admin ✅)
- ✅ RBAC - Analytics insights permission (Viewer ❌, Analyst ✅, Admin ✅)
- ✅ RBAC - Budget management permissions
- ✅ JWT authentication verification
- ✅ Password security (hashing)
- ✅ Soft delete functionality

## 🚀 Quick Start

### Prerequisites

1. **Backend running:**
   ```bash
   npm run dev
   ```

2. **Database seeded:**
   ```bash
   npm run seed
   ```

3. **Dependencies installed:**
   ```bash
   npm install
   ```

### Run Tests

```bash
npm test
```

Or with auto-reload on file changes:
```bash
npm run test:watch
```

## 📊 Expected Output

```
╔════════════════════════════════════════════════════════════╗
║     AUTOMATED API TEST SUITE - Tests 5, 6, 7              ║
║     Finance Analytics Dashboard                           ║
╚════════════════════════════════════════════════════════════╝

============================================================
SETUP: Logging in all demo users
============================================================

✅ PASS: Admin logged in successfully
✅ PASS: Analyst logged in successfully
✅ PASS: Viewer logged in successfully

============================================================
TEST 5: RATE LIMITING
============================================================

🧪 TEST: 5.1: Auth endpoint rate limit (5/min)
ℹ️  Status codes: 401, 401, 401, 401, 401, 429
✅ PASS: Auth rate limit triggered (429 Too Many Requests)
✅ PASS: Rate limit headers present (Retry-After: 60)

...

============================================================
TEST SUMMARY
============================================================

Total Tests: 25
✅ Passed: 25
❌ Failed: 0
⏱️  Duration: 72.45s

📊 Pass Rate: 100.0%

============================================================
✅ ALL TESTS PASSED!
============================================================
```

## 🔧 Configuration

Edit the configuration at the top of `automated-api-tests.js`:

```javascript
const BASE_URL = 'http://localhost:5000/api/v1';
const DEMO_USERS = {
  admin: { email: 'admin@demo.com', password: 'admin123' },
  analyst: { email: 'analyst@demo.com', password: 'analyst123' },
  viewer: { email: 'viewer@demo.com', password: 'viewer123' }
};
```

## ⚠️ Important Notes

### Rate Limit Test Duration
The rate limit test includes a 65-second wait to verify that rate limits reset properly. This is intentional and necessary for accurate testing.

### Test Order
Tests are designed to run in sequence. Do not run them in parallel as they may interfere with each other (especially rate limit tests).

### Database State
Tests create temporary records and budgets during execution. These are used for RBAC testing and are not cleaned up automatically (soft-deleted records remain in database).

## 🐛 Troubleshooting

### "Setup failed" Error
**Problem:** Cannot login demo users

**Solutions:**
1. Make sure backend is running: `npm run dev`
2. Seed the database: `npm run seed`
3. Check MongoDB is running
4. Verify BASE_URL is correct

### "Connection refused" Error
**Problem:** Cannot connect to backend

**Solutions:**
1. Verify backend is running on port 5000
2. Check if another process is using port 5000
3. Verify BASE_URL in test configuration

### Rate Limit Tests Failing
**Problem:** Rate limit not triggering or not resetting

**Solutions:**
1. Check `src/middleware/rateLimiter.js` configuration
2. Verify you're in development mode (NODE_ENV=development)
3. Wait longer for rate limit to reset (may need >60 seconds)
4. Restart backend to reset rate limit counters

### RBAC Tests Failing
**Problem:** Permission checks not working as expected

**Solutions:**
1. Verify `src/config/roles.js` configuration
2. Check `src/middleware/authorize.js` is applied to routes
3. Ensure demo users have correct roles in database
4. Re-seed database: `npm run seed`

## 📝 Test Details

### Test 5.1: Auth Rate Limit
Makes 6 rapid login requests. The 6th should return 429 (Too Many Requests).

**Expected:** At least 1 request returns 429
**Rate Limit:** 5 requests per minute (development mode)

### Test 5.2: Rate Limit Reset
Waits 65 seconds and verifies login works again.

**Expected:** Login succeeds after wait period
**Wait Time:** 65 seconds (60s window + 5s buffer)

### Test 6.1-6.6: Error Handling
Tests various error scenarios and verifies correct HTTP status codes and error format.

**Expected Error Format:**
```json
{
  "success": false,
  "message": "Error description",
  "details": null
}
```

### Test 7.1: User Data Isolation
Verifies users cannot access other users' records.

**Expected:** 404 Not Found (not 403) to prevent information disclosure

### Test 7.2-7.6: RBAC Permissions
Tests role-based access control for all operations.

**Permission Matrix:**
| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| Create Record | ❌ 403 | ✅ 201 | ✅ 201 |
| Update Record | ❌ 403 | ✅ 200 | ✅ 200 |
| Delete Record | ❌ 403 | ❌ 403 | ✅ 204 |
| View Insights | ❌ 403 | ✅ 200 | ✅ 200 |
| Create Budget | ❌ 403 | ✅ 201 | ✅ 201 |
| Delete Budget | ❌ 403 | ❌ 403 | ✅ 204 |

## 🔄 Continuous Integration

To run tests in CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run API Tests
  run: |
    npm run seed
    npm test
```

## 📈 Future Enhancements

Potential additions to the test suite:
- [ ] Performance testing (response time benchmarks)
- [ ] Load testing (concurrent requests)
- [ ] Analytics calculation verification
- [ ] Budget calculation accuracy tests
- [ ] CSV export format validation
- [ ] Date range filtering tests
- [ ] Pagination tests
- [ ] Soft delete verification (database queries)

## 🤝 Contributing

To add new tests:

1. Add test function in `automated-api-tests.js`
2. Use `log.test()`, `log.pass()`, `log.fail()` for consistent output
3. Update this README with test details
4. Ensure tests are idempotent (can run multiple times)

## 📄 License

MIT
