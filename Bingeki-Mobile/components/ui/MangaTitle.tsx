/**
 * MangaTitle component
 * Bold rotated label — always red (#FF2E63) with white text and brutal 3×3 shadow
 */
import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { Fonts } from '@/constants/theme';

type MangaTitleProps = {
  text: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
  rotate?: boolean;
};

export function MangaTitle({
  text,
  style,
  textStyle,
  size = 'md',
  rotate = true,
}: MangaTitleProps) {
  const fontSize = size === 'lg' ? 20 : size === 'md' ? 15 : 11;

  return (
    <View
      style={[
        styles.container,
        rotate && styles.rotated,
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize }, textStyle]}>
        {text.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    backgroundColor: '#FF2E63',
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  rotated: {
    transform: [{ rotate: '-1deg' }],
  },
  text: {
    fontFamily: Fonts.heading,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#FFFFFF',
  },
});
