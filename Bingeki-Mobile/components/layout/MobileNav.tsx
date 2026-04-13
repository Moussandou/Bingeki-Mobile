/**
 * Custom bottom navigation bar
 * Compact capsule-style tab bar with haptic feedback
 */
import React from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '../ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

export function MobileNav({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  // Only show specific routes
  const validRoutes = ['index', 'discover', 'library'];
  const routes = state.routes.filter(route => validRoutes.includes(route.name));

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.borderHeavy }]}>
      <View style={styles.content}>
        {routes.map((route, index) => {
          const isFocused = state.index === state.routes.findIndex(r => r.key === route.key);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          };

          const getIcon = () => {
            switch (route.name) {
              case 'index': return 'house.fill';
              case 'discover': return 'magnifyingglass';
              case 'library': return 'book.closed.fill';
              default: return 'house.fill';
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[
                styles.tabItem,
                isFocused && { backgroundColor: theme.text, borderRadius: 12 } // Active tab focus
              ]}
            >
              <IconSymbol 
                name={getIcon() as any} 
                size={24} 
                color={isFocused ? theme.background : theme.text} 
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,             // Floating position
    alignSelf: 'center',
    width: '75%',           // Compact width
    height: 70,
    borderRadius: 35,       // Capsule style
    borderWidth: 3,         // Outline manga
    // Hard shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,           // Android fallback
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  tabItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
