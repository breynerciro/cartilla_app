import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface AgeGroupHeaderProps {
  title: string;
  subtitle?: string;
}

export const AgeGroupHeader = ({ title, subtitle }: AgeGroupHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>{subtitle || "Recomendaciones para"}</Text>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: Colors.blue1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  subtitle: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: Typography.sizes.base,
    color: Colors.blue2,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontFamily: Typography.fonts.unkempt,
    fontSize: Typography.sizes.heading,
    color: Colors.white,
  },
  line: {
    width: 60,
    height: 4,
    backgroundColor: Colors.blue3,
    borderRadius: 2,
    marginTop: 16,
  }
});
