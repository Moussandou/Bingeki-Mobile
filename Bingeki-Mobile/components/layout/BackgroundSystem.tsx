/**
 * Premium Manga Visual System
 * Implements high-fidelity Halftones, Wedge Speedlines, and Animated SFX
 * Refined based on the Bingeki Web CSS specifications.
 */
import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import Svg, { Rect, Defs, Pattern, Circle, G, Path } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Sharp Halftone Dot Overlay
 * Replicates the 20px radial-gradient grid from web
 */
export function MangaHalftone() {
  const dotsColor = useThemeColor({}, 'dots');
  const opacity = useThemeColor({}, 'halftoneOpacity');

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 100 }]} pointerEvents="none">
      <Svg width="100%" height="100%" opacity={opacity}>
        <Defs>
          <Pattern
            id="halftone"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <Circle cx="2" cy="2" r="2" fill={dotsColor} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#halftone)" />
      </Svg>
    </View>
  );
}

/**
 * Thick Wedge Speedlines
 * Radial effect with 10deg gap and 2deg wedge thickness
 */
export function MangaSpeedlines() {
  const color = useThemeColor({}, 'dots');
  const opacity = useThemeColor({}, 'speedlinesOpacity');
  const centerX = SCREEN_WIDTH / 2;
  const centerY = SCREEN_HEIGHT / 2;
  const radius = Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * 1.2;

  // Generate 36 wedges (one every 10 degrees)
  const renderWedges = () => {
    const wedges = [];
    for (let i = 0; i < 36; i++) {
        const startDeg = i * 10;
        const endDeg = startDeg + 2.5; // 2.5 degree thickness for "thick" look
        
        const x1 = centerX + radius * Math.cos((startDeg * Math.PI) / 180);
        const y1 = centerY + radius * Math.sin((startDeg * Math.PI) / 180);
        const x2 = centerX + radius * Math.cos((endDeg * Math.PI) / 180);
        const y2 = centerY + radius * Math.sin((endDeg * Math.PI) / 180);

        wedges.push(
            <Path 
                key={i}
                d={`M ${centerX} ${centerY} L ${x1} ${y1} L ${x2} ${y2} Z`}
                fill={color}
            />
        );
    }
    return wedges;
  };

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 99 }]} pointerEvents="none">
      <Svg width="100%" height="100%" opacity={opacity}>
        <G>{renderWedges()}</G>
      </Svg>
    </View>
  );
}

/**
 * Animated "Waku Waku" SFX Component
 * Triple-layered for Brutalist impact with vibration animation
 */
function WakuWakuLabel({ text, top, left, right, bottom, rotate, size }: any) {
    const scale = useSharedValue(1);
    const rotation = useSharedValue(rotate ? parseFloat(rotate) : 0);
    const accentColor = '#FF2E63';
    const dotsColor = useThemeColor({}, 'dots');

    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.05, { duration: 400, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
        rotation.value = withRepeat(
            withSequence(
                withTiming((rotation.value || 0) + 2, { duration: 500 }),
                withTiming((rotation.value || 0) - 2, { duration: 500 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { rotate: `${rotation.value}deg` }
        ]
    }));

    return (
        <Animated.View 
            style={[
                styles.sfxContainer,
                { top, left, right, bottom },
                animatedStyle
            ]}
        >
            {/* Layer 1: Red Brutalist Offset Shadow */}
            <ThemedText style={[styles.sfxText, { fontSize: size, color: accentColor, position: 'absolute', top: 6, left: 6 }]}>
                {text}
            </ThemedText>
            
            {/* Layer 2: Extra Black "Gasket" Shadow for thickness */}
            <ThemedText style={[styles.sfxText, { fontSize: size, color: '#000', position: 'absolute', top: 2, left: 2 }]}>
                {text}
            </ThemedText>
            <ThemedText style={[styles.sfxText, { fontSize: size, color: '#000', position: 'absolute', top: -1, left: -1 }]}>
                {text}
            </ThemedText>

            {/* Layer 3: Main White Text with light shadow */}
            <ThemedText 
                style={[
                    styles.sfxText, 
                    { 
                        fontSize: size, 
                        color: '#FFFFFF',
                        textShadowColor: '#000',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 1 
                    }
                ]}
            >
                {text}
            </ThemedText>
        </Animated.View>
    );
}

export function MangaSFX() {
    const labels = [
        { text: 'SUIVI !!', top: 110, left: -15, rotate: '-12deg', size: 38 },
        { text: 'LEVEL UP', top: 320, right: -30, rotate: '15deg', size: 28 },
        { text: 'BINGE !!', bottom: 180, left: -5, rotate: '8deg', size: 45 },
        { text: 'COMMUNAUTÉ', top: SCREEN_HEIGHT * 0.7, right: -50, rotate: '-10deg', size: 22 },
    ];

    return (
        <View style={[StyleSheet.absoluteFill, { zIndex: 101 }]} pointerEvents="none">
            {labels.map((label, i) => (
                <WakuWakuLabel key={i} {...label} />
            ))}
        </View>
    );
}

export function BackgroundSystem({ children }: { children?: React.ReactNode }) {
  const bgColor = useThemeColor({}, 'background');

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* 1. Main Content Base */}
      <View style={styles.content}>
        {children}
      </View>

      {/* 2. Manga Decorative Overlays */}
      <MangaHalftone />
      <MangaSpeedlines />
      <MangaSFX />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  sfxContainer: {
    position: 'absolute',
    opacity: 0.12, // Reduced for subtle premium feel, but thicker text
  },
  sfxText: {
    fontFamily: 'Outfit_900Black',
    textTransform: 'uppercase',
    letterSpacing: -1,
  }
});
