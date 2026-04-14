/**
 * Custom bottom navigation bar
 * Compact capsule-style tab bar with haptic feedback
 */
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '../ui/icon-symbol';

export function MobileNav({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Only show specific routes
  const validRoutes = ['index', 'discover', 'library'];
  const routes = state.routes.filter(route => validRoutes.includes(route.name));

  return (
    <View style={styles.container}>
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
                isFocused && styles.activeTab
              ]}
            >
              <IconSymbol
                name={getIcon() as any}
                size={24}
                color={isFocused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'}
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
    bottom: 30,
    alignSelf: 'center',
    width: '75%',
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#000000',
    backgroundColor: '#FF2E63',
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
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
  },
  activeTab: {
    backgroundColor: '#000000',
    borderRadius: 25,
  },
});
