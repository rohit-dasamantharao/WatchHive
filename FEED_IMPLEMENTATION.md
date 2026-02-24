# Feed Feature Implementation

## Overview
The Feed feature serves as the central hub for user engagement on WatchHive, surfacing relevant activities from followed users and discovering new content through trending suggestions.

## API Design

### Endpoint: `GET /api/v1/feed`
- **Authentication**: Required (`authMiddleware`)
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
- **Response**:
  ```json
  {
    "items": [
      {
        "type": "ENTRY" | "SUGGESTION",
        "id": "string",
        "data": { ... }, // Entry object or TMDb Movie/TV object
        "timestamp": "ISO Date"
      }
    ],
    "nextPage": number | null,
    "hasMore": boolean
  }
  ```

## Algorithm Specification

The feed generation algorithm prioritizes social relevance while ensuring discovery.

1. **Step 1: Fetch Social Content**
   - Query `Entry` table for posts from users the current user follows.
   - Include the current user's own posts.
   - Sort by `createdAt` descending.
   - Fetch `limit` items for the current page.

2. **Step 2: Fetch Discovery Content**
   - If the user is new (no follows/posts) or content is sparse, fetch **Trending Movies/TV Shows** from TMDb API.
   - This ensures the feed is never empty ("Cold Start" problem solution).

3. **Step 3: Interleaving Strategy**
   - Inject 1 suggestion card for every 3 social posts to encourage discovery.
   - If social posts are exhausted (end of feed), append remaining trending items.
   - For new users, fill the feed primarily with trending suggestions.

4. **Step 4: Pagination**
   - Use standard offset/limit pagination for SQL queries.
   - Client handles infinite scroll triggering.

## UI/UX Implementation

### Components
- **`FeedPage`**: Main container handling data fetching, infinite scroll state, and empty states.
- **`FeedList`**: Renders the stream of items.
- **`FeedCard`**: A polymorphic component that renders:
  - **User Entries**: Shows user avatar, movie poster, rating, review, tags, and interaction buttons (Like, Comment).
  - **Suggestions**: Shows distinct "Recommended" styling, movie poster, global rating, and brief overview.

### Design
- **Cinematic Theme**: Dark background (`#0d0d10`), high-contrast text, and card-based layout (`#1e1e24`).
- **Responsive**: Adapts from single-column mobile view to focused desktop view.
- **Micro-interactions**: Hover effects on cards, like button animations.

## Testing Plan

### 1. Unit Testing (Backend)
- Verify `GET /feed` returns 401 for unauthenticated requests.
- Verify `GET /feed` returns correct structure for authenticated users.
- Test pagination logic (page 1 vs page 2).

### 2. Integration Testing
- **Social Graph**: Create User A and User B. User A follows B.
  - Verify User B's post appears in User A's feed.
- **Mixed Content**: Verify suggestions are interleaved correctly.

### 3. Frontend Testing
- **Empty State**: Verify "Trending Now" appears for new users.
- **Infinite Scroll**: Verify "Load More" button fetches next page and appends items.
- **Broken Images**: Ensure fallback avatars/posters are used if URLs fail.

### 4. Critical Path
- Login -> Redirect to Feed -> Scroll -> Like a Post.

## Future Improvements
- **Personalization**: Use collaborative filtering to recommend movies based on user's Liked entries.
- **Caching**: Implement Redis caching for the feed construction to reduce DB load.
- **Real-time**: Use WebSockets to push new activities instantly.
