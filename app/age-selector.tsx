import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { Button } from '../src/components/Button';
import { FooterLogos } from '../src/components/FooterLogos';
import { Header } from '../src/components/Header';
import { BackButton } from '../src/components/BackButton';

const AGE_GROUPS = [
  { label: '0 A 3 años', route: '0-3' },
  { label: '3 A 5 años', route: '3-5' },
  { label: '6 A 13 años', route: '6-13' },
  { label: '14 A 18 años', route: '14-18' },
] as const;

export default function AgeSelectorScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="¿QUÉ EDAD TIENE TU NIÑO(A)?" 
        decoration="right" 
      />

      <View style={styles.content}>
        {/* Botones de grupo de edad */}
        <View style={styles.buttonsContainer}>
          {AGE_GROUPS.map((group) => (
            <Button
              key={group.route}
              title={group.label}
              variant="dark"
              onPress={() => router.push(`/age/${group.route}`)}
              style={styles.button}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <BackButton onPress={() => router.replace('/main-menu')} />
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
    marginTop: 50,
    gap: 20,
  },
  // Figma: borderRadius ~20, paddingVertical 20
  button: {
    paddingVertical: 20,
    borderRadius: 20,
  },
});
