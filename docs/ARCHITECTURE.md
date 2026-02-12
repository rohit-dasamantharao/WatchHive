# WatchHive — Architecture & Design

## System Overview

WatchHive is a social platform for movie/TV enthusiasts. Users log what they watch, follow others, and discover content.

```
┌─ Frontend (React SPA) ─┐     ┌─ Backend (Express API) ─┐     ┌─ Database ─┐
│  React 18 + TypeScript  │────▶│  Node.js + TypeScript    │────▶│ PostgreSQL │
│  Vite, React Router     │     │  Prisma ORM, JWT Auth    │     │ (Supabase) │
│  Context API, Axios     │     │  express-validator       │     └────────────┘
└─────────────────────────┘     └──────────────────────────┘
                                         │
                                         ▼
                                ┌─ External APIs ──┐
                                │ TMDb (movie data)│
                                │ Google OAuth     │
                                └──────────────────┘
```

---

## Database Schema

**8 tables** — see `server/prisma/schema.prisma` for full definitions.

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | User accounts & profiles | id, username, email, passwordHash, googleId, displayName, bio, profilePictureUrl |
| `entries` | Movie/TV watch logs | id, userId, tmdbId, title, type, watchedAt, rating, review, tags |
| `follows` | Follow relationships | followerId, followingId (unique pair) |
| `likes` | Entry likes | userId, entryId (unique pair) |
| `comments` | Entry comments | userId, entryId, parentCommentId (nested), content |
| `lists` | User-created lists | userId, name, description, isPublic |
| `list_items` | Items in lists | listId, tmdbId, orderIndex |
| `notifications` | User notifications | userId, type, content (JSON), isRead |

### Key Relationships
- User → many Entries, Follows, Likes, Comments, Lists, Notifications
- Entry → many Likes, Comments
- Comment → many child Comments (nested replies via parentCommentId)
- List → many ListItems

---

## Authentication Flow

1. **Traditional:** Email/password → bcrypt hash → JWT (access: 15min, refresh: 7 days)
2. **Google OAuth:** Google popup → ID token → backend verifies with Google → JWT
3. **Token refresh:** Frontend auto-refreshes on 401 responses

---

## API Route Structure

```
/api/v1/
├── auth/       POST register, login, google, refresh, logout
├── entries/    GET list, POST create, GET/:id, PUT/:id, DELETE/:id
├── follows/    POST /:id/follow, DELETE /:id/unfollow, GET followers/following
├── likes/      POST /:entryId/like, DELETE /:entryId/unlike
├── comments/   (planned) CRUD with nesting
├── lists/      (planned) CRUD with items
├── feed/       (planned) Activity from followed users
└── notifications/ (planned) User notifications
```

---

## Frontend Architecture

- **Routing:** React Router v6, all WatchHive routes under `/watch-hive/*`
- **State:** AuthContext for user/token state, component-level state elsewhere
- **Services:** Axios-based API client with automatic token injection & refresh
- **Styling:** CSS files per page/component, glassmorphism design system

---

## Development Phases

| Phase | Status | Features |
|-------|--------|----------|
| 1. Foundation | ✅ Done | Auth, DB schema, project structure |
| 2. Core Features | ✅ Done | Entry CRUD, forms, tags, ratings |
| 3. Social | 🚧 In Progress | Follow, Like (done), Comments, Feed (pending) |
| 4. Discovery | ⏳ Planned | TMDb enrichment, search, recommendations |
| 5. Polish | ⏳ Planned | Responsive design, themes, performance |
| 6. Deployment | ⏳ Planned | Vercel deployment, CI/CD |

---

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with short expiry + refresh flow
- Helmet.js security headers, CORS whitelist
- Input validation via express-validator
- Users can only access/modify their own data
- Google OAuth tokens verified server-side

---

## Roadmap (Upcoming Tasks)

### High Priority
- [ ] Comment system (nested replies)
- [ ] Activity feed (entries from followed users)
- [ ] Production deployment

### Medium Priority
- [ ] User profile page with statistics
- [ ] Watchlists & custom lists
- [ ] Search & discovery
- [ ] Notifications

### Low Priority
- [ ] Dark/light theme toggle
- [ ] Export/import data
- [ ] Mobile responsiveness polish
- [ ] Performance optimization
- [ ] Unit & E2E tests
