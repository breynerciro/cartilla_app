import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius } from '../theme/radius';
import { Shadows } from '../theme/shadows';
import { Spacing } from '../theme/spacing';

type NavyCardSize = 'lg' | 'md' | 'sm';

interface NavyCardProps extends ViewProps {
  size?: NavyCardSize;
}

// Tarjeta navy. Unifica seis implementaciones (radio, padding vertical/horizontal):
//   lg 32, 32/24: onboarding, age/[group]/index
//   md 32, 24/20: SlidesRunner
//   sm 24, 16/16: main-menu y BrushingTimer (20, 14/16: radio +4, padding +2)
// InfoCard (24, 32) no se usa y no tiene variante. Todas comparten Shadows.lg.
// El layout (width, flex, margen) lo pone quien la usa con `style`.
export const NavyCard = ({ size = 'lg', style, children, ...rest }: NavyCardProps) => {
  return (
    <View {...rest} style={[styles.base, styles[size], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.navy,
    ...Shadows.lg,
  },
  lg: {
    borderRadius: Radius.xxl,
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xxl,
  },
  md: {
    borderRadius: Radius.xxl,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  sm: {
    borderRadius: Radius.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
});
