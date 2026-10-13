import { Stack, useRootNavigationState, useRouter } from 'expo-router';
import {
  useFonts,
  UbuntuSans_400Regular,
  UbuntuSans_700Bold,
} from '@expo-google-fonts/ubuntu-sans';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../src/theme/colors';
import {
  addNotificationResponseListener,
  consumeInitialNotificationResponse,
} from '../src/services/notifications';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Los deep links (p. ej. una notificación) se abren con las pestañas como raíz, para
// que el botón atrás regrese a la navegación principal en vez de salir de la app.
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Ubuntu Sans
    UbuntuSans_400Regular,
    UbuntuSans_700Bold,
  });
  const router = useRouter();
  // El Stack raíz no existe mientras cargan las fuentes; antes de eso no se puede navegar.
  const navigationReady = !!useRootNavigationState()?.key;

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Al tocar una notificación (o abrir la app desde una) se lleva a la pestaña Citas.
  // navigate (no push): /calendar es una pestaña y solo hay que enfocarla. Espera a que
  // la navegación esté montada para que el arranque en frío no se pierda.
  useEffect(() => {
    if (!navigationReady) return;

    const goToCalendar = () => {
      try {
        router.navigate('/calendar');
      } catch (e) {
        console.log('No se pudo navegar desde la notificación:', e);
      }
    };

    const unsubscribe = addNotificationResponseListener(goToCalendar);
    consumeInitialNotificationResponse().then((openedFromNotification) => {
      if (openedFromNotification) goToCalendar();
    });

    return unsubscribe;
  }, [navigationReady]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      {/* Iconos oscuros por defecto: casi todas las pantallas son blancas. Cada <Screen> declara el suyo. */}
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          // Mismo fondo que Screen (blanco) en todos los Stack; la intro pone su propio navy.
          contentStyle: { backgroundColor: Colors.surface },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="intro" />
        <Stack.Screen name="onboarding" />
        {/* Guía (con glosario y temas), Citas y Cepillado viven dentro de las pestañas. */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
