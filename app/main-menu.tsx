import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/theme/colors';
import { Radius } from '../src/theme/radius';
import { Spacing, screenPadding } from '../src/theme/spacing';
import { Typography } from '../src/theme/typography';
import { Screen } from '../src/components/Screen';
import { NavyCard } from '../src/components/NavyCard';
import { Header } from '../src/components/Header';
import { FooterLogos } from '../src/components/FooterLogos';

const MENU_OPTIONS = [
  {
    id: 'knowledge',
    title: 'Todo lo que debes saber',
    subtitle: 'Información por edades',
    icon: 'book-outline' as const,
    route: '/onboarding',
    color: Colors.blue,
  },
  {
    id: 'timer',
    title: 'Temporizador de Cepillado',
    subtitle: 'Guía de 2 minutos',
    icon: 'timer-outline' as const,
    route: '/timer',
    color: Colors.timer.quadrant1,
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
    id: 'emergency',
    title: 'Contactos de Emergencia',
    subtitle: 'Números de urgencia',
    icon: 'call-outline' as const,
    route: '/emergency',
    color: Colors.timer.warning,
  },
];

export default function MainMenuScreen() {
  const router = useRouter();
  
  // Animaciones para cada tarjeta
  const anims = useRef(MENU_OPTIONS.map(() => new Animated.Value(0))).current;

  const handleOptionPress = async (option: typeof MENU_OPTIONS[0]) => {
    if (option.id === 'knowledge') {
      router.push('/knowledge-hub');
    } else {
      router.push(option.route as any);
    }
  };

  useEffect(() => {
    Animated.stagger(150, anims.map(anim => 
      Animated.spring(anim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      })
    )).start();
  }, []);

  return (
    <Screen>
      <Header 
        title="HEMOFILIA Y ODONTOLOGÍA" 
        decoration="right" 
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {MENU_OPTIONS.map((option, index) => {
          const translateY = anims[index].interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          });
          
          return (
            <Animated.View 
              key={option.id}
              style={{
                opacity: anims[index],
                transform: [{ translateY }]
              }}
            >
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => handleOptionPress(option)}
                accessibilityRole="button"
                accessibilityLabel={`${option.title}. ${option.subtitle}`}
              >
                <NavyCard size="sm" style={styles.card}>
                  <View style={[styles.iconContainer, { backgroundColor: `${option.color}33` }]}>
                    <Ionicons name={option.icon} size={36} color={option.color} />
                  </View>
                
                  <View style={styles.textContainer}>
                    <Text style={styles.cardTitle}>{option.title}</Text>
                    <Text style={[styles.cardSubtitle, { color: option.color }]}>{option.subtitle}</Text>
                  </View>
                
                  <Ionicons name="chevron-forward" size={24} color={Colors.lavender} />
                </NavyCard>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      <FooterLogos />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  // El margen lateral va en el contenido (no en la pantalla) para que el
  // ScrollView llegue al borde y no recorte la sombra de las tarjetas.
  content: {
    paddingHorizontal: screenPadding,
    paddingVertical: Spacing.lg,
    justifyContent: 'center',
    flexGrow: 1,
    gap: Spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Tile de icono: mismo 56 / Radius.lg / separacion 16 que las tarjetas de emergencia.
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
