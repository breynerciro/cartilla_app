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
            variant="primary"
            onPress={() => router.push('/main-menu')}
            style={styles.button}
            textStyle={styles.buttonText}
          />
          <FooterLogos color="white" />
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
  },
  spacerTop: {
    flex: 1.5,
  },
  titleContainer: {
    width: '100%',
    backgroundColor: Colors.navy,
    paddingVertical: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 36,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 43,
    letterSpacing: 2,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 24,
    color: Colors.white,
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 28,
  },
  spacerMiddle: {
    flex: 3,
  },
  bottomSection: {
    paddingHorizontal: 30,
    paddingBottom: 20,
    alignItems: 'center',
  },
  button: {
    width: 222,
    height: 65,
    backgroundColor: Colors.white,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderColor: 'transparent',
    borderWidth: 0,
  },
  buttonText: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 24,
    color: Colors.navy,
    textAlign: 'center',
    lineHeight: 29,
  },
});
