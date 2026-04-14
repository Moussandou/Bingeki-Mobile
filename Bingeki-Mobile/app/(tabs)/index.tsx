import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { BackgroundSystem } from '@/components/layout/BackgroundSystem';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AnimeCard } from '@/components/ui/AnimeCard';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing, Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuthStore } from '@/store/authStore';
import { useGamificationStore } from '@/store/gamificationStore';
import { useLibraryStore } from '@/store/libraryStore';
import { getTopWorks, type JikanResult } from '@/services/api';
import { calculateRank } from '@/utils/rankUtils';

export default function DashboardScreen() {
  const router = useRouter();
  const primaryPink = useThemeColor({}, 'primary');
  const borderHeavyColor = useThemeColor({}, 'borderHeavy');

  const { userProfile } = useAuthStore();
  const { level, xp, xpToNextLevel, streak } = useGamificationStore();
  const works = useLibraryStore((s) => s.works);

  const [trending, setTrending] = useState<JikanResult[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setTrendingLoading(true);
      try {
        setTrending(await getTopWorks('anime', 15));
      } catch (e) {
        console.error('Dashboard trending error:', e);
      } finally {
        setTrendingLoading(false);
      }
    };
    load();
  }, []);

  const username = userProfile?.displayName ?? 'RÉVOLUTIONNAIRE';
  const rank = calculateRank(level);
  const xpPct = Math.min((xp / xpToNextLevel) * 100, 100);

  return (
    <BackgroundSystem>
      <ScreenHeader title="BINGEKI" subtitle={`BIENVENUE, ${username}`} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HUNTER LICENSE — Gamification Card */}
        <View style={styles.licenseCard}>
          {/* Header row */}
          <View style={styles.licenseHeader}>
            <View>
              <ThemedText style={styles.licenseLabel}>HUNTER LICENSE</ThemedText>
              <ThemedText style={styles.licenseName}>{username}</ThemedText>
            </View>
            <View style={styles.rankBox}>
              <ThemedText style={styles.rankLabel}>RANG</ThemedText>
              <ThemedText style={styles.rankValue}>{rank}</ThemedText>
            </View>
          </View>

          {/* XP Bar */}
          <View style={styles.xpSection}>
            <View style={styles.xpLabels}>
              <ThemedText style={styles.xpLabel}>LVL {level}</ThemedText>
              <ThemedText style={styles.xpLabel}>{xp} / {xpToNextLevel} XP</ThemedText>
            </View>
            <View style={styles.xpBarTrack}>
              <View style={[styles.xpBarFill, { width: `${xpPct}%` }]} />
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <ThemedText style={styles.statValue}>{streak}</ThemedText>
              <ThemedText style={styles.statLabel}>STREAK</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <ThemedText style={styles.statValue}>{works.length}</ThemedText>
              <ThemedText style={styles.statLabel}>ŒUVRES</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <ThemedText style={styles.statValue}>{level}</ThemedText>
              <ThemedText style={styles.statLabel}>NIVEAU</ThemedText>
            </View>
          </View>
        </View>

        {/* LE Q.G. — Trending */}
        <View style={styles.section}>
          <SectionHeader title="LE Q.G." count={Math.min(trending.length, 8)} style={styles.sectionHeader} />
          {trendingLoading ? (
            <ActivityIndicator color={primaryPink} style={styles.loader} />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {trending.slice(0, 8).map((item) => (
                <AnimeCard
                  key={item.mal_id}
                  item={item}
                  onPress={() => router.push(`/details/${item.mal_id}`)}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* EXPLORATION — Genre pills */}
        <View style={styles.section}>
          <SectionHeader title="EXPLORATION" style={styles.sectionHeader} />
          <TouchableOpacity
            style={[styles.searchMock, { borderColor: primaryPink }]}
            onPress={() => router.push('/discover')}
          >
            <IconSymbol name="magnifyingglass" size={18} color={primaryPink} />
            <ThemedText style={styles.searchText}>Rechercher dans le catalogue...</ThemedText>
          </TouchableOpacity>
          <View style={styles.genreRow}>
            {['SHONEN', 'SEINEN', 'ISEKAI', 'ACTION'].map((genre) => (
              <TouchableOpacity
                key={genre}
                style={[styles.genreTag, { borderColor: borderHeavyColor }]}
                onPress={() => router.push('/discover')}
              >
                <ThemedText style={styles.genreText}>{genre}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </BackgroundSystem>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 16,
    paddingBottom: 120,
  },
  // Hunter License Card
  licenseCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
    backgroundColor: '#FF2E63',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 6,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  licenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  licenseLabel: {
    fontSize: 8,
    fontFamily: Fonts.bodyBold,
    color: 'rgba(0,0,0,0.5)',
    letterSpacing: 2,
  },
  licenseName: {
    fontSize: 20,
    fontFamily: Fonts.heading,
    color: '#000000',
    letterSpacing: 1,
  },
  rankBox: {
    alignItems: 'flex-end',
  },
  rankLabel: {
    fontSize: 8,
    fontFamily: Fonts.bodyBold,
    color: 'rgba(0,0,0,0.5)',
    letterSpacing: 2,
  },
  rankValue: {
    fontSize: 28,
    fontFamily: Fonts.heading,
    color: '#000000',
    letterSpacing: 2,
  },
  xpSection: {
    marginBottom: 14,
  },
  xpLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpLabel: {
    fontSize: 9,
    fontFamily: Fonts.bodyBold,
    color: 'rgba(0,0,0,0.6)',
    letterSpacing: 1,
  },
  xpBarTrack: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.2)',
    paddingTop: 12,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: Fonts.heading,
    color: '#000000',
  },
  statLabel: {
    fontSize: 7,
    fontFamily: Fonts.bodyBold,
    color: 'rgba(0,0,0,0.5)',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  // Sections
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
  // Exploration
  searchMock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    padding: 12,
    borderWidth: 2,
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  searchText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    opacity: 0.5,
  },
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: Spacing.md,
  },
  genreTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  genreText: {
    fontFamily: Fonts.headingBold,
    fontSize: 10,
    letterSpacing: 1,
  },
  bottomPad: {
    height: 40,
  },
});
