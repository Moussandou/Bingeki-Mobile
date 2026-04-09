import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Dimensions, ScrollView, TouchableWithoutFeedback, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  FadeIn,
  FadeOut,
  FadeInDown,
  FadeOutDown,
  FadeInRight,
  FadeOutRight
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Fonts, Borders, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '../themed-text';
import { IconSymbol } from '../ui/icon-symbol';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MobileMenuFAB() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const primaryPink = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const borderHeavyColor = useThemeColor({}, 'borderHeavy');

  const [isOpen, setIsOpen] = useState(false);
  const animation = useSharedValue(0);

  const toggleMenu = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    animation.value = withSpring(nextState ? 1 : 0, { damping: 15 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: withTiming(animation.value, { duration: 200 }),
    pointerEvents: isOpen ? 'auto' : 'none',
  }));

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${animation.value * 90}deg` },
      { scale: withSpring(isOpen ? 1.1 : 1) }
    ],
  }));

  const menuItems = [
    { label: 'Déconnexion', icon: 'logout', route: '/(auth)/login' },
    { label: 'Mes tickets', icon: 'ticket.fill', route: '/discover' },
    { label: 'Mon profil', icon: 'person.fill', route: '/profile' },
    { label: 'Paramètres', icon: 'settings', route: '/profile' },
    { label: 'Donner un avis', icon: 'star.fill', route: '/discover' },
    { label: 'Anime lens', icon: 'camera.viewfinder', route: '/' },
    { label: 'Actualités anime', icon: 'newspaper.fill', route: '/' },
    { label: 'Changelog', icon: 'history', route: '/' },
    { label: 'Agenda', icon: 'calendar', route: '/' },
    { label: 'Communauté', icon: 'person.2.fill', route: '/discover' },
  ];

  const formatLabel = (label: string) => {
    return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  };

  const handleItemPress = (route: string) => {
    setIsOpen(false);
    animation.value = withTiming(0);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  return (
    <>
      {/* Blur Overlay Backdrop */}
      <Animated.View style={[styles.fullScreenOverlay, overlayStyle]}>
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <BlurView 
            intensity={40} 
            tint={colorScheme === 'dark' ? 'dark' : 'light'} 
            style={StyleSheet.absoluteFill} 
          />
        </TouchableWithoutFeedback>
      </Animated.View>

      <View style={styles.container} pointerEvents="box-none">
        {/* Menu Wrapper (Staggered items) */}
        <View style={styles.menuWrapper} pointerEvents="box-none">
          {isOpen && (
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              style={{ maxHeight: SCREEN_HEIGHT * 0.6 }}
            >
              {menuItems.map((item, index) => (
                <Animated.View
                  key={item.label}
                  entering={FadeInRight.delay(index * 40).springify().damping(12)}
                  exiting={FadeOutRight.duration(150)}
                >
                  <Pressable 
                    onPress={() => handleItemPress(item.route)}
                    style={({ pressed }) => [
                      styles.pillButton,
                      { 
                        backgroundColor: surfaceColor,
                        borderColor: borderHeavyColor,
                        // Custom sharp shadow implementation
                        shadowColor: pressed ? primaryPink : '#000',
                        shadowOffset: { width: 4, height: 4 },
                        shadowOpacity: 1,
                        shadowRadius: 0,
                      }
                    ]}
                  >
                    <IconSymbol name={item.icon as any} size={20} color={item.label === 'Déconnexion' ? primaryPink : textColor} />
                    <ThemedText style={[styles.pillLabel, { color: item.label === 'Déconnexion' ? primaryPink : textColor }]}>
                      {formatLabel(item.label)}
                    </ThemedText>
                  </Pressable>
                </Animated.View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* FAB Button */}
        <Pressable onPress={toggleMenu} style={styles.fabWrapper}>
          <Animated.View 
            style={[
              styles.fab, 
              { 
                backgroundColor: isOpen ? primaryPink : surfaceColor,
                borderColor: isOpen ? primaryPink : borderHeavyColor,
              },
              fabAnimatedStyle
            ]}
          >
            <IconSymbol 
              name={isOpen ? 'xmark' : 'line.3.horizontal'} 
              size={30} 
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
    ...StyleSheet.absoluteFillObject,
    zIndex: 900,
  },
  container: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    alignItems: 'flex-end',
    zIndex: 1000,
  },
  menuWrapper: {
    marginBottom: 20,
    width: SCREEN_WIDTH * 0.7,
  },
  scrollContent: {
    alignItems: 'flex-end',
    gap: 12,
    paddingRight: 5,
    paddingBottom: 10,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 2, // Specification: 2px
    gap: 12,
    elevation: 4,
  },
  pillLabel: {
    fontFamily: Fonts.headingBold,
    fontSize: 16,
  },
  fabWrapper: {
    // Sharp shadow for FAB
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  fab: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 3, // Specification: 3px
    justifyContent: 'center',
    alignItems: 'center',
  },
});
