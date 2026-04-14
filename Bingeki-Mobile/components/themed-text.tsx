/**
 * Themed text component
 * Standardized typography with light/dark mode support
 */
import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Fonts } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'mangaTitle';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const mangaColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'mangaTitle' ? [styles.mangaTitle, { backgroundColor, color: mangaColor }] : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.body,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.bodyBold,
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
    fontFamily: Fonts.headingBold,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 20,
    fontFamily: Fonts.headingBold,
    textTransform: 'uppercase',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    fontFamily: Fonts.body,
    color: '#0a7ea4',
    textDecorationLine: 'underline',
  },
  mangaTitle: {
    fontSize: 28,
    fontFamily: Fonts.heading, // 900 Black
    textTransform: 'uppercase',
    letterSpacing: -0.5, // -0.02em approximate
    paddingHorizontal: 8, // 0.5em
    paddingVertical: 2, // 0.1em
    transform: [{ rotate: '-1deg' }],
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
});
