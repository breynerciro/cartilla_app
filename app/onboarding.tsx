import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
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

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push('/age-selector');
    }
  };

  const isLast = currentSlide === slides.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Decoración superior unificada */}
      <CornerDecoration position="bottom-left" />

      <View style={styles.content}>
        {/* Tarjeta navy con texto*/}
        <View style={styles.card}>
          <Text style={styles.cardText}>
            {slides[currentSlide].text}
          </Text>
        </View>

        {/* Sección inferior: diente + botón */}
        <View style={styles.characterSection}>
          <Image
            source={slides[currentSlide].image}
            style={{ width: charSize, height: charSize }}
            resizeMode="contain"
          />
          <NextButton onPress={nextSlide} isLast={isLast} />
        </View>
      </View>

      <FooterLogos />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  card: {
    backgroundColor: Colors.navy,
    borderRadius: 27,           // Figma: 27px
    padding: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 40,
  },
  cardText: {
    fontFamily: Typography.fonts.unkempt,   // Figma: Unkempt 400
    fontSize: Typography.sizes.card,         // Figma: 36px → adapt for readability
    color: Colors.white,
    textAlign: 'center',
    lineHeight: Typography.sizes.card * Typography.lineHeight.normal,
  },
  characterSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  // character: dynamic via useWindowDimensions (see render)
});
