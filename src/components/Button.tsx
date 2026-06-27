import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  variant?: 'primary' | 'secondary' | 'dark' | 'outline';
}

export const Button = ({ title, onPress, style, textStyle, variant = 'primary' }: ButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':   return Colors.blue;
      case 'secondary': return Colors.lavender;
      case 'dark':      return Colors.navy;
      case 'outline':   return 'transparent';
      default:          return Colors.blue;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'outline': return Colors.navy;
      default:        return Colors.white;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: variant === 'outline' ? Colors.navy : 'rgba(255,255,255,0.15)',
            borderWidth: variant === 'outline' ? 2 : 1.5,
            transform: [{ scale: scaleAnim }],
          },
          style,
        ]}
      >
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  text: {
    fontFamily: Typography.fonts.unkempt,
    fontSize: Typography.sizes.title,
    lineHeight: Typography.sizes.title * 1.1,
  },
});
