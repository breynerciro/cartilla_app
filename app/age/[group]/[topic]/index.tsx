import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../../src/theme/colors';
import { Typography } from '../../../../src/theme/typography';
import { ageGroupData, AgeGroup, TopicData } from '../../../../src/data/content';
import { FooterLogos } from '../../../../src/components/FooterLogos';
import { Header } from '../../../../src/components/Header';
import { BackButton } from '../../../../src/components/BackButton';

// ─── Sub-menu screen (for topics with subtopics) ─────────
function SubtopicMenuScreen({
  group, topic, data,
}: { group: string; topic: string; data: TopicData }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardImgSize = Math.min(width * 0.25, 100);

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={data.title}
        decoration="left"
        showBack={true}
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {data.subtopics!.map((sub, index) => {
          const isEven = index % 2 === 0;
          return (
            <TouchableOpacity
              key={sub.id}
              style={styles.card}
              onPress={() => router.push(`/age/${group}/${topic}/${sub.id}`)}
              activeOpacity={0.85}
            >
              {isEven ? (
                <>
                  <Image source={sub.menuImage} style={{ width: cardImgSize, height: cardImgSize }} resizeMode="contain" />
                  <View style={styles.cardTextBox}>
                    <Text style={styles.cardText}>{sub.title}</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.cardTextBox}>
                    <Text style={styles.cardText}>{sub.title}</Text>
                  </View>
                  <Image source={sub.menuImage} style={{ width: cardImgSize, height: cardImgSize }} resizeMode="contain" />
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <BackButton onPress={() => router.back()} />
        <FooterLogos />
      </View>
    </SafeAreaView>
  );
}

import { SlidesRunner } from '../../../../src/components/SlidesRunner';

// ─── Main export ──────────────────────────────────────────────────────────────

export default function TopicScreen() {
  const { group, topic } = useLocalSearchParams();
  const router = useRouter();

  const ageGroup = group as AgeGroup;
  const data = ageGroupData[ageGroup];
  const topicData = data?.topics.find((t) => t.id === topic);

  if (!data || !topicData) return null;

  // If topic has subtopics → show sub-menu
  if (topicData.subtopics && topicData.subtopics.length > 0) {
    return (
      <SubtopicMenuScreen
        group={group as string}
        topic={topic as string}
        data={topicData}
      />
    );
  }

  // If topic has slides directly → run slides
  if (topicData.slides && topicData.slides.length > 0) {
    return (
      <SlidesRunner
        slides={topicData.slides}
        groupTitle={data.title}
        onFinish={() => router.back()}
      />
    );
  }

  return null;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 120,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 120,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10,
  },
  cardTextBox: {
    flex: 1,
    backgroundColor: Colors.navy,
    borderRadius: 16,
    padding: 14,
    justifyContent: 'center',
    minHeight: 80,
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
    paddingBottom: 12,
    alignItems: 'center',
    gap: 8,
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
