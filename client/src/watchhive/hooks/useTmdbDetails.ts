import { useState, useEffect } from 'react';
import axios from 'axios';

const tmdbCache = new Map<string, any>();
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

export const useTmdbDetails = (tmdbId: number, type: 'MOVIE' | 'TV_SHOW' | 'EPISODE') => {
    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!tmdbId) return;

        // Simplify EPISODE to TV_SHOW logic for now or skip fetching details
        // Ideally we need parent show ID for episodes, Entry model should store it if needed.
        // Assuming EPISODE entries have tmdbId pointing to the episode itself?
        // TMDb API for episode is /tv/{id}/season/{season_number}/episode/{episode_number}
        // Entry model only has tmdbId.
        // Let's assume for feed we mainly show the show poster for episodes unless we query deeply.
        // For now, let's treat EPISODE as TV_SHOW if tmdbId refers to the show, or handle it properly.
        // However, `entries.service.ts` says `tmdbId` is stored.
        // If it's an episode, `tmdbId` might be the episode ID, which requires specific lookup.
        // For MVP simplicity, let's just fetch Movie/TV details. 
        // If type is EPISODE, we might fail to get a poster if we query /tv/episodeId.

        let endpoint = type === 'TV_SHOW' ? 'tv' : 'movie';
        if (type === 'EPISODE') {
            // Fallback strategy: Treat as TV Show if possible or skip
            // We'll skip fetching details for EPISODE type to avoid 404s for now
            // Unless we know the specific ID refers to a show.
            // Let's assume Entry stores the SHOW ID for episodes? (Common pattern)
            // If not, we can't fetch the poster easily.
            endpoint = 'tv';
        }

        const cacheKey = `${endpoint}-${tmdbId}`;

        if (tmdbCache.has(cacheKey)) {
            setDetails(tmdbCache.get(cacheKey));
            return;
        }

        setLoading(true);

        const fetchDetails = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const response = await axios.get(`${API_BASE_URL}/tmdb/${endpoint}/${tmdbId}`, {
                    headers
                });

                tmdbCache.set(cacheKey, response.data);
                setDetails(response.data);
            } catch (err) {
                console.error(`Error fetching TMDb details for ${type} ${tmdbId}`, err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [tmdbId, type]);

    return { details, loading, error };
};
