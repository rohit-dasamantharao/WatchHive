import apiClient from './api';
import { User, UserStats, UpdateUserData } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const userService = {
    async getMe(): Promise<User> {
        return apiClient.get<User>('/users/me');
    },

    async getUser(userId: string): Promise<User> {
        return apiClient.get<User>(`/users/${userId}`);
    },

    async updateUser(data: UpdateUserData): Promise<User> {
        return apiClient.put<User>('/users/me', data);
    },

    async uploadAvatar(file: File): Promise<User> {
        const formData = new FormData();
        formData.append('avatar', file);

        // Need to use fetch directly for FormData (multipart)
        const token = apiClient.getAccessToken();
        const response = await fetch(`${API_BASE}/api/v1/users/me/avatar`, {
            method: 'POST',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: formData,
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || 'Failed to upload avatar');
        }

        return response.json();
    },

    async deleteAvatar(): Promise<User> {
        return apiClient.delete<User>('/users/me/avatar');
    },

    async getUserStats(userId: string): Promise<UserStats> {
        return apiClient.get<UserStats>(`/users/${userId}/stats`);
    },

    async searchUsers(query: string): Promise<User[]> {
        return apiClient.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`);
    },
};

export default userService;
