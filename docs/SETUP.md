# WatchHive — Setup & Deployment Guide

---

## 1. Local Development Setup

### Prerequisites
- Node.js v18+, npm
- PostgreSQL database (Supabase recommended)

### Steps
```bash
git clone <repo-url> && cd WatchHive
npm run install:all

# Configure backend
cd server && cp .env.example .env
# Edit .env with your DATABASE_URL, JWT secrets, etc.
npm run prisma:generate
npm run prisma:migrate
cd ..

# Start both servers
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5001 |
| Prisma Studio | `cd server && npx prisma studio` → http://localhost:5555 |

### Useful Commands
```bash
npm run dev                          # Start both servers
cd server && npx prisma studio       # Database GUI
cd server && npx prisma migrate dev --name <name>  # New migration
cd server && npx prisma migrate reset  # Reset DB (WARNING: deletes data)
```

---

## 2. Supabase (Database) Setup

1. Go to [supabase.com](https://supabase.com) → Sign in → **New Project**
2. Name: `watchhive`, set a strong DB password, pick closest region
3. Wait 2-3 min for provisioning
4. Go to **Project Settings → Database → Connection string → URI tab**
5. Copy the connection string, replace `[YOUR-PASSWORD]` with your actual password
6. Paste it as `DATABASE_URL` in `server/.env`
7. Run: `cd server && npx prisma migrate dev --name init`

---

## 3. Google OAuth Setup

### Create Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/) → create/select a project
2. **APIs & Services → OAuth consent screen** → External → Create
   - App name: `WatchHive`, add your email, select scopes: `email`, `profile`, `openid`
   - Add test users (while in Testing mode, only these users can sign in)
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:3000` (+ your production URL)
4. Copy the **Client ID**

### Configure
Set the **same Client ID** in both files:

```env
# server/.env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# client/.env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

Restart both servers after updating.

### Go Live
To allow any Google account (not just test users): **OAuth consent screen → Publish App**.

---

## 4. Environment Variables Reference

### Backend (`server/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret for JWT signing |
| `JWT_REFRESH_SECRET` | ✅ | Secret for refresh tokens |
| `PORT` | ❌ | Server port (default: 5001) |
| `FRONTEND_URL` | ❌ | Frontend URL for CORS (default: http://localhost:3000) |
| `TMDB_API_KEY` | ❌ | TMDb API key for movie data |
| `GOOGLE_CLIENT_ID` | ❌ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ❌ | Google OAuth client secret |

### Frontend (`client/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Backend API URL (e.g., http://localhost:5001/api/v1) |
| `VITE_GOOGLE_CLIENT_ID` | ❌ | Google OAuth client ID |

---

## 5. Deployment (Vercel)

### Frontend
1. **Vercel Dashboard → New Project** → Import repo
2. Framework: **Vite**, Root: `client`, Output: `dist`
3. Set env var: `VITE_API_URL` = your backend URL

### Backend
1. **Vercel Dashboard → New Project** → Import same repo
2. Framework: **Other**, Root: `server`
3. Build: `npm run build`, Install: `npm install`
4. Set env vars: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL`, `GOOGLE_CLIENT_ID`

### Post-Deployment
- Add your Vercel frontend domain to `FRONTEND_URL` in backend env vars
- Add your Vercel domain to Google OAuth **Authorized JavaScript origins**
- Test all endpoints work correctly

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Cannot connect to database | Check `DATABASE_URL` in `server/.env`, verify Supabase is running |
| Port already in use | `pkill -f "npm run dev"` or use different ports |
| Module not found | Run `npm install` in both `client/` and `server/` |
| Google button shows "Not configured" | Set `VITE_GOOGLE_CLIENT_ID` in `client/.env`, restart Vite |
| Google "Access blocked" (400) | Add `http://localhost:3000` to Authorized JavaScript Origins in Google Console |
| CORS errors in production | Set `FRONTEND_URL` in backend to match your frontend domain exactly |
