/**
 * Firebase callable function bindings for mobile
 * Ported from V2
 */
import { httpsCallable } from 'firebase/functions';
import { functions } from './config';

export const getWorkDetailsFn = httpsCallable<{ id: number; type: string }, any>(functions, 'getWorkDetails');
export const searchWorksFn = httpsCallable<{ query: string; type: string; page?: number; filters?: any; nsfwMode?: boolean }, any>(functions, 'searchWorks');
export const getTopWorksFn = httpsCallable<{ type: string; filter?: string; limit?: number; nsfwMode?: boolean }, any>(functions, 'getTopWorks');
export const getSeasonalAnimeFn = httpsCallable<{ limit?: number; nsfwMode?: boolean }, any>(functions, 'getSeasonalAnime');
export const getAnimeEpisodesFn = httpsCallable<{ id: number; page?: number }, any>(functions, 'getAnimeEpisodes');
export const getJikanStatusFn = httpsCallable<Record<string, never>, any>(functions, 'getJikanStatus');
