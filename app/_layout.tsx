import { Stack } from 'expo-router';
import {
  useFonts,
  UbuntuSans_400Regular,
  UbuntuSans_700Bold,
} from '@expo-google-fonts/ubuntu-sans';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../src/theme/colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Ubuntu Sans
    UbuntuSans_400Regular,
    UbuntuSans_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" backgroundColor={Colors.navy} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.navy },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="intro" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="knowledge-hub" />
        <Stack.Screen name="glossary" />
        <Stack.Screen name="age-selector" />
        <Stack.Screen name="main-menu" />
        <Stack.Screen name="calendar" />
        <Stack.Screen name="emergency" />
        <Stack.Screen name="age/[group]" />
      </Stack>
    </>
  );
}
