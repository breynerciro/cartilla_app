import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Radius } from '../src/theme/radius';
import { Spacing, screenPadding } from '../src/theme/spacing';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { FooterLogos } from '../src/components/FooterLogos';
import { Header } from '../src/components/Header';
import { BackButton } from '../src/components/BackButton';

export default function KnowledgeHubScreen() {
  const router = useRouter();

  const handleContentPress = async () => {
    try {
      const hasSeen = await AsyncStorage.getItem('hasSeenKnowledgeIntro');
      if (hasSeen === 'true') {
        router.push('/age-selector');
      } else {
        router.push('/onboarding');
      }
    } catch (e) {
      router.push('/onboarding');
    }
  };

  return (
    <Screen>
      <Header
        title="TODO LO QUE DEBES SABER"
        decoration="right"
      />

      <View style={styles.content}>
        <View style={styles.buttonsContainer}>
          <Button
            title="Glosario"
            variant="dark"
            onPress={() => router.push('/glossary')}
            style={styles.button}
          />
          <Button
            title="Guía por edades"
            variant="dark"
            onPress={handleContentPress}
            style={styles.button}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <BackButton onPress={() => router.back()} />
        <FooterLogos />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: screenPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 350,
    gap: Spacing.xl,
  },
  button: {
    paddingVertical: Spacing.xl,
    borderRadius: Radius.lgPlus,
  },
});
