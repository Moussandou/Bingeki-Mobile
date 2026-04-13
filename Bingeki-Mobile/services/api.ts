/**
 * API Service for Mobile
 * Wraps Firebase Cloud Functions to fetch anime/manga data
 */
import { searchWorksFn, getTopWorksFn, getSeasonalAnimeFn, getWorkDetailsFn, getAnimeEpisodesFn } from '@/firebase/functions';

export interface JikanResult {
    mal_id: number;
    title: string;
    images: {
        jpg: {
            image_url: string;
            small_image_url: string;
            large_image_url: string;
        }
    };
    episodes?: number | null;
    chapters?: number | null;
    type: string;
    score?: number | null;
    synopsis?: string;
}

export const searchWorks = async (query: string, type: 'anime' | 'manga' = 'anime'): Promise<JikanResult[]> => {
    try {
        const result = await searchWorksFn({ query, type });
        return result.data?.data || [];
    } catch (error) {
        console.error('API Error (Search):', error);
        return [];
    }
};

export const getTopWorks = async (type: 'anime' | 'manga' = 'anime', limit: number = 20): Promise<JikanResult[]> => {
    try {
        const result = await getTopWorksFn({ type, limit });
        return result.data || [];
    } catch (error) {
        console.error('API Error (Top):', error);
        return [];
    }
};

export const getSeasonalAnime = async (limit: number = 20): Promise<JikanResult[]> => {
    try {
        const result = await getSeasonalAnimeFn({ limit });
        return result.data || [];
    } catch (error) {
        console.error('API Error (Seasonal):', error);
        return [];
    }
};

export const getWorkDetails = async (id: number, type: 'anime' | 'manga' = 'anime'): Promise<any> => {
    try {
        const result = await getWorkDetailsFn({ id, type });
        return result.data;
    } catch (error) {
        console.error('API Error (Details):', error);
        return null;
    }
};

export const getAnimeEpisodes = async (id: number, page: number = 1): Promise<any> => {
    try {
        const result = await getAnimeEpisodesFn({ id, page });
        return result.data;
    } catch (error) {
        console.error('API Error (Episodes):', error);
        return { data: [], pagination: { has_next_page: false } };
    }
};
