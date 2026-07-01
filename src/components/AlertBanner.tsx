import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Ionicons } from '@expo/vector-icons';

interface AlertBannerProps {
  message: string;
  type?: 'warning' | 'info' | 'danger';
}

export const AlertBanner = ({ message, type = 'warning' }: AlertBannerProps) => {
  const getBackgroundColor = () => {
    switch (type) {
      case 'danger': return '#FFE5E5';
      case 'warning': return '#FFF3CD';
      case 'info': return Colors.background.secondary;
      default: return Colors.background.secondary;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'danger': return '#FF4444';
      case 'warning': return '#FFAA00';
      case 'info': return Colors.blue3;
      default: return Colors.blue3;
    }
  };

  const getIconName = () => {
    switch (type) {
      case 'danger': return 'warning';
      case 'warning': return 'alert-circle';
      case 'info': return 'information-circle';
      default: return 'information-circle';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <Ionicons name={getIconName()} size={28} color={getIconColor()} style={styles.icon} />
      <Text style={[styles.text, { color: getIconColor() }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginVertical: 12,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    flex: 1,
    fontFamily: Typography.fonts.ubuntu,
    fontSize: Typography.sizes.base,
    lineHeight: 22,
  }
});
