# 🚀 Collaboration Setup Checklist

Use this checklist to set up collaboration for WatchHive.

---

## ✅ **Phase 1: Version Control** (Essential)

### GitHub Repository Setup

- [ ] Create GitHub repository (if not exists)
  ```bash
  # If not initialized
  git init
  git add .
  git commit -m "Initial commit"
  
  # Create repo on GitHub, then:
  git remote add origin https://github.com/YOUR_USERNAME/WatchHive.git
  git branch -M main
  git push -u origin main
  ```

- [ ] Add collaborators
  - Go to Settings → Collaborators
  - Invite team members
  - Set appropriate permissions

- [ ] Create branch protection rules
  - Settings → Branches → Add rule
  - Protect `main` branch
  - Require PR reviews
  - Require status checks

- [ ] Set up branch strategy
  ```bash
  # Create develop branch
  git checkout -b develop
  git push origin develop
  ```

---

## ✅ **Phase 2: Project Management** (Essential)

### GitHub Projects

- [ ] Create project board
  - Go to Projects → New project
  - Choose "Board" template
  - Name it "WatchHive Development"

- [ ] Add columns:
  - 📋 Backlog
  - 🎯 To Do
  - 🚧 In Progress
  - 👀 In Review
  - ✅ Done

- [ ] Add automation:
  - Auto-move to "In Progress" when PR created
  - Auto-move to "Done" when PR merged

- [ ] Create initial issues:
  - [ ] TMDb API Integration
  - [ ] Social Features (Follow/Like/Comment)
  - [ ] Activity Feed
  - [ ] User Statistics Dashboard
  - [ ] Lists & Watchlists

- [ ] Add labels:
  ```
  priority: high (red)
  priority: medium (yellow)
  priority: low (green)
  type: feature (blue)
  type: bug (red)
  type: docs (purple)
  ai-assisted (cyan)
  needs-review (orange)
  ```

---

## ✅ **Phase 3: Communication** (Recommended)

### Discord Setup (Free)

- [ ] Create Discord server
  - Name: "WatchHive Dev Team"
  
- [ ] Create channels:
  ```
  TEXT CHANNELS
  ├── #general - General chat
  ├── #development - Dev updates
  ├── #ai-sessions - AI development logs
  ├── #code-review - PR discussions
  ├── #bugs - Bug reports
  ├── #design - UX/UI discussions
  └── #marketing - Marketing strategy
  
  VOICE CHANNELS
  ├── Dev Hangout
  └── Pair Programming
  ```

- [ ] Add GitHub integration
  - Add GitHub bot to Discord
  - Connect to repository
  - Send notifications to #development

- [ ] Set up roles:
  - @Admin
  - @Developer
  - @Designer
  - @Marketer

**Alternative: Slack**
- [ ] Create Slack workspace
- [ ] Add GitHub app
- [ ] Create similar channels

---

## ✅ **Phase 4: Documentation** (Recommended)

### Notion Setup (Optional)

- [ ] Create Notion workspace
  - Name: "WatchHive"

- [ ] Create pages:
  - 📚 Documentation (sync from GitHub)
  - 🎯 Roadmap
  - 📝 Meeting Notes
  - 🐛 Bug Tracker
  - 💡 Ideas & Features
  - 🤖 AI Session Logs

- [ ] Sync GitHub docs
  - Use Notion GitHub integration
  - Or manually copy important docs

**Alternative: Use GitHub Wiki**
- [ ] Enable Wiki in repository settings
- [ ] Create main pages
- [ ] Link from README

---

## ✅ **Phase 5: Design** (If applicable)

### Figma Setup

- [ ] Create Figma workspace
  - Name: "WatchHive Design"

- [ ] Create files:
  - Design System
  - UI Components
  - Page Mockups
  - Prototypes

- [ ] Share with team
  - Add developers (view access)
  - Add designers (edit access)

- [ ] Link in GitHub
  - Add Figma links to issues
  - Reference in PRs

---

## ✅ **Phase 6: CI/CD** (Recommended)

### GitHub Actions

- [x] CI workflow created (`.github/workflows/ci.yml`)
- [ ] Add deployment secrets
  - Settings → Secrets → New secret
  - Add necessary API keys, tokens

- [ ] Set up staging environment
  - Deploy URL: [Add your staging URL]
  - Auto-deploy from `develop` branch

- [ ] Set up production environment
  - Deploy URL: [Add your production URL]
  - Auto-deploy from `main` branch

**Deployment Options**:
- [ ] Vercel (Frontend)
- [ ] Railway (Backend)
- [ ] Netlify (Frontend alternative)
- [ ] Render (Backend alternative)

---

## ✅ **Phase 7: Team Onboarding**

### For Each New Team Member

- [ ] Add to GitHub repository
- [ ] Add to Discord/Slack
- [ ] Add to Notion (if using)
- [ ] Add to Figma (if designer)
- [ ] Share test credentials securely
- [ ] Send onboarding docs:
  - [ ] AI_DEVELOPMENT_GUIDE.md
  - [ ] docs/COLLABORATION_GUIDE.md
  - [ ] docs/setup/QUICKSTART.md
  - [ ] docs/architecture/WATCHHIVE_ARCHITECTURE.md

- [ ] Assign first task
  - Small, well-defined
  - Good for learning codebase
  - Has clear acceptance criteria

---

## ✅ **Phase 8: Establish Workflows**

### Daily Workflow

- [ ] Set up async standups
  - Time: [e.g., 9 AM daily]
  - Channel: #development
  - Format: ✅ Yesterday, 🎯 Today, 🚫 Blockers

### Weekly Workflow

- [ ] Schedule sprint planning
  - Day: [e.g., Monday]
  - Time: [e.g., 10 AM]
  - Duration: 1 hour

- [ ] Schedule sprint review
  - Day: [e.g., Friday]
  - Time: [e.g., 4 PM]
  - Duration: 30 minutes

### Code Review

- [ ] Set review expectations
  - Response time: [e.g., 24 hours]
  - Minimum reviewers: [e.g., 1]
  - Required for merge: Yes

---

## ✅ **Phase 9: Security**

### Secrets Management

- [ ] Create `.env.example` files
  ```bash
  # In server/
  DATABASE_URL=
  JWT_SECRET=
  JWT_REFRESH_SECRET=
  TMDB_API_KEY=
  ```

- [ ] Document required secrets
  - Update README with list
  - Add to onboarding docs

- [ ] Set up GitHub Secrets
  - For CI/CD workflows
  - For deployment

### Access Control

- [ ] Review team permissions
- [ ] Enable 2FA for all members
- [ ] Rotate secrets regularly

---

## ✅ **Phase 10: Launch**

### Pre-Launch

- [ ] Test collaboration workflow
  - Create test issue
  - Create test PR
  - Review and merge
  - Verify automation

- [ ] Team kickoff meeting
  - Introduce team members
  - Review collaboration guide
  - Assign initial tasks
  - Set sprint goals

### Post-Launch

- [ ] Monitor collaboration health
  - PR merge time
  - Issue resolution time
  - Team communication

- [ ] Iterate and improve
  - Weekly retros
  - Adjust workflows
  - Update documentation

---

## 📊 **Quick Setup (Minimal)**

If you want to start quickly with minimal setup:

**Essential Only** (30 minutes):
1. ✅ GitHub repository with collaborators
2. ✅ GitHub Projects board
3. ✅ Discord server with basic channels
4. ✅ PR/Issue templates (already created)
5. ✅ Branch protection on main

**Start Collaborating!**

---

## 🆘 **Need Help?**

- Read: `docs/COLLABORATION_GUIDE.md`
- Check: GitHub Projects board
- Ask: In Discord #general
- Review: Recent PRs for examples

---

**Setup Progress**: [ ] Not Started | [ ] In Progress | [ ] Complete

**Last Updated**: February 1, 2026  
**Next Review**: [Add date]
