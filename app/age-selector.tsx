import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Radius } from '../src/theme/radius';
import { Spacing, screenPadding } from '../src/theme/spacing';
import { Screen } from '../src/components/Screen';
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
    <Screen>
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
    marginTop: Spacing.massive,
    gap: Spacing.xl,
  },
  // Figma: borderRadius ~20, paddingVertical 20
  button: {
    paddingVertical: Spacing.xl,
    borderRadius: Radius.lgPlus,
  },
});
