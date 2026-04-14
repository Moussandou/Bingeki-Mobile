/**
 * Work Details Screen
 * Displays info and progress for a specific anime or manga
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { BackgroundSystem } from '@/components/layout/BackgroundSystem';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spacing, Colors, Fonts, Borders } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getWorkDetails, getAnimeEpisodes } from '@/services/api';
import { useLibraryStore, type Work } from '@/store/libraryStore';
import { useGamificationStore } from '@/store/gamificationStore';
import { handleProgressUpdateWithXP } from '@/utils/progressUtils';
import { getDisplayTitle } from '@/utils/titleUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DetailedWork extends Omit<Work, 'status'> {
    status: Work['status'] | string;
    trailer?: any;
    studios?: any[];
    genres?: any[];
    season?: string;
    year?: number;
    score?: number;
}

export default function DetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const primaryPink = useThemeColor({}, 'primary');
    const borderHeavyColor = useThemeColor({}, 'borderHeavy');
    const surfaceColor = useThemeColor({}, 'surface');
    const textDimColor = useThemeColor({}, 'textDim');
    const textColor = useThemeColor({}, 'text');

    const [fetchedWork, setFetchedWork] = useState<DetailedWork | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'info' | 'episodes'>('info');
    const [episodes, setEpisodes] = useState<any[]>([]);
    const [loadingEpisodes, setLoadingEpisodes] = useState(false);

    const { getWork, addWork, removeWork, updateStatus } = useLibraryStore();
    const libraryWork = getWork(Number(id));

    // Sync library data with fresh API details
    const work = libraryWork ? {
        ...libraryWork,
        ...(fetchedWork ? {
            studios: fetchedWork.studios,
            genres: fetchedWork.genres,
            season: fetchedWork.season,
            year: fetchedWork.year,
            score: fetchedWork.score,
        } : {})
    } : fetchedWork;

    const [progress, setProgress] = useState(libraryWork?.currentChapter || 0);

    useEffect(() => {
        loadDetails();
    }, [id]);

    const loadDetails = async () => {
        setLoading(true);
        const data = await getWorkDetails(Number(id), 'anime');
        if (data) {
            setFetchedWork({
                id: data.mal_id,
                title: data.title,
                title_english: data.title_english,
                title_japanese: data.title_japanese,
                image: data.images.jpg.large_image_url,
                synopsis: data.synopsis,
                type: data.type.toLowerCase() === 'manga' ? 'manga' : 'anime',
                totalChapters: data.chapters || data.episodes || 0,
                status: data.status?.toLowerCase().replace(/ /g, '_') || 'unknown',
                score: data.score,
                studios: data.studios,
                genres: data.genres,
                season: data.season,
                year: data.year,
            } as DetailedWork);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (activeTab === 'episodes' && work) {
            loadEpisodes();
        }
    }, [activeTab, work?.id]);

    const loadEpisodes = async () => {
        setLoadingEpisodes(true);
        const res = await getAnimeEpisodes(Number(work?.id));
        if (res && res.data) {
            setEpisodes(res.data);
        }
        setLoadingEpisodes(false);
    };

    const handleProgressUpdate = (num: number) => {
        if (!work) return;
        const success = handleProgressUpdateWithXP(work.id, num, work.totalChapters);
        if (success) {
            setProgress(num);
        }
    };

    const handleAddToLibrary = () => {
        if (!fetchedWork) return;
        addWork({
            ...fetchedWork,
            status: 'reading',
            currentChapter: 0,
        } as Work);
    };

    if (loading) {
        return (
            <BackgroundSystem>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={primaryPink} />
                </View>
            </BackgroundSystem>
        );
    }

    if (!work) {
        return (
            <BackgroundSystem>
                <View style={[styles.container, styles.center]}>
                    <ThemedText style={styles.title}>INTREUVABLE</ThemedText>
                    <Button title="RETOUR" onPress={() => router.back()} />
                </View>
            </BackgroundSystem>
        );
    }

    return (
        <BackgroundSystem>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} stickyHeaderIndices={[1]}>

                <View style={styles.header}>
                    <TouchableOpacity style={[styles.backButton, { borderColor: borderHeavyColor }]} onPress={() => router.back()}>
                        <IconSymbol name="chevron.left" size={24} color={textColor} />
                    </TouchableOpacity>
                    
                    <View style={[styles.posterWrapper, { borderColor: borderHeavyColor }]}>
                        <Image source={work.image} style={styles.poster} contentFit="cover" />
                        <View style={[styles.typeBadge, { backgroundColor: primaryPink }]}>
                            <ThemedText style={styles.typeText}>{work.type?.toUpperCase()}</ThemedText>
                        </View>
                    </View>

                    <ThemedText style={styles.title}>{getDisplayTitle(work)}</ThemedText>
                    
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <IconSymbol name="star.fill" size={16} color={primaryPink} />
                            <ThemedText style={styles.metaText}>{work.score || '?'}</ThemedText>
                        </View>
                        <View style={styles.metaItem}>
                            <IconSymbol name="book.fill" size={16} color={textColor} />
                            <ThemedText style={styles.metaText}>
                                {work.totalChapters || '?'} {work.type === 'manga' ? 'CH' : 'EP'}
                            </ThemedText>
                        </View>
                    </View>

                    {!libraryWork ? (
                        <Button 
                            title="AJOUTER À LA BIBLIO" 
                            variant="manga" 
                            onPress={handleAddToLibrary}
                            style={styles.actionBtn}
                        />
                    ) : (
                        <View style={styles.libraryActions}>
                             <View style={styles.progressControl}>
                                <TouchableOpacity 
                                    style={[styles.progressStep, { borderColor: borderHeavyColor }]}
                                    onPress={() => handleProgressUpdate(Math.max(0, progress - 1))}
                                >
                                    <ThemedText style={styles.stepText}>-</ThemedText>
                                </TouchableOpacity>
                                <View style={styles.progressCenter}>
                                    <ThemedText style={styles.progressVal}>{progress}</ThemedText>
                                    <ThemedText style={styles.progressTotal}>/{work.totalChapters || '?'}</ThemedText>
                                </View>
                                <TouchableOpacity 
                                    style={[styles.progressStep, { borderColor: borderHeavyColor, backgroundColor: primaryPink }]}
                                    onPress={() => handleProgressUpdate(progress + 1)}
                                >
                                    <ThemedText style={[styles.stepText, { color: '#FFF' }]}>+</ThemedText>
                                </TouchableOpacity>
                             </View>
                        </View>
                    )}
                </View>


                <View style={[styles.tabs, { backgroundColor: surfaceColor, borderBottomColor: borderHeavyColor }]}>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'info' && { borderBottomColor: primaryPink, borderBottomWidth: 4 }]}
                        onPress={() => setActiveTab('info')}
                    >
                        <ThemedText style={[styles.tabText, activeTab === 'info' && { color: primaryPink }]}>INFOS</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'episodes' && { borderBottomColor: primaryPink, borderBottomWidth: 4 }]}
                        onPress={() => setActiveTab('episodes')}
                    >
                        <ThemedText style={[styles.tabText, activeTab === 'episodes' && { color: primaryPink }]}>CONTENU</ThemedText>
                    </TouchableOpacity>
                </View>


                <View style={styles.content}>
                    {activeTab === 'info' ? (
                        <View style={styles.infoSection}>
                            <ThemedText style={styles.sectionTitle}>SYNOPSIS</ThemedText>
                            <Card variant="manga" style={styles.synopsisCard}>
                                <ThemedText style={styles.synopsis}>{work.synopsis || 'Pas de synopsis disponible.'}</ThemedText>
                            </Card>

                            <View style={styles.detailsGrid}>
                                <View style={styles.detailItem}>
                                    <ThemedText style={styles.detailLabel}>SAISON</ThemedText>
                                    <ThemedText style={styles.detailValue}>{work.season?.toUpperCase() || '?'} {work.year}</ThemedText>
                                </View>
                                <View style={styles.detailItem}>
                                    <ThemedText style={styles.detailLabel}>STUDIO</ThemedText>
                                    <ThemedText style={styles.detailValue}>{work.studios?.[0]?.name || '?'}</ThemedText>
                                </View>
                            </View>

                            {libraryWork && (
                                <TouchableOpacity 
                                    style={styles.deleteZone}
                                    onPress={() => {
                                        removeWork(work.id);
                                        router.back();
                                    }}
                                >
                                    <IconSymbol name="trash" size={18} color={primaryPink} />
                                    <ThemedText style={[styles.deleteText, { color: primaryPink }]}>RETIRER DE LA BIBLIOTHÈQUE</ThemedText>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <View style={styles.episodesSection}>
                            {loadingEpisodes ? (
                                <ActivityIndicator color={primaryPink} />
                            ) : episodes.length > 0 ? (
                                episodes.map((ep) => (
                                    <TouchableOpacity 
                                        key={ep.mal_id} 
                                        style={[
                                            styles.episodeItem, 
                                            { borderColor: borderHeavyColor },
                                            ep.mal_id <= progress && { backgroundColor: surfaceColor, opacity: 0.6 }
                                        ]}
                                        onPress={() => handleProgressUpdate(ep.mal_id)}
                                    >
                                        <View style={[styles.epNumber, { backgroundColor: ep.mal_id <= progress ? textDimColor : primaryPink }]}>
                                            <ThemedText style={styles.epNumText}>{ep.mal_id}</ThemedText>
                                        </View>
                                        <ThemedText numberOfLines={1} style={styles.epTitle}>{ep.title}</ThemedText>
                                        {ep.mal_id <= progress && <IconSymbol name="checkmark" size={18} color={textDimColor} />}
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <ThemedText style={styles.emptyText}>Aucun épisode trouvé.</ThemedText>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </BackgroundSystem>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    scrollContent: {
        paddingTop: 60,
        paddingBottom: 100,
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.lg,
    },
    backButton: {
        position: 'absolute',
        top: 0,
        left: Spacing.md,
        width: 44,
        height: 44,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    posterWrapper: {
        width: 180,
        height: 260,
        borderWidth: 4,
        marginBottom: Spacing.md,
        position: 'relative',
    },
    poster: {
        width: '100%',
        height: '100%',
    },
    typeBadge: {
        position: 'absolute',
        top: -10,
        right: -10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 2,
        borderColor: '#000',
    },
    typeText: {
        color: '#FFF',
        fontFamily: Fonts.headingBold,
        fontSize: 12,
    },
    title: {
        fontSize: 24,
        fontFamily: Fonts.heading,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    metaRow: {
        flexDirection: 'row',
        gap: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontFamily: Fonts.headingBold,
        fontSize: 16,
    },
    actionBtn: {
        width: '100%',
    },
    libraryActions: {
        width: '100%',
    },
    progressControl: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.md,
    },
    progressStep: {
        width: 50,
        height: 50,
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepText: {
        fontSize: 24,
        fontFamily: Fonts.heading,
    },
    progressCenter: {
        alignItems: 'center',
    },
    progressVal: {
        fontSize: 32,
        fontFamily: Fonts.heading,
    },
    progressTotal: {
        fontSize: 14,
        fontFamily: Fonts.bodyBold,
        opacity: 0.6,
    },
    tabs: {
        flexDirection: 'row',
        height: 50,
        borderBottomWidth: 2,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText: {
        fontFamily: Fonts.headingBold,
        fontSize: 14,
        letterSpacing: 1,
    },
    content: {
        padding: Spacing.md,
    },
    infoSection: {
        gap: Spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: Fonts.heading,
        marginBottom: Spacing.xs,
    },
    synopsisCard: {
        padding: Spacing.md,
    },
    synopsis: {
        fontFamily: Fonts.body,
        fontSize: 14,
        lineHeight: 20,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
        marginTop: Spacing.md,
    },
    detailItem: {
        flex: 1,
        minWidth: '45%',
    },
    detailLabel: {
        fontSize: 10,
        fontFamily: Fonts.bodyBold,
        opacity: 0.6,
    },
    detailValue: {
        fontSize: 14,
        fontFamily: Fonts.headingBold,
    },
    deleteZone: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: Spacing.xl,
        justifyContent: 'center',
        padding: Spacing.md,
    },
    deleteText: {
        fontFamily: Fonts.headingBold,
        fontSize: 12,
    },
    episodesSection: {
        gap: Spacing.sm,
    },
    episodeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        padding: Spacing.sm,
        gap: Spacing.md,
    },
    epNumber: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    epNumText: {
        color: '#FFF',
        fontFamily: Fonts.heading,
        fontSize: 14,
    },
    epTitle: {
        flex: 1,
        fontFamily: Fonts.bodyBold,
        fontSize: 14,
    },
    emptyText: {
        textAlign: 'center',
        opacity: 0.5,
        marginTop: Spacing.xl,
    }
});
