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

  // Filter routes to show only Dashboard, Discover, Library
  const validRoutes = ['index', 'social', 'library'];
  const routes = state.routes.filter(route => validRoutes.includes(route.name));

  return (
    <View style={[styles.container, { bottom: 20 + insets.bottom / 2, backgroundColor: theme.surface }]}>
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
              case 'social': return 'safari';
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
                isFocused && { backgroundColor: theme.primary + '20' } // Subtle background for active
              ]}
            >
              <IconSymbol 
                name={getIcon() as any} 
                size={28} 
                color={isFocused ? theme.primary : theme.text} 
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
    alignSelf: 'center',
    width: width * 0.7,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    // Shadow for landing depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tabItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
