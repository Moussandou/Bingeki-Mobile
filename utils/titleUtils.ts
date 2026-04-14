/**
 * Title display based on user language preference (romaji/english/native)
 * Ported from V2
 */

export interface TitledWork {
    title: string;
    title_english?: string | null;
    title_japanese?: string | null;
}

export const getDisplayTitle = (
    work: TitledWork | any,
    language: 'romaji' | 'english' | 'native' | 'default' = 'romaji'
): string => {
    if (!work) return '';

    const { title, title_english, title_japanese } = work;

    switch (language) {
        case 'english':
            return title_english || title;
        case 'native':
            return title_japanese || title;
        case 'romaji':
        case 'default':
        default:
            return title || title_english || title_japanese || 'Unknown Title';
    }
};
