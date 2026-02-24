import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface ListItem {
    id: string;
    listId: string;
    tmdbId: number;
    mediaType?: string;
    orderIndex: number;
    addedAt: string;
}

export interface List {
    id: string;
    userId: string;
    name: string;
    description?: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    items: ListItem[];
}

export const listsApi = {
    getWatchlist: async (): Promise<List> => {
        const response = await apiClient.get('/lists/watchlist');
        return response.data;
    },

    addToWatchlist: async (listId: string, tmdbId: number, mediaType: 'movie' | 'tv' = 'movie'): Promise<ListItem> => {
        const response = await apiClient.post(`/lists/${listId}/items`, { tmdbId, mediaType });
        return response.data;
    },

    removeFromWatchlist: async (listId: string, tmdbId: number): Promise<void> => {
        await apiClient.delete(`/lists/${listId}/items/${tmdbId}`);
    },
};

export default listsApi;
