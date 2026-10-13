import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../src/theme/colors';
import { Radius } from '../src/theme/radius';
import { Spacing, screenPadding } from '../src/theme/spacing';
import { Typography } from '../src/theme/typography';
import { Screen } from '../src/components/Screen';
import { FooterLogos } from '../src/components/FooterLogos';
import { Header } from '../src/components/Header';
import { BackButton } from '../src/components/BackButton';
import { glossaryData } from '../src/data/glossary';

export default function GlossaryScreen() {
  const router = useRouter();

  return (
    <Screen>
      <Header
        title="GLOSARIO"
        decoration="right"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
      >
        {glossaryData.map((item, index) => (
          <View key={index} style={styles.termContainer}>
            <Text style={styles.termTitle}>{item.term}</Text>
            <Text style={styles.termDefinition}>{item.definition}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <BackButton onPress={() => router.back()} />
        <FooterLogos />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  // El margen lateral va en el contenido (no en la pantalla) para que el
  // ScrollView llegue al borde y no recorte la sombra de los costados.
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  footer: {
    alignItems: 'center',
  },
  termContainer: {
    backgroundColor: Colors.offWhite,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.blue,
  },
  termTitle: {
    ...Typography.scale.bodyLarge,
    fontFamily: Typography.fonts.ubuntuBold,
    color: Colors.navy,
    marginBottom: Spacing.sm,
  },
  termDefinition: {
    ...Typography.scale.body,
    color: Colors.text.primary,
  },
});
