import { OAuth2Client } from 'google-auth-library';
import prisma from '../utils/prisma.js';
import {
    generateAccessToken,
    generateRefreshToken,
} from '../utils/jwt.util.js';
import { AppError } from '../middleware/error.middleware.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export interface GoogleAuthPayload {
    googleId: string;
    email: string;
    name: string;
    picture?: string;
}

export interface GoogleAuthResponse {
    user: {
        id: string;
        username: string;
        email: string;
        displayName: string | null;
        profilePictureUrl: string | null;
    };
    accessToken: string;
    refreshToken: string;
    isNewUser: boolean;
}

export const googleAuthService = {
    /**
     * Verify Google ID token and extract user info
     */
    async verifyGoogleToken(idToken: string): Promise<GoogleAuthPayload> {
        if (!GOOGLE_CLIENT_ID) {
            throw new AppError('Google OAuth is not configured', 500);
        }

        try {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();

            if (!payload) {
                throw new AppError('Invalid Google token', 401);
            }

            if (!payload.email) {
                throw new AppError('Google account email not available', 400);
            }

            return {
                googleId: payload.sub,
                email: payload.email,
                name: payload.name || payload.email.split('@')[0],
                picture: payload.picture,
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to verify Google token', 401);
        }
    },

    /**
     * Login or register a user via Google OAuth
     * - If user exists with googleId → login
     * - If user exists with same email (non-Google) → link Google account and login
     * - If user doesn't exist → create new account and login
     */
    async loginOrRegister(idToken: string): Promise<GoogleAuthResponse> {
        const googlePayload = await this.verifyGoogleToken(idToken);
        let isNewUser = false;

        // 1. Check if user already exists with this Google ID
        let user = await prisma.user.findUnique({
            where: { googleId: googlePayload.googleId },
            select: {
                id: true,
                username: true,
                email: true,
                displayName: true,
                profilePictureUrl: true,
            },
        });

        if (!user) {
            // 2. Check if user exists with same email (registered via email/password)
            const existingEmailUser = await prisma.user.findUnique({
                where: { email: googlePayload.email },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    displayName: true,
                    profilePictureUrl: true,
                    googleId: true,
                },
            });

            if (existingEmailUser) {
                // Link Google account to existing user
                user = await prisma.user.update({
                    where: { id: existingEmailUser.id },
                    data: {
                        googleId: googlePayload.googleId,
                        // Update profile picture if not set
                        ...(googlePayload.picture && !existingEmailUser.profilePictureUrl
                            ? { profilePictureUrl: googlePayload.picture }
                            : {}),
                    },
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        displayName: true,
                        profilePictureUrl: true,
                    },
                });
            } else {
                // 3. Create a new user
                isNewUser = true;

                // Generate a unique username from email or name
                const baseUsername = googlePayload.email
                    .split('@')[0]
                    .replace(/[^a-zA-Z0-9_]/g, '_')
                    .slice(0, 25);

                let username = baseUsername;
                let counter = 1;

                // Ensure unique username
                while (await prisma.user.findUnique({ where: { username } })) {
                    username = `${baseUsername}_${counter}`;
                    counter++;
                }

                user = await prisma.user.create({
                    data: {
                        username,
                        email: googlePayload.email,
                        googleId: googlePayload.googleId,
                        displayName: googlePayload.name,
                        profilePictureUrl: googlePayload.picture || null,
                        // No passwordHash — this is a Google-only user
                    },
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        displayName: true,
                        profilePictureUrl: true,
                    },
                });
            }
        }

        // Generate JWT tokens
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
            isNewUser,
        };
    },
};
