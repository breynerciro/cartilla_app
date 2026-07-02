import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface QuadrantIndicatorProps {
  activeQuadrant: number; // 0: UR, 1: UL, 2: LR, 3: LL
}

export const QuadrantIndicator: React.FC<QuadrantIndicatorProps> = ({ activeQuadrant }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.quadrant, styles.topLeft, activeQuadrant === 1 && { backgroundColor: Colors.timer.quadrant2 }]} />
        <View style={[styles.quadrant, styles.topRight, activeQuadrant === 0 && { backgroundColor: Colors.timer.quadrant1 }]} />
      </View>
      <View style={styles.row}>
        <View style={[styles.quadrant, styles.bottomLeft, activeQuadrant === 3 && { backgroundColor: Colors.timer.quadrant4 }]} />
        <View style={[styles.quadrant, styles.bottomRight, activeQuadrant === 2 && { backgroundColor: Colors.timer.quadrant3 }]} />
      </View>
    </View>
  );
};

const QSIZE = 64; // Tamaño compacto

const styles = StyleSheet.create({
  container: {
    width: QSIZE,
    height: QSIZE,
    gap: 2, // Representa la cruz divisoria
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 2,
  },
  quadrant: {
    flex: 1,
    backgroundColor: '#EAEAEA',
  },
  topLeft: { borderTopLeftRadius: QSIZE / 2 },
  topRight: { borderTopRightRadius: QSIZE / 2 },
  bottomLeft: { borderBottomLeftRadius: QSIZE / 2 },
  bottomRight: { borderBottomRightRadius: QSIZE / 2 },
});
