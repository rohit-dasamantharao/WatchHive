import prisma from '../utils/prisma.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.util.js';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../utils/jwt.util.js';
import { AppError } from '../middleware/error.middleware.js';

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    displayName?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        username: string;
        email: string;
        displayName: string | null;
        profilePictureUrl: string | null;
    };
    accessToken: string;
    refreshToken: string;
}

export const authService = {
    async register(data: RegisterData): Promise<AuthResponse> {
        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email: data.email }, { username: data.username }],
            },
        });

        if (existingUser) {
            if (existingUser.email === data.email) {
                throw new AppError('Email already in use', 400);
            }
            throw new AppError('Username already taken', 400);
        }

        // Hash password
        const passwordHash = await hashPassword(data.password);

        // Create user
        const user = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                passwordHash,
                displayName: data.displayName || data.username,
            },
            select: {
                id: true,
                username: true,
                email: true,
                displayName: true,
                profilePictureUrl: true,
            },
        });

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
        });
        const refreshToken = generateRefreshToken({
            userId: user.id,
            email: user.email,
        });

        return {
            user,
            accessToken,
            refreshToken,
        };
    },

    async login(data: LoginData): Promise<AuthResponse> {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email: data.email },
            select: {
                id: true,
                username: true,
                email: true,
                displayName: true,
                profilePictureUrl: true,
                passwordHash: true,
            },
        });

        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        // Verify password
        const isPasswordValid = await comparePassword(
            data.password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
        });
        const refreshToken = generateRefreshToken({
            userId: user.id,
            email: user.email,
        });

        // Remove password hash from response
        const { passwordHash, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        };
    },

    async refresh(token: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const payload = verifyRefreshToken(token);

            // Verify user still exists
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
            });

            if (!user) {
                throw new AppError('User not found', 404);
            }

            // Generate new tokens
            const accessToken = generateAccessToken({
                userId: user.id,
                email: user.email,
            });
            const refreshToken = generateRefreshToken({
                userId: user.id,
                email: user.email,
            });

            return {
                accessToken,
                refreshToken,
            };
        } catch (error) {
            throw new AppError('Invalid refresh token', 401);
        }
    },
};
