import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Dimensions, ScrollView, TouchableWithoutFeedback } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '../themed-text';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface MenuItemProps {
  item: { label: string; icon: string; route: string; color: string };
  index: number;
  isOpen: boolean;
  onPress: (route: string) => void;
}

function MenuItem({ item, index, isOpen, onPress }: MenuItemProps) {
  const animatedStyle = useAnimatedStyle(() => {
    // Fast snappy delay (40ms interval)
    const delay = index * 40;
    
    return {
      opacity: withDelay(
        delay,
        withTiming(isOpen ? 1 : 0, { duration: 200 })
      ),
      transform: [
        {
          translateX: withDelay(
            delay,
            withTiming(isOpen ? 0 : 20, { duration: 200 })
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={styles.pillButton}
        onPress={() => onPress(item.route)}
      >
        <MaterialIcons name={item.icon as any} size={22} color={item.color} />
        <ThemedText style={[styles.pillLabel, item.label === 'Déconnexion' && { color: '#FF2E63' }]}>
          {item.label}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

export function MobileMenuFAB() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [isOpen, setIsOpen] = useState(false);

  const animation = useSharedValue(0);

  const toggleMenu = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    animation.value = withTiming(nextState ? 1 : 0, { duration: 300 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(animation.value, { duration: 300 }),
      pointerEvents: isOpen ? 'auto' : 'none',
    };
  });

  const fabStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: animation.value > 0.5 ? '#FF2E63' : (colorScheme === 'dark' ? '#222' : '#FFF'),
      transform: [
        { rotate: `${animation.value * 90}deg` },
        { scale: withTiming(isOpen ? 1.1 : 1, { duration: 200 }) }
      ],
    };
  });

  const menuStyle = useAnimatedStyle(() => {
    return {
      opacity: animation.value,
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

  const handleItemPress = (route: string) => {
    toggleMenu();
    router.push(route as any);
  };

  return (
    <>
      <Animated.View style={[styles.fullScreenOverlay, overlayStyle]}>
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <BlurView 
            intensity={60} 
            tint={colorScheme === 'dark' ? 'dark' : 'light'} 
            style={StyleSheet.absoluteFill} 
          />
        </TouchableWithoutFeedback>
      </Animated.View>

      <View style={styles.container}>
        <Animated.View style={[styles.menuWrapper, menuStyle]}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContent}
            style={{ maxHeight: SCREEN_HEIGHT * 0.6 }}
          >
            {menuItems.map((item, index) => (
              <MenuItem 
                key={index}
                item={item}
                index={index}
                isOpen={isOpen}
                onPress={handleItemPress}
              />
            ))}
          </ScrollView>
          
          <Animated.View style={[styles.scrollHint, { opacity: animation.value }]}>
            <MaterialIcons name="keyboard-double-arrow-down" size={24} color={theme.textDim} />
            <ThemedText style={styles.scrollText}>SCROLL</ThemedText>
          </Animated.View>
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
    </>
  );
}

const styles = StyleSheet.create({
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 900,
  },
  container: {
    position: 'absolute',
    bottom: 110, // Slight adjustment for spacing
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
    alignItems: 'flex-end',
  },
  scrollContent: {
    gap: 10,
    paddingBottom: 20,
    alignItems: 'flex-end',
    paddingRight: 15,
  },
  scrollHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 20,
    marginTop: 8,
    opacity: 0.6,
  },
  scrollText: {
    fontSize: 10,
    fontFamily: 'Outfit_900Black',
    letterSpacing: 1,
  },
  pillButton: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    gap: 12,
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
