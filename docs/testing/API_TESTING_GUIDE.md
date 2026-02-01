# 🧪 Backend API Testing Guide

**Test your WatchHive API endpoints**

---

## Prerequisites

- ✅ Database is set up and migrations are run
- ✅ Backend server is running (`npm run dev` in server folder)

---

## 🚀 Start the Backend Server

```bash
cd server
npm run dev
```

You should see:
```
🚀 WatchHive API Server
📡 Server running on http://localhost:5001
🌍 Environment: development
💾 Database: Connected

📋 Available endpoints:
   GET  /health
   POST /api/v1/auth/register
   POST /api/v1/auth/login
   POST /api/v1/auth/refresh
   POST /api/v1/auth/logout

✨ Ready to accept requests!
```

---

## 🧪 Testing Methods

### Option 1: Using curl (Terminal)

#### 1. Health Check
```bash
curl http://localhost:5001/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-30T09:30:13.000Z",
  "uptime": 123.456
}
```

#### 2. Register a New User
```bash
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "displayName": "John Doe"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": "uuid-here",
    "username": "johndoe",
    "email": "john@example.com",
    "displayName": "John Doe",
    "profilePictureUrl": null
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save the tokens!** You'll need them for authenticated requests.

#### 3. Login
```bash
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": "uuid-here",
    "username": "johndoe",
    "email": "john@example.com",
    "displayName": "John Doe",
    "profilePictureUrl": null
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 4. Refresh Token
```bash
curl -X POST http://localhost:5001/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 5. Logout
```bash
curl -X POST http://localhost:5001/api/v1/auth/logout
```

**Expected Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

### Option 2: Using Postman (Recommended for GUI)

#### Setup Postman Collection

1. **Download Postman**: https://www.postman.com/downloads/
2. **Create New Collection**: "WatchHive API"
3. **Set Base URL Variable**: 
   - Variable: `baseUrl`
   - Value: `http://localhost:5001`

#### Create Requests

**1. Health Check**
- Method: `GET`
- URL: `{{baseUrl}}/health`

**2. Register**
- Method: `POST`
- URL: `{{baseUrl}}/api/v1/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test1234",
  "displayName": "Test User"
}
```

**3. Login**
- Method: `POST`
- URL: `{{baseUrl}}/api/v1/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "test@example.com",
  "password": "Test1234"
}
```

**4. Refresh Token**
- Method: `POST`
- URL: `{{baseUrl}}/api/v1/auth/refresh`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "refreshToken": "{{refreshToken}}"
}
```

**5. Logout**
- Method: `POST`
- URL: `{{baseUrl}}/api/v1/auth/logout`

---

### Option 3: Using VS Code REST Client Extension

Install the "REST Client" extension in VS Code, then create a file `api-tests.http`:

```http
### Variables
@baseUrl = http://localhost:5001
@accessToken = YOUR_TOKEN_HERE
@refreshToken = YOUR_REFRESH_TOKEN_HERE

### Health Check
GET {{baseUrl}}/health

### Register New User
POST {{baseUrl}}/api/v1/auth/register
Content-Type: application/json

{
  "username": "janedoe",
  "email": "jane@example.com",
  "password": "SecurePass456",
  "displayName": "Jane Doe"
}

### Login
POST {{baseUrl}}/api/v1/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "SecurePass456"
}

### Refresh Token
POST {{baseUrl}}/api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "{{refreshToken}}"
}

### Logout
POST {{baseUrl}}/api/v1/auth/logout
```

Click "Send Request" above each request to test!

---

## ✅ Test Scenarios

### Scenario 1: New User Registration Flow

1. **Register** a new user
2. **Verify** you receive tokens
3. **Check** Prisma Studio - user should appear in `users` table
4. **Try registering again** with same email - should get error

### Scenario 2: Login Flow

1. **Login** with registered credentials
2. **Verify** you receive tokens
3. **Try wrong password** - should get 401 error
4. **Try non-existent email** - should get 401 error

### Scenario 3: Token Refresh Flow

1. **Login** to get tokens
2. **Wait 16 minutes** (access token expires after 15 min)
3. **Use refresh token** to get new access token
4. **Verify** you get new tokens

### Scenario 4: Validation Testing

**Test Invalid Inputs:**

1. **Short username** (less than 3 chars):
```json
{
  "username": "ab",
  "email": "test@example.com",
  "password": "Test1234"
}
```
Expected: 400 error with validation message

2. **Invalid email**:
```json
{
  "username": "testuser",
  "email": "not-an-email",
  "password": "Test1234"
}
```
Expected: 400 error

3. **Weak password** (no uppercase/number):
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "weakpass"
}
```
Expected: 400 error

4. **Missing fields**:
```json
{
  "username": "testuser"
}
```
Expected: 400 error

---

## 🔍 Verify in Database

After testing, check your database using Prisma Studio:

```bash
cd server
npx prisma studio
```

Open http://localhost:5555 and verify:

1. **Users table** has your registered users
2. **Password hashes** are stored (not plain text)
3. **Timestamps** are set correctly
4. **All fields** are populated as expected

---

## 📊 Expected Results Summary

| Endpoint | Method | Auth Required | Expected Status |
|----------|--------|---------------|-----------------|
| `/health` | GET | No | 200 |
| `/api/v1/auth/register` | POST | No | 201 |
| `/api/v1/auth/login` | POST | No | 200 |
| `/api/v1/auth/refresh` | POST | No | 200 |
| `/api/v1/auth/logout` | POST | No | 200 |

---

## 🐛 Common Issues & Solutions

### Issue: "Connection refused"
**Solution**: Make sure server is running (`npm run dev`)

### Issue: "Database connection error"
**Solution**: Check DATABASE_URL in `.env` is correct

### Issue: "Validation failed"
**Solution**: Check your request body matches the validation rules:
- Username: 3-30 chars, alphanumeric + underscore only
- Email: Valid email format
- Password: Min 8 chars, must have uppercase, lowercase, and number

### Issue: "Email already in use"
**Solution**: Use a different email or delete the user from database

### Issue: "Invalid or expired token"
**Solution**: 
- Access tokens expire after 15 minutes
- Use refresh token to get new access token
- Or login again

---

## 🎯 Success Checklist

After testing, you should have:

- [ ] Successfully registered a user
- [ ] Successfully logged in
- [ ] Received access and refresh tokens
- [ ] Verified user in database (Prisma Studio)
- [ ] Tested token refresh
- [ ] Tested validation errors
- [ ] Confirmed all endpoints work

---

## 📝 Next Steps After Testing

Once backend is tested and working:

1. ✅ Mark Phase 1 Backend as complete
2. 🎨 Start frontend development
3. 🔗 Connect frontend to backend
4. 🧪 Test full authentication flow in UI

---

**Ready to test? Start the server and try the endpoints!** 🚀

**Need help?** Let me know if you encounter any errors!
