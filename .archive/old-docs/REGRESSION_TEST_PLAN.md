# WatchHive - Comprehensive Regression Test Plan

**Version**: 1.0.0  
**Last Updated**: January 30, 2026  
**Status**: Active  
**Purpose**: Pre-Release Testing & Quality Assurance

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Test Strategy](#test-strategy)
3. [Test Environments](#test-environments)
4. [Test Categories](#test-categories)
5. [Manual Test Cases](#manual-test-cases)
6. [Automated Test Cases](#automated-test-cases)
7. [Performance Tests](#performance-tests)
8. [Security Tests](#security-tests)
9. [Database Tests](#database-tests)
10. [Release Checklist](#release-checklist)

---

## 🎯 Overview

### Purpose
This regression test plan ensures that all WatchHive features work correctly before each release. It covers:
- Core functionality
- User authentication
- Database operations
- API endpoints
- UI/UX
- Performance
- Security

### Scope
- **Frontend**: React application (all pages and components)
- **Backend**: Express API (all endpoints)
- **Database**: PostgreSQL (Supabase)
- **Integration**: End-to-end user flows

### Test Execution Frequency
- **Pre-Release**: All tests must pass
- **Post-Deployment**: Smoke tests
- **Weekly**: Full regression suite
- **Daily**: Critical path tests

---

## 🎯 Test Strategy

### Testing Pyramid

```
         /\
        /  \  E2E Tests (10%)
       /____\
      /      \  Integration Tests (30%)
     /________\
    /          \  Unit Tests (60%)
   /____________\
```

### Test Levels

1. **Unit Tests** (60%)
   - Individual functions
   - Components
   - Services
   - Utilities

2. **Integration Tests** (30%)
   - API endpoints
   - Database operations
   - Service interactions

3. **E2E Tests** (10%)
   - User workflows
   - Critical paths
   - Cross-browser

---

## 🌍 Test Environments

### 1. Local Development
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5001
- **Database**: Supabase (development)
- **Purpose**: Developer testing

### 2. Staging
- **Frontend**: https://staging.watchhive.com
- **Backend**: https://api-staging.watchhive.com
- **Database**: Supabase (staging)
- **Purpose**: Pre-production testing

### 3. Production
- **Frontend**: https://watchhive.com
- **Backend**: https://api.watchhive.com
- **Database**: Supabase (production)
- **Purpose**: Smoke tests only

---

## 📊 Test Categories

### Priority Levels
- **P0 (Critical)**: Must pass before release
- **P1 (High)**: Should pass before release
- **P2 (Medium)**: Nice to have
- **P3 (Low)**: Optional

### Test Types
- **Functional**: Feature functionality
- **Non-Functional**: Performance, security, usability
- **Regression**: Existing features still work
- **Smoke**: Basic functionality check

---

## 🧪 Manual Test Cases

### Category 1: Authentication (P0 - Critical)

#### TC-AUTH-001: User Registration - Happy Path
**Priority**: P0  
**Type**: Functional  
**Preconditions**: None

**Steps**:
1. Navigate to http://localhost:3000
2. Click "Sign up" link
3. Fill in form:
   - Username: `testuser_[timestamp]`
   - Email: `test_[timestamp]@watchhive.com`
   - Display Name: `Test User`
   - Password: `TestPass123`
4. Click "Create Account"

**Expected Results**:
- ✅ Form validates successfully
- ✅ User is created in database
- ✅ Password is hashed (BCrypt)
- ✅ JWT tokens generated
- ✅ User auto-logged in
- ✅ Redirected to `/watch-hive/feed`
- ✅ Welcome message shows display name
- ✅ Navbar shows username
- ✅ Logout button visible

**Actual Results**: _[To be filled during test execution]_  
**Status**: ⬜ Pass / ⬜ Fail  
**Tested By**: _[Name]_  
**Date**: _[Date]_

---

#### TC-AUTH-002: User Registration - Duplicate Username
**Priority**: P0  
**Type**: Functional, Negative

**Steps**:
1. Navigate to signup page
2. Use existing username: `testuser123`
3. Fill other fields with valid data
4. Click "Create Account"

**Expected Results**:
- ✅ Error message: "Username already exists"
- ✅ User not created in database
- ✅ Form remains on signup page
- ✅ Other fields retain values

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-AUTH-003: User Registration - Duplicate Email
**Priority**: P0  
**Type**: Functional, Negative

**Steps**:
1. Navigate to signup page
2. Use existing email: `test@watchhive.com`
3. Fill other fields with valid data
4. Click "Create Account"

**Expected Results**:
- ✅ Error message: "Email already exists"
- ✅ User not created in database

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-AUTH-004: User Registration - Weak Password
**Priority**: P1  
**Type**: Functional, Validation

**Steps**:
1. Navigate to signup page
2. Enter password: `weak`
3. Try to submit

**Expected Results**:
- ✅ Validation error: "Password must be at least 8 characters"
- ✅ Form not submitted

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-AUTH-005: User Registration - Invalid Email Format
**Priority**: P1  
**Type**: Functional, Validation

**Steps**:
1. Navigate to signup page
2. Enter email: `notanemail`
3. Try to submit

**Expected Results**:
- ✅ Validation error: "Email is invalid"
- ✅ Form not submitted

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-AUTH-006: User Login - Happy Path
**Priority**: P0  
**Type**: Functional

**Preconditions**: User exists (email: `test@watchhive.com`, password: `TestPass123`)

**Steps**:
1. Navigate to http://localhost:3000
2. Enter email: `test@watchhive.com`
3. Enter password: `TestPass123`
4. Click "Log In"

**Expected Results**:
- ✅ Credentials validated
- ✅ JWT tokens generated
- ✅ Tokens stored in localStorage
- ✅ User redirected to `/watch-hive/feed`
- ✅ User info displayed correctly
- ✅ Navbar shows authenticated state

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-AUTH-007: User Login - Invalid Credentials
**Priority**: P0  
**Type**: Functional, Negative

**Steps**:
1. Navigate to login page
2. Enter email: `test@watchhive.com`
3. Enter password: `WrongPassword123`
4. Click "Log In"

**Expected Results**:
- ✅ Error message: "Login failed. Please check your credentials."
- ✅ User not logged in
- ✅ Remains on login page
- ✅ No tokens stored

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-AUTH-008: User Login - Non-existent User
**Priority**: P1  
**Type**: Functional, Negative

**Steps**:
1. Navigate to login page
2. Enter email: `nonexistent@watchhive.com`
3. Enter password: `TestPass123`
4. Click "Log In"

**Expected Results**:
- ✅ Error message displayed
- ✅ User not logged in

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-AUTH-009: User Logout
**Priority**: P0  
**Type**: Functional

**Preconditions**: User is logged in

**Steps**:
1. Click "Logout" button in navbar

**Expected Results**:
- ✅ Tokens cleared from localStorage
- ✅ User redirected to `/watch-hive/login`
- ✅ Navbar shows unauthenticated state
- ✅ Cannot access protected routes

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-AUTH-010: Token Refresh
**Priority**: P0  
**Type**: Functional

**Preconditions**: User is logged in

**Steps**:
1. Log in and note access token
2. Wait 16 minutes (or modify JWT expiry to 1 minute for testing)
3. Make an API request (e.g., navigate to profile)

**Expected Results**:
- ✅ Access token expires
- ✅ Refresh token used automatically
- ✅ New access token received
- ✅ Request succeeds
- ✅ No interruption to user

**Status**: ⬜ Pass / ⬜ Fail

---

### Category 2: Protected Routes (P0 - Critical)

#### TC-ROUTE-001: Access Feed Without Login
**Priority**: P0  
**Type**: Functional, Security

**Preconditions**: User is logged out

**Steps**:
1. Navigate directly to http://localhost:3000/watch-hive/feed

**Expected Results**:
- ✅ Redirected to `/watch-hive/login`
- ✅ Feed page not accessible

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-ROUTE-002: Access Profile Without Login
**Priority**: P0  
**Type**: Functional, Security

**Preconditions**: User is logged out

**Steps**:
1. Navigate directly to http://localhost:3000/watch-hive/profile

**Expected Results**:
- ✅ Redirected to `/watch-hive/login`
- ✅ Profile page not accessible

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-ROUTE-003: Access Login When Logged In
**Priority**: P1  
**Type**: Functional

**Preconditions**: User is logged in

**Steps**:
1. Navigate to http://localhost:3000/watch-hive/login

**Expected Results**:
- ✅ Redirected to `/watch-hive/feed`
- ✅ Login page not shown

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-ROUTE-004: Access Signup When Logged In
**Priority**: P1  
**Type**: Functional

**Preconditions**: User is logged in

**Steps**:
1. Navigate to http://localhost:3000/watch-hive/signup

**Expected Results**:
- ✅ Redirected to `/watch-hive/feed`
- ✅ Signup page not shown

**Status**: ⬜ Pass / ⬜ Fail

---

### Category 3: User Profile (P1 - High)

#### TC-PROFILE-001: View Own Profile
**Priority**: P1  
**Type**: Functional

**Preconditions**: User is logged in

**Steps**:
1. Click "Profile" in navbar

**Expected Results**:
- ✅ Profile page loads
- ✅ User avatar displayed (or placeholder)
- ✅ Display name shown
- ✅ Username shown
- ✅ Email shown
- ✅ All fields populated correctly

**Status**: ⬜ Pass / ⬜ Fail

---

### Category 4: UI/UX (P1 - High)

#### TC-UI-001: Login Page Design
**Priority**: P1  
**Type**: Visual, UX

**Steps**:
1. Navigate to login page

**Expected Results**:
- ✅ "WatchHive" logo with gradient
- ✅ Tagline visible
- ✅ Animated gradient background
- ✅ Glassmorphism card effect
- ✅ Email field with icon
- ✅ Password field with icon
- ✅ "Log In" button with gradient
- ✅ "Sign up" link visible
- ✅ Smooth animations
- ✅ Responsive on mobile

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-UI-002: Signup Page Design
**Priority**: P1  
**Type**: Visual, UX

**Steps**:
1. Navigate to signup page

**Expected Results**:
- ✅ "WatchHive" logo with gradient
- ✅ "Create Account" heading
- ✅ All 4 input fields visible
- ✅ Helper text displayed
- ✅ Validation hints shown
- ✅ "Create Account" button
- ✅ "Log in" link visible
- ✅ Consistent styling with login

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-UI-003: Navbar - Authenticated State
**Priority**: P1  
**Type**: Visual, UX

**Preconditions**: User is logged in

**Expected Results**:
- ✅ "WatchHive" logo visible
- ✅ "Feed" link visible
- ✅ "Profile" link visible
- ✅ Username displayed
- ✅ "Logout" button visible
- ✅ Glassmorphism effect
- ✅ Sticky positioning

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-UI-004: Responsive Design - Mobile
**Priority**: P1  
**Type**: Visual, UX

**Steps**:
1. Resize browser to 375px width (iPhone size)
2. Navigate through all pages

**Expected Results**:
- ✅ All pages responsive
- ✅ No horizontal scroll
- ✅ Text readable
- ✅ Buttons accessible
- ✅ Forms usable
- ✅ Navbar adapts

**Status**: ⬜ Pass / ⬜ Fail

---

### Category 5: API Endpoints (P0 - Critical)

#### TC-API-001: POST /api/v1/auth/register
**Priority**: P0  
**Type**: API, Integration

**Request**:
```bash
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "apitest",
    "email": "apitest@test.com",
    "password": "ApiTest123"
  }'
```

**Expected Response**:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "username": "apitest",
    "email": "apitest@test.com",
    "displayName": null
  }
}
```

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-API-002: POST /api/v1/auth/login
**Priority**: P0  
**Type**: API, Integration

**Request**:
```bash
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@watchhive.com",
    "password": "TestPass123"
  }'
```

**Expected Response**:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "username": "testuser123",
    "email": "test@watchhive.com",
    "displayName": "Test User"
  }
}
```

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-API-003: POST /api/v1/auth/refresh
**Priority**: P0  
**Type**: API, Integration

**Request**:
```bash
curl -X POST http://localhost:5001/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGc..."
  }'
```

**Expected Response**:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-API-004: POST /api/v1/auth/logout
**Priority**: P1  
**Type**: API, Integration

**Request**:
```bash
curl -X POST http://localhost:5001/api/v1/auth/logout \
  -H "Authorization: Bearer eyJhbGc..."
```

**Expected Response**:
```json
{
  "message": "Logged out successfully"
}
```

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-API-005: GET /health
**Priority**: P0  
**Type**: API, Smoke

**Request**:
```bash
curl http://localhost:5001/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-01-30T10:30:00.000Z"
}
```

**Status**: ⬜ Pass / ⬜ Fail

---

### Category 6: Database (P0 - Critical)

#### TC-DB-001: User Creation
**Priority**: P0  
**Type**: Database, Integration

**Steps**:
1. Create user via API
2. Open Prisma Studio
3. Check `users` table

**Expected Results**:
- ✅ User record exists
- ✅ `id` is UUID
- ✅ `username` matches
- ✅ `email` matches
- ✅ `password_hash` is BCrypt hash (starts with `$2a$10$`)
- ✅ `created_at` timestamp set
- ✅ `updated_at` timestamp set

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-DB-002: Unique Constraints
**Priority**: P0  
**Type**: Database, Validation

**Steps**:
1. Create user with username `uniquetest`
2. Try to create another user with same username

**Expected Results**:
- ✅ Second creation fails
- ✅ Error: "Unique constraint violation"
- ✅ Only one record in database

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-DB-003: Password Hashing
**Priority**: P0  
**Type**: Security, Database

**Steps**:
1. Create user with password `TestPassword123`
2. Check database

**Expected Results**:
- ✅ Password NOT stored as plain text
- ✅ `password_hash` starts with `$2a$10$`
- ✅ Hash is 60 characters long
- ✅ Different users with same password have different hashes

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-DB-004: Database Connection
**Priority**: P0  
**Type**: Infrastructure, Smoke

**Steps**:
1. Start backend server
2. Check logs

**Expected Results**:
- ✅ "Database: Connected" in logs
- ✅ No connection errors
- ✅ Prisma Client initialized

**Status**: ⬜ Pass / ⬜ Fail

---

### Category 7: Security (P0 - Critical)

#### TC-SEC-001: SQL Injection Prevention
**Priority**: P0  
**Type**: Security, Negative

**Steps**:
1. Try to register with username: `admin' OR '1'='1`
2. Try to login with email: `' OR '1'='1' --`

**Expected Results**:
- ✅ No SQL injection occurs
- ✅ Input treated as literal string
- ✅ Prisma ORM prevents injection

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-SEC-002: XSS Prevention
**Priority**: P0  
**Type**: Security, Negative

**Steps**:
1. Register with display name: `<script>alert('XSS')</script>`
2. View profile

**Expected Results**:
- ✅ Script not executed
- ✅ Text displayed as-is
- ✅ React escapes HTML

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-SEC-003: JWT Token Validation
**Priority**: P0  
**Type**: Security

**Steps**:
1. Get valid JWT token
2. Modify token payload
3. Try to access protected route

**Expected Results**:
- ✅ Request rejected
- ✅ 401 Unauthorized error
- ✅ "Invalid token" message

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-SEC-004: CORS Configuration
**Priority**: P1  
**Type**: Security

**Steps**:
1. Make API request from different origin
2. Check CORS headers

**Expected Results**:
- ✅ CORS headers present
- ✅ Only allowed origins accepted
- ✅ Credentials allowed if needed

**Status**: ⬜ Pass / ⬜ Fail

---

### Category 8: Performance (P1 - High)

#### TC-PERF-001: Page Load Time
**Priority**: P1  
**Type**: Performance

**Steps**:
1. Open browser DevTools
2. Navigate to login page
3. Check Network tab

**Expected Results**:
- ✅ Page loads in < 2 seconds
- ✅ First Contentful Paint < 1 second
- ✅ Time to Interactive < 3 seconds

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-PERF-002: API Response Time
**Priority**: P1  
**Type**: Performance

**Steps**:
1. Make login API request
2. Measure response time

**Expected Results**:
- ✅ Response time < 500ms
- ✅ Database query < 100ms
- ✅ No N+1 queries

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-PERF-003: Bundle Size
**Priority**: P2  
**Type**: Performance

**Steps**:
1. Build frontend: `npm run build`
2. Check bundle size

**Expected Results**:
- ✅ Main bundle < 500KB
- ✅ Vendor bundle < 1MB
- ✅ Code splitting enabled

**Status**: ⬜ Pass / ⬜ Fail

---

### Category 9: Cross-Browser (P1 - High)

#### TC-BROWSER-001: Chrome
**Priority**: P1  
**Type**: Compatibility

**Steps**:
1. Test all features in Chrome (latest)

**Expected Results**:
- ✅ All features work
- ✅ UI renders correctly
- ✅ No console errors

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-BROWSER-002: Firefox
**Priority**: P1  
**Type**: Compatibility

**Steps**:
1. Test all features in Firefox (latest)

**Expected Results**:
- ✅ All features work
- ✅ UI renders correctly
- ✅ No console errors

**Status**: ⬜ Pass / ⬜ Fail

---

#### TC-BROWSER-003: Safari
**Priority**: P1  
**Type**: Compatibility

**Steps**:
1. Test all features in Safari (latest)

**Expected Results**:
- ✅ All features work
- ✅ UI renders correctly
- ✅ No console errors

**Status**: ⬜ Pass / ⬜ Fail

---

## 📝 Test Execution Template

### Test Run Information
- **Test Run ID**: TR-[YYYYMMDD]-[NN]
- **Version**: [Version Number]
- **Environment**: [Local/Staging/Production]
- **Tester**: [Name]
- **Date**: [Date]
- **Duration**: [Time]

### Summary
- **Total Tests**: [Number]
- **Passed**: [Number]
- **Failed**: [Number]
- **Blocked**: [Number]
- **Skipped**: [Number]
- **Pass Rate**: [Percentage]

### Failed Tests
| Test ID | Description | Severity | Bug ID | Status |
|---------|-------------|----------|--------|--------|
| TC-XXX-XXX | [Description] | P0 | BUG-XXX | Open |

---

## ✅ Release Checklist

### Pre-Release (Must Complete)

#### Code Quality
- [ ] All P0 tests passed
- [ ] All P1 tests passed
- [ ] No critical bugs open
- [ ] Code reviewed
- [ ] No console errors
- [ ] No TypeScript errors

#### Functionality
- [ ] User can register
- [ ] User can login
- [ ] User can logout
- [ ] Protected routes work
- [ ] Profile displays correctly
- [ ] Database operations work

#### Security
- [ ] Passwords hashed
- [ ] JWT tokens secure
- [ ] No SQL injection
- [ ] No XSS vulnerabilities
- [ ] CORS configured
- [ ] Environment variables secure

#### Performance
- [ ] Page load < 2s
- [ ] API response < 500ms
- [ ] No memory leaks
- [ ] Bundle size optimized

#### Database
- [ ] Migrations applied
- [ ] Backups configured
- [ ] Indexes created
- [ ] Foreign keys set

#### Documentation
- [ ] README updated
- [ ] API docs current
- [ ] Changelog updated
- [ ] Test results documented

#### Infrastructure
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Database connected
- [ ] Environment variables set
- [ ] SSL certificates valid
- [ ] Monitoring enabled

### Post-Release (Verify)

- [ ] Smoke tests passed in production
- [ ] Health check endpoint responding
- [ ] Users can register/login
- [ ] No errors in logs
- [ ] Performance metrics normal
- [ ] Database connections stable

---

## 📊 Test Metrics

### Key Performance Indicators (KPIs)

- **Test Coverage**: Target 80%+
- **Pass Rate**: Target 95%+
- **Critical Bugs**: Target 0
- **Test Execution Time**: Target < 2 hours
- **Automation Rate**: Target 70%+

### Tracking

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Test Coverage | 80% | TBD | ⬜ |
| Pass Rate | 95% | TBD | ⬜ |
| Critical Bugs | 0 | TBD | ⬜ |
| Execution Time | < 2h | TBD | ⬜ |
| Automation | 70% | TBD | ⬜ |

---

## 🔄 Test Cycle

### Weekly Regression
1. Run all automated tests
2. Execute critical manual tests
3. Review results
4. File bugs
5. Retest fixes

### Pre-Release
1. Run full regression suite
2. Execute all manual tests
3. Verify all P0/P1 tests pass
4. Sign off on release

### Post-Release
1. Run smoke tests
2. Monitor production
3. Verify key metrics
4. Document issues

---

## 📞 Contact & Support

**Test Lead**: [Name]  
**Email**: [Email]  
**Slack**: #watchhive-qa

---

**Document Version**: 1.0.0  
**Last Updated**: January 30, 2026  
**Next Review**: February 30, 2026
