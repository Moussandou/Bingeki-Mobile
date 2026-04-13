/**
 * Main dashboard screen
 * Displays user progress, rank, and quick actions
 */
import React from 'react';
import { StyleSheet, ScrollView, View, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing, Colors, Fonts, Borders } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { calculateRank, getRankColor } from '@/constants/rank';

import { BackgroundSystem } from '@/components/layout/BackgroundSystem';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();
  const primaryPink = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const textDimColor = useThemeColor({}, 'textDim');
  const borderHeavyColor = useThemeColor({}, 'borderHeavy');
  const borderColor = useThemeColor({}, 'border');

  // User stats and progress data
  const userData = {
    username: 'TAKAX',
    level: 12,
    xp: 131,
    maxXp: 450,
    streak: 3,
    objectives: { current: 3, total: 3 },
    stats: {
      chaps: 381,
      eps: 40,
      films: 0
    }
  };

  const rank = calculateRank(userData.level);
  const rankColor = getRankColor(rank);

  // Generate avatar from username
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}&backgroundColor=FF2E63`;

  return (
    <BackgroundSystem>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Card variant="manga" style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatarShadow, { backgroundColor: primaryPink, borderColor: borderHeavyColor }]} />
            <Image
              source={avatarUrl}
              style={[styles.avatar, { borderColor: borderHeavyColor, backgroundColor: borderHeavyColor === '#FFFFFF' ? '#1a1a1a' : '#f0f0f0' }]}
              contentFit="cover"
            />
          </View>

          <View style={styles.nameHeader}>
            <ThemedText style={[styles.username, { color: textColor }]}>{userData.username}</ThemedText>
            <View style={[styles.rankBadge, { borderColor, backgroundColor: surfaceColor }]}>
              <ThemedText style={[styles.rankText, { color: rankColor }]}>{rank}</ThemedText>
            </View>
          </View>

          <View style={styles.statusRow}>
            <View style={[styles.streakBox, { borderColor: borderHeavyColor, backgroundColor: surfaceColor }]}>
              <IconSymbol name="flame.fill" size={24} color={primaryPink} />
              <ThemedText style={[styles.streakValue, { color: primaryPink }]}>{userData.streak}</ThemedText>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.levelInfo}>
                <ThemedText style={[styles.levelLabel, { color: textColor }]}>NIV {userData.level}</ThemedText>
                <ThemedText style={[styles.xpLabel, { color: textDimColor }]}>{userData.xp} / {userData.maxXp} XP</ThemedText>
              </View>
              <View style={[styles.progressBarContainer, { backgroundColor: borderColor, borderColor: borderHeavyColor }]}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      backgroundColor: primaryPink, 
                      width: `${(userData.xp / userData.maxXp) * 100}%` 
                    }
                  ]} 
                />
              </View>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Button
              variant="manga"
              title="DÉCOUVRIR"
              icon={<IconSymbol name="plus" size={20} color="#FFF" />}
              style={styles.discoverBtn}
              onPress={() => router.push('/discover')}
            />
            <Button
              variant="outline"
              title="PROFIL"
              style={[styles.profileBtn, { borderColor: borderHeavyColor, borderRadius: Borders.mangaRadius }]}
              onPress={() => router.push('/profile')}
            />
          </View>
        </Card>

        {/* Objective Card */}
        <Card variant="manga" style={[styles.secondaryCard, { backgroundColor: surfaceColor }]}>
          <View style={styles.cardHeader}>
            <IconSymbol name="target" size={22} color={textDimColor} />
            <ThemedText style={[styles.cardTitle, { color: textDimColor }]}>OBJECTIF</ThemedText>
          </View>
          <View style={styles.objectiveContent}>
            <ThemedText style={[styles.objectiveValue, { color: textColor }]}>
              {userData.objectives.current}
              <ThemedText style={[styles.objectiveTotal, { color: textDimColor }]}>/{userData.objectives.total}</ThemedText>
            </ThemedText>
            <View style={[styles.pinkUnderline, { backgroundColor: primaryPink }]} />
          </View>
        </Card>

        {/* Total Stats Card */}
        <Card variant="manga" style={[styles.secondaryCard, { backgroundColor: surfaceColor }]}>
          <View style={styles.cardHeader}>
            <IconSymbol name="arrow.up.right" size={22} color={textDimColor} />
            <ThemedText style={[styles.cardTitle, { color: textDimColor }]}>TOTAL</ThemedText>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <ThemedText style={[styles.statCount, { color: textColor }]}>{userData.stats.chaps}</ThemedText>
              <ThemedText style={[styles.statLabel, { color: textDimColor }]}>CHAPS</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={[styles.statCount, { color: textColor }]}>{userData.stats.eps}</ThemedText>
              <ThemedText style={[styles.statLabel, { color: textDimColor }]}>EPS</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={[styles.statCount, { color: textColor }]}>{userData.stats.films}</ThemedText>
              <ThemedText style={[styles.statLabel, { color: textDimColor }]}>FILMS</ThemedText>
            </View>
          </View>
        </Card>

        {/* FAB spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </BackgroundSystem>
  );
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
  },
  verticalStripe: {
    position: 'absolute',
    left: '50%',
    marginLeft: -40,
    width: 80,
    height: '100%',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.md,
    paddingTop: 80,
    gap: Spacing.lg,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    marginBottom: Spacing.md,
  },
  avatarShadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 120,
    height: 120,
    borderWidth: 2,
  },
  avatar: {
    width: 120,
    height: 120,
    borderWidth: 4,
  },
  nameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  username: {
    fontSize: 28,
    fontFamily: Fonts.heading,
    letterSpacing: 1,
  },
  rankBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
  },
  rankText: {
    fontSize: 12,
    fontFamily: Fonts.headingBold,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  streakBox: {
    borderWidth: Borders.width,
    padding: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 80,
    justifyContent: 'center',
  },
  streakValue: {
    fontSize: 22,
    fontFamily: Fonts.heading,
  },
  progressSection: {
    flex: 1,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  levelLabel: {
    fontFamily: Fonts.heading,
    fontSize: 16,
  },
  xpLabel: {
    fontSize: 12,
    fontFamily: Fonts.bodyBold,
  },
  progressBarContainer: {
    height: 10,
    borderWidth: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  actionButtons: {
    width: '100%',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  discoverBtn: {
    width: '100%',
  },
  profileBtn: {
    width: 'auto',
    alignSelf: 'center',
    borderWidth: 2,
    paddingHorizontal: 30,
  },
  secondaryCard: {
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    letterSpacing: 1,
    fontFamily: Fonts.bodyBold,
  },
  objectiveContent: {
    alignItems: 'center',
  },
  objectiveValue: {
    fontSize: 42,
    fontFamily: Fonts.heading,
    lineHeight: 42,
  },
  objectiveTotal: {
    fontSize: 24,
  },
  pinkUnderline: {
    height: 4,
    width: 60,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statCount: {
    fontSize: 24,
    fontFamily: Fonts.heading,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: Fonts.bodyBold,
  },
});
