/**
 * Visual background system
 * Provides manga-style effects like halftones and speedlines
 */
import React from 'react';
import { StyleSheet, View, Dimensions, Image, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DOT_PATTERN = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAADBJREFUOE9jZKAQMFKon2HUw6iHUR8OUw9T3Y0M9DMMpB4mS+8E9TDSBv1IBA0FAwMANH8EAp7W8uIAAAAASUVORK5CYII=';

export function MangaHalftone() {
  const dotsColor = useThemeColor({}, 'dots');
  const opacity = useThemeColor({}, 'halftoneOpacity');

  return (
    <View style={[StyleSheet.absoluteFill, { opacity }]} pointerEvents="none">
      <Image
        source={{ uri: DOT_PATTERN }}
        style={[StyleSheet.absoluteFill, { tintColor: dotsColor }]}
        resizeMode="repeat"
      />
    </View>
  );
}


export function MangaSpeedlines() {
  const color = useThemeColor({}, 'dots');
  const lines = Array.from({ length: 36 }, (_, i) => i);
  const centerX = SCREEN_WIDTH / 2;
  const centerY = SCREEN_HEIGHT / 2;
  const radius = Math.max(SCREEN_WIDTH, SCREEN_HEIGHT);

  return (
    <View style={[StyleSheet.absoluteFill, { opacity: 0.05 }]} pointerEvents="none">
      {lines.map((line) => (
        <View
          key={line}
          style={[
            styles.speedline,
            {
              backgroundColor: color,
              left: centerX,
              top: centerY,
              width: radius,
              transform: [
                { rotate: `${line * 10}deg` },
                { translateX: SCREEN_WIDTH * 0.2 }
              ]
            }
          ]}
        />
      ))}
    </View>
  );
}

export function BackgroundSystem({ children }: { children?: React.ReactNode }) {
  const bgColor = useThemeColor({}, 'background');

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <MangaHalftone />
      <MangaSpeedlines />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  speedline: {
    position: 'absolute',
    height: 1,
    opacity: 0.5,
  }
});
