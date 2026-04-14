/**
 * Progress update + XP recalculation logic
 * Central handler for chapter/episode progress changes
 */
import { useLibraryStore } from '@/store/libraryStore';
import { useGamificationStore } from '@/store/gamificationStore';


export const handleProgressUpdateWithXP = (
    workId: number | string,
    newProgress: number,
    totalChapters?: number | null
) => {
    const { getWork, updateProgress, updateStatus } = useLibraryStore.getState();

    const work = getWork(workId);
    if (!work) return false;


    if (newProgress < 0) return false;

    // Cap at total if known
    if (totalChapters && newProgress > totalChapters) {
        newProgress = totalChapters;
    }

    const oldProgress = work.currentChapter || 0;


    if (newProgress === oldProgress) return false;


    updateProgress(workId, newProgress);

    // Auto-complete if progress reached total
    if (newProgress > oldProgress && totalChapters && newProgress >= totalChapters) {
        updateStatus(workId, 'completed');
    }

    // Recalculate XP from full works list
    const addedChapters = newProgress - oldProgress;
    if (addedChapters > 0) {
        const { addChapters } = useGamificationStore.getState();
        addChapters(addedChapters);
    }

    return true;
};
