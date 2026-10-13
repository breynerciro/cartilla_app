import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Radius } from '../theme/radius';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';
import { NavyCard } from './NavyCard';

interface MenuCardProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

// Tarjeta de menú reutilizable (acceso al Glosario en la Guía). Mismo patrón visual que el antiguo
// main-menu: tile de icono 56, título en bold y subtítulo en el color del tile.
export const MenuCard = ({ title, subtitle, icon, color, onPress }: MenuCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
    >
      <NavyCard size="sm" style={styles.card}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}33` }]}>
          <Ionicons name={icon} size={36} color={color} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={[styles.cardSubtitle, { color }]}>{subtitle}</Text>
        </View>

        <Ionicons name="chevron-forward" size={24} color={Colors.lavender} />
      </NavyCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    ...Typography.scale.bodyLarge,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    ...Typography.scale.label,
    fontFamily: Typography.fonts.ubuntu,
  },
});
