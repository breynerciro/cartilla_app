import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface InfoCardProps {
  text: string;
}

export const InfoCard = ({ text }: InfoCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.blue1,
    borderRadius: 24,
    padding: 32,
    width: '100%',
    shadowColor: Colors.blue1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  cardText: {
    fontFamily: Typography.fonts.font1,
    fontSize: Typography.sizes.subtitle,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 30,
  },
});
