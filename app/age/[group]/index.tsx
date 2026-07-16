import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../../src/theme/colors';
import { Typography } from '../../../src/theme/typography';
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
    <SafeAreaView style={styles.container}>
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
        <View style={styles.card}>
          <Text style={styles.cardText}>{slide.text}</Text>
        </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
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
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.navy,
    borderRadius: 32,
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: '100%',
    marginBottom: 32,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
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
    paddingHorizontal: 8,
  },
  charImageContainer: { flex: 1 },
});
