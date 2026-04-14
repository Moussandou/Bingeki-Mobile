/**
 * Global design system tokens
 * Brutalist Manga styling: colors, spacing, borders, shadows, and fonts
 */

import { Platform } from 'react-native';

const primaryPink = '#FF2E63';
const secondaryCyan = '#08D9D6';

export const Colors = {
  light: {
    text: '#1a1a1a',
    textDim: '#666666',
    background: '#f5f5f5',
    tint: primaryPink,
    icon: '#1a1a1a',
    tabIconDefault: '#666666',
    tabIconSelected: primaryPink,
    border: '#e5e5e5',
    borderHeavy: '#000000',
    surface: '#ffffff',
    surfaceHover: '#e8e8e8',
    primary: primaryPink,
    secondary: secondaryCyan,
    primaryGlow: 'rgba(255, 46, 99, 0.5)',
    error: '#ff3333',
    dots: '#000000',
    halftoneOpacity: 0.1,
  },
  dark: {
    text: '#e0e0e0',
    textDim: '#a0a0a0',
    background: '#121212',
    tint: primaryPink,
    icon: '#e0e0e0',
    tabIconDefault: '#a0a0a0',
    tabIconSelected: primaryPink,
    border: '#333333',
    borderHeavy: '#ffffff',
    surface: '#1e1e1e',
    surfaceHover: '#2d2d2d',
    primary: primaryPink,
    secondary: secondaryCyan,
    primaryGlow: 'rgba(255, 46, 99, 0.5)',
    error: '#ff3333',
    dots: '#ffffff',
    halftoneOpacity: 0.05,
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
    shadowOffset: { width: 6, height: 6 },
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

