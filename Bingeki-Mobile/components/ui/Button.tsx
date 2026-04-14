/**
 * Unified button component
 * Supports multiple variants including manga-style design
 */
import React from 'react';
import { StyleSheet, Pressable, ViewStyle, TextStyle, ActivityIndicator, View, StyleProp, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Borders, Spacing, Fonts, Shadows } from '@/constants/theme';
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
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderHeavyColor = useThemeColor({}, 'borderHeavy');
  
  const scale = useSharedValue(1);
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);

  const shadowOffsetX = useSharedValue(isManga ? Shadows.brutal.shadowOffset.width : 0);
  const shadowOffsetY = useSharedValue(isManga ? Shadows.brutal.shadowOffset.height : 0);
  const shadowColor = useSharedValue(isManga ? Shadows.brutal.shadowColor : 'transparent');

  const getBackgroundColor = () => {
    if (disabled) return useThemeColor({}, 'border');
    switch (variant) {
      case 'primary': return primaryColor;
      case 'secondary': return secondaryColor;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      case 'manga': return surfaceColor;
      default: return primaryColor;
    }
  };

  const getTextColor = () => {
    if (disabled) return useThemeColor({}, 'textDim');
    switch (variant) {
      case 'primary': return '#FFFFFF';
      case 'secondary': return '#1A1A1A';
      case 'outline': return textColor;
      case 'ghost': return textColor;
      case 'manga': return textColor;
      default: return '#FFFFFF';
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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translationX.value },
        { translateY: translationY.value },
      ],

      shadowOffset: {
        width: shadowOffsetX.value,
        height: shadowOffsetY.value,
      },
      shadowColor: shadowColor.value,
    };
  });

  const handlePressIn = () => {
    if (disabled || isLoading) return;
    
    if (isManga) {
      // Physical sinking effect: move by 4px, shadow shrinks to 2px
      translationX.value = withSpring(4, { damping: 20, stiffness: 200 });
      translationY.value = withSpring(4, { damping: 20, stiffness: 200 });
      shadowOffsetX.value = withSpring(2, { damping: 20, stiffness: 200 });
      shadowOffsetY.value = withSpring(2, { damping: 20, stiffness: 200 });
    } else {
      scale.value = withSpring(0.96);
    }
  };

  const handlePressOut = () => {
    if (disabled || isLoading) return;
    
    if (isManga) {
      translationX.value = withSpring(0, { damping: 20, stiffness: 200 });
      translationY.value = withSpring(0, { damping: 20, stiffness: 200 });
      shadowOffsetX.value = withSpring(Shadows.brutal.shadowOffset.width, { damping: 20, stiffness: 200 });
      shadowOffsetY.value = withSpring(Shadows.brutal.shadowOffset.height, { damping: 20, stiffness: 200 });
    } else {
      scale.value = withSpring(1);
    }
  };

  const handlePress = () => {
    if (disabled || isLoading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm': return { paddingVertical: 8, paddingHorizontal: 12, minHeight: 40 };
      case 'lg': return { paddingVertical: 16, paddingHorizontal: 24, minHeight: 60 };
      case 'icon': return { padding: 12, aspectRatio: 1, minHeight: 44, justifyContent: 'center' };
      case 'md':
      default: return { paddingVertical: 12, paddingHorizontal: 16, minHeight: 48 };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 14;
      case 'lg': return 18;
      case 'md':
      default: return 16;
    }
  };

  const androidShadowStyle = useAnimatedStyle(() => {
    if (!isManga || Platform.OS !== 'android' || disabled) return {};
    return {
      backgroundColor: shadowColor.value as any,
      top: shadowOffsetY.value,
      left: shadowOffsetX.value,
      right: -shadowOffsetX.value,
      bottom: -shadowOffsetY.value,
      borderRadius: Borders.mangaRadius,
    };
  });


  const renderShadow = () => {
    if (!isManga || Platform.OS !== 'android' || disabled) return null;
    
    return (
      <Animated.View
        style={[
          styles.androidShadow,
          androidShadowStyle
        ]}
      />
    );
  };

  return (
    <View style={styles.shadowWrapper}>
      {renderShadow()}
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
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
            animatedStyle,
            style,
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
  androidShadow: {
    position: 'absolute',
    zIndex: -1,
  },
  buttonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
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
