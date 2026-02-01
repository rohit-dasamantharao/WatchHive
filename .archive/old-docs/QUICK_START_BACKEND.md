# 🚀 Database Setup & Testing - Quick Start

**Follow these steps to set up your database and test the backend**

---

## Step 1: Set Up Database (Choose One)

### Option A: Supabase (Recommended - Free & Easy) ⭐

1. **Go to** [https://supabase.com](https://supabase.com) and sign up
2. **Create a new project** named "watchhive"
3. **Set a database password** (save it!)
4. **Wait 2-3 minutes** for setup
5. **Get your connection string**:
   - Go to Project Settings → Database
   - Copy the "URI" connection string
   - Replace `[YOUR-PASSWORD]` with your actual password

6. **Update your .env file**:
   ```bash
   # Edit server/.env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres"
   ```

### Option B: Install PostgreSQL Locally

```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb watchhive

# Update server/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/watchhive"
```

---

## Step 2: Run Database Migrations

```bash
cd server
npx prisma migrate dev --name init
```

**Expected output:**
```
✔ Generated Prisma Client
✔ The migration has been created successfully
✔ Applied migration init
```

---

## Step 3: Verify Database Setup

Open Prisma Studio to see your tables:

```bash
npx prisma studio
```

Opens at http://localhost:5555

**You should see 8 tables:**
- users
- entries
- follows
- likes
- comments
- lists
- list_items
- notifications

---

## Step 4: Start the Backend Server

```bash
# Make sure you're in the server directory
cd server
npm run dev
```

**Expected output:**
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

## Step 5: Test the API

### Quick Test (Automated)

Run the test script:

```bash
# From the root directory
./test-api.sh
```

This will test all endpoints automatically!

### Manual Test (curl)

```bash
# Test health check
curl http://localhost:5001/health

# Register a user
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "displayName": "John Doe"
  }'

# Login
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Using VS Code REST Client

1. Install "REST Client" extension in VS Code
2. Open `api-tests.http`
3. Click "Send Request" above any request

### Using Postman

1. Import the requests from `API_TESTING_GUIDE.md`
2. Test each endpoint

---

## ✅ Success Checklist

After completing all steps, verify:

- [ ] Database is set up (Supabase or local)
- [ ] `DATABASE_URL` is in `server/.env`
- [ ] Migrations ran successfully
- [ ] Can see tables in Prisma Studio
- [ ] Server starts without errors
- [ ] Health check returns 200
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] User appears in Prisma Studio

---

## 🆘 Troubleshooting

### "Connection refused" when testing API
**Solution**: Make sure server is running (`npm run dev` in server folder)

### "Can't reach database server"
**Solution**: 
- Check `DATABASE_URL` in `server/.env`
- For Supabase: verify password is correct
- For local: make sure PostgreSQL is running

### "Migration failed"
**Solution**:
```bash
# Delete migrations folder and try again
rm -rf prisma/migrations
npx prisma migrate dev --name init
```

### "Module not found" errors
**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

---

## 📚 Detailed Guides

For more detailed information, see:

- **Database Setup**: `DATABASE_SETUP_GUIDE.md`
- **API Testing**: `API_TESTING_GUIDE.md`
- **Backend README**: `server/README.md`

---

## 🎯 What's Next?

Once backend is tested and working:

1. ✅ Mark Phase 1 Backend as complete
2. 🎨 Start frontend development
3. 🔗 Build authentication UI
4. 📱 Connect frontend to backend

---

**Need help?** Check the detailed guides or let me know what error you're seeing!

**Everything working?** Great! Let's move on to the frontend! 🚀
