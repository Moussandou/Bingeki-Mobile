/**
 * Authentication and user profile store
 * Manages Firebase User state and Firestore profile synchronization
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  bio?: string;
  isAdmin?: boolean;
  xp?: number;
  level?: number;
  totalXp?: number;
  streak?: number;
  lastActivityDate?: number;
  totalChaptersRead?: number;
  totalAnimeEpisodesWatched?: number;
  totalWorksAdded?: number;
  totalWorksCompleted?: number;
  totalMoviesWatched?: number;
  lastLogin?: number;
  createdAt?: number;
}

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  subscribeToProfile: (uid: string) => () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      userProfile: null,
      loading: true,

      setUser: (user) => set({ user }),
      setUserProfile: (userProfile) => set({ userProfile }),
      setLoading: (loading) => set({ loading }),

      subscribeToProfile: (uid) => {
        const docRef = doc(db, 'users', uid);
        return onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            set({ userProfile: { uid: docSnap.id, ...docSnap.data() } as UserProfile });
          } else {
            set({ userProfile: null });
          }
        });
      },

      logout: async () => {
        await auth.signOut();
        set({ user: null, userProfile: null });
      },
    }),
    {
      name: 'bingeki-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ userProfile: state.userProfile }),
    }
  )
);
