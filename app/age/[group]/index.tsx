import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../../src/theme/colors';
import { Spacing, screenPadding } from '../../../src/theme/spacing';
import { Typography } from '../../../src/theme/typography';
import { Screen } from '../../../src/components/Screen';
import { NavyCard } from '../../../src/components/NavyCard';
import { ageGroupData, AgeGroup } from '../../../src/data/content';
import { FooterLogos } from '../../../src/components/FooterLogos';
import { NextButton } from '../../../src/components/NextButton';
import { Header } from '../../../src/components/Header';

export default function AgeGroupIntroScreen() {
  const { group } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [slideIndex, setSlideIndex] = useState(0);

  const ageGroup = group as AgeGroup;
  const data = ageGroupData[ageGroup];
  if (!data) return null;

  const slides = data.introSlides;
  const slide = slides[slideIndex];
  const isLast = slideIndex === slides.length - 1;
  const isLeft = slide.toothPosition === 'left';
  const toothSize = Math.min(width * 0.45, 210);

  const handleNext = () => {
    if (!isLast) {
      setSlideIndex(slideIndex + 1);
    } else {
      router.push(`/age/${group}/topics`);
    }
  };

  return (
    <Screen>
      <Header 
        title={data.title}
        decoration={isLeft ? 'left' : 'right'}
      />

      {/* Progress dots */}
      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === slideIndex && styles.dotActive]}
          />
        ))}
      </View>

      <View style={styles.body}>
        <NavyCard size="lg" style={styles.card}>
          <Text style={styles.cardText}>{slide.text}</Text>
        </NavyCard>

        <View style={styles.charRow}>
          <View style={styles.charImageContainer}>
            <Image 
              source={slide.image} 
              style={{ width: toothSize, height: toothSize, alignSelf: isLeft ? 'flex-start' : 'center' }} 
              resizeMode="contain" 
            />
          </View>
          <NextButton onPress={handleNext} isLast={isLast} />
        </View>
      </View>

      <FooterLogos />
    </Screen>
  );
}

const styles = StyleSheet.create({
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#D0D5E8',
  },
  dotActive: {
    backgroundColor: Colors.blue,
    width: 20,
  },
  body: {
    flex: 1,
    paddingHorizontal: screenPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    marginBottom: Spacing.xxxl,
  },
  cardText: {
    fontFamily: Typography.fonts.ubuntu,
    fontSize: 20,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 20 * 1.4,
  },
  charRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing.sm,
  },
  charImageContainer: { flex: 1 },
});
