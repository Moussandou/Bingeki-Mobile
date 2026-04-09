import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing, Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function HomeScreen() {
  const tint = useThemeColor({}, 'tint');
  const [search, setSearch] = useState('');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <ThemedView style={styles.header}>
        <ThemedText type="mangaTitle" style={styles.mainTitle}>
          BINGEKI
        </ThemedText>
        <ThemedText type="subtitle" style={styles.tagline}>
          Mobile Edition
        </ThemedText>
      </ThemedView>

      <Input
        placeholder="SEARCH MANGA OR ANIME..."
        value={search}
        onChangeText={setSearch}
        icon={<IconSymbol name="magnifyingglass" size={20} color={tint} />}
        style={{ fontFamily: 'Outfit_900Black', textTransform: 'uppercase' }}
      />

      <Card variant="manga" hoverable onPress={() => { }} style={{ marginBottom: Spacing.xl }}>
        <ThemedText type="subtitle">Mission: Initialization</ThemedText>
        <ThemedText style={styles.panelBody}>
          Welcome to the new Bingeki experience. Your library has been upgraded with high-energy visuals and tactile interactions.
        </ThemedText>
        <Button 
          variant="manga" 
          title="START READING" 
          icon={<IconSymbol name="book.fill" size={18} color={tint} />} 
          style={{ marginTop: Spacing.md }} 
        />
      </Card>

      <View style={styles.grid}>
        <Card variant="manga" hoverable style={styles.halfPanel}>
          <ThemedText type="defaultSemiBold">STATS</ThemedText>
          <ThemedText style={styles.statValue}>99+</ThemedText>
        </Card>
        <Card variant="manga" hoverable style={styles.halfPanel}>
          <ThemedText type="defaultSemiBold">RANK</ThemedText>
          <ThemedText style={[styles.statValue, { color: tint }]}>S-TIER</ThemedText>
        </Card>
      </View>

      <ThemedView brutalist style={styles.systemUpdate}>
        <ThemedText type="subtitle">System Status</ThemedText>
        <ThemedView style={[styles.statusIndicator, { backgroundColor: tint }]} />
        <ThemedText>All systems operational. Aesthetics maximized.</ThemedText>
        <Button variant="primary" title="VERIFY SYSTEMS" style={{ marginTop: Spacing.md }} />
      </ThemedView>

      <ThemedView style={styles.footer}>
        <ThemedText type="link">View Full Documentation</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.md,
    paddingTop: 60,
  },
  header: {
    marginBottom: Spacing.xl,
    alignItems: 'flex-start',
  },
  mainTitle: {
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: 14,
    opacity: 0.7,
  },
  panelBody: {
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  halfPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Outfit_900Black', // Updated to match brutalist tokens
    marginTop: Spacing.xs,
  },
  systemUpdate: {
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statusIndicator: {
    height: 4,
    width: '40%',
    marginVertical: Spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.xl,
  },
});
