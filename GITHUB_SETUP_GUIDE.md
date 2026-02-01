# 🚀 GitHub Setup Guide - Step by Step

**Follow these steps to push WatchHive to GitHub and set up the project board.**

---

## ✅ **Step 1: Initialize Git Repository**

Run these commands in your terminal:

```bash
# Navigate to project directory
cd /Users/adityadasamantharao/Documents/Repos/WatchHive

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: WatchHive full-stack application

- Complete authentication system (JWT)
- Entry management (CRUD)
- Database setup (Supabase + Prisma)
- Documentation organized
- Collaboration framework
- GitHub templates and CI/CD"
```

---

## ✅ **Step 2: Create GitHub Repository**

### **Option A: Via GitHub Website** (Recommended)

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `WatchHive`
   - **Description**: `A social platform for movie and TV show enthusiasts to track, share, and discover content`
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
3. Click "Create repository"

### **Option B: Via GitHub CLI** (If you have `gh` installed)

```bash
gh repo create WatchHive --public --description "A social platform for movie and TV show enthusiasts" --source=.
```

---

## ✅ **Step 3: Connect Local Repository to GitHub**

After creating the repository on GitHub, you'll see commands like these. Run them:

```bash
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/WatchHive.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Example** (if your username is `adityadasamantharao`):
```bash
git remote add origin https://github.com/adityadasamantharao/WatchHive.git
git branch -M main
git push -u origin main
```

---

## ✅ **Step 4: Create Develop Branch**

```bash
# Create and switch to develop branch
git checkout -b develop

# Push develop branch
git push -u origin develop
```

---

## ✅ **Step 5: Set Up Branch Protection** (Optional but Recommended)

1. Go to your repository on GitHub
2. Click **Settings** → **Branches**
3. Click **Add rule**
4. Branch name pattern: `main`
5. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (1)
   - ✅ Require status checks to pass
6. Click **Create**

---

## ✅ **Step 6: Create GitHub Projects Board**

### **Method 1: Via GitHub Website**

1. Go to your repository on GitHub
2. Click **Projects** tab
3. Click **New project**
4. Choose **Board** template
5. Name it: `WatchHive Development`
6. Click **Create**

### **Method 2: Via Organization** (If you have one)

1. Go to your GitHub organization
2. Click **Projects** → **New project**
3. Follow same steps as above

---

## ✅ **Step 7: Set Up Project Board Columns**

Add these columns to your board:

1. **📋 Backlog** - Future tasks
2. **🎯 To Do** - Prioritized for current sprint
3. **🚧 In Progress** - Currently being worked on
4. **👀 In Review** - PR created, awaiting review
5. **✅ Done** - Merged and deployed

---

## ✅ **Step 8: Add Labels to Repository**

1. Go to **Issues** → **Labels**
2. Create these labels:

**Priority Labels**:
- `priority: high` (color: red `#d73a4a`)
- `priority: medium` (color: yellow `#fbca04`)
- `priority: low` (color: green `#0e8a16`)

**Type Labels**:
- `type: feature` (color: blue `#0075ca`)
- `type: bug` (color: red `#d73a4a`)
- `type: docs` (color: purple `#7057ff`)
- `type: enhancement` (color: cyan `#a2eeef`)
- `type: test` (color: orange `#d93f0b`)
- `type: deployment` (color: pink `#e99695`)

**Special Labels**:
- `ai-assisted` (color: cyan `#1d76db`)
- `needs-review` (color: orange `#fbca04`)
- `blocked` (color: black `#000000`)
- `good first issue` (color: green `#7057ff`)

---

## ✅ **Step 9: Create Issues from Task List**

I've created a comprehensive task list in `docs/PROJECT_TASKS.md` with 22 tasks.

### **Quick Method: Use GitHub CLI**

If you have `gh` CLI installed:

```bash
# Navigate to project
cd /Users/adityadasamantharao/Documents/Repos/WatchHive

# Create issues from task list (you'll need to do this manually or use a script)
# Example for first task:
gh issue create \
  --title "[FEATURE] TMDb API Integration" \
  --body "$(cat docs/PROJECT_TASKS.md | sed -n '/### \*\*1. TMDb API Integration\*\*/,/^---$/p')" \
  --label "priority: high,type: feature,ai-assisted"
```

### **Manual Method: Via GitHub Website**

For each task in `docs/PROJECT_TASKS.md`:

1. Go to **Issues** → **New issue**
2. Copy task title and description
3. Add appropriate labels
4. Click **Submit new issue**
5. Add to project board

---

## ✅ **Step 10: Organize Issues on Project Board**

1. Go to your project board
2. Drag issues to appropriate columns:
   - **High Priority** tasks → **🎯 To Do**
   - **Medium Priority** tasks → **📋 Backlog**
   - **Low Priority** tasks → **📋 Backlog**

---

## ✅ **Step 11: Set Up Project Automation** (Optional)

1. In your project board, click **⋯** (three dots)
2. Click **Workflows**
3. Enable:
   - **Item added to project** → Move to **📋 Backlog**
   - **Pull request opened** → Move to **👀 In Review**
   - **Pull request merged** → Move to **✅ Done**
   - **Issue closed** → Move to **✅ Done**

---

## ✅ **Step 12: Verify GitHub Actions**

1. Go to **Actions** tab
2. You should see the CI/CD workflow (`.github/workflows/ci.yml`)
3. It will run automatically on next push/PR

---

## ✅ **Step 13: Add Repository Description & Topics**

1. Go to repository main page
2. Click **⚙️** (gear icon) next to About
3. Add:
   - **Description**: `A social platform for movie and TV show enthusiasts to track, share, and discover content`
   - **Website**: (your deployed URL, if any)
   - **Topics**: `react`, `typescript`, `nodejs`, `express`, `prisma`, `postgresql`, `social-media`, `movies`, `tv-shows`, `full-stack`
4. Click **Save changes**

---

## ✅ **Step 14: Create README Badges** (Optional)

Add these to the top of your README.md:

```markdown
![GitHub](https://img.shields.io/github/license/YOUR_USERNAME/WatchHive)
![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/WatchHive)
![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/WatchHive)
![GitHub pull requests](https://img.shields.io/github/issues-pr/YOUR_USERNAME/WatchHive)
```

---

## 📋 **Quick Checklist**

- [ ] Git initialized
- [ ] Initial commit created
- [ ] GitHub repository created
- [ ] Local repo connected to GitHub
- [ ] Code pushed to GitHub
- [ ] Develop branch created
- [ ] Branch protection set up (optional)
- [ ] Project board created
- [ ] Board columns added
- [ [ ] Labels created
- [ ] Issues created from task list
- [ ] Issues organized on board
- [ ] Automation enabled (optional)
- [ ] Repository description added
- [ ] Topics added

---

## 🆘 **Troubleshooting**

### **Issue: "Permission denied (publickey)"**

**Solution**:
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
```

Then use SSH URL instead:
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/WatchHive.git
```

### **Issue: "Repository not found"**

**Solution**:
- Check repository name is correct
- Check you have access to the repository
- Verify the URL is correct

### **Issue: "Failed to push some refs"**

**Solution**:
```bash
# Pull first
git pull origin main --rebase

# Then push
git push origin main
```

---

## 🎉 **You're Done!**

Your WatchHive project is now on GitHub with:
- ✅ Complete codebase
- ✅ Project board with tasks
- ✅ Labels and organization
- ✅ CI/CD automation
- ✅ Collaboration ready

**Next Steps**:
1. Invite collaborators (if any)
2. Start working on first task
3. Create feature branch
4. Make changes
5. Create PR
6. Review and merge!

---

## 📚 **Helpful Commands**

```bash
# Check git status
git status

# View remote
git remote -v

# Create new branch
git checkout -b feature/feature-name

# Commit changes
git add .
git commit -m "feat: description"

# Push changes
git push origin branch-name

# Switch branches
git checkout branch-name

# Pull latest changes
git pull origin main
```

---

**Need Help?** Check:
- `docs/COLLABORATION_GUIDE.md` - Complete workflow
- `docs/COLLABORATION_SETUP_CHECKLIST.md` - Detailed setup
- GitHub Docs: https://docs.github.com

**Happy coding! 🚀**
