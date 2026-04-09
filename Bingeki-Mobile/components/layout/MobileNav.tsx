import React from 'react';
import { View, StyleSheet, Pressable, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { Button } from '../ui/Button';
import { IconSymbol } from '../ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '../themed-text';

const { width } = Dimensions.get('window');

export function MobileNav({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  // Filter routes to show only Dashboard, Discover, Library
  // index -> Dashboard
  // social -> Discover
  // library -> Library
  const validRoutes = ['index', 'social', 'library'];
  const routes = state.routes.filter(route => validRoutes.includes(route.name));

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <BlurView 
        intensity={80} 
        tint={colorScheme === 'dark' ? 'dark' : 'light'} 
        style={StyleSheet.absoluteFill} 
      />
      <View style={[styles.border, { backgroundColor: theme.border }]} />
      
      <View style={styles.content}>
        {routes.map((route, index) => {
          const { options } = descriptors[route.key];
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
              case 'index': return 'squareshape.fill';
              case 'social': return 'magnifyingglass';
              case 'library': return 'book.closed.fill';
              default: return 'house.fill';
            }
          };

          const getLabel = () => {
            switch (route.name) {
              case 'index': return 'Q.G.';
              case 'social': return 'DÉCOUVRIR';
              case 'library': return 'BIBLIO';
              default: return options.title;
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
            >
              <Button
                variant={isFocused ? 'primary' : 'ghost'}
                size="icon"
                onPress={onPress}
                style={[
                  styles.navButton,
                  { borderRadius: 12 } // Anchor requirement
                ]}
              >
                <IconSymbol 
                  name={getIcon() as any} 
                  size={24} 
                  color={isFocused ? '#FFF' : theme.text} 
                />
              </Button>
              <ThemedText style={[
                styles.label, 
                { color: isFocused ? theme.primary : theme.textDim }
              ]}>
                {getLabel()}
              </ThemedText>
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
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 88 : 70,
    overflow: 'hidden',
  },
  border: {
    height: 1,
    width: '100%',
    opacity: 0.2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 4,
  },
  navButton: {
    width: 48,
    height: 48,
    padding: 0,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Outfit_900Black',
    textTransform: 'uppercase',
  }
});
