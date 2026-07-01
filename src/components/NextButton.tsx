import React, { useRef } from 'react';
import { StyleSheet, Pressable, Animated, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface NextButtonProps {
  onPress: () => void;
  isLast?: boolean;
}

export const NextButton: React.FC<NextButtonProps> = ({ onPress, isLast = false }) => {
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
    >
      <Animated.View style={[
        styles.container,
        { transform: [{ scale: scaleAnim }] }
      ]}>
        {/* Layer decorativo trasero (sombra/borde lavanda) */}
        <Ionicons 
          name={isLast ? "checkmark-circle" : "play"}
          size={82} 
          color={Colors.lavender} 
          style={styles.borderLayer}
        />
        
        {/* Layer frontal interactivo (navy) */}
        <Ionicons 
          name={isLast ? "checkmark-circle" : "play"}
          size={82} 
          color={Colors.navy} 
          style={styles.frontLayer}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 82,
    height: 82, // Usamos un contenedor cuadrado para el ícono
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderLayer: {
    position: 'absolute',
    top: 4,
    left: -2, // Offset para simular el borde tridimensional inferior-izquierdo
  },
  frontLayer: {
    position: 'absolute',
    top: 0,
    left: 2, // Ajuste para centrar respecto a la sombra
  }
});
