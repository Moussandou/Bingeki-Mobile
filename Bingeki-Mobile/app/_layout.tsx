/**
 * Root layout component
 * Handles global providers, font loading, and splash screen
 */
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useFonts, Outfit_700Bold, Outfit_900Black } from '@expo-google-fonts/outfit';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthSync } from '@/hooks/useAuthSync';
import { useFirestoreSync } from '@/hooks/useFirestoreSync';

import { useSegments, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  
  // Auth state
  const { user, loading: authLoading } = useAuthStore();
  
  // Initialize Firebase sync hooks
  useAuthSync();
  useFirestoreSync();

  const [loaded, error] = useFonts({
    Outfit_700Bold,
    Outfit_900Black,
    Inter_400Regular,
    Inter_700Bold,
  });

  // Redirection Logic
  useEffect(() => {
    if (authLoading || !loaded) return;

    // const inAuthGroup = segments[0] === '(auth)';

    // if (!user && !inAuthGroup) {
    //   // Not logged in, redirect to login
    //   router.replace('/(auth)/login');
    // } else if (user && inAuthGroup) {
    //   // Logged in, redirect to tabs
    //   router.replace('/(tabs)');
    // }
  }, [user, authLoading, segments, loaded]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="details/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

