import React, { useRef } from 'react';
import { StyleSheet, Pressable, Animated } from 'react-native';
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
        styles.button, 
        isLast && styles.buttonLast,
        { transform: [{ scale: scaleAnim }] }
      ]}>
        <Ionicons 
          name={isLast ? "checkmark" : "arrow-forward"} 
          size={32} 
          color={Colors.white} 
          style={!isLast ? { marginLeft: 2 } : undefined}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 64,
    height: 64,
    borderRadius: 32, // Circular
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8, // Sombra rica en Android
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)', // Reflejo sutil
  },
  buttonLast: {
    backgroundColor: Colors.blue,
    shadowColor: Colors.blue,
  }
});
