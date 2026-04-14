/**
 * Global design system tokens
 * Brutalist Manga styling: colors, spacing, borders, shadows, and fonts
 */

import { Platform } from 'react-native';

const primaryPink = '#FF2E63';
const secondaryCyan = '#08D9D6';
const darkAccent = '#252A34';

export const Colors = {
  light: {
    text: '#1A1A1A',
    textDim: '#666666',
    background: '#F5F5F5', // Paper aspect
    tint: primaryPink,
    icon: '#1A1A1A',
    tabIconDefault: '#666666',
    tabIconSelected: primaryPink,
    border: '#E5E5E5',
    borderHeavy: '#000000',
    surface: '#FFFFFF',
    surfaceHover: '#E8E8E8',
    primary: primaryPink,
    secondary: secondaryCyan,
    darkAccent: darkAccent,
    primaryForeground: '#FFFFFF',
    secondaryForeground: '#1A1A1A',
    primaryGlow: 'rgba(255, 46, 99, 0.5)',
    error: '#ff3333',
    dots: '#000000',
    halftoneOpacity: 0.1,
    speedlinesOpacity: 0.05,
  },
  dark: {
    text: '#E0E0E0',
    textDim: '#A0A0A0',
    background: '#121212',
    tint: primaryPink,
    icon: '#E0E0E0',
    tabIconDefault: '#A0A0A0',
    tabIconSelected: primaryPink,
    border: '#333333',
    borderHeavy: '#444444', // Dark mode specific brutal border
    surface: '#1E1E1E',
    surfaceHover: '#2D2D2D',
    primary: primaryPink,
    secondary: secondaryCyan,
    darkAccent: darkAccent,
    primaryForeground: '#FFFFFF',
    secondaryForeground: '#1A1A1A',
    primaryGlow: 'rgba(255, 46, 99, 0.5)',
    error: '#ff3333',
    dots: '#FFFFFF',
    halftoneOpacity: 0.05,
    speedlinesOpacity: 0.03,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Borders = {
  width: 4,
  radius: 12,
  mangaRadius: 0,
};

export const Shadows = {
  brutal: {
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  brutalHover: {
    shadowColor: '#000000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  brutalActive: {
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  brutalPressed: {
    shadowColor: primaryPink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  glass: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  }
};

export const Fonts = {
  heading: 'Outfit_900Black',
  headingBold: 'Outfit_700Bold',
  body: 'Inter_400Regular',
  bodyBold: 'Inter_700Bold',
};

