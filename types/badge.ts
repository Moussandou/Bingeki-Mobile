/**
 * Badge and achievement types
 */
export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    category: 'chapters' | 'streak' | 'total' | 'special' | 'works';
    unlockedAt?: number;
}

export const MOCK_BADGES: Badge[] = [
    { id: 'first_steps', name: 'First Steps', description: 'Create a Bingeki account', icon: 'flag', rarity: 'common', category: 'special' },
    { id: 'first_work', name: 'Bibliophile', description: 'Add your first work', icon: 'book', rarity: 'common', category: 'works' },

    { id: 'reader_5', name: 'Steady Reader', description: 'Read 5 chapters', icon: 'book-open', rarity: 'common', category: 'chapters' },
    { id: 'reader_25', name: 'Devourer', description: 'Read 25 chapters', icon: 'flame', rarity: 'rare', category: 'chapters' },
    { id: 'reader_100', name: 'Binge Reader', description: 'Read 100 chapters', icon: 'zap', rarity: 'epic', category: 'chapters' },

    { id: 'collector_5', name: 'Collector', description: 'Add 5 works', icon: 'library', rarity: 'common', category: 'works' },
    { id: 'collector_10', name: 'Amateur', description: 'Add 10 works', icon: 'layers', rarity: 'rare', category: 'works' },
    { id: 'collector_25', name: 'Otaku', description: 'Add 25 works', icon: 'database', rarity: 'epic', category: 'works' },

    { id: 'streak_3', name: 'Regular', description: 'Maintain a 3-day streak', icon: 'timer', rarity: 'common', category: 'streak' },
    { id: 'streak_7', name: 'Motivated', description: 'Maintain a 7-day streak', icon: 'calendar-check', rarity: 'rare', category: 'streak' },
    { id: 'streak_30', name: 'Unstoppable', description: 'Maintain a 30-day streak', icon: 'crown', rarity: 'legendary', category: 'streak' },

    { id: 'first_complete', name: 'Finisher', description: 'Complete your first work', icon: 'check-circle', rarity: 'common', category: 'works' },
    { id: 'complete_5', name: 'Completist', description: 'Complete 5 works', icon: 'target', rarity: 'rare', category: 'works' },

    { id: 'level_5', name: 'Novice', description: 'Reach level 5', icon: 'star', rarity: 'common', category: 'total' },
    { id: 'level_10', name: 'Apprentice', description: 'Reach level 10', icon: 'medal', rarity: 'rare', category: 'total' },
    { id: 'level_25', name: 'Expert', description: 'Reach level 25', icon: 'award', rarity: 'epic', category: 'total' },
    { id: 'level_50', name: 'Legend', description: 'Reach level 50', icon: 'trophy', rarity: 'legendary', category: 'total' },
];
