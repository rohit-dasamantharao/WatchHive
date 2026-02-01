# 📋 WatchHive - Project Tasks & Roadmap

**Generated**: February 1, 2026  
**Status**: Ready for GitHub Projects Board

---

## 🎯 **Current Status**

### ✅ **Completed (Phase 1 & 2)**
- [x] Authentication system (login, signup, JWT)
- [x] Database setup (8 tables, Supabase)
- [x] Entry management (CRUD operations)
- [x] Entry form (create/edit with tags, ratings)
- [x] Entry list view
- [x] Navigation system
- [x] Documentation organization
- [x] Collaboration framework

### 🚧 **In Progress**
- [x] GitHub repository setup ✅
- [x] Project board creation ✅
- [x] TMDb API Integration ✅ (Completed: Feb 1, 2026)
- [x] Follow System ✅ (Completed: Feb 1, 2026)
- [x] Like System ✅ (Completed: Feb 1, 2026)
- [ ] Comment System (Next up)

---

## 📊 **Tasks for GitHub Projects Board**

---

## 🔴 **HIGH PRIORITY** (Phase 3: Core Features)

### **1. TMDb API Integration**
**Priority**: High  
**Complexity**: Medium  
**Estimated Time**: 4-6 hours  
**Labels**: `priority: high`, `type: feature`, `ai-assisted`

**Description**:
Integrate The Movie Database (TMDb) API to auto-fill movie/TV show data.

**Acceptance Criteria**:
- [ ] Set up TMDb API key in environment variables
- [ ] Create TMDb service for API calls
- [ ] Implement movie search functionality
- [ ] Auto-fill entry form with TMDb data (title, poster, release date, etc.)
- [ ] Add poster image display in entry list
- [ ] Handle API errors gracefully
- [ ] Add loading states

**Files to Create/Modify**:
- `server/.env` - Add TMDB_API_KEY
- `server/src/services/tmdb.service.ts` - TMDb API service
- `client/src/services/tmdb.service.ts` - Frontend TMDb service
- `client/src/components/entries/MovieSearch.tsx` - Search component
- `client/src/components/entries/EntryForm.tsx` - Update to use TMDb data

**Documentation**:
- TMDb API: https://developers.themoviedb.org/3

---

### **2. Social Features - Follow System**
**Priority**: High  
**Complexity**: Medium  
**Estimated Time**: 3-4 hours  
**Labels**: `priority: high`, `type: feature`, `ai-assisted`

**Description**:
Implement user follow/unfollow functionality.

**Acceptance Criteria**:
- [ ] Create follow/unfollow API endpoints
- [ ] Add follow button to user profiles
- [ ] Display followers/following count
- [ ] Create followers/following list pages
- [ ] Add follow status indicator
- [ ] Handle edge cases (self-follow, duplicate follows)

**Files to Create/Modify**:
- `server/src/routes/follows.ts` - Follow API routes
- `client/src/services/follows.service.ts` - Follow service
- `client/src/components/social/FollowButton.tsx` - Follow button component
- `client/src/pages/FollowersPage.tsx` - Followers list
- `client/src/pages/FollowingPage.tsx` - Following list

**Database**:
- Table already exists: `follows` (follower_id, following_id)

---

### **3. Social Features - Like System**
**Priority**: High  
**Complexity**: Low  
**Estimated Time**: 2-3 hours  
**Labels**: `priority: high`, `type: feature`, `ai-assisted`

**Description**:
Implement like functionality for entries.

**Acceptance Criteria**:
- [ ] Create like/unlike API endpoints
- [ ] Add like button to entries
- [ ] Display like count
- [ ] Show liked state
- [ ] Optimistic UI updates
- [ ] Handle concurrent likes

**Files to Create/Modify**:
- `server/src/routes/likes.ts` - Like API routes
- `client/src/services/likes.service.ts` - Like service
- `client/src/components/entries/LikeButton.tsx` - Like button component
- `client/src/components/entries/EntryList.tsx` - Update to show likes

**Database**:
- Table already exists: `likes` (user_id, entry_id)

---

### **4. Social Features - Comment System**
**Priority**: High  
**Complexity**: High  
**Estimated Time**: 5-7 hours  
**Labels**: `priority: high`, `type: feature`, `ai-assisted`

**Description**:
Implement commenting on entries with nested replies.

**Acceptance Criteria**:
- [ ] Create comment CRUD API endpoints
- [ ] Add comment form to entries
- [ ] Display comments with threading
- [ ] Support nested replies (parent_comment_id)
- [ ] Add edit/delete for own comments
- [ ] Show comment count
- [ ] Add pagination for comments

**Files to Create/Modify**:
- `server/src/routes/comments.ts` - Comment API routes
- `client/src/services/comments.service.ts` - Comment service
- `client/src/components/comments/CommentForm.tsx` - Comment form
- `client/src/components/comments/CommentList.tsx` - Comment list
- `client/src/components/comments/Comment.tsx` - Single comment component

**Database**:
- Table already exists: `comments` (user_id, entry_id, parent_comment_id, content)

---

### **5. Activity Feed**
**Priority**: High  
**Complexity**: High  
**Estimated Time**: 6-8 hours  
**Labels**: `priority: high`, `type: feature`, `ai-assisted`

**Description**:
Create an activity feed showing what users you follow are watching.

**Acceptance Criteria**:
- [ ] Create feed API endpoint (entries from followed users)
- [ ] Implement pagination (infinite scroll)
- [ ] Show entry cards with user info
- [ ] Add filters (all, movies, TV shows)
- [ ] Add sorting (recent, popular)
- [ ] Display likes and comments count
- [ ] Make FeedPage functional (currently empty)

**Files to Create/Modify**:
- `server/src/routes/feed.ts` - Feed API routes
- `client/src/services/feed.service.ts` - Feed service
- `client/src/pages/FeedPage.tsx` - Update to show actual feed
- `client/src/components/feed/FeedItem.tsx` - Feed item component
- `client/src/components/feed/FeedFilters.tsx` - Filter component

**Database**:
- Query entries from followed users
- Join with likes and comments for counts

---

## 🟡 **MEDIUM PRIORITY** (Phase 4: Enhanced Features)

### **6. User Profile Page**
**Priority**: Medium  
**Complexity**: Medium  
**Estimated Time**: 4-5 hours  
**Labels**: `priority: medium`, `type: feature`, `ai-assisted`

**Description**:
Create a comprehensive user profile page with statistics.

**Acceptance Criteria**:
- [ ] Display user info (avatar, bio, join date)
- [ ] Show user statistics (total entries, avg rating, etc.)
- [ ] Display recent entries
- [ ] Show followers/following count
- [ ] Add edit profile functionality
- [ ] Support profile picture upload
- [ ] Make ProfilePage functional (currently basic)

**Files to Create/Modify**:
- `server/src/routes/users.ts` - User profile routes
- `client/src/services/users.service.ts` - User service
- `client/src/pages/ProfilePage.tsx` - Update profile page
- `client/src/components/profile/ProfileHeader.tsx` - Profile header
- `client/src/components/profile/ProfileStats.tsx` - Statistics component
- `client/src/components/profile/EditProfile.tsx` - Edit profile form

---

### **7. User Statistics Dashboard**
**Priority**: Medium  
**Complexity**: Medium  
**Estimated Time**: 3-4 hours  
**Labels**: `priority: medium`, `type: feature`, `ai-assisted`

**Description**:
Create a statistics dashboard showing user's watch history analytics.

**Acceptance Criteria**:
- [ ] Total movies/TV shows watched
- [ ] Average rating
- [ ] Most watched genres
- [ ] Watch time over time (chart)
- [ ] Top rated entries
- [ ] Recent activity
- [ ] Yearly summary

**Files to Create/Modify**:
- `server/src/routes/stats.ts` - Statistics routes
- `client/src/pages/StatsPage.tsx` - Statistics page
- `client/src/components/stats/StatsCard.tsx` - Stat card component
- `client/src/components/stats/WatchChart.tsx` - Chart component

**Libraries**:
- Consider: Chart.js or Recharts for visualizations

---

### **8. Lists & Watchlists**
**Priority**: Medium  
**Complexity**: High  
**Estimated Time**: 6-8 hours  
**Labels**: `priority: medium`, `type: feature`, `ai-assisted`

**Description**:
Implement custom lists and watchlists functionality.

**Acceptance Criteria**:
- [ ] Create list CRUD API endpoints
- [ ] Add/remove items from lists
- [ ] Public/private list settings
- [ ] List sharing
- [ ] Display user's lists
- [ ] Browse public lists
- [ ] Add to watchlist quick action

**Files to Create/Modify**:
- `server/src/routes/lists.ts` - List API routes
- `client/src/services/lists.service.ts` - List service
- `client/src/pages/ListsPage.tsx` - Lists page
- `client/src/components/lists/ListForm.tsx` - Create/edit list
- `client/src/components/lists/ListCard.tsx` - List card component

**Database**:
- Tables already exist: `lists`, `list_items`

---

### **9. Search & Discovery**
**Priority**: Medium  
**Complexity**: Medium  
**Estimated Time**: 4-5 hours  
**Labels**: `priority: medium`, `type: feature`, `ai-assisted`

**Description**:
Implement search for movies, users, and lists.

**Acceptance Criteria**:
- [ ] Search movies/TV shows (via TMDb)
- [ ] Search users
- [ ] Search lists
- [ ] Filter and sort results
- [ ] Recent searches
- [ ] Popular searches
- [ ] Search suggestions

**Files to Create/Modify**:
- `server/src/routes/search.ts` - Search routes
- `client/src/services/search.service.ts` - Search service
- `client/src/pages/SearchPage.tsx` - Search page
- `client/src/components/search/SearchBar.tsx` - Search bar component
- `client/src/components/search/SearchResults.tsx` - Results component

---

### **10. Notifications System**
**Priority**: Medium  
**Complexity**: High  
**Estimated Time**: 5-6 hours  
**Labels**: `priority: medium`, `type: feature`, `ai-assisted`

**Description**:
Implement notifications for likes, comments, follows, etc.

**Acceptance Criteria**:
- [ ] Create notification API endpoints
- [ ] Generate notifications on actions (like, comment, follow)
- [ ] Mark as read functionality
- [ ] Notification bell icon with count
- [ ] Notification dropdown
- [ ] Notification preferences
- [ ] Real-time updates (optional: WebSocket)

**Files to Create/Modify**:
- `server/src/routes/notifications.ts` - Notification routes
- `client/src/services/notifications.service.ts` - Notification service
- `client/src/components/notifications/NotificationBell.tsx` - Bell icon
- `client/src/components/notifications/NotificationList.tsx` - Notification list
- `client/src/components/notifications/Notification.tsx` - Single notification

**Database**:
- Table already exists: `notifications`

---

## 🟢 **LOW PRIORITY** (Phase 5: Polish & Extras)

### **11. Advanced Filtering & Sorting**
**Priority**: Low  
**Complexity**: Low  
**Estimated Time**: 2-3 hours  
**Labels**: `priority: low`, `type: feature`

**Description**:
Add advanced filtering and sorting to entry list.

**Acceptance Criteria**:
- [ ] Filter by type (movie/TV show)
- [ ] Filter by rating
- [ ] Filter by tags
- [ ] Filter by date range
- [ ] Sort by date, rating, title
- [ ] Save filter preferences

---

### **12. Export/Import Data**
**Priority**: Low  
**Complexity**: Medium  
**Estimated Time**: 3-4 hours  
**Labels**: `priority: low`, `type: feature`

**Description**:
Allow users to export/import their watch history.

**Acceptance Criteria**:
- [ ] Export to JSON
- [ ] Export to CSV
- [ ] Import from JSON
- [ ] Import from Letterboxd
- [ ] Data validation on import

---

### **13. Dark/Light Theme Toggle**
**Priority**: Low  
**Complexity**: Low  
**Estimated Time**: 2-3 hours  
**Labels**: `priority: low`, `type: feature`

**Description**:
Add theme toggle (currently dark theme only).

**Acceptance Criteria**:
- [ ] Theme toggle button
- [ ] Light theme styles
- [ ] Save preference
- [ ] Respect system preference

---

### **14. Mobile Responsiveness Improvements**
**Priority**: Low  
**Complexity**: Medium  
**Estimated Time**: 4-5 hours  
**Labels**: `priority: low`, `type: enhancement`

**Description**:
Improve mobile experience across all pages.

**Acceptance Criteria**:
- [ ] Test all pages on mobile
- [ ] Fix layout issues
- [ ] Improve touch targets
- [ ] Add mobile-specific interactions
- [ ] Test on different devices

---

### **15. Performance Optimization**
**Priority**: Low  
**Complexity**: Medium  
**Estimated Time**: 3-4 hours  
**Labels**: `priority: low`, `type: enhancement`

**Description**:
Optimize application performance.

**Acceptance Criteria**:
- [ ] Implement lazy loading
- [ ] Add image optimization
- [ ] Reduce bundle size
- [ ] Add caching strategies
- [ ] Optimize database queries

---

## 🐛 **BUGS & FIXES**

### **16. Fix Entry Update Bug**
**Priority**: High  
**Complexity**: Low  
**Estimated Time**: 1 hour  
**Labels**: `priority: high`, `type: bug`

**Description**:
Entry update sometimes returns 400 error on first attempt.

**Status**: ✅ **FIXED** (tmdbId excluded from update payload)

---

## 📚 **DOCUMENTATION**

### **17. API Documentation**
**Priority**: Medium  
**Complexity**: Low  
**Estimated Time**: 2-3 hours  
**Labels**: `priority: medium`, `type: docs`

**Description**:
Create comprehensive API documentation.

**Acceptance Criteria**:
- [ ] Document all endpoints
- [ ] Add request/response examples
- [ ] Include authentication details
- [ ] Add error codes
- [ ] Use Swagger/OpenAPI (optional)

---

### **18. User Guide**
**Priority**: Low  
**Complexity**: Low  
**Estimated Time**: 2-3 hours  
**Labels**: `priority: low`, `type: docs`

**Description**:
Create user-facing documentation.

**Acceptance Criteria**:
- [ ] Getting started guide
- [ ] Feature explanations
- [ ] FAQ
- [ ] Troubleshooting
- [ ] Screenshots/GIFs

---

## 🧪 **TESTING**

### **19. Unit Tests**
**Priority**: Medium  
**Complexity**: High  
**Estimated Time**: 8-10 hours  
**Labels**: `priority: medium`, `type: test`

**Description**:
Add unit tests for backend and frontend.

**Acceptance Criteria**:
- [ ] Backend: Test all API routes
- [ ] Backend: Test services
- [ ] Frontend: Test components
- [ ] Frontend: Test services
- [ ] Achieve >70% coverage

---

### **20. E2E Tests**
**Priority**: Low  
**Complexity**: High  
**Estimated Time**: 6-8 hours  
**Labels**: `priority: low`, `type: test`

**Description**:
Add end-to-end tests for critical workflows.

**Acceptance Criteria**:
- [ ] Test authentication flow
- [ ] Test entry creation
- [ ] Test social features
- [ ] Use Playwright or Cypress

---

## 🚀 **DEPLOYMENT**

### **21. Production Deployment**
**Priority**: High  
**Complexity**: Medium  
**Estimated Time**: 3-4 hours  
**Labels**: `priority: high`, `type: deployment`

**Description**:
Deploy application to production.

**Acceptance Criteria**:
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway
- [ ] Configure environment variables
- [ ] Set up custom domain
- [ ] Configure CORS
- [ ] Test production build

---

### **22. CI/CD Pipeline**
**Priority**: Medium  
**Complexity**: Medium  
**Estimated Time**: 2-3 hours  
**Labels**: `priority: medium`, `type: deployment`

**Description**:
Set up automated deployment pipeline.

**Acceptance Criteria**:
- [ ] Auto-deploy on merge to main
- [ ] Run tests before deploy
- [ ] Deploy to staging from develop
- [ ] Rollback capability

---

## 📊 **Summary**

**Total Tasks**: 22  
**High Priority**: 6 tasks  
**Medium Priority**: 8 tasks  
**Low Priority**: 8 tasks  

**Estimated Total Time**: 80-100 hours

**Phase Breakdown**:
- Phase 3 (High Priority): ~25-30 hours
- Phase 4 (Medium Priority): ~35-40 hours
- Phase 5 (Low Priority): ~20-25 hours

---

## 🎯 **Recommended Order**

1. **Week 1-2**: TMDb Integration, Follow System, Like System
2. **Week 3-4**: Comment System, Activity Feed
3. **Week 5-6**: User Profile, Statistics, Lists
4. **Week 7-8**: Search, Notifications
5. **Week 9+**: Polish, Testing, Deployment

---

**Generated By**: Antigravity AI  
**Date**: February 1, 2026  
**Status**: Ready for GitHub Projects Board
