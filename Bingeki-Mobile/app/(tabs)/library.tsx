/**
 * User library screen
 * Manages followed works and reading/watching progress
 */
import { StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BackgroundSystem } from '@/components/layout/BackgroundSystem';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { WorkCard } from '@/components/ui/WorkCard';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing, Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useLibraryStore, type Work } from '@/store/libraryStore';

export default function LibraryScreen() {
    const router = useRouter();
    const works = useLibraryStore((s) => s.works);
    const updateWorkDetails = useLibraryStore((s) => s.updateWorkDetails);
    const primaryPink = useThemeColor({}, 'primary');
    const textDimColor = useThemeColor({}, 'textDim');

    const handleIncrement = (item: Work) => {
        updateWorkDetails(item.id, { currentChapter: (item.currentChapter ?? 0) + 1 });
    };

    return (
        <BackgroundSystem>
            <ScreenHeader
                title="BIBLIOTHÈQUE"
                subtitle={`${works.length} ŒUVRES EN COURS`}
            />
            <FlatList
                data={works}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) => (
                    <View style={styles.cardWrapper}>
                        <WorkCard
                            item={item}
                            onPress={() => router.push(`/details/${item.id}`)}
                            onIncrement={() => handleIncrement(item)}
                        />
                    </View>
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <IconSymbol name="tray" size={60} color={textDimColor} />
                        <ThemedText style={[styles.emptyText, { color: textDimColor }]}>
                            TA BIBLIOTHÈQUE EST VIDE.
                        </ThemedText>
                        <TouchableOpacity onPress={() => router.push('/discover')}>
                            <ThemedText style={[styles.emptyAction, { color: primaryPink }]}>
                                DÉCOUVRIR DES ANIMÉS
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </BackgroundSystem>
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingHorizontal: Spacing.sm,
        paddingTop: Spacing.md,
        paddingBottom: 120,
    },
    columnWrapper: {
        gap: Spacing.sm,
        marginBottom: 0,
    },
    separator: {
        height: Spacing.sm,
    },
    cardWrapper: {
        flex: 1,
    },
    emptyContainer: {
        marginTop: 80,
        alignItems: 'center',
        gap: Spacing.md,
        paddingHorizontal: Spacing.lg,
    },
    emptyText: {
        fontFamily: Fonts.headingBold,
        fontSize: 18,
        textAlign: 'center',
    },
    emptyAction: {
        fontFamily: Fonts.heading,
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});
