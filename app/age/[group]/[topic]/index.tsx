import { DynamicImage } from '../../../../src/components/DynamicImage';
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

      <View style={styles.body}>
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
                  <DynamicImage source={sub.menuImage} style={{ width: cardImgSize, height: cardImgSize }} resizeMode="contain" />
                  <View style={styles.cardTextBox}>
                    <Text style={styles.cardText} adjustsFontSizeToFit minimumFontScale={0.5} numberOfLines={3}>{sub.title}</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.cardTextBox}>
                    <Text style={styles.cardText} adjustsFontSizeToFit minimumFontScale={0.5} numberOfLines={3}>{sub.title}</Text>
                  </View>
                  <DynamicImage source={sub.menuImage} style={{ width: cardImgSize, height: cardImgSize }} resizeMode="contain" />
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

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

  // State to track if we've finished showing intro slides for this topic
  const [introFinished, setIntroFinished] = React.useState(false);

  const ageGroup = group as AgeGroup;
  const data = ageGroupData[ageGroup];
  const topicData = data?.topics.find((t) => t.id === topic);

  if (!data || !topicData) return null;

  const hasSlides = topicData.slides && topicData.slides.length > 0;
  const hasSubtopics = topicData.subtopics && topicData.subtopics.length > 0;
  const hasInlineButtons = topicData.slides?.some(s => 'buttons' in s && (s as any).buttons?.length > 0);

  // 1. If topic has slides and they haven't finished yet → show slides
  if (hasSlides && !introFinished) {
    return (
      <SlidesRunner
        slides={topicData.slides!}
        groupTitle={data.title}
        onNavigate={(targetId) => router.push(`/age/${group}/${topic}/${targetId}`)}
        onFinish={() => {
          if (hasSubtopics && !hasInlineButtons) {
            // If it has subtopics and no inline buttons, move to the fallback menu
            setIntroFinished(true);
          } else {
            // Otherwise, go back
            router.back();
          }
        }}
      />
    );
  }

  // 2. If topic has subtopics (and slides are either done or don't exist) → show menu
  if (hasSubtopics && !hasInlineButtons) {
    return (
      <SubtopicMenuScreen
        group={group as string}
        topic={topic as string}
        data={topicData}
      />
    );
  }

  return null;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
