import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView, Edges } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../theme/colors';
import { screenPadding } from '../theme/spacing';

interface ScreenProps {
  children: React.ReactNode;
  backgroundColor?: string;
  // Margen horizontal de pantalla (screenPadding). Se suma a los insets laterales.
  padded?: boolean;
  // 'dark' = iconos oscuros, para fondos claros; 'light' para fondos oscuros.
  statusBarStyle?: 'dark' | 'light';
  // Por defecto respeta los cuatro bordes seguros.
  edges?: Edges;
  style?: StyleProp<ViewStyle>;
}

// Contenedor base de pantalla: área segura, fondo y barra de estado.
// `style` va sobre el SafeAreaView, así que sirve para layout del contenido
// (p. ej. justifyContent: 'space-between').
export const Screen = ({
  children,
  backgroundColor = Colors.surface,
  padded = false,
  statusBarStyle = 'dark',
  edges,
  style,
}: ScreenProps) => {
  return (
    <SafeAreaView
      edges={edges}
      style={[styles.container, { backgroundColor }, padded && styles.padded, style]}
    >
      <StatusBar style={statusBarStyle} />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: screenPadding,
  },
});
