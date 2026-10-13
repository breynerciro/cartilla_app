import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Spacing, screenPadding } from '../../src/theme/spacing';
import { Screen } from '../../src/components/Screen';
import { Header } from '../../src/components/Header';
import { MenuCard } from '../../src/components/MenuCard';
import { FooterLogos } from '../../src/components/FooterLogos';

const OPTIONS = [
  {
    id: 'glossary',
    title: 'Glosario',
    subtitle: 'Términos odontológicos y hematológicos',
    icon: 'book-outline' as const,
    route: '/glossary',
    color: Colors.blue,
  },
  {
    id: 'calendar',
    title: 'Calendario de Citas',
    subtitle: 'Organiza tus controles',
    icon: 'calendar-outline' as const,
    route: '/calendar',
    color: Colors.lavender,
  },
  {
    id: 'timer',
    title: 'Temporizador de Cepillado',
    subtitle: 'Guía de 2 minutos',
    icon: 'timer-outline' as const,
    route: '/timer',
    color: Colors.timer.quadrant1,
  },
];

export default function MasScreen() {
  const router = useRouter();

  return (
    <Screen edges={['top', 'left', 'right']}>
      <Header title="MÁS" decoration="right" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {OPTIONS.map((option) => (
          <MenuCard
            key={option.id}
            title={option.title}
            subtitle={option.subtitle}
            icon={option.icon}
            color={option.color}
            onPress={() => router.push(option.route as any)}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <FooterLogos />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: screenPadding,
    paddingVertical: Spacing.lg,
    justifyContent: 'center',
    flexGrow: 1,
    gap: Spacing.lg,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.sm,
  },
});
