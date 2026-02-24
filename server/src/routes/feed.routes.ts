import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware.js';
import tmdbService from '../services/tmdb.service.js';

const router = Router();
const prisma = new PrismaClient();

// ============================================
// GET /api/v1/feed
// Fetch mixed feed of user entries and system suggestions
// ============================================
router.get('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;

        // 1. Get followed user IDs
        const follows = await prisma.follow.findMany({
            where: { followerId: userId },
            select: { followingId: true }
        });
        const followedIds = follows.map(f => f.followingId);

        // Include self in the feed
        const relevantUserIds = [...followedIds, userId];

        // 2. Fetch Entries (Followed + Self)
        const rawEntries = await prisma.entry.findMany({
            where: {
                userId: { in: relevantUserIds }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        profilePictureUrl: true,
                        isPrivate: true
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                },
                likes: {
                    where: { userId: userId },
                    select: { id: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
        });

        // Sort by "Trending Score" (Mix of Date & Engagement)
        const entries = rawEntries.map(entry => {
            const likes = entry._count.likes || 0;
            const comments = entry._count.comments || 0;
            const engagement = likes + (comments * 2);
            const hoursAge = Math.max(0.5, (Date.now() - new Date(entry.createdAt).getTime()) / (1000 * 60 * 60));
            const score = (engagement + 1) / Math.pow(hoursAge + 2, 1.5);
            return { entry, score };
        }).sort((a, b) => b.score - a.score).map(x => x.entry);

        // 3. Advanced Suggestions Generation
        let suggestions: any[] = [];

        try {
            // A. Fetch Most Recent User Entry for Contextual Suggestions
            const lastEntry = await prisma.entry.findFirst({
                where: { userId },
                orderBy: { watchedAt: 'desc' }
            });

            // C. Fetch TMDb Suggestions
            let tmdbRecs: any[] = [];

            if (lastEntry) {
                const recs = lastEntry.type === 'TV_SHOW'
                    ? await tmdbService.getTVShowRecommendations(lastEntry.tmdbId)
                    : await tmdbService.getMovieRecommendations(lastEntry.tmdbId);

                tmdbRecs = recs.results.map((r: any) => ({ ...r, reason: `Because you watched ${lastEntry.title}` }));
            }

            // Global trending
            const globalTrending = await tmdbService.getTrending('all', 'week');
            const trendingItems = globalTrending.results.map((r: any) => ({ ...r, reason: "Trending this week" }));

            // D. Add internal trends if they are noteworthy (e.g., liked by others)
            // For now, we mix them in as "Popular on WatchHive"
            // Note: internalTrending entries only have IDs, we'd need TMDb data to display them as suggestions
            // To keep it simple, we'll just prioritize global/rec results but we could pull internal ones if needed.

            suggestions = [...tmdbRecs.slice(0, 10), ...trendingItems.slice(0, 10)];

            // Randomize slightly
            suggestions.sort(() => Math.random() - 0.5);

        } catch (err) {
            console.error('Failed to fetch advanced suggestions', err);
            const fallback = await tmdbService.getTrending('all', 'week');
            suggestions = fallback.results.map((r: any) => ({ ...r, reason: "Trending Now" }));
        }

        // Pre-fetch user's watched IDs to mark items in feed
        const userEntries = await prisma.entry.findMany({
            where: { userId },
            select: { tmdbId: true }
        });
        const watchedTmdbIds = new Set(userEntries.map(e => e.tmdbId));

        // 4. Mix Content Strategy
        const feedItems: any[] = [];
        let suggestionIndex = (page - 1) * 2;

        const mappedEntries = entries.map(entry => ({
            type: 'ENTRY',
            id: entry.id,
            timestamp: entry.createdAt,
            data: {
                ...entry,
                isLiked: entry.likes.length > 0,
                isWatched: watchedTmdbIds.has(entry.tmdbId)
            }
        }));

        if (mappedEntries.length === 0 && page === 1) {
            suggestions.slice(0, 15).forEach(item => {
                feedItems.push({
                    type: 'SUGGESTION',
                    id: `suggestion-${item.id}`,
                    timestamp: new Date(),
                    data: {
                        ...item,
                        isWatched: watchedTmdbIds.has(item.id)
                    },
                    reason: item.reason || "Trending on WatchHive"
                });
            });
        } else {
            for (let i = 0; i < mappedEntries.length; i++) {
                feedItems.push(mappedEntries[i]);

                if ((i + 1) % 3 === 0) {
                    const sugg = suggestions[suggestionIndex % suggestions.length];
                    if (sugg) {
                        feedItems.push({
                            type: 'SUGGESTION',
                            id: `suggestion-${sugg.id}-${page}-${i}`,
                            timestamp: mappedEntries[i].timestamp,
                            data: {
                                ...sugg,
                                isWatched: watchedTmdbIds.has(sugg.id)
                            },
                            reason: sugg.reason || "Trending Now"
                        });
                        suggestionIndex++;
                    }
                }
            }
        }

        res.json({
            items: feedItems,
            nextPage: entries.length === limit ? page + 1 : null,
            hasMore: entries.length === limit
        });

    } catch (error) {
        console.error('Feed error:', error);
        res.status(500).json({ error: 'Failed to fetch feed' });
    }
});

export default router;
