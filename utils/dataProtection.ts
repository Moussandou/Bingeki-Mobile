/**
 * Data merge strategies for library and gamification state
 * Resolves conflicts between local and cloud data
 */
import { logger } from '@/utils/logger';
import type { Work, Folder } from '@/store/libraryStore';
import type { Badge } from '@/types/badge';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GamificationData {
    level: number;
    xp: number;
    totalXp: number;
    xpToNextLevel: number;
    streak: number;
    lastActivityDate: number | string | null;
    bonusXp: number;
    badges: Badge[];
    totalChaptersRead: number;
    totalAnimeEpisodesWatched: number;
    totalMoviesWatched: number;
    totalWorksAdded: number;
    totalWorksCompleted: number;
    lastUpdated?: number;
    version?: number;
}

export interface LibraryData {
    works: Work[];
    folders: Folder[];
    lastUpdated?: number;
    version?: number;
}

export function mergeGamificationData(
    local: Partial<GamificationData>,
    cloud: Partial<GamificationData> | null
): GamificationData {
    if (!cloud) {
        return {
            level: local.level || 1,
            xp: local.xp || 0,
            totalXp: local.totalXp || 0,
            xpToNextLevel: local.xpToNextLevel || 100,
            streak: local.streak || 0,
            lastActivityDate: local.lastActivityDate || null,
            bonusXp: local.bonusXp || 0,
            badges: local.badges || [],
            totalChaptersRead: local.totalChaptersRead || 0,
            totalAnimeEpisodesWatched: local.totalAnimeEpisodesWatched || 0,
            totalMoviesWatched: local.totalMoviesWatched || 0,
            totalWorksAdded: local.totalWorksAdded || 0,
            totalWorksCompleted: local.totalWorksCompleted || 0,
            lastUpdated: Date.now(),
            version: (local.version || 0) + 1
        };
    }

    if (!local || Object.keys(local).length === 0) {
        return {
            ...cloud,
            lastUpdated: cloud.lastUpdated || Date.now(),
            version: cloud.version || 1
        } as GamificationData;
    }

    const MAX_LEVEL = 100;
    const localTotalXp = local.totalXp || 0;
    const cloudTotalXp = cloud.totalXp || 0;
    const isLocalAhead = localTotalXp >= cloudTotalXp;

    const mergedTotalXp = Math.max(localTotalXp, cloudTotalXp);
    const mergedLevel = Math.min(MAX_LEVEL, isLocalAhead ? (local.level || 1) : (cloud.level || 1));
    const mergedXp = isLocalAhead ? (local.xp || 0) : (cloud.xp || 0);

    const mergedTotalChapters = Math.max(local.totalChaptersRead || 0, cloud.totalChaptersRead || 0);
    const mergedTotalEpisodes = Math.max(local.totalAnimeEpisodesWatched || 0, cloud.totalAnimeEpisodesWatched || 0);
    const mergedTotalMovies = Math.max(local.totalMoviesWatched || 0, cloud.totalMoviesWatched || 0);
    const mergedTotalWorks = Math.max(local.totalWorksAdded || 0, cloud.totalWorksAdded || 0);
    const mergedTotalCompleted = Math.max(local.totalWorksCompleted || 0, cloud.totalWorksCompleted || 0);

    const localLastActivityTime = local.lastActivityDate ? new Date(local.lastActivityDate).getTime() : 0;
    const cloudLastActivityTime = cloud.lastActivityDate ? new Date(cloud.lastActivityDate).getTime() : 0;
    const useLocalStreak = localLastActivityTime >= cloudLastActivityTime;
    const mergedStreak = useLocalStreak ? (local.streak || 0) : (cloud.streak || 0);
    const mergedLastActivity = useLocalStreak ? local.lastActivityDate : cloud.lastActivityDate;
    const mergedBonusXp = Math.max(local.bonusXp || 0, cloud.bonusXp || 0);

    const localBadges = local.badges || [];
    const cloudBadges = cloud.badges || [];
    const badgeMap = new Map<string, Badge>();

    [...cloudBadges, ...localBadges].forEach(badge => {
        const existing = badgeMap.get(badge.id);
        if (!existing || (badge.unlockedAt && (!existing.unlockedAt || badge.unlockedAt < existing.unlockedAt))) {
            badgeMap.set(badge.id, badge);
        }
    });
    const mergedBadges = Array.from(badgeMap.values());

    const LEVEL_BASE = 100;
    const LEVEL_MULTIPLIER = 1.15;
    let xpToNext = LEVEL_BASE;
    for (let i = 1; i < mergedLevel; i++) {
        xpToNext = Math.floor(xpToNext * LEVEL_MULTIPLIER);
    }

    return {
        level: mergedLevel,
        xp: mergedXp,
        totalXp: mergedTotalXp,
        xpToNextLevel: xpToNext,
        streak: mergedStreak,
        lastActivityDate: mergedLastActivity || null,
        bonusXp: mergedBonusXp,
        badges: mergedBadges,
        totalChaptersRead: mergedTotalChapters,
        totalAnimeEpisodesWatched: mergedTotalEpisodes,
        totalMoviesWatched: mergedTotalMovies,
        totalWorksAdded: mergedTotalWorks,
        totalWorksCompleted: mergedTotalCompleted,
        lastUpdated: Date.now(),
        version: Math.max(local.version || 0, cloud.version || 0) + 1
    };
}

export function mergeLibraryData(
    local: Work[] | undefined,
    cloud: Work[] | null
): Work[] {
    if (!cloud || cloud.length === 0) return local || [];
    if (!local || local.length === 0) return cloud;

    const workMap = new Map<number | string, Work>();
    cloud.forEach(work => workMap.set(work.id, work));
    local.forEach(work => {
        const existing = workMap.get(work.id);
        if (!existing || (work.lastUpdated || 0) >= (existing.lastUpdated || 0)) {
            workMap.set(work.id, work);
        }
    });

    const merged: Work[] = [];
    const seenIds = new Set<number | string>();

    local.forEach(work => {
        if (workMap.has(work.id)) {
            merged.push(workMap.get(work.id)!);
            seenIds.add(work.id);
        }
    });

    cloud.forEach(work => {
        if (!seenIds.has(work.id)) {
            merged.push(workMap.get(work.id)!);
        }
    });

    return merged;
}

export function validateGamificationWrite(
    newData: Partial<GamificationData>,
    existing: Partial<GamificationData> | null
): boolean {
    if (!existing) return true;
    const checks = [
        { name: 'level', newVal: newData.level, oldVal: existing.level },
        { name: 'totalXp', newVal: newData.totalXp, oldVal: existing.totalXp },
        { name: 'totalChaptersRead', newVal: newData.totalChaptersRead, oldVal: existing.totalChaptersRead },
        { name: 'totalAnimeEpisodesWatched', newVal: newData.totalAnimeEpisodesWatched, oldVal: existing.totalAnimeEpisodesWatched },
        { name: 'totalMoviesWatched', newVal: newData.totalMoviesWatched, oldVal: existing.totalMoviesWatched },
        { name: 'totalWorksAdded', newVal: newData.totalWorksAdded, oldVal: existing.totalWorksAdded },
        { name: 'totalWorksCompleted', newVal: newData.totalWorksCompleted, oldVal: existing.totalWorksCompleted }
    ];

    for (const check of checks) {
        if (check.newVal !== undefined && check.oldVal !== undefined) {
            if (check.newVal < check.oldVal) {
                logger.warn(`[DataProtection] Validation failed: ${check.name} would decrease`);
                return false;
            }
        }
    }
    return true;
}

export async function logDataBackup(
    userId: string,
    dataType: 'gamification' | 'library',
    data: unknown
): Promise<void> {
    const backup = {
        userId,
        dataType,
        timestamp: Date.now(),
        data: JSON.stringify(data)
    };
    try {
        const key = `bingeki_backup_${dataType}_${userId}`;
        await AsyncStorage.setItem(key, JSON.stringify(backup));
    } catch (e) {
        logger.warn('[DataProtection] Could not store backup in AsyncStorage:', e);
    }
}
