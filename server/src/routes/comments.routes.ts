import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware } from '../middleware/auth.middleware.js';
import prisma from '../utils/prisma.js';
import notificationService from '../services/notification.service.js';

const router = Router();

/**
 * @route   POST /api/comments/:entryId
 * @desc    Add a comment to an entry
 * @access  Private
 */
router.post(
    '/:entryId',
    authMiddleware,
    [body('content').trim().notEmpty().withMessage('Comment cannot be empty')],
    async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { entryId } = req.params;
            const { content, parentCommentId } = req.body;
            const userId = req.user!.userId;

            // Check if entry exists
            const entry = await prisma.entry.findUnique({
                where: { id: entryId },
                include: { user: { select: { id: true, username: true } } }
            });

            if (!entry) {
                res.status(404).json({ error: 'Entry not found' });
                return;
            }

            // Create comment
            const comment = await prisma.comment.create({
                data: {
                    content,
                    userId,
                    entryId,
                    parentCommentId: parentCommentId || null,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            displayName: true,
                            profilePictureUrl: true,
                        },
                    },
                    parentComment: {
                        select: {
                            userId: true
                        }
                    }
                },
            });

            // Get updated comment count
            const commentCount = await prisma.comment.count({
                where: { entryId }
            });

            // --- Send Notifications ---
            const actorName = comment.user.displayName || comment.user.username;

            // 1. Notify Parent Comment Owner (if it's a reply)
            if (comment.parentComment && comment.parentComment.userId !== userId) {
                await notificationService.createNotification(comment.parentComment.userId, 'REPLY', {
                    actorId: userId,
                    actorName,
                    entryId,
                    commentId: comment.id,
                    contentSnippet: content.substring(0, 50),
                    entryTitle: entry.title
                });
            }
            // 2. Notify Entry Owner (if it's not a reply or if the entry owner is NOT the parent comment owner)
            else if (entry.userId !== userId) {
                await notificationService.createNotification(entry.userId, 'COMMENT', {
                    actorId: userId,
                    actorName,
                    entryId,
                    commentId: comment.id,
                    contentSnippet: content.substring(0, 50),
                    entryTitle: entry.title
                });
            }

            res.status(201).json({
                message: 'Comment added',
                comment,
                commentCount
            });
        } catch (error) {
            console.error('Error adding comment:', error);
            res.status(500).json({ error: 'Failed to add comment' });
        }
    }
);

/**
 * @route   GET /api/comments/:entryId
 * @desc    Get comments for an entry
 * @access  Private (or Public depending on entry visibility, but we use authMiddleware generally)
 */
router.get('/:entryId', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const { entryId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const skip = (page - 1) * limit;

        const [comments, total] = await Promise.all([
            prisma.comment.findMany({
                where: { entryId, parentCommentId: null }, // Fetch top-level comments; replies fetched separately or recursively if needed
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            displayName: true,
                            profilePictureUrl: true,
                        },
                    },
                    replies: { // Include immediate replies
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                    displayName: true,
                                    profilePictureUrl: true,
                                },
                            },
                        },
                        orderBy: { createdAt: 'asc' }
                    }
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.comment.count({ where: { entryId, parentCommentId: null } }),
        ]);

        res.json({
            comments,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

/**
 * @route   DELETE /api/comments/:commentId
 * @desc    Delete a comment
 * @access  Private (Owner or Entry Owner)
 */
router.delete('/:commentId', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const { commentId } = req.params;
        const userId = req.user!.userId;

        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            include: { entry: true },
        });

        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }

        // Allow deletion if user owns comment OR user owns the entry
        if (comment.userId !== userId && comment.entry.userId !== userId) {
            res.status(403).json({ error: 'Not authorized to delete this comment' });
            return;
        }

        await prisma.comment.delete({
            where: { id: commentId },
        });

        const commentCount = await prisma.comment.count({
            where: { entryId: comment.entryId }
        });

        res.json({ message: 'Comment deleted', commentCount });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
});

export default router;
