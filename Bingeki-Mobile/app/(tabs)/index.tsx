/**
 * Main dashboard screen
 * Displays user stats, trending content, and quick exploration tags
 */
import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AnimeCard } from '@/components/ui/AnimeCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing, Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuthStore } from '@/store/authStore';
import { useGamificationStore } from '@/store/gamificationStore';
import { useLibraryStore } from '@/store/libraryStore';
import { getTopWorks, type JikanResult } from '@/services/api';
import { calculateRank } from '@/utils/rankUtils';
import { BrutalView } from '@/components/ui/BrutalView';

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
    <>
      <ScreenHeader title="BINGEKI" subtitle={`BIENVENUE, ${username}`} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="manga" style={styles.licenseCard}>
          <View style={styles.licenseHeader}>
            <View style={styles.profileSection}>
              <BrutalView
                offset={4}
                shadowColor={primaryPink}
                borderRadius={0}
                contentStyle={[styles.avatarBox, { borderColor: borderHeavyColor }]}
              >
                  <IconSymbol name="person.fill" size={40} color={borderHeavyColor} />
              </BrutalView>
              <View style={styles.nameBlock}>
                <ThemedText style={styles.licenseName}>{username}</ThemedText>
                <View style={styles.badgeRow}>
                  <BrutalView
                    offset={2}
                    borderRadius={0}
                    style={{ alignSelf: 'flex-start' }}
                    contentStyle={styles.rankBadge}
                  >
                     <ThemedText style={styles.rankBadgeText}>RANK {rank}</ThemedText>
                  </BrutalView>
                  
                  <BrutalView
                    offset={2}
                    borderRadius={0}
                    style={{ alignSelf: 'flex-start' }}
                    contentStyle={styles.miniStat}
                  >
                    <IconSymbol name="flame.fill" size={12} color={primaryPink} />
                    <ThemedText style={styles.miniStatValue}>{streak}</ThemedText>
                  </BrutalView>
                </View>
              </View>
            </View>
            

          </View>

          <View style={styles.xpSection}>
            <View style={styles.xpLabels}>
              <ThemedText style={styles.xpLabel}>NIV. {level}</ThemedText>
              <ThemedText style={styles.xpLabel}>{xp} / {xpToNextLevel} XP</ThemedText>
            </View>
            <View style={styles.xpBarTrack}>
              <View style={[styles.xpBarFill, { width: `${xpPct}%` }]} />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <ThemedText style={styles.statLabel}>OBJECTIF</ThemedText>
              <ThemedText style={styles.statValue}>3 <ThemedText style={styles.statSub}>/ 3</ThemedText></ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <ThemedText style={styles.statLabel}>TOTAL</ThemedText>
              <View style={styles.totalRow}>
                <View style={styles.totalItem}>
                    <ThemedText style={styles.totalValue}>381</ThemedText>
                    <ThemedText style={styles.totalSub}>CHAPS</ThemedText>
                </View>
                <View style={styles.totalItem}>
                    <ThemedText style={styles.totalValue}>40</ThemedText>
                    <ThemedText style={styles.totalSub}>EPS</ThemedText>
                </View>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Button 
                title="+ DÉCOUVRIR" 
                size="sm" 
                variant="manga" 
                onPress={() => router.push('/discover')}
                style={styles.ctaButton}
              />
            </View>
          </View>
        </Card>

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

        <View style={styles.section}>
          <SectionHeader title="EXPLORATION" style={styles.sectionHeader} />
          <BrutalView
            offset={4}
            borderRadius={0}
            style={styles.searchContainer}
            contentStyle={[styles.searchMock, { borderColor: primaryPink }]}
          >
            <TouchableOpacity
              style={styles.searchInner}
              onPress={() => router.push('/discover')}
              activeOpacity={1}
            >
              <IconSymbol name="magnifyingglass" size={18} color={primaryPink} />
              <ThemedText style={styles.searchText}>Rechercher dans le catalogue...</ThemedText>
            </TouchableOpacity>
          </BrutalView>
          <View style={styles.genreRow}>
            {['SHONEN', 'SEINEN', 'ISEKAI', 'ACTION'].map((genre) => (
              <BrutalView
                key={genre}
                offset={2}
                borderRadius={0}
                contentStyle={[styles.genreTag, { borderColor: borderHeavyColor }]}
              >
                <TouchableOpacity
                  onPress={() => router.push('/discover')}
                  activeOpacity={1}
                >
                  <ThemedText style={styles.genreText}>{genre}</ThemedText>
                </TouchableOpacity>
              </BrutalView>
            ))}
          </View>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </>
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
  licenseCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
    padding: 18,
    backgroundColor: '#FFFFFF',
  },
  licenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  avatarBox: {
    width: 70,
    height: 70,
    borderWidth: 3,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameBlock: {
    gap: 8,
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  licenseName: {
    fontSize: 22,
    fontFamily: Fonts.heading,
    color: '#000000',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  rankBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  rankBadgeText: {
    fontSize: 8,
    fontFamily: Fonts.bodyBold,
    color: '#4CAF50',
  },
  statSummary: {
    alignItems: 'flex-end',
  },
  miniStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  miniStatValue: {
    fontSize: 14,
    fontFamily: Fonts.heading,
  },
  xpSection: {
    marginBottom: 20,
  },
  xpLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpLabel: {
    fontSize: 10,
    fontFamily: Fonts.headingBold,
    letterSpacing: 0.5,
  },
  xpBarTrack: {
    height: 10,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#000',
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#FF2E63',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: '#000',
    paddingTop: 15,
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    fontSize: 8,
    fontFamily: Fonts.bodyBold,
    color: 'rgba(0,0,0,0.4)',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: Fonts.heading,
    color: '#000000',
  },
  statSub: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.3)',
  },
  totalRow: {
    flexDirection: 'row',
    gap: 15,
  },
  totalItem: {
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 16,
    fontFamily: Fonts.heading,
  },
  totalSub: {
    fontSize: 8,
    fontFamily: Fonts.bodyBold,
    opacity: 0.4,
  },
  statDivider: {
    width: 2,
    height: 35,
    backgroundColor: '#000',
    marginHorizontal: 10,
  },
  ctaButton: {
    borderWidth: 2,
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
  // Exploration
  searchContainer: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  searchMock: {
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  searchText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    opacity: 0.5,
  },
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: Spacing.md,
  },
  genreTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
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
