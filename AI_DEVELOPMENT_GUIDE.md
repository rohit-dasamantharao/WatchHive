# 🤖 WatchHive - AI Development Guide

**Version**: 1.0.0  
**Last Updated**: February 1, 2026  
**Status**: ✅ Active Development

---

## 📌 **CRITICAL: READ THIS FIRST**

**This document is the SINGLE SOURCE OF TRUTH for all AI agents and developers working on WatchHive.**

Before making ANY changes to the codebase:
1. ✅ Read this entire document
2. ✅ Review the core concepts section
3. ✅ Check test credentials
4. ✅ Understand the current implementation status
5. ✅ Follow the development workflows

**Failure to follow this guide may result in breaking existing functionality or losing development context.**

---

## 🎯 **Core Concepts**

### **What is WatchHive?**

WatchHive is a **social platform for movie and TV show enthusiasts** to:
- Track what they've watched
- Rate and review content
- Share their watch history with friends
- Discover new content through social connections
- Create custom watchlists

### **Key Principles**

1. **User-Centric**: Everything revolves around the user's watch history
2. **Social-First**: Built for sharing and discovery
3. **Data-Driven**: Uses TMDb API for movie/TV metadata
4. **Privacy-Aware**: Users control what they share
5. **Modern UX**: Beautiful, responsive, and intuitive

---

## 🔑 **Test Credentials & Important IDs**

### **Test User Account**

**ALWAYS use these credentials for testing:**

```
Email: test@watchhive.com
Password: TestPass123
Username: testuser123
Display Name: Test User
```

**User ID**: `bcccd173-c073-44eb-82...` (varies, check database)

### **Test Entry Data**

**Sample Movie Entry (Fight Club):**
```json
{
  "tmdbId": 550,
  "title": "Fight Club",
  "type": "MOVIE",
  "rating": 9,
  "review": "An incredible psychological thriller with an amazing twist!",
  "tags": ["thriller", "classic"],
  "watchLocation": "Netflix",
  "isRewatch": false
}
```

**Sample Movie Entry (The Shawshank Redemption):**
```json
{
  "tmdbId": 278,
  "title": "The Shawshank Redemption",
  "type": "MOVIE",
  "rating": 9,
  "review": "One of the greatest films ever made!",
  "tags": ["drama", "classic"],
  "watchLocation": "Home",
  "isRewatch": false
}
```

**Current Test Database State:**
- 2 entries created (Fight Club, The Shawshank Redemption)
- All CRUD operations verified and working
- Last tested: February 1, 2026

### **Database Connection**

- **Provider**: Supabase (PostgreSQL)
- **Host**: `db.bhzkgsbpseujegmvkszz.supabase.co`
- **Database**: `postgres`
- **Connection String**: Stored in `server/.env`

### **Local Development URLs**

```
Frontend:       http://localhost:3000
Backend API:    http://localhost:5001
Health Check:   http://localhost:5001/health
Prisma Studio:  http://localhost:5555
```

---

## 🏗️ **Architecture Overview**

### **Tech Stack**

**Frontend:**
- React 18 with TypeScript
- Vite (build tool)
- React Router (navigation)
- Axios (API calls)
- CSS Modules (styling)

**Backend:**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- JWT Authentication
- BCrypt (password hashing)

**Infrastructure:**
- Monorepo structure
- Concurrent dev servers
- Hot module replacement
- Environment-based configuration

### **Project Structure**

```
WatchHive/
├── client/                 # React frontend
│   ├── src/watchhive/      # Main app code
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts (Auth, etc.)
│   │   ├── services/       # API service layers
│   │   ├── types/          # TypeScript type definitions
│   │   └── index.css       # Global styles
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── utils/          # Helper functions
│   │   └── config.ts       # Configuration
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Database migrations
│   └── package.json
└── package.json            # Root package (runs both servers)
```

### **Database Schema**

**8 Core Tables:**

1. **users** - User accounts and profiles
2. **entries** - Movie/TV watch logs
3. **follows** - User follow relationships
4. **likes** - Entry likes
5. **comments** - Entry comments (with threading)
6. **lists** - User-created watchlists
7. **list_items** - Items in lists
8. **notifications** - User notifications

**Key Relationships:**
- Users → Entries (one-to-many)
- Users → Follows (many-to-many, self-referential)
- Entries → Likes (one-to-many)
- Entries → Comments (one-to-many)
- Users → Lists (one-to-many)
- Lists → List Items (one-to-many)

---

## ✅ **Current Implementation Status**

### **Phase 1: Authentication & Database** ✅ **COMPLETE**

- [x] User registration
- [x] User login
- [x] JWT token generation (access + refresh)
- [x] Password hashing (BCrypt)
- [x] Protected routes
- [x] Auto token refresh
- [x] Database schema (8 tables)
- [x] Supabase integration
- [x] Prisma ORM setup

### **Phase 2: Entry Management** ✅ **COMPLETE**

- [x] Create entry (manual)
- [x] Read entries (with filters)
- [x] Update entry
- [x] Delete entry
- [x] Entry list view
- [x] Entry form (create/edit)
- [x] Tags management
- [x] Rating system (1-10)
- [x] Review text
- [x] Watch location tracking
- [x] Rewatch flagging

### **Phase 3: Social Features** ⏳ **PENDING**

- [ ] Follow/unfollow users
- [ ] Activity feed
- [ ] Like entries
- [ ] Comment on entries
- [ ] Nested comment replies
- [ ] Notifications

### **Phase 4: TMDb Integration** ⏳ **PENDING**

- [ ] Movie search
- [ ] Auto-fill entry data
- [ ] Poster images
- [ ] Movie details
- [ ] Trending movies
- [ ] Recommendations

### **Phase 5: Lists & Discovery** ⏳ **PENDING**

- [ ] Create custom lists
- [ ] Add movies to lists
- [ ] Public/private lists
- [ ] User statistics
- [ ] Advanced search
- [ ] Filters and sorting

---

## 🚀 **Development Workflows**

### **Starting the Application**

```bash
# From project root (recommended)
npm run dev

# Or separately:
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

### **Database Management**

```bash
# View database in browser
cd server && npx prisma studio

# Create new migration
cd server && npx prisma migrate dev --name migration_name

# Apply migrations
cd server && npx prisma migrate deploy

# Reset database (⚠️ DELETES ALL DATA)
cd server && npx prisma migrate reset

# Generate Prisma Client (after schema changes)
cd server && npx prisma generate
```

### **Testing Workflow**

1. **Start the application** (`npm run dev`)
2. **Open browser** to http://localhost:3000
3. **Login** with test credentials
4. **Test the feature** you're working on
5. **Check browser console** for frontend errors
6. **Check terminal** for backend errors
7. **Verify database** in Prisma Studio (http://localhost:5555)

### **Making Changes**

**Frontend Changes:**
1. Modify files in `client/src/watchhive/`
2. Vite will hot-reload automatically
3. Check browser for updates
4. Test functionality

**Backend Changes:**
1. Modify files in `server/src/`
2. tsx watch will auto-restart server
3. Check terminal for restart confirmation
4. Test API endpoints

**Database Changes:**
1. Modify `server/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description`
3. Run `npx prisma generate`
4. Restart backend server
5. Update TypeScript types if needed

---

## 🎨 **UI/UX Guidelines**

### **Design System**

**Colors:**
- Primary: Black (#000000)
- Secondary: White (#FFFFFF)
- Accent: Gradient (purple to pink)
- Background: Dark theme (#0a0a0a)
- Text: White on dark, black on light

**Typography:**
- Font Family: System fonts (Inter, SF Pro, Roboto)
- Headings: Bold, large
- Body: Regular, readable (16px minimum on mobile)

**Components:**
- Glassmorphism effects
- Smooth animations
- Hover states on all interactive elements
- Loading spinners for async operations
- Error messages with retry options
- Empty states with helpful messages

**Responsive Design:**
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Touch-friendly buttons (48px minimum)
- No horizontal scrolling

---

## 🔐 **Security Best Practices**

### **Authentication**

- ✅ Passwords hashed with BCrypt (10 rounds)
- ✅ JWT tokens (access: 15min, refresh: 7 days)
- ✅ Tokens stored in localStorage
- ✅ Auto token refresh on 401
- ✅ Protected routes require authentication
- ✅ User can only access their own data

### **API Security**

- ✅ Input validation (express-validator)
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection (React auto-escaping)
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ Rate limiting (TODO)

### **Data Privacy**

- ✅ Users own their data
- ✅ Private profiles supported
- ✅ Cascade deletes for data integrity
- ✅ No sensitive data in logs

---

## 📋 **API Endpoints Reference**

### **Authentication**

```
POST   /api/v1/auth/register    - Create account
POST   /api/v1/auth/login       - Login
POST   /api/v1/auth/refresh     - Refresh token
POST   /api/v1/auth/logout      - Logout
```

### **Entries**

```
POST   /api/v1/entries          - Create entry
GET    /api/v1/entries          - Get all entries (with filters)
GET    /api/v1/entries/:id      - Get single entry
PUT    /api/v1/entries/:id      - Update entry
DELETE /api/v1/entries/:id      - Delete entry
GET    /api/v1/entries/stats/summary - Get user stats
```

### **Health**

```
GET    /health                  - Server health check
```

---

## 🐛 **Common Issues & Solutions**

### **Issue: "Cannot connect to database"**

**Solution:**
1. Check `server/.env` has correct `DATABASE_URL`
2. Verify Supabase project is running
3. Check internet connection
4. Run `cd server && npx prisma db pull` to verify connection

### **Issue: "Port already in use"**

**Solution:**
1. Kill existing processes: `pkill -f "npm run dev"`
2. Or change ports in config files
3. Check for zombie processes: `lsof -i :3000` or `lsof -i :5001`

### **Issue: "Module not found"**

**Solution:**
1. Run `npm install` in root, `client/`, and `server/`
2. Delete `node_modules` and reinstall if needed
3. Clear npm cache: `npm cache clean --force`

### **Issue: "Prisma Client not generated"**

**Solution:**
1. Run `cd server && npx prisma generate`
2. Restart backend server
3. Check `server/node_modules/.prisma/client` exists

### **Issue: "Token refresh fails"**

**Solution:**
1. Check refresh token endpoint: `/api/v1/auth/refresh` (NOT `/api/v1/api/v1/auth/refresh`)
2. Verify refresh token in localStorage
3. Clear localStorage and login again

### **Issue: "Entry update returns 400"**

**Solution:**
1. Ensure `tmdbId` is NOT sent in update payload (it's immutable)
2. Check date format is ISO8601
3. Verify rating is between 1-10
4. Check server logs for validation errors

---

## 🧪 **Testing Checklist**

### **Before Committing Code**

- [ ] Application starts without errors
- [ ] Can login with test credentials
- [ ] Can create new entry
- [ ] Can edit existing entry
- [ ] Can delete entry
- [ ] Navigation works (Feed, Entries, Profile)
- [ ] No console errors in browser
- [ ] No errors in terminal
- [ ] Database changes are migrated
- [ ] TypeScript compiles without errors

### **Feature Testing**

**Authentication:**
- [ ] Can register new user
- [ ] Can login with existing user
- [ ] Can logout
- [ ] Token refresh works
- [ ] Protected routes redirect to login

**Entry Management:**
- [ ] Can create entry with all fields
- [ ] Can create entry with minimal fields
- [ ] Can edit entry
- [ ] Can delete entry
- [ ] Tags add/remove works
- [ ] Rating validation (1-10)
- [ ] List pagination works

---

## 📚 **Important Files to Review**

### **Before Making Changes**

1. **This file** (`AI_DEVELOPMENT_GUIDE.md`) - Core concepts
2. `docs/architecture/WATCHHIVE_REQUIREMENTS.md` - Original requirements
3. `docs/architecture/WATCHHIVE_ARCHITECTURE.md` - Detailed architecture
4. `docs/implementation/DATABASE_SETUP_COMPLETE.md` - Database setup details
5. `docs/implementation/ENTRY_MANAGEMENT_COMPLETE.md` - Entry system details
6. `docs/implementation/DEVELOPMENT_SESSION_LOG.md` - Recent development history

### **When Working on Frontend**

1. `client/src/watchhive/WatchHiveApp.tsx` - Main app & routing
2. `client/src/watchhive/contexts/AuthContext.tsx` - Auth state
3. `client/src/watchhive/services/*.service.ts` - API services
4. `client/src/watchhive/index.css` - Global styles

### **When Working on Backend**

1. `server/src/app.ts` - Express app setup
2. `server/src/routes/*.ts` - API routes
3. `server/src/middleware/auth.middleware.ts` - Auth middleware
4. `server/prisma/schema.prisma` - Database schema

---

## 🔄 **Version History**

### **v1.0.0 - February 1, 2026**

**Completed:**
- ✅ Full authentication system
- ✅ Database setup (8 tables)
- ✅ Entry CRUD operations
- ✅ Entry form (create/edit)
- ✅ Entry list view
- ✅ Navigation system
- ✅ Test user created
- ✅ Bug fix: Entry update payload

**Known Issues:**
- None currently

**Next Steps:**
- TMDb API integration
- Social features (follow, like, comment)
- Activity feed
- User statistics dashboard

---

## 🎯 **Development Priorities**

### **High Priority**

1. **TMDb Integration** - Auto-fill movie data
2. **Social Features** - Follow, like, comment
3. **Activity Feed** - See what friends are watching
4. **User Profile** - Display stats and entries

### **Medium Priority**

1. **Lists** - Custom watchlists
2. **Search** - Find movies and users
3. **Notifications** - Real-time updates
4. **Statistics** - Watch history analytics

### **Low Priority**

1. **Export/Import** - Backup data
2. **Sharing** - Social media integration
3. **Recommendations** - AI-powered suggestions
4. **Mobile App** - Native mobile version

---

## 💡 **Best Practices**

### **Code Quality**

- ✅ Use TypeScript for type safety
- ✅ Follow existing code patterns
- ✅ Write descriptive variable names
- ✅ Add comments for complex logic
- ✅ Keep functions small and focused
- ✅ Use async/await (not callbacks)

### **Git Workflow**

- ✅ Commit frequently with clear messages
- ✅ Test before committing
- ✅ Don't commit `node_modules` or `.env`
- ✅ Use meaningful branch names
- ✅ Keep commits atomic (one feature per commit)

### **Performance**

- ✅ Use pagination for large lists
- ✅ Implement loading states
- ✅ Optimize database queries
- ✅ Use indexes for frequently queried fields
- ✅ Minimize API calls
- ✅ Cache when appropriate

---

## 🆘 **Getting Help**

### **Documentation**

- React: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs
- Prisma: https://www.prisma.io/docs
- Express: https://expressjs.com
- Vite: https://vitejs.dev

### **Project Documentation**

- `README.md` - Project overview
- `docs/README.md` - Documentation index
- `docs/setup/QUICKSTART.md` - Quick start guide
- `docs/architecture/WATCHHIVE_REQUIREMENTS.md` - Full requirements
- `docs/architecture/WATCHHIVE_ARCHITECTURE.md` - Architecture details
- `docs/testing/API_TESTING_GUIDE.md` - API testing guide
- `docs/implementation/DEVELOPMENT_SESSION_LOG.md` - Development history

---

## ⚠️ **Critical Reminders**

### **DO:**

- ✅ Always test with the test user credentials
- ✅ Check both browser console and terminal for errors
- ✅ Verify database changes in Prisma Studio
- ✅ Follow the existing code patterns
- ✅ Update this guide when making significant changes
- ✅ Read error messages carefully
- ✅ Test on both create and edit modes

### **DON'T:**

- ❌ Commit `.env` files
- ❌ Hard-code credentials
- ❌ Skip database migrations
- ❌ Ignore TypeScript errors
- ❌ Break existing functionality
- ❌ Send `tmdbId` in entry update payloads
- ❌ Forget to run `npx prisma generate` after schema changes

---

## 📝 **Quick Reference**

### **Test User**
```
Email: test@watchhive.com
Password: TestPass123
```

### **Start App**
```bash
npm run dev
```

### **View Database**
```bash
cd server && npx prisma studio
```

### **Create Migration**
```bash
cd server && npx prisma migrate dev --name description
```

### **URLs**
```
Frontend: http://localhost:3000
Backend:  http://localhost:5001
Prisma:   http://localhost:5555
```

---

**Last Updated**: February 1, 2026  
**Maintained By**: AI Development Team  
**Status**: ✅ Active & Current

**Remember**: This guide is your compass. Follow it, and you'll never lose your way in the WatchHive codebase! 🚀
