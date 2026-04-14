/**
 * Firestore data operations
 * Handles user profiles, library data, and gamification state syncing
 */
import { 
    doc, 
    getDoc, 
    setDoc, 
    onSnapshot 
} from 'firebase/firestore';
import { db } from './config';
import { logger } from '@/utils/logger';
import { Work, Folder } from '@/store/libraryStore';
import { GamificationData, LibraryData, validateGamificationWrite, mergeGamificationData, mergeLibraryData, logDataBackup } from '@/utils/dataProtection';
import { UserProfile } from '@/store/authStore';

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
