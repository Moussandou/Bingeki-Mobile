import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { BackgroundSystem } from '@/components/layout/BackgroundSystem';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AnimeCard } from '@/components/ui/AnimeCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing, Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { searchWorks, getTopWorks, getSeasonalAnime, type JikanResult } from '@/services/api';

export default function DiscoverScreen() {
    const router = useRouter();
    const primaryPink = useThemeColor({}, 'primary');
    const borderHeavyColor = useThemeColor({}, 'borderHeavy');
    const surfaceColor = useThemeColor({}, 'surface');
    const textDimColor = useThemeColor({}, 'textDim');
    const textColor = useThemeColor({}, 'text');

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
                getTopWorks('anime', 15),
                getSeasonalAnime(15)
            ]);
            setTrending(Array.from(new Map(top.map(item => [item.mal_id, item])).values()));
            setSeasonal(Array.from(new Map(season.map(item => [item.mal_id, item])).values()));
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
            setSearchResults(Array.from(new Map(results.map(item => [item.mal_id, item])).values()));
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setSearching(false);
        }
    };

    return (
        <BackgroundSystem>
            <ScreenHeader title="DÉCOUVRIR" subtitle="ANIME · MANGA · WEBTOON" />
            <View style={styles.container}>
                <View style={[styles.searchBar, { borderColor: borderHeavyColor, backgroundColor: surfaceColor }]}>
                    <IconSymbol name="magnifyingglass" size={20} color={textDimColor} />
                    <TextInput
                        placeholder="RECHERCHER UN ANIME..."
                        placeholderTextColor={textDimColor}
                        style={[styles.searchInput, { color: textColor }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                    {searching && <ActivityIndicator size="small" color={primaryPink} />}
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {searchQuery.length > 0 && searchResults.length > 0 && (
                        <View style={styles.section}>
                            <SectionHeader title="RÉSULTATS" count={searchResults.length} style={styles.sectionHeader} />
                            <FlatList
                                data={searchResults}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <AnimeCard item={item} onPress={() => router.push(`/details/${item.mal_id}`)} />
                                )}
                                keyExtractor={(item, index) => `search-${item.mal_id}-${index}`}
                                contentContainerStyle={styles.horizontalList}
                            />
                        </View>
                    )}

                    <View style={styles.section}>
                        <SectionHeader title="TENDANCES" count={trending.length} style={styles.sectionHeader} />
                        {loading ? (
                            <ActivityIndicator color={primaryPink} style={styles.loader} />
                        ) : (
                            <FlatList
                                data={trending}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <AnimeCard item={item} onPress={() => router.push(`/details/${item.mal_id}`)} />
                                )}
                                keyExtractor={(item, index) => `trending-${item.mal_id}-${index}`}
                                contentContainerStyle={styles.horizontalList}
                            />
                        )}
                    </View>

                    <View style={styles.section}>
                        <SectionHeader title="SAISON ACTUELLE" count={seasonal.length} style={styles.sectionHeader} />
                        {loading ? (
                            <ActivityIndicator color={primaryPink} style={styles.loader} />
                        ) : (
                            <FlatList
                                data={seasonal}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <AnimeCard item={item} onPress={() => router.push(`/details/${item.mal_id}`)} />
                                )}
                                keyExtractor={(item, index) => `seasonal-${item.mal_id}-${index}`}
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
        paddingTop: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 3,
        marginHorizontal: Spacing.md,
        marginBottom: Spacing.md,
        paddingHorizontal: Spacing.md,
        height: 52,
        gap: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    searchInput: {
        flex: 1,
        fontFamily: Fonts.bodyBold,
        fontSize: 14,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionHeader: {
        marginHorizontal: Spacing.md,
        marginBottom: Spacing.md,
    },
    horizontalList: {
        paddingHorizontal: Spacing.md,
        gap: Spacing.md,
    },
    loader: {
        marginTop: Spacing.lg,
    },
});
