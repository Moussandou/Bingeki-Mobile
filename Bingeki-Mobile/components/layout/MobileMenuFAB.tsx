import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Dimensions, ScrollView } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '../themed-text';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
      damping: 18,
      stiffness: 90,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const fabStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: animation.value > 0.5 ? '#FF2E63' : (colorScheme === 'dark' ? '#222' : '#FFF'),
      transform: [
        { rotate: `${animation.value * 90}deg` },
        { scale: withSpring(isOpen ? 1.1 : 1) }
      ],
    };
  });

  const menuStyle = useAnimatedStyle(() => {
    return {
      opacity: animation.value,
      transform: [
        { translateY: interpolate(animation.value, [0, 1], [30, 0]) },
      ],
      pointerEvents: isOpen ? 'auto' : 'none',
    };
  });

  const menuItems = [
    { label: 'Déconnexion', icon: 'exit-to-app', route: '/(auth)/login', color: '#FF2E63' },
    { label: 'Mes Tickets', icon: 'confirmation-number', route: '/social', color: '#FF2E63' },
    { label: 'Mon Profil', icon: 'person-outline', route: '/profile', color: '#FF2E63' },
    { label: 'Paramètres', icon: 'settings', route: '/profile', color: '#FF2E63' },
    { label: 'Donner un avis', icon: 'rate-review', route: '/social', color: '#FF2E63' },
    { label: 'ANIME LENS', icon: 'filter-center-focus', route: '/', color: '#FF2E63' },
    { label: 'Anime News', icon: 'article', route: '/', color: '#FF2E63' },
    { label: 'CHANGELOG', icon: 'history', route: '/', color: '#FF2E63' },
    { label: 'AGENDA', icon: 'calendar-today', route: '/', color: '#FF2E63' },
    { label: 'COMMUNAUTÉ', icon: 'people-outline', route: '/social', color: '#FF2E63' },
  ];

  const handleItemPress = (route: any) => {
    toggleMenu();
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.menuWrapper, menuStyle]}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          style={{ maxHeight: SCREEN_HEIGHT * 0.6 }}
        >
          {menuItems.map((item, index) => (
            <Pressable 
              key={index} 
              style={styles.pillButton}
              onPress={() => handleItemPress(item.route)}
            >
              <MaterialIcons name={item.icon as any} size={22} color={item.color} />
              <ThemedText style={[styles.pillLabel, item.label === 'Déconnexion' && { color: '#FF2E63' }]}>
                {item.label}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      <Pressable onPress={toggleMenu} style={styles.fabWrapper}>
        <Animated.View style={[styles.fab, fabStyle]}>
          <MaterialIcons 
            name={isOpen ? 'close' : 'menu'} 
            size={32} 
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
    bottom: 40,
    right: 20,
    alignItems: 'flex-end',
    zIndex: 1000,
  },
  fabWrapper: {
    borderRadius: 35,
    // Solid brutalist shadow
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  fab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
  },
  menuWrapper: {
    marginBottom: 20,
    width: 240,
  },
  scrollContent: {
    gap: 10,
    paddingBottom: 10,
    alignItems: 'flex-end',
  },
  pillButton: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    gap: 12,
    width: '100%',
    borderWidth: 2,
    borderColor: '#000',
    // Solid shadow for the pills
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
  },
  pillLabel: {
    color: '#333',
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    textTransform: 'uppercase',
  }
});
