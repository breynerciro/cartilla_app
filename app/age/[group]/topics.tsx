import { DynamicImage } from '../../../src/components/DynamicImage';
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../../src/theme/colors';
import { Typography } from '../../../src/theme/typography';
import { ageGroupData, AgeGroup } from '../../../src/data/content';
import { FooterLogos } from '../../../src/components/FooterLogos';
import { Header } from '../../../src/components/Header';

export default function TopicMenuScreen() {
  const { group } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardImgSize = Math.min(width * 0.25, 110);

  const ageGroup = group as AgeGroup;
  const data = ageGroupData[ageGroup];
  if (!data) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={data.title}
        decoration="left"
        showBack={true}
        onBack={() => router.back()}
      />

      <View style={styles.body}>
        {data.topics.map((topic, index) => {
          const isEven = index % 2 === 0;
          return (
            <TouchableOpacity
              key={topic.id}
              style={styles.card}
              onPress={() => router.push(`/age/${group}/${topic.id}`)}
              activeOpacity={0.85}
            >
              {isEven ? (
                <>
                  <DynamicImage source={topic.menuImage} style={{ width: cardImgSize, height: cardImgSize }} resizeMode="contain" />
                  <View style={styles.cardTextBox}>
                    <Text style={styles.cardText} adjustsFontSizeToFit minimumFontScale={0.5} numberOfLines={3}>{topic.title}</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.cardTextBox}>
                    <Text style={styles.cardText} adjustsFontSizeToFit minimumFontScale={0.5} numberOfLines={3}>{topic.title}</Text>
                  </View>
                  <DynamicImage source={topic.menuImage} style={{ width: cardImgSize, height: cardImgSize }} resizeMode="contain" />
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.finishButton}
          onPress={() => router.replace('/age-selector')}
          activeOpacity={0.8}
        >
          <Text style={styles.finishButtonText}>Finalizar</Text>
        </TouchableOpacity>
        <FooterLogos />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  body: {
    paddingHorizontal: 12,
    paddingTop: 8,
    flex: 1,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  cardTextBox: {
    flex: 1,
    backgroundColor: Colors.navy,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    minHeight: 90,
  },
  cardText: {
    fontFamily: Typography.fonts.unkempt,
    fontSize: 18,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: 'center',
    gap: 6,
  },
  finishButton: {
    backgroundColor: Colors.navy,
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 60,
    alignItems: 'center',
  },
  finishButtonText: {
    fontFamily: Typography.fonts.unkempt,
    fontSize: Typography.sizes.title,
    color: Colors.white,
  },
});
