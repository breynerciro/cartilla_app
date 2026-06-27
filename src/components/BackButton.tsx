import React, { useRef } from 'react';
import { StyleSheet, Pressable, Animated, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface BackButtonProps {
  onPress: () => void;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress, label = "Volver" }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
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
      <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim }] }]}>
        <Ionicons name="arrow-back" size={24} color={Colors.navy} />
        <Text style={styles.text}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    gap: 6,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 14, 85, 0.1)', // Borde sutil navy
  },
  text: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 16,
    color: Colors.navy,
  },
});
