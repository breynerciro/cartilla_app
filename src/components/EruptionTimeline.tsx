import React from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface TimelineEvent {
  id: string;
  months: string;
  startMonth: number;
  teeth: {
    name: string;
    arch: 'Superior' | 'Inferior';
    color: string;
  }[];
}

const timelineData: TimelineEvent[] = [
  {
    id: '1',
    months: '6 - 10 meses',
    startMonth: 6,
    teeth: [{ name: 'Incisivo Central', arch: 'Inferior', color: '#F48FB1' }],
  },
  {
    id: '2',
    months: '8 - 12 meses',
    startMonth: 8,
    teeth: [{ name: 'Incisivo Central', arch: 'Superior', color: '#F48FB1' }],
  },
  {
    id: '3',
    months: '9 - 13 meses',
    startMonth: 9,
    teeth: [{ name: 'Incisivo Lateral', arch: 'Superior', color: '#FFCA28' }],
  },
  {
    id: '4',
    months: '10 - 16 meses',
    startMonth: 10,
    teeth: [{ name: 'Incisivo Lateral', arch: 'Inferior', color: '#FFCA28' }],
  },
  {
    id: '5',
    months: '13 - 19 meses',
    startMonth: 13,
    teeth: [{ name: 'Primer Molar', arch: 'Superior', color: '#64B5F6' }],
  },
  {
    id: '6',
    months: '14 - 18 meses',
    startMonth: 14,
    teeth: [{ name: 'Primer Molar', arch: 'Inferior', color: '#64B5F6' }],
  },
  {
    id: '7',
    months: '16 - 22 meses',
    startMonth: 16,
    teeth: [{ name: 'Canino', arch: 'Superior', color: '#4DB6AC' }],
  },
  {
    id: '8',
    months: '17 - 23 meses',
    startMonth: 17,
    teeth: [{ name: 'Canino', arch: 'Inferior', color: '#4DB6AC' }],
  },
  {
    id: '9',
    months: '23 - 31 meses',
    startMonth: 23,
    teeth: [{ name: 'Segundo Molar', arch: 'Inferior', color: '#CE93D8' }],
  },
  {
    id: '10',
    months: '25 - 33 meses',
    startMonth: 25,
    teeth: [{ name: 'Segundo Molar', arch: 'Superior', color: '#CE93D8' }],
  },
];

export const EruptionTimeline = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Línea de Tiempo de Erupción</Text>
        <Text style={styles.subtitle}>
          Conoce el orden exacto en el que aparecen los dientes de tu bebé.
        </Text>
      </View>

      <View style={styles.timelineContainer}>
        {/* Línea vertical central/lateral */}
        <View style={styles.verticalLine} />

        {timelineData.map((event, index) => {
          return (
            <View key={event.id} style={styles.eventRow}>
              {/* Indicador de tiempo (punto en la línea) */}
              <View style={styles.timeIndicator}>
                <View style={styles.dot} />
              </View>

              {/* Tarjeta de contenido */}
              <View style={styles.cardContainer}>
                <View style={styles.timeBubble}>
                  <Text style={styles.timeText}>{event.months}</Text>
                </View>

                {event.teeth.map((tooth, idx) => (
                  <View key={idx} style={[styles.toothCard, { borderLeftColor: tooth.color }]}>
                    <View style={styles.toothInfo}>
                      <Text style={styles.toothName}>{tooth.name}</Text>
                      <Text style={styles.toothArch}>Maxilar {tooth.arch}</Text>
                    </View>
                    <View style={[styles.colorBadge, { backgroundColor: tooth.color + '22' }]}>
                      <View style={[styles.innerBadge, { backgroundColor: tooth.color }]} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 20,
    color: Colors.navy,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    maxWidth: '90%',
    lineHeight: 20,
  },
  timelineContainer: {
    position: 'relative',
    paddingLeft: 20, // Espacio para la línea
  },
  verticalLine: {
    position: 'absolute',
    left: 27,
    top: 10,
    bottom: 20,
    width: 3,
    backgroundColor: '#EAECEF',
    borderRadius: 2,
  },
  eventRow: {
    flexDirection: 'row',
    marginBottom: 24,
    position: 'relative',
  },
  timeIndicator: {
    width: 18,
    alignItems: 'center',
    marginRight: 16,
    zIndex: 2,
    paddingTop: 8,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderWidth: 4,
    borderColor: Colors.blue,
  },
  cardContainer: {
    flex: 1,
    paddingRight: 8,
  },
  timeBubble: {
    backgroundColor: Colors.navy,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 10,
  },
  timeText: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 13,
    color: Colors.white,
  },
  toothCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 5,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  toothInfo: {
    flex: 1,
  },
  toothName: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  toothArch: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 13,
    color: Colors.text.secondary,
  },
  colorBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
});
