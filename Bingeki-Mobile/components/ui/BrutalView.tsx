import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface BrutalViewProps {
  children: React.ReactNode;
  offset?: number;
  backgroundColor?: string;
  shadowColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  isPressed?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

/**
 * Reusable neo-brutalist shadow wrapper
 * Handles consistent sinking animation logic
 */
export function BrutalView({
  children,
  offset = 4,
  shadowColor = '#000000',
  isPressed = false,
  style,
  contentStyle,
  borderRadius,
}: BrutalViewProps) {
  const contentTranslateX = useSharedValue(0);
  const contentTranslateY = useSharedValue(0);
  const shadowTranslateX = useSharedValue(offset);
  const shadowTranslateY = useSharedValue(offset);

  React.useEffect(() => {
    if (isPressed) {
      contentTranslateX.value = withSpring(offset, { damping: 20, stiffness: 300 });
      contentTranslateY.value = withSpring(offset, { damping: 20, stiffness: 300 });
      shadowTranslateX.value = withSpring(0, { damping: 20, stiffness: 300 });
      shadowTranslateY.value = withSpring(0, { damping: 20, stiffness: 300 });
    } else {
      contentTranslateX.value = withSpring(0, { damping: 20, stiffness: 300 });
      contentTranslateY.value = withSpring(0, { damping: 20, stiffness: 300 });
      shadowTranslateX.value = withSpring(offset, { damping: 20, stiffness: 300 });
      shadowTranslateY.value = withSpring(offset, { damping: 20, stiffness: 300 });
    }
  }, [isPressed, offset]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [
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

  return (
    <View style={[styles.wrapper, style]}>
      {/* SHADOW LAYER */}
      <Animated.View
        style={[
          styles.shadow,
          { 
            backgroundColor: shadowColor,
            borderRadius: borderRadius ?? 0,
          },
          animatedShadowStyle
        ]}
      />
      
      {/* CONTENT LAYER */}
      <Animated.View
        style={[
          styles.content,
          animatedContentStyle,
          contentStyle,
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    overflow: 'visible',
  },
  shadow: {
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    backgroundColor: '#000000',
  },
  content: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
});
