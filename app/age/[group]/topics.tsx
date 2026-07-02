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
import { TopicCard } from '../../../src/components/TopicCard';

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
          return (
            <TopicCard 
              key={topic.id}
              title={topic.title}
              image={topic.menuImage}
              imagePosition={(index + 1) % 2 === 0 ? 'left' : 'right'}
              onPress={() => router.push(`/age/${group}/${topic.id}`)}
            />
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
    paddingHorizontal: 16,
    paddingTop: 16,
    flex: 1,
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
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: Typography.sizes.title - 2,
    color: Colors.white,
  },
});
