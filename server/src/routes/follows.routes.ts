import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import prisma from '../utils/prisma.js';
import notificationService from '../services/notification.service.js';
import { NotificationType } from '@prisma/client';

const router = Router();

/**
 * @route   POST /api/follows/:userId
 * @desc    Follow a user (or send follow request if private)
 * @access  Private
 */
router.post('/:userId', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const followingId = req.params.userId;
        const followerId = req.user!.userId;

        if (followerId === followingId) {
            res.status(400).json({ error: 'You cannot follow yourself' });
            return;
        }

        const userToFollow = await prisma.user.findUnique({
            where: { id: followingId },
        });

        if (!userToFollow) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // 1. Check if already following
        const existingFollow = await prisma.follow.findUnique({
            where: { followerId_followingId: { followerId, followingId } },
        });

        if (existingFollow) {
            res.status(400).json({ error: 'You are already following this user' });
            return;
        }

        // 2. Check if there's a pending request
        const existingRequest = await prisma.followRequest.findUnique({
            where: { senderId_recipientId: { senderId: followerId, recipientId: followingId } }
        });

        if (existingRequest) {
            if (existingRequest.status === 'pending') {
                res.status(400).json({ error: 'Follow request already pending' });
                return;
            }
            await prisma.followRequest.delete({ where: { id: existingRequest.id } });
        }

        const actor = await prisma.user.findUnique({ where: { id: followerId }, select: { username: true, displayName: true } });
        const actorName = actor?.displayName || actor?.username || 'Someone';

        // 3. Handle Private vs Public
        if (userToFollow.isPrivate) {
            const request = await prisma.followRequest.create({
                data: { senderId: followerId, recipientId: followingId }
            });

            await notificationService.createNotification(followingId, NotificationType.FOLLOW_REQUEST, {
                actorId: followerId,
                actorName,
                requestId: request.id
            });

            res.status(201).json({ message: 'Follow request sent', status: 'requested' });
        } else {
            const follow = await prisma.follow.create({
                data: { followerId, followingId },
                include: {
                    following: {
                        select: { id: true, username: true, displayName: true, profilePictureUrl: true }
                    }
                }
            });

            await notificationService.createNotification(followingId, NotificationType.FOLLOW, {
                actorId: followerId,
                actorName
            });

            res.status(201).json({ message: 'Successfully followed user', follow, status: 'following' });
        }
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Failed to follow user' });
    }
});

/**
 * @route   POST /api/follows/requests/:requestId/accept
 * @desc    Accept a follow request
 */
router.post('/requests/:requestId/accept', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const { requestId } = req.params;
        const userId = req.user!.userId;

        const request = await prisma.followRequest.findUnique({
            where: { id: requestId },
        });

        if (!request || request.recipientId !== userId) {
            res.status(404).json({ error: 'Request not found' });
            return;
        }

        await prisma.follow.create({
            data: { followerId: request.senderId, followingId: userId }
        });

        await prisma.followRequest.delete({ where: { id: requestId } });

        const recipient = await prisma.user.findUnique({ where: { id: userId }, select: { username: true, displayName: true } });
        await notificationService.createNotification(request.senderId, NotificationType.FOLLOW_ACCEPT, {
            actorId: userId,
            actorName: recipient?.displayName || recipient?.username || 'Someone'
        });

        res.json({ message: 'Follow request accepted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to accept' });
    }
});

/**
 * @route   POST /api/follows/requests/:requestId/reject
 * @desc    Reject a follow request
 */
router.post('/requests/:requestId/reject', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const { requestId } = req.params;
        const userId = req.user!.userId;

        const request = await prisma.followRequest.findUnique({ where: { id: requestId } });

        if (!request || request.recipientId !== userId) {
            res.status(404).json({ error: 'Request not found' });
            return;
        }

        await prisma.followRequest.delete({ where: { id: requestId } });
        res.json({ message: 'Follow request rejected' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject' });
    }
});

/**
 * @route   GET /api/follows/requests/pending
 * @desc    Get pending follow requests for current user
 */
router.get('/requests/pending', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const requests = await prisma.followRequest.findMany({
            where: { recipientId: userId, status: 'pending' },
            include: {
                sender: {
                    select: { id: true, username: true, displayName: true, profilePictureUrl: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

/**
 * @route   DELETE /api/follows/:userId
 * @desc    Unfollow a user
 */
router.delete('/:userId', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const followingId = req.params.userId;
        const followerId = req.user!.userId;

        await prisma.followRequest.deleteMany({
            where: { senderId: followerId, recipientId: followingId }
        });

        const existingFollow = await prisma.follow.findUnique({
            where: { followerId_followingId: { followerId, followingId } },
        });

        if (!existingFollow) {
            res.status(404).json({ error: 'You are not following this user' });
            return;
        }

        await prisma.follow.delete({
            where: { followerId_followingId: { followerId, followingId } },
        });

        res.json({ message: 'Successfully unfollowed user' });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Failed to unfollow user' });
    }
});

/**
 * @route   GET /api/follows/:userId/followers
 */
router.get('/:userId/followers', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 20;
        const skip = (page - 1) * limit;

        const [followers, total] = await Promise.all([
            prisma.follow.findMany({
                where: { followingId: userId },
                skip,
                take: limit,
                include: {
                    follower: {
                        select: { id: true, username: true, displayName: true, profilePictureUrl: true, createdAt: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.follow.count({ where: { followingId: userId } }),
        ]);

        res.json({
            followers: followers.map((f) => f.follower),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

/**
 * @route   GET /api/follows/:userId/following
 */
router.get('/:userId/following', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 20;
        const skip = (page - 1) * limit;

        const [following, total] = await Promise.all([
            prisma.follow.findMany({
                where: { followerId: userId },
                skip,
                take: limit,
                include: {
                    following: {
                        select: { id: true, username: true, displayName: true, profilePictureUrl: true, createdAt: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.follow.count({ where: { followerId: userId } }),
        ]);

        res.json({
            following: following.map((f) => f.following),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

/**
 * @route   GET /api/follows/:userId/status
 */
router.get('/:userId/status', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const followingId = req.params.userId;
        const followerId = req.user!.userId;

        const follow = await prisma.follow.findUnique({
            where: { followerId_followingId: { followerId, followingId } },
        });

        const request = await prisma.followRequest.findUnique({
            where: { senderId_recipientId: { senderId: followerId, recipientId: followingId } }
        });

        res.json({
            isFollowing: !!follow,
            isRequested: !!request,
            followedAt: follow?.createdAt || null,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

/**
 * @route   GET /api/follows/stats/:userId
 */
router.get('/stats/:userId', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const [followersCount, followingCount] = await Promise.all([
            prisma.follow.count({ where: { followingId: userId } }),
            prisma.follow.count({ where: { followerId: userId } }),
        ]);
        res.json({ followersCount, followingCount });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

export default router;
