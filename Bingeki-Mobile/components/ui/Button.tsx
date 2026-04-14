/**
 * Unified button component
 * Supports multiple variants including manga-style design
 */
import React from 'react';
import { StyleSheet, Pressable, ViewStyle, TextStyle, ActivityIndicator, View, StyleProp } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Borders, Spacing, Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '../themed-text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'manga';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  onPress,
  style,
  textStyle,
  children,
}: ButtonProps) {
  const isManga = variant === 'manga';
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const textColor = useThemeColor({}, 'text');
  const borderHeavyColor = useThemeColor({}, 'borderHeavy');
  
  const contentTranslateX = useSharedValue(0);
  const contentTranslateY = useSharedValue(0);
  const shadowTranslateX = useSharedValue(isManga ? 4 : 0);
  const shadowTranslateY = useSharedValue(isManga ? 4 : 0);
  const scale = useSharedValue(1);

  const getBackgroundColor = () => {
    if (disabled) return useThemeColor({}, 'border');
    switch (variant) {
      case 'primary': return primaryColor;
      case 'secondary': return secondaryColor;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      case 'manga': return useThemeColor({}, 'surface');
      default: return primaryColor;
    }
  };

  const getTextColor = () => {
    if (disabled) return useThemeColor({}, 'textDim');
    switch (variant) {
      case 'primary': return '#FFFFFF';
      case 'secondary': return '#1A1A1A';
      case 'manga': return textColor;
      default: return textColor;
    }
  };

  const getBorderColor = () => {
    if (disabled) return 'transparent';
    switch (variant) {
      case 'outline': return primaryColor;
      case 'manga': return borderHeavyColor;
      default: return 'transparent';
    }
  };

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: contentTranslateX.value },
      { translateY: contentTranslateY.value },
    ],
  }));

  const animatedShadowStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shadowTranslateX.value },
      { translateY: shadowTranslateY.value },
    ],
  }));

  const handlePressIn = () => {
    if (disabled || isLoading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isManga) {
      contentTranslateX.value = withSpring(4, { damping: 20, stiffness: 300 });
      contentTranslateY.value = withSpring(4, { damping: 20, stiffness: 300 });
      shadowTranslateX.value = withSpring(0, { damping: 20, stiffness: 300 });
      shadowTranslateY.value = withSpring(0, { damping: 20, stiffness: 300 });
    } else {
      scale.value = withSpring(0.96);
    }
  };

  const handlePressOut = () => {
    if (disabled || isLoading) return;
    
    if (isManga) {
      contentTranslateX.value = withSpring(0, { damping: 20, stiffness: 300 });
      contentTranslateY.value = withSpring(0, { damping: 20, stiffness: 300 });
      shadowTranslateX.value = withSpring(4, { damping: 20, stiffness: 300 });
      shadowTranslateY.value = withSpring(4, { damping: 20, stiffness: 300 });
    } else {
      scale.value = withSpring(1);
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm': return { paddingVertical: 8, paddingHorizontal: 12, minHeight: 40 };
      case 'lg': return { paddingVertical: 16, paddingHorizontal: 24, minHeight: 60 };
      case 'icon': return { padding: 12, aspectRatio: 1, minHeight: 44, justifyContent: 'center' };
      default: return { paddingVertical: 12, paddingHorizontal: 16, minHeight: 48 };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 14;
      case 'lg': return 18;
      default: return 16;
    }
  };

  return (
    <View style={[styles.shadowWrapper, style]}>
      {isManga && (
        <Animated.View
          style={[
            styles.brutalShadow,
            animatedShadowStyle
          ]}
        />
      )}
      
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled || isLoading}
        style={[
          styles.buttonBase,
          getSizeStyles(),
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: variant === 'outline' || isManga ? (isManga ? Borders.width : 2) : 0,
            borderRadius: isManga ? Borders.mangaRadius : 8,
            opacity: disabled ? 0.6 : 1,
          },
          animatedContentStyle,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color={getTextColor()} />
        ) : (
          <View style={styles.contentContainer}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            {(title || children) && size !== 'icon' && (
              <ThemedText
                style={[
                  styles.text,
                  { color: getTextColor(), fontSize: getTextSize() },
                  isManga && { fontFamily: Fonts.headingBold, textTransform: 'uppercase' },
                  textStyle,
                ]}
              >
                {title || children}
              </ThemedText>
            )}
          </View>
        )}
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    position: 'relative',
    overflow: 'visible',
  },
  brutalShadow: {
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    backgroundColor: '#000000',
  },
  buttonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  text: {
    fontFamily: Fonts.bodyBold,
    textAlign: 'center',
  },
});
