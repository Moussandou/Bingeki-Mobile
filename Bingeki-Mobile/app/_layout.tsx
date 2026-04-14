/**
 * Root layout component
 * Global providers, background system, and navigation stacks
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
import { BackgroundSystem } from '@/components/layout/BackgroundSystem';
import { useAuthStore } from '@/store/authStore';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { authLoading } = useAuthStore();
  
  useAuthSync();
  useFirestoreSync();

  const [loaded, error] = useFonts({
    Outfit_700Bold,
    Outfit_900Black,
    Inter_400Regular,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <BackgroundSystem>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: 'transparent' },
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="details/[id]" />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </BackgroundSystem>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
