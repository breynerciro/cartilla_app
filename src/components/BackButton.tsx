import React, { useRef } from 'react';
import { StyleSheet, Pressable, Animated, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface BackButtonProps {
  onPress: () => void;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress }) => {
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
        <Ionicons 
          name="play"
          size={82} 
          color={Colors.lavender} 
          style={[styles.borderLayer, { transform: [{ rotate: '180deg' }] }]}
        />
        <Ionicons 
          name="play"
          size={82} 
          color={Colors.navy} 
          style={[styles.frontLayer, { transform: [{ rotate: '180deg' }] }]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 82,
    height: 82,
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
