import React from 'react';
import { Tabs } from 'expo-router/js-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';

// Al abrir un deep link (p. ej. desde una notificación) la pila de retroceso debe
// incluir las pestañas para poder volver. 'inicio' es la pestaña raíz.
export const unstable_settings = {
  initialRouteName: 'inicio',
};

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="inicio"
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
        name="inicio"
        options={{
          title: 'Inicio',
          tabBarAccessibilityLabel: 'Inicio',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="guia"
        options={{
          title: 'Guía',
          tabBarAccessibilityLabel: 'Guía por edades',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="emergencia"
        options={{
          title: 'Emergencia',
          tabBarAccessibilityLabel: 'Contactos de emergencia',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'call' : 'call-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mas"
        options={{
          title: 'Más',
          tabBarAccessibilityLabel: 'Más opciones',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'ellipsis-horizontal-circle' : 'ellipsis-horizontal-circle-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
