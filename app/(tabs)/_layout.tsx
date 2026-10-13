import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router/js-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';

// Al abrir un deep link (p. ej. /calendar desde una notificación) la pila de retroceso
// debe incluir las pestañas para poder volver. La Guía es la pestaña raíz.
export const unstable_settings = {
  initialRouteName: '(guia)',
};

type IconName = keyof typeof Ionicons.glyphMap;

// Alto de la barra sin el inset inferior: píldora 28 + etiqueta + aire. Con el ancho
// de cada pestaña (1/4 de pantalla) el objetivo táctil queda muy por encima de 48 dp.
const TAB_BAR_HEIGHT = 64;
const PILL_WIDTH = 56;
const PILL_HEIGHT = 28;

// Activa: píldora detrás del ícono relleno. Inactiva: ícono outline sin fondo.
// Emergencia va siempre en rojo (también inactiva) y activa lleva la píldora roja sólida.
const TabIcon = ({
  focused,
  icon,
  danger = false,
}: {
  focused: boolean;
  icon: IconName;
  danger?: boolean;
}) => {
  const name = (focused ? icon : `${icon}-outline`) as IconName;
  const color = danger
    ? focused ? Colors.onPrimary : Colors.danger
    : focused ? Colors.primary : Colors.textSecondary;
  const pillColor = danger ? Colors.danger : Colors.primaryTint;

  return (
    <View style={[styles.pill, focused && { backgroundColor: pillColor }]}>
      <Ionicons name={name} size={22} color={color} />
    </View>
  );
};

const TabLabel = ({
  focused,
  label,
  danger = false,
}: {
  focused: boolean;
  label: string;
  danger?: boolean;
}) => (
  <Text
    style={[
      styles.label,
      focused ? styles.labelActive : styles.labelInactive,
      danger && styles.labelDanger,
    ]}
    numberOfLines={1}
    maxFontSizeMultiplier={Typography.maxFontScale}
  >
    {label}
  </Text>
);

// Opciones de una pestaña: ícono, etiqueta y nombre para TalkBack/VoiceOver. El
// estado seleccionado lo anuncia la barra (aria-selected en cada pestaña).
const tabOptions = (label: string, accessibilityLabel: string, icon: IconName, danger = false) => ({
  title: label,
  tabBarAccessibilityLabel: accessibilityLabel,
  tabBarIcon: ({ focused }: { focused: boolean }) => (
    <TabIcon focused={focused} icon={icon} danger={danger} />
  ),
  tabBarLabel: ({ focused }: { focused: boolean }) => (
    <TabLabel focused={focused} label={label} danger={danger} />
  ),
});

// Cada pestaña con contenido propio (Guía, Citas, Cepillado) es una pila anidada:
// las pantallas que se abren desde ella conservan la barra de pestañas.
export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      initialRouteName="(guia)"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          // Con alto propio la barra no suma el inset sola: se agrega aquí para que la
          // navegación por gestos de Android (y el indicador de iOS) no tape las pestañas.
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarItemStyle: styles.item,
        tabBarIconStyle: styles.iconSlot,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen name="(guia)" options={tabOptions('Guía', 'Guía por edades', 'book')} />
      <Tabs.Screen name="calendar" options={tabOptions('Citas', 'Calendario de citas', 'calendar')} />
      <Tabs.Screen name="timer" options={tabOptions('Cepillado', 'Temporizador de cepillado', 'timer')} />
      <Tabs.Screen
        name="emergencia"
        options={tabOptions('Emergencia', 'Contactos de emergencia', 'medkit', true)}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // El botón de la pestaña ya trae padding 5 y alinea arriba: 6 + 5 + píldora 28 +
  // 4 + etiqueta 16 = 59, dentro de los 64 de la barra.
  item: {
    paddingTop: 6,
  },
  // La ranura del ícono mide lo mismo que la píldora para que no se recorte.
  iconSlot: {
    width: PILL_WIDTH,
    height: PILL_HEIGHT,
  },
  pill: {
    width: PILL_WIDTH,
    height: PILL_HEIGHT,
    borderRadius: PILL_HEIGHT / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  // Solo hay Ubuntu Sans 400 y 700 cargadas: la activa usa la 700 (el 600 pedido no
  // existe y Android no sintetiza pesos de fuentes propias).
  labelActive: {
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.navy,
  },
  labelInactive: {
    fontFamily: Typography.fonts.ubuntu,
    color: Colors.textSecondary,
  },
  labelDanger: {
    color: Colors.danger,
  },
});
