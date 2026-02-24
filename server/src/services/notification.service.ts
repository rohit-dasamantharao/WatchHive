import prisma from '../utils/prisma.js';
import { NotificationType } from '@prisma/client';

export const notificationService = {
    /**
     * Create a notification for a user
     */
    createNotification: async (
        userId: string,
        type: NotificationType,
        content: any
    ) => {
        try {
            // Don't notify yourself
            if (content.actorId === userId) return null;

            return await prisma.notification.create({
                data: {
                    userId,
                    type,
                    content,
                },
            });
        } catch (error) {
            console.error('Error creating notification:', error);
            return null;
        }
    },

    /**
     * Get user notifications
     */
    getNotifications: async (userId: string, page = 1, limit = 20) => {
        const skip = (page - 1) * limit;
        return await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        });
    },

    /**
     * Mark notification as read
     */
    markAsRead: async (notificationId: string, userId: string) => {
        return await prisma.notification.updateMany({
            where: { id: notificationId, userId },
            data: { isRead: true },
        });
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: async (userId: string) => {
        return await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    },

    /**
     * Get unread count
     */
    getUnreadCount: async (userId: string) => {
        return await prisma.notification.count({
            where: { userId, isRead: false },
        });
    }
};

export default notificationService;
