import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authMiddleware } from '../middleware/auth.middleware.js';
import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/error.middleware.js';

const router = Router();

// Resolve uploads directory relative to project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../uploads/avatars');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for avatar uploads
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, _file, cb) => {
        const userId = req.user?.userId || 'unknown';
        const ext = path.extname(_file.originalname) || '.jpg';
        // Use a timestamp to bust caches
        cb(null, `${userId}-${Date.now()}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
    fileFilter: (_req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new AppError('Only JPEG, PNG, WebP, and GIF images are allowed', 400) as any);
        }
    },
});

// GET /api/v1/users/me - Get current user profile
router.get('/me', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                displayName: true,
                bio: true,
                profilePictureUrl: true,
                location: true,
                isPrivate: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
});

// PUT /api/v1/users/me - Update current user profile
router.put('/me', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { displayName, bio, location } = req.body;

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(displayName !== undefined && { displayName }),
                ...(bio !== undefined && { bio }),
                ...(location !== undefined && { location }),
            },
            select: {
                id: true,
                username: true,
                email: true,
                displayName: true,
                bio: true,
                profilePictureUrl: true,
                location: true,
                isPrivate: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.json(user);
    } catch (error) {
        next(error);
    }
});

// POST /api/v1/users/me/avatar - Upload profile picture
router.post(
    '/me/avatar',
    authMiddleware,
    upload.single('avatar'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.userId;

            if (!req.file) {
                throw new AppError('No file uploaded', 400);
            }

            // Delete old avatar file if it exists
            const currentUser = await prisma.user.findUnique({
                where: { id: userId },
                select: { profilePictureUrl: true },
            });

            if (currentUser?.profilePictureUrl && currentUser.profilePictureUrl.includes('/uploads/avatars/')) {
                const oldFilename = currentUser.profilePictureUrl.split('/uploads/avatars/').pop();
                if (oldFilename) {
                    const oldPath = path.join(uploadsDir, oldFilename);
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                }
            }

            // Build the URL for the uploaded file
            const profilePictureUrl = `/uploads/avatars/${req.file.filename}`;

            // Update user in database
            const user = await prisma.user.update({
                where: { id: userId },
                data: { profilePictureUrl },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    displayName: true,
                    bio: true,
                    profilePictureUrl: true,
                    location: true,
                },
            });

            res.json(user);
        } catch (error) {
            next(error);
        }
    }
);

// DELETE /api/v1/users/me/avatar - Remove profile picture
router.delete('/me/avatar', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        // Get current avatar to delete file
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { profilePictureUrl: true },
        });

        if (currentUser?.profilePictureUrl && currentUser.profilePictureUrl.includes('/uploads/avatars/')) {
            const filename = currentUser.profilePictureUrl.split('/uploads/avatars/').pop();
            if (filename) {
                const filePath = path.join(uploadsDir, filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        }

        // Clear profilePictureUrl in database
        const user = await prisma.user.update({
            where: { id: userId },
            data: { profilePictureUrl: null },
            select: {
                id: true,
                username: true,
                email: true,
                displayName: true,
                bio: true,
                profilePictureUrl: true,
                location: true,
            },
        });

        res.json(user);
    } catch (error) {
        next(error);
    }
});

export default router;
