# 🔗 Quick Supabase Setup Instructions

## Follow These Steps:

1. **Open Supabase**: https://supabase.com
2. **Sign in** with GitHub or email
3. **Create New Project**:
   - Click "New Project"
   - Name: `watchhive`
   - Database Password: Create a strong password (SAVE THIS!)
   - Region: Choose closest to you
   - Click "Create new project"
   - Wait 2-3 minutes

4. **Get Connection String**:
   - Click "Project Settings" (gear icon)
   - Go to "Database" tab
   - Scroll to "Connection string"
   - Select "URI" tab
   - Copy the string (looks like):
     ```
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
     ```
   - Replace `[YOUR-PASSWORD]` with your actual password

5. **Update .env**:
   - Open `server/.env`
   - Replace DATABASE_URL with your Supabase connection string
   - Save the file

6. **Run This Command**:
   ```bash
   cd server
   npx prisma migrate dev --name init
   ```

## ✅ You're Done!

Once you see "Migration completed", you're ready!

---

**Paste your DATABASE_URL here when ready, and I'll help test it!**
