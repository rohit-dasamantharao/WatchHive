import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/watch-hive/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Entry types
export interface Entry {
    id: string;
    userId: string;
    tmdbId: number;
    title: string;
    type: 'MOVIE' | 'TV_SHOW' | 'EPISODE';
    watchedAt: string;
    rating: number | null;
    review: string | null;
    tags: string[];
    isRewatch: boolean;
    watchLocation: string | null;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        username: string;
        displayName: string | null;
        profilePictureUrl: string | null;
    };
    _count: {
        likes: number;
        comments: number;
    };
}

export interface CreateEntryData {
    tmdbId: number;
    title: string;
    type: 'MOVIE' | 'TV_SHOW' | 'EPISODE';
    watchedAt?: string;
    rating?: number;
    review?: string;
    tags?: string[];
    isRewatch?: boolean;
    watchLocation?: string;
}

export interface UpdateEntryData {
    title?: string;
    type?: 'MOVIE' | 'TV_SHOW' | 'EPISODE';
    watchedAt?: string;
    rating?: number;
    review?: string;
    tags?: string[];
    isRewatch?: boolean;
    watchLocation?: string;
}

export interface GetEntriesParams {
    userId?: string;
    type?: 'MOVIE' | 'TV_SHOW' | 'EPISODE';
    rating?: number;
    tag?: string;
    search?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'watchedAt' | 'createdAt' | 'rating' | 'title';
    order?: 'asc' | 'desc';
}

export interface EntriesResponse {
    entries: Entry[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}

export interface EntryStats {
    totalEntries: number;
    movieCount: number;
    tvShowCount: number;
    episodeCount: number;
    averageRating: number;
    totalWatchTime: number;
}

// Entry API functions
export const entriesApi = {
    // Create a new entry
    createEntry: async (data: CreateEntryData): Promise<Entry> => {
        const response = await apiClient.post('/entries', data);
        return response.data.entry;
    },

    // Get all entries with filters
    getEntries: async (params?: GetEntriesParams): Promise<EntriesResponse> => {
        const response = await apiClient.get('/entries', { params });
        return response.data;
    },

    // Get a single entry
    getEntry: async (id: string): Promise<Entry> => {
        const response = await apiClient.get(`/entries/${id}`);
        return response.data.entry;
    },

    // Update an entry
    updateEntry: async (id: string, data: UpdateEntryData): Promise<Entry> => {
        const response = await apiClient.put(`/entries/${id}`, data);
        return response.data.entry;
    },

    // Delete an entry
    deleteEntry: async (id: string): Promise<void> => {
        await apiClient.delete(`/entries/${id}`);
    },

    // Get entry statistics
    getStats: async (): Promise<EntryStats> => {
        const response = await apiClient.get('/entries/stats/summary');
        return response.data.stats;
    },
};

export default entriesApi;
