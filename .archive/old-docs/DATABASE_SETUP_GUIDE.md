# 🗄️ Database Setup Guide - Supabase

**Quick and Easy Setup for WatchHive**

---

## Option 1: Supabase (Recommended - Free & Easy)

### Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email

### Step 2: Create New Project

1. Click "New Project"
2. Fill in the details:
   - **Name**: `watchhive` (or any name you prefer)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is perfect
3. Click "Create new project"
4. Wait 2-3 minutes for setup to complete

### Step 3: Get Database Connection String

1. Once project is ready, click on "Project Settings" (gear icon in sidebar)
2. Go to "Database" section
3. Scroll down to "Connection string"
4. Select "URI" tab
5. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with the password you created in Step 2

### Step 4: Update Your .env File

1. Open `server/.env` in your editor
2. Replace the DATABASE_URL line with your Supabase connection string:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres"
   ```
3. Save the file

### Step 5: Run Database Migrations

Open terminal and run:

```bash
cd server
npx prisma migrate dev --name init
```

This will:
- Create all your database tables
- Set up relationships
- Add indexes

You should see output like:
```
✔ Generated Prisma Client
✔ The migration has been created successfully
✔ Applied migration
```

### Step 6: Verify Database

Check your tables were created:

```bash
npx prisma studio
```

This opens a GUI at http://localhost:5555 where you can see all your tables!

---

## Option 2: Local PostgreSQL (If you prefer)

### Install PostgreSQL

**On macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**On Linux:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE watchhive;

# Create user (optional)
CREATE USER watchhive_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE watchhive TO watchhive_user;

# Exit
\q
```

### Update .env

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/watchhive"
# Or if you created a user:
DATABASE_URL="postgresql://watchhive_user:your_password@localhost:5432/watchhive"
```

### Run Migrations

```bash
cd server
npx prisma migrate dev --name init
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Database connection string is in `server/.env`
- [ ] Ran `npx prisma migrate dev` successfully
- [ ] Can see tables in Prisma Studio (`npx prisma studio`)
- [ ] All 8 tables created: users, entries, follows, likes, comments, lists, list_items, notifications

---

## 🆘 Troubleshooting

### "Connection refused" error
- Check your connection string is correct
- For Supabase: Make sure you replaced `[YOUR-PASSWORD]` with actual password
- For local: Make sure PostgreSQL is running

### "Migration failed" error
- Delete `prisma/migrations` folder
- Try again with `npx prisma migrate dev --name init`

### "Can't reach database" error
- Check your internet connection (for Supabase)
- Verify the database URL is correct
- Make sure there are no extra spaces in the connection string

---

## 📞 Need Help?

If you encounter any issues:
1. Check the error message carefully
2. Verify your connection string
3. Make sure you're in the `server/` directory
4. Let me know the exact error and I'll help!

---

**Once database is set up, we can test the backend API!** 🚀
