/**
 * Section header component
 * Combines MangaTitle with a count badge and accent line
 */
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Fonts } from '@/constants/theme';
import { IconSymbol } from './icon-symbol';
import { ThemedText } from '../themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface SectionHeaderProps {
  title: string;
  count?: number;
  style?: ViewStyle;
}

export function SectionHeader({ title, count, style }: SectionHeaderProps) {
  const borderHeavy = useThemeColor({}, 'borderHeavy');
  const textDim = useThemeColor({}, 'textDim');

  return (
    <View style={[styles.container, style]}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      {count !== undefined ? (
        <View style={[styles.countBadge, { borderColor: borderHeavy }]}>
          <ThemedText style={styles.countText}>+{count}</ThemedText>
        </View>
      ) : null}
      <View style={styles.spacer} />
      <IconSymbol name="plus.circle" size={12} color={textDim} />
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
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  countBadge: {
    borderWidth: 1.5,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  countText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 9,
  },
  spacer: {
    flex: 1,
  },
});
