import React from 'react';
import { StyleSheet, Pressable, ViewStyle, ViewProps, View } from 'react-native';
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
  const shadowOffsetX = useSharedValue(isManga ? Shadows.brutal.shadowOffset.width : 0);
  const shadowOffsetY = useSharedValue(isManga ? Shadows.brutal.shadowOffset.height : 0);
  const shadowColor = useSharedValue(isManga ? Shadows.brutal.shadowColor : 'transparent');

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
    if (!hoverable) return;
    scale.value = withSpring(0.98);
    
    if (isManga) {
      translationX.value = withSpring(-2);
      translationY.value = withSpring(-2);
      shadowOffsetX.value = withSpring(Shadows.brutalHover.shadowOffset.width);
      shadowOffsetY.value = withSpring(Shadows.brutalHover.shadowOffset.height);
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

  const getVariantStyles = (): ViewStyle => {
    if (isManga) {
      return {
        borderWidth: Borders.width,
        borderRadius: Borders.radius,
        ...Shadows.brutal,
      };
    }
    if (isGlass) {
      return {
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: 'rgba(30, 32, 37, 0.8)',
        ...Shadows.glass,
      };
    }
    return {
      borderWidth: 1,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    };
  };

  const Component = (hoverable || onPress) ? AnimatedPressable : Animated.View;

  return (
    <Component
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        isManga ? { borderColor, backgroundColor } : { borderColor, backgroundColor },
        getVariantStyles(),
        animatedStyle,
        style as ViewStyle,
      ]}
      {...props as any}
    >
      {children}
    </Component>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    overflow: 'visible', // Needed for brutalist shadow to show
  },
});
