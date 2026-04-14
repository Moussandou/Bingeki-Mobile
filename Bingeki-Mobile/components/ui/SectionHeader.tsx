/**
 * Section header component
 * Combines MangaTitle with a count badge and accent line
 */
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MangaTitle } from './MangaTitle';

interface SectionHeaderProps {
  title: string;
  count?: number;
  style?: ViewStyle;
}

export function SectionHeader({ title, count, style }: SectionHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <MangaTitle text={title} size="sm" />
      {count !== undefined ? (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      ) : null}
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 8,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#FF2E63',
  },
  countBadge: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1.5,
    borderColor: '#333333',
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  countText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: '#08D9D6',
    fontWeight: '700',
    letterSpacing: 1,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 46, 99, 0.25)',
  },
});
