import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { FooterLogos } from '../src/components/FooterLogos';
import { NextButton } from '../src/components/NextButton';
import { CornerDecoration } from '../src/components/CornerDecoration';

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
      
      router.push('/age-selector');
    }
  };

  const isLast = currentSlide === slides.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <CornerDecoration position="bottom-left" />

      {/* ZONE 2: Body — card sizes to content, doesn't bloat */}
      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.cardText} adjustsFontSizeToFit minimumFontScale={0.5} numberOfLines={15}>
            {slides[currentSlide].text}
          </Text>
        </View>
      </View>

      {/* ZONE 3: Footer — always visible */}
      <View style={styles.footer}>
        <View style={styles.characterSection}>
          <Image
            source={slides[currentSlide].image}
            style={{ width: charSize, height: charSize }}
            resizeMode="contain"
          />
          <NextButton onPress={nextSlide} isLast={isLast} />
        </View>
        <FooterLogos />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.navy,
    borderRadius: 32,
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: '100%',
    flexShrink: 1,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    justifyContent: 'center',
  },
  cardText: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 20,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 20 * 1.4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  characterSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
});
