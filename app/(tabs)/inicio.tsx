import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Spacing, screenPadding } from '../../src/theme/spacing';
import { Typography } from '../../src/theme/typography';
import { Screen } from '../../src/components/Screen';
import { Header } from '../../src/components/Header';
import { NavyCard } from '../../src/components/NavyCard';
import { MenuCard } from '../../src/components/MenuCard';
import { FooterLogos } from '../../src/components/FooterLogos';

const QUICK_ACCESS = [
  {
    id: 'guide',
    title: 'Guía por edades',
    subtitle: 'Información según la etapa',
    icon: 'book-outline' as const,
    route: '/guia',
    color: Colors.blue,
  },
  {
    id: 'emergency',
    title: 'Contactos de emergencia',
    subtitle: 'Números de urgencia',
    icon: 'call-outline' as const,
    route: '/emergencia',
    color: Colors.timer.warning,
  },
];

export default function InicioScreen() {
  const router = useRouter();
  const anims = useRef(QUICK_ACCESS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      120,
      anims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  return (
    <Screen edges={['top', 'left', 'right']}>
      <Header title="HEMOFILIA Y ODONTOLOGÍA" decoration="right" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <NavyCard size="lg" style={styles.hero}>
          <Text style={styles.heroTitle}>Bienvenido(a)</Text>
          <Text style={styles.heroText}>
            Encuentra información y herramientas para el cuidado bucodental en cada
            etapa de la vida.
          </Text>
        </NavyCard>

        <Text style={styles.sectionTitle}>ACCESOS RÁPIDOS</Text>

        {QUICK_ACCESS.map((item, index) => {
          const translateY = anims[index].interpolate({
            inputRange: [0, 1],
            outputRange: [40, 0],
          });

          return (
            <Animated.View
              key={item.id}
              style={{ opacity: anims[index], transform: [{ translateY }] }}
            >
              <MenuCard
                title={item.title}
                subtitle={item.subtitle}
                icon={item.icon}
                color={item.color}
                onPress={() => router.push(item.route as any)}
              />
            </Animated.View>
          );
        })}
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
    gap: Spacing.lg,
  },
  hero: {
    gap: Spacing.sm,
  },
  heroTitle: {
    ...Typography.scale.title,
    color: Colors.white,
  },
  heroText: {
    ...Typography.scale.body,
    color: Colors.white,
  },
  sectionTitle: {
    ...Typography.scale.label,
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginTop: Spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.sm,
  },
});
