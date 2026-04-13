/**
 * Content discovery screen
 * Browse and search for new anime and manga using the shared API proxy
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/Card';
import { Spacing, Colors, Fonts, Borders } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BackgroundSystem } from '@/components/layout/BackgroundSystem';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { searchWorks, getTopWorks, getSeasonalAnime, type JikanResult } from '@/services/api';

export default function DiscoverScreen() {
    const router = useRouter();
    const primaryPink = useThemeColor({}, 'primary');
    const borderHeavyColor = useThemeColor({}, 'borderHeavy');
    const surfaceColor = useThemeColor({}, 'surface');
    const textDimColor = useThemeColor({}, 'textDim');

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<JikanResult[]>([]);
    const [trending, setTrending] = useState<JikanResult[]>([]);
    const [seasonal, setSeasonal] = useState<JikanResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        loadDiscoveryData();
    }, []);

    const loadDiscoveryData = async () => {
        setLoading(true);
        try {
            const [top, season] = await Promise.all([
                getTopWorks('anime', 10),
                getSeasonalAnime(10)
            ]);
            setTrending(top);
            setSeasonal(season);
        } catch (error) {
            console.error('Discovery load error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setSearching(true);
        try {
            const results = await searchWorks(searchQuery, 'anime');
            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setSearching(false);
        }
    };

    const renderHorizontalItem = ({ item }: { item: JikanResult }) => (
        <TouchableOpacity 
            style={styles.horizontalCard}
            onPress={() => router.push(`/details/${item.mal_id}`)}
        >
            <View style={[styles.imageWrapper, { borderColor: borderHeavyColor }]}>
                <Image source={item.images.jpg.image_url} style={styles.cardContentImage} />
                <View style={[styles.scoreBadge, { backgroundColor: primaryPink }]}>
                    <ThemedText style={styles.scoreText}>{item.score || 'N/A'}</ThemedText>
                </View>
            </View>
            <ThemedText numberOfLines={2} style={styles.cardTitle}>{item.title}</ThemedText>
        </TouchableOpacity>
    );

    return (
        <BackgroundSystem>
            <View style={styles.container}>
                {/* Search Header */}
                <View style={styles.header}>
                    <ThemedText style={styles.title}>DÉCOUVRIR</ThemedText>
                    <View style={[styles.searchBar, { borderColor: borderHeavyColor, backgroundColor: surfaceColor }]}>
                        <IconSymbol name="magnifyingglass" size={20} color={textDimColor} />
                        <TextInput
                            placeholder="RECHERCHER UN ANIME..."
                            placeholderTextColor={textDimColor}
                            style={[styles.searchInput, { color: Colors.light.text }]}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                        {searching && <ActivityIndicator size="small" color={primaryPink} />}
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {searchQuery.length > 0 && searchResults.length > 0 ? (
                        <View style={styles.section}>
                            <ThemedText style={styles.sectionTitle}>RÉSULTATS</ThemedText>
                            <FlatList
                                data={searchResults}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={renderHorizontalItem}
                                keyExtractor={(item) => `search-${item.mal_id}`}
                                contentContainerStyle={styles.horizontalList}
                            />
                        </View>
                    ) : null}

                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>TENDANCES</ThemedText>
                        {loading ? (
                            <ActivityIndicator color={primaryPink} />
                        ) : (
                            <FlatList
                                data={trending}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={renderHorizontalItem}
                                keyExtractor={(item) => `trending-${item.mal_id}`}
                                contentContainerStyle={styles.horizontalList}
                            />
                        )}
                    </View>

                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>SAISON ACTUELLE</ThemedText>
                        {loading ? (
                            <ActivityIndicator color={primaryPink} />
                        ) : (
                            <FlatList
                                data={seasonal}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={renderHorizontalItem}
                                keyExtractor={(item) => `seasonal-${item.mal_id}`}
                                contentContainerStyle={styles.horizontalList}
                            />
                        )}
                    </View>
                </ScrollView>
            </View>
        </BackgroundSystem>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80,
    },
    header: {
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: 32,
        fontFamily: Fonts.heading,
        marginBottom: Spacing.md,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: Borders.width,
        paddingHorizontal: Spacing.md,
        height: 50,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontFamily: Fonts.bodyBold,
        fontSize: 14,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: Fonts.heading,
        marginLeft: Spacing.md,
        marginBottom: Spacing.sm,
    },
    horizontalList: {
        paddingHorizontal: Spacing.md,
        gap: Spacing.md,
    },
    horizontalCard: {
        width: 130,
    },
    imageWrapper: {
        width: 130,
        height: 190,
        borderWidth: 2,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 8,
    },
    cardContentImage: {
        width: '100%',
        height: '100%',
    },
    scoreBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    scoreText: {
        color: '#FFF',
        fontFamily: Fonts.headingBold,
        fontSize: 10,
    },
    cardTitle: {
        fontSize: 12,
        fontFamily: Fonts.bodyBold,
        lineHeight: 16,
    }
});