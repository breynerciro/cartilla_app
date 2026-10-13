import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../src/theme/colors';
import { Spacing, screenPadding } from '../src/theme/spacing';
import { Typography } from '../src/theme/typography';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { FooterLogos } from '../src/components/FooterLogos';

export default function IntroScreen() {
  const router = useRouter();

  return (
    // El fondo navy es de la intro (ya no del Stack): cubre tambien detras del
    // status bar y se ve mientras carga la imagen.
    <ImageBackground
      source={require('../assets/images/png\'s/fondo.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <Screen backgroundColor="transparent" statusBarStyle="light">
        <View style={styles.spacerTop} />

        <View style={styles.titleContainer}>
          <Text style={styles.title} adjustsFontSizeToFit numberOfLines={2}>
            HEMOFILIA Y{'\n'}ODONTOLOGÍA
          </Text>
          <Text style={styles.subtitle}>Todo lo que debes saber</Text>
        </View>

        <View style={styles.spacerMiddle} />

        <View style={styles.bottomSection}>
          <Button
            title="Empezar"
            variant="light"
            onPress={() => router.push('/main-menu')}
            style={styles.button}
          />
          <FooterLogos color="white" />
        </View>
      </Screen>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.navy,
  },
  spacerTop: {
    flex: 1.5,
  },
  titleContainer: {
    width: '100%',
    backgroundColor: Colors.navy,
    paddingVertical: Spacing.xxxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.scale.display,
    color: Colors.white,
    textAlign: 'center',
    letterSpacing: 2,
    paddingHorizontal: screenPadding,
  },
  subtitle: {
    ...Typography.scale.title,
    fontFamily: Typography.fonts.ubuntu,
    color: Colors.white,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  spacerMiddle: {
    flex: 3,
  },
  bottomSection: {
    paddingHorizontal: screenPadding,
    alignItems: 'center',
  },
  // Fondo, color de texto y borde vienen de variant="light"; aqui solo el ancho.
  button: {
    width: 222,
    marginBottom: Spacing.huge,
  },
});
