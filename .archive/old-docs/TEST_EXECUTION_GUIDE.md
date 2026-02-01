# WatchHive - Test Execution Guide

**Version**: 1.0.0  
**Last Updated**: January 30, 2026  
**Purpose**: Guide for executing regression tests before release

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Automated Tests](#automated-tests)
3. [Manual Tests](#manual-tests)
4. [Test Reports](#test-reports)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites

Before running tests, ensure:
- ✅ Backend server running on port 5001
- ✅ Frontend server running on port 3000
- ✅ Database connected (Supabase)
- ✅ All dependencies installed

### Quick Test Run

```bash
# Run automated regression tests
./test-regression.sh
```

---

## 🤖 Automated Tests

### Running Automated API Tests

The automated test suite (`test-regression.sh`) runs 11 critical API tests:

```bash
# Basic run
./test-regression.sh

# With custom API URL
API_URL=https://api-staging.watchhive.com ./test-regression.sh

# With custom frontend URL
FRONTEND_URL=https://staging.watchhive.com ./test-regression.sh
```

### What Gets Tested

1. **TC-API-005**: Health Check
2. **TC-API-001**: User Registration
3. **TC-AUTH-002**: Duplicate Username Validation
4. **TC-AUTH-003**: Duplicate Email Validation
5. **TC-AUTH-004**: Weak Password Validation
6. **TC-AUTH-005**: Invalid Email Validation
7. **TC-API-002**: User Login
8. **TC-AUTH-007**: Invalid Login Credentials
9. **TC-API-003**: Token Refresh
10. **TC-API-004**: User Logout
11. **TC-SEC-001**: SQL Injection Prevention

### Expected Output

```
========================================
WatchHive Automated Regression Tests
========================================
API URL: http://localhost:5001
Frontend URL: http://localhost:3000
Test User: autotest_1738234567
Test Email: autotest_1738234567@watchhive.com

========================================
Pre-flight Checks
========================================
✓ Backend server is running
✓ Frontend server is running

========================================
Running API Tests
========================================
▶ TC-API-005: Health Check
✓ PASS: Health check endpoint responding

▶ TC-API-001: User Registration
✓ PASS: User registration successful

... (more tests)

========================================
Test Summary
========================================
Total Tests: 11
Passed: 11
Failed: 0

Pass Rate: 100%
✓ Test suite PASSED (≥95% pass rate)
```

### Exit Codes

- **0**: All tests passed (≥95% pass rate)
- **1**: Tests failed (<80% pass rate)

### Integration with CI/CD

```yaml
# Example GitHub Actions workflow
name: Regression Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd server && npm install
          cd ../client && npm install
      - name: Start servers
        run: |
          cd server && npm run dev &
          cd client && npm run dev &
          sleep 10
      - name: Run regression tests
        run: ./test-regression.sh
```

---

## 📝 Manual Tests

### Pre-Release Manual Test Checklist

Use the comprehensive test plan in `REGRESSION_TEST_PLAN.md`. Here's the critical path:

#### 1. Authentication Flow (15 minutes)

**TC-AUTH-001: User Registration**
```
1. Go to http://localhost:3000
2. Click "Sign up"
3. Fill form with unique data
4. Click "Create Account"
5. Verify redirect to feed
6. Verify welcome message
```

**TC-AUTH-006: User Login**
```
1. Logout
2. Go to login page
3. Enter credentials
4. Click "Log In"
5. Verify redirect to feed
```

**TC-AUTH-009: User Logout**
```
1. Click "Logout"
2. Verify redirect to login
3. Verify cannot access protected routes
```

#### 2. Protected Routes (5 minutes)

**TC-ROUTE-001 & TC-ROUTE-002**
```
1. Logout
2. Try to access /watch-hive/feed
3. Verify redirect to login
4. Try to access /watch-hive/profile
5. Verify redirect to login
```

#### 3. UI/UX Verification (10 minutes)

**TC-UI-001: Login Page**
```
1. Check gradient background
2. Check glassmorphism card
3. Check all form elements
4. Check animations
5. Test on mobile (resize to 375px)
```

**TC-UI-002: Signup Page**
```
1. Check all 4 input fields
2. Check helper text
3. Check validation hints
4. Check button styling
```

#### 4. Database Verification (5 minutes)

**TC-DB-001: User Creation**
```
1. Create new user
2. Open Prisma Studio (http://localhost:5555)
3. Check users table
4. Verify password is hashed
5. Verify all fields populated
```

#### 5. Security Tests (10 minutes)

**TC-SEC-001: SQL Injection**
```
1. Try username: admin' OR '1'='1
2. Try email: ' OR '1'='1' --
3. Verify no injection occurs
```

**TC-SEC-002: XSS Prevention**
```
1. Register with display name: <script>alert('XSS')</script>
2. View profile
3. Verify script not executed
```

### Total Manual Testing Time

- **Critical Path**: ~45 minutes
- **Full Suite**: ~2 hours

---

## 📊 Test Reports

### Generating Test Reports

After running tests, document results:

```markdown
# Test Run Report

**Test Run ID**: TR-20260130-01
**Version**: 1.0.0
**Environment**: Local
**Tester**: [Your Name]
**Date**: 2026-01-30
**Duration**: 45 minutes

## Summary
- Total Tests: 50
- Passed: 48
- Failed: 2
- Pass Rate: 96%

## Failed Tests
| Test ID | Description | Severity | Notes |
|---------|-------------|----------|-------|
| TC-UI-004 | Mobile responsive | P1 | Navbar overlaps on 320px |
| TC-PERF-001 | Page load time | P2 | 2.1s (target: <2s) |

## Recommendation
✅ APPROVED FOR RELEASE
Minor issues can be fixed in next release.
```

### Test Metrics Dashboard

Track over time:

| Date | Version | Tests | Passed | Failed | Pass Rate |
|------|---------|-------|--------|--------|-----------|
| 2026-01-30 | 1.0.0 | 50 | 48 | 2 | 96% |
| 2026-01-25 | 0.9.0 | 45 | 43 | 2 | 95.6% |
| 2026-01-20 | 0.8.0 | 40 | 38 | 2 | 95% |

---

## 🔧 Troubleshooting

### Common Issues

#### "Backend server is not running"

**Solution**:
```bash
cd server
npm run dev
```

Wait for:
```
🚀 WatchHive API Server
📡 Server running on http://localhost:5001
💾 Database: Connected
```

#### "Frontend server is not running"

**Solution**:
```bash
cd client
npm run dev
```

Wait for:
```
VITE v5.4.21  ready in 181 ms
➜  Local:   http://localhost:3000/
```

#### "Database connection failed"

**Solution**:
1. Check `server/.env` has correct `DATABASE_URL`
2. Verify Supabase project is running
3. Test connection:
```bash
cd server
npx prisma db pull
```

#### "Tests failing with 401 errors"

**Cause**: JWT tokens expired or invalid

**Solution**:
- Tests create new users automatically
- If still failing, check backend logs
- Verify JWT_SECRET in `server/.env`

#### "Tests failing with 500 errors"

**Cause**: Server error

**Solution**:
1. Check backend terminal for errors
2. Check database connection
3. Verify all migrations applied:
```bash
cd server
npx prisma migrate status
```

---

## 📋 Pre-Release Checklist

### Before Running Tests

- [ ] Backend server running
- [ ] Frontend server running
- [ ] Database connected
- [ ] All dependencies installed
- [ ] Environment variables set
- [ ] No uncommitted changes

### Running Tests

- [ ] Run automated tests: `./test-regression.sh`
- [ ] All automated tests pass (≥95%)
- [ ] Run critical manual tests
- [ ] All P0 tests pass
- [ ] All P1 tests pass
- [ ] Document any failures

### After Tests

- [ ] Review test results
- [ ] File bugs for failures
- [ ] Update test documentation
- [ ] Get sign-off from team
- [ ] Tag release in git
- [ ] Deploy to staging
- [ ] Run smoke tests on staging

---

## 🎯 Test Execution Schedule

### Daily (Automated)
```bash
# Run critical path tests
./test-regression.sh
```
**Time**: 2 minutes  
**When**: Before commits

### Weekly (Manual + Automated)
```bash
# Full regression suite
./test-regression.sh
# + Manual critical tests
```
**Time**: 1 hour  
**When**: Friday afternoons

### Pre-Release (Full Suite)
```bash
# All automated tests
./test-regression.sh

# All manual tests (use REGRESSION_TEST_PLAN.md)
# Document results
# Get sign-off
```
**Time**: 2-3 hours  
**When**: Before each release

### Post-Deployment (Smoke Tests)
```bash
# Production smoke tests
API_URL=https://api.watchhive.com ./test-regression.sh
```
**Time**: 5 minutes  
**When**: After deployment

---

## 📚 Related Documentation

- **`REGRESSION_TEST_PLAN.md`** - Complete test plan with all test cases
- **`test-regression.sh`** - Automated test script
- **`API_TESTING_GUIDE.md`** - API testing guide
- **`INTEGRATION_TEST_REPORT.md`** - Integration test results

---

## 🆘 Support

**Questions?**
- Check `REGRESSION_TEST_PLAN.md` for detailed test cases
- Review `TROUBLESHOOTING.md` for common issues
- Contact QA team

---

## 📝 Test Execution Log Template

```markdown
# Test Execution Log

## Test Run Information
- **ID**: TR-YYYYMMDD-NN
- **Version**: X.Y.Z
- **Environment**: Local/Staging/Production
- **Tester**: [Name]
- **Date**: YYYY-MM-DD
- **Start Time**: HH:MM
- **End Time**: HH:MM
- **Duration**: X minutes

## Pre-Test Checklist
- [ ] Backend running
- [ ] Frontend running
- [ ] Database connected
- [ ] Clean test environment

## Automated Tests
- **Command**: `./test-regression.sh`
- **Result**: PASS/FAIL
- **Pass Rate**: XX%
- **Failed Tests**: [List]

## Manual Tests
- **TC-AUTH-001**: ✅ PASS
- **TC-AUTH-006**: ✅ PASS
- **TC-UI-001**: ✅ PASS
- **TC-DB-001**: ✅ PASS
... (continue for all tests)

## Issues Found
| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| BUG-001 | P1 | [Description] | Open |

## Recommendation
✅ APPROVED FOR RELEASE
⚠️ APPROVED WITH WARNINGS
❌ NOT APPROVED

## Sign-Off
- **Tester**: [Name] - [Date]
- **Tech Lead**: [Name] - [Date]
- **Product Owner**: [Name] - [Date]
```

---

**Document Version**: 1.0.0  
**Last Updated**: January 30, 2026  
**Next Review**: February 30, 2026
