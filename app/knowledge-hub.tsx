import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../src/theme/colors';
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
    <SafeAreaView style={styles.container}>
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
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 350,
    gap: 20,
  },
  button: {
    paddingVertical: 20,
    borderRadius: 20,
  },
});
