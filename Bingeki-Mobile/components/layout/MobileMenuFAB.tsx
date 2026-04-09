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
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '../themed-text';
import { IconSymbol } from '../ui/icon-symbol';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface MenuItemProps {
  item: { label: string; icon: any; route: string; color?: string };
  index: number;
  isOpen: boolean;
  onPress: (route: string) => void;
}

function MenuItem({ item, index, isOpen, onPress }: MenuItemProps) {
  const primaryPink = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const surfaceColor = useThemeColor({}, 'surface');
  
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
        style={[styles.pillButton, { backgroundColor: surfaceColor }]}
        onPress={() => onPress(item.route)}
      >
        <IconSymbol name={item.icon} size={22} color={item.color || primaryPink} />
        <ThemedText style={[styles.pillLabel, { color: textColor }, item.label === 'Déconnexion' && { color: primaryPink }]}>
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
  const primaryPink = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
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
      backgroundColor: animation.value > 0.5 ? primaryPink : surfaceColor,
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
    { label: 'Déconnexion', icon: 'logout', route: '/(auth)/login' },
    { label: 'Mes Tickets', icon: 'ticket.fill', route: '/social' },
    { label: 'Mon Profil', icon: 'person.fill', route: '/profile' },
    { label: 'Paramètres', icon: 'settings', route: '/profile' },
    { label: 'Donner un avis', icon: 'star.fill', route: '/social' },
    { label: 'ANIME LENS', icon: 'camera.viewfinder', route: '/' },
    { label: 'Actualités Anime', icon: 'newspaper.fill', route: '/' },
    { label: 'CHANGELOG', icon: 'history', route: '/' },
    { label: 'AGENDA', icon: 'calendar', route: '/' },
    { label: 'COMMUNAUTÉ', icon: 'person.2.fill', route: '/social' },
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
                item={item as any}
                index={index}
                isOpen={isOpen}
                onPress={handleItemPress}
              />
            ))}
          </ScrollView>
          
          <Animated.View style={[styles.scrollHint, { opacity: animation.value }]}>
            <IconSymbol name="chevron.double.down" size={24} color={theme.textDim} />
            <ThemedText style={styles.scrollText}>DÉFILER</ThemedText>
          </Animated.View>
        </Animated.View>

        <Pressable onPress={toggleMenu} style={[styles.fabWrapper, { shadowColor: '#000' }]}>
          <Animated.View style={[styles.fab, fabStyle, { borderColor: '#000' }]}>
            <IconSymbol
              name={isOpen ? 'xmark' : 'line.3.horizontal'}
              size={32}
              color={isOpen ? '#FFF' : textColor}
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
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    textTransform: 'uppercase',
  }
});
