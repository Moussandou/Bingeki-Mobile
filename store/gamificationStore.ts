/**
 * Gamification store: levels, XP, streaks, and achievements
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from './authStore';
import { Badge } from '@/types/badge';

export interface GamificationState {
    level: number;
    xp: number;
    totalXp: number;
    xpToNextLevel: number;
    streak: number;
    lastActivityDate: number | string | null;
    badges: Badge[];
    totalChaptersRead: number;
    totalWorksAdded: number;
    totalWorksCompleted: number;
    totalAnimeEpisodesWatched: number;
    totalMoviesWatched: number;
    bonusXp: number;

    xpGained: number;
    levelUpData: { oldLevel: number, newLevel: number } | null;
    recentUnlock: Badge | null;

    addXp: (amount: number, reason?: string) => void;
    addChapters: (count: number) => void;
    addAnimeEpisode: (id: number | string) => void;
    addWorksAdded: (count: number) => void;
    addWorksCompleted: (count: number) => void;
    clearLevelUp: () => void;
    resetStore: () => void;
    syncFromProfile: (profile: Partial<UserProfile>) => void;
}

const LEVEL_BASE = 100;
const LEVEL_MULTIPLIER = 1.15;

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            level: 1,
            xp: 0,
            totalXp: 0,
            xpToNextLevel: LEVEL_BASE,
            streak: 0,
            lastActivityDate: null,
            badges: [],
            totalChaptersRead: 0,
            totalWorksAdded: 0,
            totalWorksCompleted: 0,
            totalAnimeEpisodesWatched: 0,
            totalMoviesWatched: 0,
            bonusXp: 0,

            xpGained: 0,
            levelUpData: null,
            recentUnlock: null,

            addXp: (amount) => set((state) => {
                let newXp = state.xp + amount;
                let newLevel = state.level;
                let newXpToNext = state.xpToNextLevel;

                while (newXp >= newXpToNext) {
                    newXp -= newXpToNext;
                    newLevel++;
                    newXpToNext = Math.floor(newXpToNext * LEVEL_MULTIPLIER);
                }

                return {
                    xp: newXp,
                    level: newLevel,
                    xpToNextLevel: newXpToNext,
                    totalXp: state.totalXp + amount,
                    xpGained: state.xpGained + amount,
                    levelUpData: newLevel > state.level ? { oldLevel: state.level, newLevel } : state.levelUpData
                };
            }),

            addChapters: (count) => {
                get().addXp(count * 5, 'Read Chapters');
                set((s) => ({ totalChaptersRead: s.totalChaptersRead + count }));
            },

            addAnimeEpisode: (id) => {
                get().addXp(10, 'Watched Episode');
                set((s) => ({ totalAnimeEpisodesWatched: s.totalAnimeEpisodesWatched + 1 }));
            },

            addWorksAdded: (count) => {
                get().addXp(count * 20, 'Added Works');
                set((s) => ({ totalWorksAdded: s.totalWorksAdded + count }));
            },

            addWorksCompleted: (count) => {
                get().addXp(count * 100, 'Completed Works');
                set((s) => ({ totalWorksCompleted: s.totalWorksCompleted + count }));
            },

            clearLevelUp: () => set({ levelUpData: null, xpGained: 0, recentUnlock: null }),

            resetStore: () => set({
                level: 1,
                xp: 0,
                totalXp: 0,
                xpToNextLevel: LEVEL_BASE,
                streak: 0,
                lastActivityDate: null,
                badges: [],
                totalChaptersRead: 0,
                totalWorksAdded: 0,
                totalWorksCompleted: 0,
                totalAnimeEpisodesWatched: 0,
                totalMoviesWatched: 0,
                bonusXp: 0,
                xpGained: 0,
                levelUpData: null,
                recentUnlock: null
            }),

            syncFromProfile: (profile) => {
                set({
                    level: profile.level ?? get().level,
                    xp: profile.xp ?? get().xp,
                    totalXp: profile.totalXp ?? get().totalXp,
                    streak: profile.streak ?? get().streak,
                    lastActivityDate: profile.lastActivityDate ?? get().lastActivityDate,
                    totalChaptersRead: profile.totalChaptersRead ?? get().totalChaptersRead,
                    totalAnimeEpisodesWatched: profile.totalAnimeEpisodesWatched ?? get().totalAnimeEpisodesWatched,
                    totalMoviesWatched: profile.totalMoviesWatched ?? get().totalMoviesWatched,
                    totalWorksAdded: profile.totalWorksAdded ?? get().totalWorksAdded,
                    totalWorksCompleted: profile.totalWorksCompleted ?? get().totalWorksCompleted,
                });
            }
        }),
        {
            name: 'bingeki-gamification-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state: GamificationState) => {
                const { xpGained, levelUpData, recentUnlock, ...rest } = state;
                return rest;
            },
        }
    )
);

function calculateCumulativeXp(level: number, currentLevelXp: number): number {
    let total = 0;
    let levelXpReq = LEVEL_BASE;
    for (let l = 1; l < level; l++) {
        total += levelXpReq;
        levelXpReq = Math.floor(levelXpReq * LEVEL_MULTIPLIER);
    }
    return total + currentLevelXp;
}
