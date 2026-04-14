/**
 * ScreenHeader layout component
 * Red banner with title and safe area support
 */
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenHeader({ title, subtitle, rightElement, style }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const borderColor = Colors[colorScheme ?? 'light'].borderHeavy;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, borderBottomColor: borderColor }, style]}>
      <View style={styles.row}>
        <Image 
          source={require('@/assets/images/icon.png')} 
          style={styles.logoHeader} 
          resizeMode="contain"
        />
        <View style={styles.titleBlock}>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {rightElement}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF2E63',
    paddingHorizontal: 14,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
  },
  logoHeader: {
    width: 36,
    height: 36,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  subtitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 2,
    marginTop: 2,
  },
});
