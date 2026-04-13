/**
 * Personal library screen
 * Manage tracked content and reading/watching lists
 * Synced with shared Firestore project
 */
import React from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';
import { Spacing, Colors, Fonts, Borders } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useLibraryStore, type Work } from '@/store/libraryStore';
import { BackgroundSystem } from '@/components/layout/BackgroundSystem';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function LibraryScreen() {
    const router = useRouter();
    const works = useLibraryStore((s) => s.works);
    const primaryPink = useThemeColor({}, 'primary');
    const borderHeavyColor = useThemeColor({}, 'borderHeavy');
    const surfaceColor = useThemeColor({}, 'surface');
    const textDimColor = useThemeColor({}, 'textDim');

    const renderWorkItem = ({ item }: { item: Work }) => (
        <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => router.push(`/details/${item.id}`)}
        >
            <Card variant="manga" style={styles.workCard}>
                <View style={[styles.imageContainer, { borderColor: borderHeavyColor }]}>
                    <Image
                        source={item.image}
                        style={styles.workImage}
                        contentFit="cover"
                    />
                    <View style={[styles.typeBadge, { backgroundColor: primaryPink }]}>
                        <ThemedText style={styles.typeText}>{item.type.toUpperCase()}</ThemedText>
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <ThemedText numberOfLines={2} style={styles.workTitle}>{item.title}</ThemedText>
                    
                    <View style={styles.progressRow}>
                        <View style={[styles.progressBarBase, { backgroundColor: borderHeavyColor + '20' }]}>
                            <View 
                                style={[
                                    styles.progressBarFill, 
                                    { 
                                        backgroundColor: primaryPink, 
                                        width: `${((item.currentChapter || 0) / (item.totalChapters || 1)) * 100}%` 
                                    }
                                ]} 
                            />
                        </View>
                        <ThemedText style={[styles.progressText, { color: textDimColor }]}>
                            {item.currentChapter || 0}/{item.totalChapters || '?'}
                        </ThemedText>
                    </View>

                    <View style={styles.statusBadge}>
                        <ThemedText style={[styles.statusText, { color: primaryPink }]}>
                            {item.status.replace('_', ' ').toUpperCase()}
                        </ThemedText>
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.plusButton, { borderColor: borderHeavyColor, backgroundColor: surfaceColor }]}
                    onPress={() => {
                        // Quick increment logic (to be ported from progressUtils)
                        console.log('Increment', item.id);
                    }}
                >
                    <IconSymbol name="plus" size={20} color={primaryPink} />
                </TouchableOpacity>
            </Card>
        </TouchableOpacity>
    );

    return (
        <BackgroundSystem>
            <FlatList
                data={works}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderWorkItem}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={() => (
                    <View style={styles.header}>
                        <ThemedText style={styles.headerTitle}>BIBLIOTHÈQUE</ThemedText>
                        <ThemedText style={styles.headerSubtitle}>{works.length} ŒUVRES EN COURS</ThemedText>
                    </View>
                )}
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
        padding: Spacing.md,
        paddingTop: 80,
        paddingBottom: 100,
        gap: Spacing.md,
    },
    header: {
        marginBottom: Spacing.lg,
    },
    headerTitle: {
        fontSize: 32,
        fontFamily: Fonts.heading,
        letterSpacing: 1,
    },
    headerSubtitle: {
        fontSize: 14,
        fontFamily: Fonts.bodyBold,
        opacity: 0.6,
    },
    workCard: {
        flexDirection: 'row',
        padding: Spacing.sm,
        gap: Spacing.md,
        alignItems: 'center',
    },
    imageContainer: {
        width: 80,
        height: 110,
        borderWidth: 2,
        position: 'relative',
    },
    workImage: {
        width: '100%',
        height: '100%',
    },
    typeBadge: {
        position: 'absolute',
        top: 0,
        left: 0,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    typeText: {
        fontSize: 8,
        fontFamily: Fonts.headingBold,
        color: '#FFF',
    },
    infoContainer: {
        flex: 1,
        gap: 6,
    },
    workTitle: {
        fontSize: 16,
        fontFamily: Fonts.headingBold,
        lineHeight: 20,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    progressBarBase: {
        flex: 1,
        height: 6,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
    },
    progressText: {
        fontSize: 10,
        fontFamily: Fonts.bodyBold,
        width: 40,
        textAlign: 'right',
    },
    statusBadge: {
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 10,
        fontFamily: Fonts.bodyBold,
        letterSpacing: 0.5,
    },
    plusButton: {
        width: 40,
        height: 40,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
        gap: Spacing.md,
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
    }
});