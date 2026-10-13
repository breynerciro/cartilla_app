import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../src/theme/colors';
import { Spacing, screenPadding } from '../src/theme/spacing';
import { Typography } from '../src/theme/typography';
import { Screen } from '../src/components/Screen';
import { NavyCard } from '../src/components/NavyCard';
import { NextButton } from '../src/components/NextButton';
import { Header } from '../src/components/Header';

const slides = [
  {
    text: 'La hemofilia y la enfermedad de Von Willebrand son enfermedades hereditarias que afectan la capacidad de coagulación del paciente. Esta condición lo acompaña a lo largo de su vida.',
    image: require('../assets/images/png\'s/Tooth1.png'),
  },
  {
    text: 'Por ello, la higiene oral, las valoraciones periódicas y el cuidado en cada una de sus etapas, incluyendo el momento del recambio dental, son muy importantes para no generar sangrados indeseados que puedan agravarse.',
    image: require('../assets/images/png\'s/Tooth2.png'),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const { width } = useWindowDimensions();
  const charSize = Math.min(width * 0.46, 210);

  const nextSlide = async () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      try {
        const { scheduleDailyBrushingReminders } = require('../src/services/notifications');
        await scheduleDailyBrushingReminders();
      } catch (error) {
        console.log("Notificaciones omitidas en Expo Go", error);
      }
      
      try {
        await AsyncStorage.setItem('hasSeenKnowledgeIntro', 'true');
      } catch (error) {
        console.error("Error guardando el estado de onboarding", error);
      }

      // Se vuelve a la pestaña de la guía (desde donde se abrió). Si no hay pila
      // (deep link directo), se navega explícitamente.
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/guia');
      }
    }
  };

  const isLast = currentSlide === slides.length - 1;

  return (
    <Screen>
      {/* Header sin titulo: renderiza la decoracion con el mismo patron que las demas pantallas
          (dentro del flujo y del area segura), no suelta sobre el SafeAreaView. */}
      <Header decoration="left" />

      {/* ZONE 2: Body — card sizes to content, doesn't bloat */}
      <View style={styles.body}>
        <NavyCard size="lg" style={styles.card}>
          <Text
            style={styles.cardText}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            maxFontSizeMultiplier={Typography.maxFontScale}
            numberOfLines={15}
          >
            {slides[currentSlide].text}
          </Text>
        </NavyCard>
      </View>

      {/* ZONE 3: Footer — always visible */}
      <View style={styles.footer}>
        <View style={styles.characterSection}>
          <Image
            source={slides[currentSlide].image}
            style={{ width: charSize, height: charSize }}
            resizeMode="contain"
            accessible={false}
            importantForAccessibility="no"
          />
          <NextButton onPress={nextSlide} isLast={isLast} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: screenPadding,
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    flexShrink: 1,
    justifyContent: 'center',
  },
  cardText: {
    ...Typography.scale.bodyLarge,
    color: Colors.white,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: screenPadding,
    paddingBottom: Spacing.sm,
  },
  characterSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
});
