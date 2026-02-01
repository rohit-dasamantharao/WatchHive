import apiClient from './api';
import { User, UserStats, UpdateUserData } from '../types';

export const userService = {
    async getUser(userId: string): Promise<User> {
        return apiClient.get<User>(`/users/${userId}`);
    },

    async updateUser(userId: string, data: UpdateUserData): Promise<User> {
        return apiClient.put<User>(`/users/${userId}`, data);
    },

    async getUserStats(userId: string): Promise<UserStats> {
        return apiClient.get<UserStats>(`/users/${userId}/stats`);
    },

    async searchUsers(query: string): Promise<User[]> {
        return apiClient.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`);
    },
};

export default userService;
