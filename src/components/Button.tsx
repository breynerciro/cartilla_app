import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius } from '../theme/radius';
import { Shadows } from '../theme/shadows';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  variant?: 'primary' | 'secondary' | 'dark' | 'outline' | 'light';
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
      case 'light':     return Colors.white;
      default:          return Colors.blue;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'outline': return Colors.navy;
      case 'light':   return Colors.navy;
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
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.huge,
    borderRadius: Radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  text: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: Typography.sizes.title - 2,
    lineHeight: (Typography.sizes.title - 2) * 1.2,
  },
});
