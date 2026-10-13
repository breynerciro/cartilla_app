import React, { useRef } from 'react';
import { StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

// Lado (cuadrado) del boton. Las pantallas con Back flotante lo usan para reservar
// espacio al final del scroll.
export const BACK_BUTTON_SIZE = 82;

interface BackButtonProps {
  onPress: () => void;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress, label = 'Volver' }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.88,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Animated.View style={[
        styles.container,
        { transform: [{ scale: scaleAnim }] }
      ]}>
        <Ionicons 
          name="play"
          size={BACK_BUTTON_SIZE} 
          color={Colors.lavender} 
          style={[styles.borderLayer, { transform: [{ rotate: '180deg' }] }]}
        />
        <Ionicons 
          name="play"
          size={BACK_BUTTON_SIZE} 
          color={Colors.navy} 
          style={[styles.frontLayer, { transform: [{ rotate: '180deg' }] }]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: BACK_BUTTON_SIZE,
    height: BACK_BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderLayer: {
    position: 'absolute',
    top: 4,
    left: 2, // Sombra hacia la derecha (hacia el centro)
  },
  frontLayer: {
    position: 'absolute',
    top: 0,
    left: -2, // Frente hacia la izquierda
  }
});
