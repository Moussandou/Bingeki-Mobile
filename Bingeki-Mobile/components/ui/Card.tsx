/**
 * Generic card component
 * Supports standard, glassmorphism, and manga brutalist variants
 */
import React from 'react';
import { StyleSheet, Pressable, ViewStyle, StyleProp, ViewProps, View, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Borders, Shadows } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

import { BrutalView } from './BrutalView';

export type CardVariant = 'default' | 'manga';

export type CardProps = ViewProps & {
  children: React.ReactNode;
  variant?: CardVariant;
  hoverable?: boolean;
  onPress?: () => void;
};

export function Card({
  children,
  variant = 'default',
  hoverable = false,
  onPress,
  style,
  ...props
}: CardProps) {
  const [isPressed, setIsPressed] = React.useState(false);
  const borderColor = useThemeColor({}, 'borderHeavy');
  const backgroundColor = useThemeColor({}, 'surface');

  // Extract layout vs card styles
  const flattenedStyle = StyleSheet.flatten(style || {});
  const {
    margin, marginHorizontal, marginVertical, marginTop, marginBottom, marginLeft, marginRight,
    flex, flexGrow, flexShrink, flexBasis,
    width, height, minWidth, minHeight, maxWidth, maxHeight,
    position, top, left, right, bottom, alignSelf,
    backgroundColor: styleBg, // Separate background from layout
    ...cardStyles
  } = flattenedStyle as any;

  const layoutStyles = {
    margin, marginHorizontal, marginVertical, marginTop, marginBottom, marginLeft, marginRight,
    flex, flexGrow, flexShrink, flexBasis,
    width, height, minWidth, minHeight, maxWidth, maxHeight,
    position, top, left, right, bottom, alignSelf,
  };

  const handlePressIn = () => {
    if (!hoverable && !onPress) return;
    setIsPressed(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    if (!hoverable && !onPress) return;
    setIsPressed(false);
  };

  const renderContent = () => {
    // Solid base for manga variant using theme-aware color
    const bg = variant === 'manga' ? backgroundColor : (cardStyles.backgroundColor || backgroundColor);

    return (
      <BrutalView
        isPressed={isPressed}
        style={layoutStyles as StyleProp<ViewStyle>}
        contentStyle={[
          {
            backgroundColor: bg,
            borderColor: cardStyles.borderColor || borderColor,
            borderWidth: cardStyles.borderWidth || Borders.width,
            borderRadius: cardStyles.borderRadius ?? Borders.mangaRadius,
            padding: cardStyles.padding || 16,
          },
          cardStyles
        ]}
      >
        {children}
      </BrutalView>
    );
  };

  if (hoverable || onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        {renderContent()}
      </Pressable>
    );
  }

  return renderContent();
}

const styles = StyleSheet.create({});
