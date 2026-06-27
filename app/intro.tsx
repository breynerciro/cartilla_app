import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { Button } from '../src/components/Button';
import { FooterLogos } from '../src/components/FooterLogos';
import { StatusBar } from 'expo-status-bar';

export default function IntroScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/images/png\'s/fondo.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        {/* Título centrado verticalmente en la mitad superior */}
        <View style={styles.titleBlock}>
          <Text style={styles.title} adjustsFontSizeToFit numberOfLines={1}>HEMOFILIA Y</Text>
          <Text style={styles.title} adjustsFontSizeToFit numberOfLines={1}>ODONTOLOGÍA</Text>
          <Text style={styles.subtitle}>Todo lo que debes saber</Text>
        </View>

        {/* Botón y logos en la parte inferior */}
        <View style={styles.bottomSection}>
          <Button
            title="Empezar"
            variant="primary"
            onPress={() => router.push('/onboarding')}
            style={styles.button}
            textStyle={{ color: Colors.navy }}
          />
          <FooterLogos />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 60,
  },
  title: {
    fontFamily: Typography.fonts.ubuntuBold,  // Figma: Ubuntu Sans 700
    fontSize: Typography.sizes.display,        // Figma: display size
    color: Colors.white,
    textAlign: 'center',
    lineHeight: Typography.sizes.display * 1.1,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: Typography.fonts.ubuntu,      // Figma: Ubuntu Sans 400
    fontSize: Typography.sizes.subtitle,
    color: Colors.white,
    marginTop: 15,
    textAlign: 'center',
  },
  bottomSection: {
    paddingHorizontal: 30,
    paddingBottom: 20,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 40,
    // Figma: botón blanco con texto oscuro
    backgroundColor: Colors.white,
  },
});
