/**
 * Firebase Firestore module for mobile
 * Ported from V2 - Handles profile, library, and gamification sync
 */
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from './config';
import { logger } from '@/utils/logger';
import type { Work, Folder } from '@/store/libraryStore';
import type { FavoriteCharacter } from '@/types/character';
import {
    mergeGamificationData,
    mergeLibraryData,
    validateGamificationWrite,
    logDataBackup,
    type GamificationData
} from '@/utils/dataProtection';

// Types for Firestore data
export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    lastLogin: number;
    xp?: number;
    level?: number;
    totalXp?: number;
    streak?: number;
    badges?: { id: string; name: string; description: string; icon: string; rarity: string; unlockedAt?: number }[];
    totalChaptersRead?: number;
    totalAnimeEpisodesWatched?: number;
    totalMoviesWatched?: number;
    totalWorksAdded?: number;
    totalWorksCompleted?: number;
    bio?: string;
    isAdmin?: boolean;
    createdAt?: number;
}

export interface LibraryData {
    works: Work[];
    folders?: Folder[];
    viewMode?: 'grid' | 'list';
    sortBy?: string;
    lastUpdated: number;
    version?: number;
}

// Get User Profile by UID
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
        }
        return null;
    } catch (error) {
        logger.error('[Firestore] Error getting user profile:', error);
        return null;
    }
}

// Subscribe to User Profile (Real-time)
export function subscribeToUserProfile(uid: string, callback: (profile: UserProfile | null) => void): () => void {
    const docRef = doc(db, 'users', uid);
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
        } else {
            callback(null);
        }
    }, (error) => {
        logger.error('[Firestore] Error subscribing to user profile:', error);
        callback(null);
    });
}

// Save user profile to Firestore
export async function saveUserProfileToFirestore(user: Partial<UserProfile>): Promise<void> {
    try {
        if (!user.uid) return;
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        const exists = docSnap.exists();

        const dataToSave: Partial<UserProfile> = {
            lastLogin: Date.now(),
            ...(exists ? {} : { createdAt: Date.now() })
        };

        const allowedFields: (keyof UserProfile)[] = [
            'uid', 'email', 'displayName', 'photoURL', 'bio', 'isAdmin'
        ];

        allowedFields.forEach(field => {
            const value = user[field];
            if (value !== undefined) (dataToSave as any)[field] = value;
        });

        await setDoc(docRef, dataToSave, { merge: true });
        logger.log('[Firestore] User profile saved');
    } catch (error) {
        logger.error('[Firestore] Error saving user profile:', error);
        throw error;
    }
}

// Save library data to Firestore
export async function saveLibraryToFirestore(
    userId: string, 
    works: Work[], 
    folders?: Folder[]
): Promise<void> {
    try {
        const docRef = doc(db, 'users', userId, 'data', 'library');
        const docSnap = await getDoc(docRef);
        const existing = docSnap.exists() ? docSnap.data() as LibraryData : null;

        if (existing) logDataBackup(userId, 'library', existing);
        const mergedWorks = mergeLibraryData(works, existing?.works || null);

        await setDoc(docRef, {
            works: mergedWorks,
            folders: folders ?? existing?.folders ?? [],
            lastUpdated: Date.now(),
            version: (existing?.version || 0) + 1
        });
        logger.log('[Firestore] Library saved');
    } catch (error) {
        logger.error('[Firestore] Error saving library:', error);
        throw error;
    }
}

// Save gamification data to Firestore
export async function saveGamificationToFirestore(
    userId: string,
    data: Omit<GamificationData, 'lastUpdated'>
): Promise<void> {
    try {
        const docRef = doc(db, 'users', userId, 'data', 'gamification');
        const docSnap = await getDoc(docRef);
        const existing = docSnap.exists() ? docSnap.data() as GamificationData : null;

        if (!validateGamificationWrite(data, existing)) {
            logger.warn('[Firestore] Gamification write blocked - merge required');
        }

        if (existing) logDataBackup(userId, 'gamification', existing);
        const mergedData = mergeGamificationData(data, existing);

        await setDoc(docRef, {
            ...mergedData,
            lastUpdated: Date.now()
        });

        // Sync core stats to user document for leaderboards
        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, {
            xp: mergedData.xp,
            level: mergedData.level,
            totalXp: mergedData.totalXp,
            streak: mergedData.streak,
            lastActivityDate: mergedData.lastActivityDate || null,
            totalChaptersRead: mergedData.totalChaptersRead,
            totalAnimeEpisodesWatched: mergedData.totalAnimeEpisodesWatched || 0,
            totalWorksAdded: mergedData.totalWorksAdded,
            totalWorksCompleted: mergedData.totalWorksCompleted
        }, { merge: true });

        logger.log('[Firestore] Gamification saved');
    } catch (error) {
        logger.error('[Firestore] Error saving gamification:', error);
        throw error;
    }
}

// Load library data from Firestore
export async function loadLibraryFromFirestore(userId: string): Promise<Work[] | null> {
    try {
        const docRef = doc(db, 'users', userId, 'data', 'library');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return (docSnap.data() as LibraryData).works;
        }
        return null;
    } catch (error) {
        logger.error('[Firestore] Error loading library:', error);
        return null;
    }
}

// Load gamification data from Firestore
export async function loadGamificationFromFirestore(userId: string): Promise<Omit<GamificationData, 'lastUpdated'> | null> {
    try {
        const docRef = doc(db, 'users', userId, 'data', 'gamification');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const { lastUpdated, ...data } = docSnap.data() as GamificationData;
            return data;
        }
        return null;
    } catch (error) {
        logger.error('[Firestore] Error loading gamification:', error);
        return null;
    }
}
