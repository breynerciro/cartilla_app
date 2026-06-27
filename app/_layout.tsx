import { Stack } from 'expo-router';
import {
  useFonts,
  UbuntuSans_400Regular,
  UbuntuSans_700Bold,
} from '@expo-google-fonts/ubuntu-sans';
import {
  Unkempt_400Regular,
  Unkempt_700Bold,
} from '@expo-google-fonts/unkempt';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../src/theme/colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Ubuntu Sans — font1 / ubuntuSans
    UbuntuSans_400Regular,
    UbuntuSans_700Bold,
    // Unkempt — font2 / unkempt
    Unkempt_400Regular,
    Unkempt_700Bold,
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
        <Stack.Screen name="age-selector" />
        <Stack.Screen name="age/[group]" />
      </Stack>
    </>
  );
}
