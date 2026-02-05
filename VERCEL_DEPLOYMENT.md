# 🚀 WatchHive Vercel Deployment Guide

Since you've already used Vercel for your other projects, I've optimized WatchHive to work perfectly with Vercel's monorepo setup.

## 🏗️ Deployment Strategy

We will deploy this as **two separate Vercel projects** to keep the frontend (Vite) and backend (Express/Prisma) managed independently.

---

### 1. **Backend Deployment (`/server`)**

1.  **Create a New Project** in Vercel.
2.  **Connect your GitHub repo**.
3.  **Configure Project Settings**:
    *   **Root Directory**: `server`
    *   **Framework Preset**: `Other` (Express)
    *   **Install Command**: `npm install`
    *   **Build Command**: `npm run build` (This now automatically runs `prisma generate`)
    *   **Output Directory**: `dist` (Vercel will actually use the `api/` folder for serverless)
4.  **Add Environment Variables**:
    *   `DATABASE_URL`: (Use a Supabase, Neon, or Railway PostgreSQL URL)
    *   `JWT_SECRET`: (Random String)
    *   `JWT_REFRESH_SECRET`: (Random String)
    *   `TMDB_API_KEY`: (Your TMDB API Key)
    *   `NODE_ENV`: `production`

---

### 2. **Frontend Deployment (`/client`)**

1.  **Create another New Project** in Vercel.
2.  **Connect the same GitHub repo**.
3.  **Configure Project Settings**:
    *   **Root Directory**: `client`
    *   **Framework Preset**: `Vite`
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
4.  **Add Environment Variables**:
    *   `VITE_API_URL`: (Paste the URL of your **Backend deployment** above) + `/api/v1`

---

## 🛠️ What I've Added for You

- ✅ **`server/api/index.ts`**: A dedicated Vercel handler to wrap your Express app.
- ✅ **`server/vercel.json`**: Routing configuration to ensure all API calls go to the handler.
- ✅ **`client/vercel.json`**: SPA routing to prevent 404s when refreshing the page.
- ✅ **Prisma Build Hook**: Updated `server/package.json` so Prisma client is generated automatically during Vercel's build step.

## ⚠️ Important Note on Database
Vercel is a serverless platform, so you need an external PostgreSQL database. 
- **Recommended**: [Supabase](https://supabase.com) or [Neon.tech](https://neon.tech) (both have excellent free tiers).
- Paste the connection string into the `DATABASE_URL` variable in your Vercel Backend project.

---

### 🚀 **Ready to Launch!**
Just push these changes to your repository, and you can point Vercel to the folders!
