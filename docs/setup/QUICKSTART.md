# 🎉 WatchHive - Quick Start Guide

**Your app is FULLY OPERATIONAL!** Here's everything you need to know.

---

## 🚀 **Starting the Application**

### **Option 1: Start Both Servers (Recommended)**
```bash
# From project root
npm run dev
```
This starts both frontend (port 3000) and backend (port 5001)!

### **Option 2: Start Separately**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

---

## 🌐 **Access Points**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/health
- **Prisma Studio**: http://localhost:5555 (run `cd server && npx prisma studio`)

---

## 🔐 **Test Account**

Already created for you:
- **Email**: `test@watchhive.com`
- **Password**: `TestPass123`
- **Username**: `testuser123`
- **Display Name**: `Test User`

---

## 📊 **Database Info**

- **Provider**: Supabase (PostgreSQL)
- **Host**: `db.bhzkgsbpseujegmvkszz.supabase.co`
- **Tables**: 8 (users, entries, follows, likes, comments, lists, list_items, notifications)
- **Status**: ✅ Connected & Working

---

## 🧪 **Testing the App**

### **1. Sign Up**
1. Go to http://localhost:3000
2. Click "Sign up"
3. Fill in the form
4. Click "Create Account"
5. You'll be auto-logged in!

### **2. Log In**
1. Go to http://localhost:3000
2. Enter email and password
3. Click "Log In"
4. Redirected to feed

### **3. View Profile**
1. Click "Profile" in navbar
2. See your user info

### **4. Log Out**
1. Click "Logout" button
2. Redirected to login page

---

## 🛠️ **Useful Commands**

### **Database**
```bash
# View database in browser
cd server && npx prisma studio

# Create new migration
cd server && npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
cd server && npx prisma migrate reset
```

### **Development**
```bash
# Install dependencies
npm install              # Root
cd client && npm install # Frontend
cd server && npm install # Backend

# Build for production
cd client && npm run build
cd server && npm run build
```

---

## 📁 **Project Structure**

```
WatchHive/
├── client/              # React frontend
│   ├── src/watchhive/   # Main app code
│   │   ├── components/  # UI components
│   │   ├── pages/       # Pages (Login, Signup, etc.)
│   │   ├── contexts/    # React contexts
│   │   ├── services/    # API services
│   │   └── types/       # TypeScript types
│   └── package.json
├── server/              # Express backend
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth, validation
│   │   └── utils/       # Helpers
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
└── package.json         # Root scripts
```

---

## 🔑 **API Endpoints**

### **Authentication**
- `POST /api/v1/auth/register` - Create account
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### **Health**
- `GET /health` - Check server status

---

## 🎨 **Features Implemented**

✅ **Authentication**
- User registration
- User login
- JWT tokens (access + refresh)
- Password hashing (BCrypt)
- Protected routes
- Auto token refresh

✅ **Frontend**
- Beautiful dark theme UI
- Glassmorphism effects
- Animated gradients
- Responsive design
- Form validation
- Error handling
- Loading states

✅ **Backend**
- RESTful API
- Input validation
- Error handling
- Security headers
- CORS configuration
- Database integration

✅ **Database**
- 8 tables created
- Proper relationships
- Performance indexes
- Data integrity
- Supabase hosted

---

## 🐛 **Troubleshooting**

### **"Cannot connect to database"**
- Check `server/.env` has correct DATABASE_URL
- Verify Supabase project is running
- Check internet connection

### **"Port already in use"**
- Kill existing processes: `pkill -f "npm run dev"`
- Or use different ports in config

### **"Module not found"**
- Run `npm install` in both `client/` and `server/`
- Delete `node_modules` and reinstall if needed

### **Frontend shows blank page**
- Check browser console for errors
- Verify backend is running on port 5001
- Clear browser cache

---

## 📚 **Documentation**

- `DATABASE_SETUP_COMPLETE.md` - Full database setup report
- `FULLSTACK_COMPLETE.md` - Complete implementation guide
- `INTEGRATION_TEST_REPORT.md` - Test results
- `API_TESTING_GUIDE.md` - API testing guide
- `WATCHHIVE_REQUIREMENTS.md` - Original requirements
- `WATCHHIVE_ARCHITECTURE.md` - System architecture

---

## 🎯 **What's Next?**

### **Phase 2: Movie Logging**
- Entry creation form
- TMDb API integration
- Movie search
- Rating system
- Review system

### **Phase 3: Social Features**
- Follow/unfollow
- Activity feed
- Likes
- Comments
- Notifications

### **Phase 4: Discovery**
- Trending movies
- Recommendations
- User stats
- Advanced search

---

## 💡 **Tips**

1. **Keep Prisma Studio open** to monitor database changes
2. **Use the test account** for quick testing
3. **Check browser console** for frontend errors
4. **Check terminal** for backend errors
5. **Read the docs** for detailed information

---

## 🆘 **Need Help?**

1. Check the error message
2. Look in browser console (F12)
3. Check backend terminal logs
4. Review the documentation files
5. Check Prisma Studio for data issues

---

## ✅ **Quick Checklist**

Before starting development:
- [ ] Backend running on port 5001
- [ ] Frontend running on port 3000
- [ ] Database connected (check backend logs)
- [ ] Can access http://localhost:3000
- [ ] Can sign up/login
- [ ] Prisma Studio accessible (optional)

---

**Status**: ✅ **READY FOR DEVELOPMENT**  
**Last Updated**: January 30, 2026  
**Version**: 1.0.0

🚀 **Happy Coding!**
