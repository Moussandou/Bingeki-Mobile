/**
 * Themed view container
 * Automatic light/dark mode background support
 */
import { View, type ViewProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Borders } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  brutalist?: boolean;
  transparent?: boolean;
};

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  brutalist, 
  transparent,
  ...otherProps 
}: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'border');

  return (
    <View 
      style={[
        { backgroundColor: transparent ? 'transparent' : backgroundColor }, 
        brutalist && { 
          borderWidth: Borders.width, 
          borderColor: borderColor,
          borderRadius: Borders.radius,
        },
        style
      ]} 
      {...otherProps} 
    />
  );
}
