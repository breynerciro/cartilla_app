import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { FooterLogos } from '../src/components/FooterLogos';
import { Header } from '../src/components/Header';
import { BackButton } from '../src/components/BackButton';
import { glossaryData } from '../src/data/glossary';

export default function GlossaryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  termContainer: {
    backgroundColor: Colors.offWhite,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.blue,
  },
  termTitle: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 18,
    color: Colors.navy,
    marginBottom: 6,
  },
  termDefinition: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 22,
  },
});
