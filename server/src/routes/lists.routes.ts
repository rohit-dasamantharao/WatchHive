import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Get (or create) the default "Watchlist"
router.get('/watchlist', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;

        // Try to find a list named "Watchlist" for this user
        let watchlist = await prisma.list.findFirst({
            where: {
                userId,
                name: 'Watchlist',
            },
            include: {
                items: {
                    orderBy: { addedAt: 'desc' },
                },
            },
        });

        // If not found, create it
        if (!watchlist) {
            watchlist = await prisma.list.create({
                data: {
                    userId,
                    name: 'Watchlist',
                    description: 'Movies and shows I plan to watch',
                    isPublic: true,
                },
                include: {
                    items: true,
                },
            });
        }

        res.json(watchlist);
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        res.status(500).json({ error: 'Failed to fetch watchlist' });
    }
});

// Add item to a list
router.post('/:listId/items', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const { listId } = req.params;
        const { tmdbId, mediaType } = req.body;
        const userId = req.user!.userId;

        // Verify list ownership
        const list = await prisma.list.findUnique({
            where: { id: listId },
        });

        if (!list) {
            res.status(404).json({ error: 'List not found' });
            return;
        }

        if (list.userId !== userId) {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }

        // Check if item already exists
        const existing = await prisma.listItem.findFirst({
            where: {
                listId,
                tmdbId: Number(tmdbId),
                mediaType: mediaType || 'movie',
            },
        });

        if (existing) {
            res.status(400).json({ error: 'Item already in list' });
            return;
        }

        // Get max order index
        const lastItem = await prisma.listItem.findFirst({
            where: { listId },
            orderBy: { orderIndex: 'desc' },
        });

        const newItem = await prisma.listItem.create({
            data: {
                listId,
                tmdbId: Number(tmdbId),
                mediaType: mediaType || 'movie',
                orderIndex: lastItem ? lastItem.orderIndex + 1 : 0,
            },
        });

        res.json(newItem);
    } catch (error) {
        console.error('Error adding to list:', error);
        res.status(500).json({ error: 'Failed to add item to list' });
    }
});

// Remove item from a list (by tmdbId for convenience)
router.delete('/:listId/items/:tmdbId', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const { listId, tmdbId } = req.params;
        const userId = req.user!.userId;

        const list = await prisma.list.findUnique({ where: { id: listId } });

        if (!list || list.userId !== userId) {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }

        // Find the item by tmdbId
        const item = await prisma.listItem.findFirst({
            where: {
                listId,
                tmdbId: Number(tmdbId),
            },
        });

        if (!item) {
            res.status(404).json({ error: 'Item not found in list' });
            return;
        }

        await prisma.listItem.delete({
            where: { id: item.id },
        });

        res.json({ message: 'Removed' });
    } catch (error) {
        console.error('Error removing from list:', error);
        res.status(500).json({ error: 'Failed to remove' });
    }
});

export default router;
