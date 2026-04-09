/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * Styled to match the Brutalist Manga Design System.
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
    error: '#ff3333'
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
    borderHeavy: '#000000', // Absolute black for manga style contrast
    surface: '#1e1e1e',
    surfaceHover: '#2d2d2d',
    primary: primaryPink,
    secondary: secondaryCyan,
    primaryGlow: 'rgba(255, 46, 99, 0.5)',
    error: '#ff3333'
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
  radius: 0,
};

export const Shadows = {
  brutal: {
    shadowColor: '#000000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  brutalHover: {
    shadowColor: primaryPink,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  glass: {
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 4,
  }
};

export const Fonts = {
  heading: 'Outfit_900Black', // Manga titles are 900
  headingBold: 'Outfit_700Bold',
  body: 'Inter_400Regular',
  bodyBold: 'Inter_700Bold',
};

