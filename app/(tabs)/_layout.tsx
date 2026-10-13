import React from 'react';
import { Tabs } from 'expo-router/js-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';

// Al abrir un deep link (p. ej. /calendar desde una notificación) la pila de retroceso
// debe incluir las pestañas para poder volver. La Guía es la pestaña raíz.
export const unstable_settings = {
  initialRouteName: '(guia)',
};

// Cada pestaña con contenido propio (Guía, Citas, Cepillado) es una pila anidada:
// las pantallas que se abren desde ella conservan la barra de pestañas.
export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="(guia)"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: Typography.fonts.ubuntuBold,
          fontSize: 12,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="(guia)"
        options={{
          title: 'Guía',
          tabBarAccessibilityLabel: 'Guía por edades',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Citas',
          tabBarAccessibilityLabel: 'Calendario de citas',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Cepillado',
          tabBarAccessibilityLabel: 'Temporizador de cepillado',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'timer' : 'timer-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="emergencia"
        options={{
          title: 'Emergencia',
          tabBarAccessibilityLabel: 'Contactos de emergencia',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'medkit' : 'medkit-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
