/**
 * Section header component
 * Combines MangaTitle with a count badge and accent line
 */
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Fonts } from '@/constants/theme';
import { IconSymbol } from './icon-symbol';

interface SectionHeaderProps {
  title: string;
  count?: number;
  style?: ViewStyle;
}

export function SectionHeader({ title, count, style }: SectionHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {count !== undefined ? (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>+{count}</Text>
        </View>
      ) : null}
      <View style={styles.spacer} />
      <IconSymbol name="plus.circle" size={12} color="rgba(0,0,0,0.3)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 15,
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: 16,
    color: '#000000',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  countBadge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  countText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 9,
    color: '#000000',
  },
  spacer: {
    flex: 1,
  },
});
