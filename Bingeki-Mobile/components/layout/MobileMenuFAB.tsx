import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '../themed-text';

const { width } = Dimensions.get('window');

export function MobileMenuFAB() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [isOpen, setIsOpen] = useState(false);

  const animation = useSharedValue(0);

  const toggleMenu = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    animation.value = withSpring(nextState ? 1 : 0, {
      damping: 15,
      stiffness: 100,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const fabStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isOpen ? 1.1 : 1) },
        { rotate: `${animation.value * 45}deg` }
      ],
      backgroundColor: isOpen ? theme.primary : theme.surface,
    };
  });

  const menuStyle = useAnimatedStyle(() => {
    return {
      opacity: animation.value,
      transform: [
        { translateY: interpolate(animation.value, [0, 1], [20, 0]) },
        { scale: animation.value }
      ],
      pointerEvents: isOpen ? 'auto' : 'none',
    };
  });

  const menuItems = [
    { label: 'Profile', icon: 'person', route: '/(tabs)/profile' },
    { label: 'Settings', icon: 'settings', route: '/(tabs)/profile' }, // Placeholder
    { label: 'Logout', icon: 'logout', route: '/(auth)/login' },
  ];

  const handleItemPress = (route: any) => {
    toggleMenu();
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.menuContainer, menuStyle]}>
        {menuItems.map((item, index) => (
          <Pressable 
            key={index} 
            style={styles.menuItem}
            onPress={() => handleItemPress(item.route)}
          >
            <ThemedText style={styles.menuLabel}>{item.label}</ThemedText>
            <View style={[styles.iconCircle, { backgroundColor: theme.background }]}>
              <MaterialIcons name={item.icon as any} size={20} color={theme.primary} />
            </View>
          </Pressable>
        ))}
      </Animated.View>

      <Pressable onPress={toggleMenu}>
        <Animated.View style={[styles.fab, fabStyle, { borderColor: theme.border }]}>
          <MaterialIcons 
            name={isOpen ? 'close' : 'menu'} 
            size={28} 
            color={isOpen ? '#FFF' : theme.text} 
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100, // Above the dock
    right: 20,
    alignItems: 'flex-end',
    zIndex: 100,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    // Brutalist shadow
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  menuContainer: {
    marginBottom: 16,
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  menuLabel: {
    backgroundColor: '#000',
    color: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontFamily: 'Outfit_900Black',
    textTransform: 'uppercase',
    fontSize: 12,
  }
});
