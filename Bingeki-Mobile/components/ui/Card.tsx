import React from 'react';
import { StyleSheet, Pressable, ViewStyle, ViewProps, View, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
} from 'react-native-reanimated';
import { Borders, Shadows } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type CardVariant = 'default' | 'glass' | 'manga';

export type CardProps = ViewProps & {
  children: React.ReactNode;
  variant?: CardVariant;
  hoverable?: boolean;
  onPress?: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Card({ 
  children, 
  variant = 'default',
  hoverable = false,
  onPress, 
  style, 
  ...props 
}: CardProps) {
  const isManga = variant === 'manga';
  const isGlass = variant === 'glass';

  const borderColor = useThemeColor({}, isManga ? 'borderHeavy' : 'border');
  const backgroundColor = useThemeColor({}, 'surface');
  const primaryColor = useThemeColor({}, 'primary');
  
  const scale = useSharedValue(1);
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  
  const shadowSettings = isManga ? Shadows.brutal : Shadows.glass;
  const shadowOffsetX = useSharedValue(shadowSettings.shadowOffset.width);
  const shadowOffsetY = useSharedValue(shadowSettings.shadowOffset.height);
  const shadowColor = useSharedValue(shadowSettings.shadowColor);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translationX.value },
        { translateY: translationY.value },
      ],
      // iOS Shadow
      shadowOffset: {
        width: shadowOffsetX.value,
        height: shadowOffsetY.value,
      },
      shadowColor: shadowColor.value,
    };
  });

  const handlePressIn = () => {
    if (!hoverable) return;
    scale.value = withSpring(0.98);
    
    if (isManga) {
      translationX.value = withSpring(2); // Simulating press down
      translationY.value = withSpring(2);
      shadowOffsetX.value = withSpring(Shadows.brutalPressed.shadowOffset.width);
      shadowOffsetY.value = withSpring(Shadows.brutalPressed.shadowOffset.height);
      shadowColor.value = primaryColor;
    }
  };

  const handlePressOut = () => {
    if (!hoverable) return;
    scale.value = withSpring(1);
    
    if (isManga) {
      translationX.value = withSpring(0);
      translationY.value = withSpring(0);
      shadowOffsetX.value = withSpring(Shadows.brutal.shadowOffset.width);
      shadowOffsetY.value = withSpring(Shadows.brutal.shadowOffset.height);
      shadowColor.value = Shadows.brutal.shadowColor;
    }
  };

  const Component = (hoverable || onPress) ? AnimatedPressable : Animated.View;

  // Render the sharp shadow for Android or fallback to iOS native shadow
  const renderShadow = () => {
    if (!isManga || Platform.OS !== 'android') return null;
    
    return (
      <Animated.View
        style={[
          styles.androidShadow,
          {
            backgroundColor: shadowColor.value as any,
            top: shadowOffsetY.value,
            left: shadowOffsetX.value,
            right: -shadowOffsetX.value,
            bottom: -shadowOffsetY.value,
            borderRadius: Borders.mangaRadius,
          }
        ]}
      />
    );
  };

  return (
    <View style={styles.shadowWrapper}>
      {renderShadow()}
      <Component
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          {
            backgroundColor,
            borderColor,
            borderWidth: isManga ? Borders.width : (isGlass ? 1 : 0),
            borderRadius: isManga ? Borders.mangaRadius : (isGlass ? 12 : 8),
            ...(Platform.OS === 'ios' ? (isManga ? Shadows.brutal : (isGlass ? Shadows.glass : {})) : {}),
            shadowOpacity: 1, // Force full opacity for manga
            shadowRadius: 0,  // Force hard edge for manga
          },
          animatedStyle,
          style as ViewStyle,
        ]}
        {...props as any}
      >
        {children}
      </Component>
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
  card: {
    padding: 16,
    overflow: 'visible',
  },
});
