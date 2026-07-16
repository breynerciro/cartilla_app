import { DynamicImage } from '../../../../src/components/DynamicImage';
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../../../src/theme/colors';
import { Typography } from '../../../../src/theme/typography';
import { ageGroupData, AgeGroup, SubtopicData } from '../../../../src/data/content';
import { FooterLogos } from '../../../../src/components/FooterLogos';
import { Header } from '../../../../src/components/Header';
import { BackButton } from '../../../../src/components/BackButton';
import { TopicCard } from '../../../../src/components/TopicCard';
import { SlidesRunner } from '../../../../src/components/SlidesRunner';

// ─── Nested Sub-menu screen (for subtopics that have further subtopics) ──────
function NestedSubtopicMenuScreen({
  group, topic, subtopicId, data,
}: { group: string; topic: string; subtopicId: string; data: SubtopicData }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardImgSize = Math.min(width * 0.25, 100);

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={data.title}
        decoration="left"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {data.subtopics!.map((sub, index) => {
          return (
            <TopicCard 
              key={sub.id}
              title={sub.title}
              image={sub.menuImage}
              imagePosition={index % 2 === 0 ? 'left' : 'right'}
              onPress={() => router.push(`/age/${group}/${topic}/${sub.id}`)}
            />
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

export default function SubtopicScreen() {
  const { group, topic, subtopic } = useLocalSearchParams();
  const router = useRouter();
  
  // State to track if we've finished showing intro slides for this subtopic
  const [introFinished, setIntroFinished] = React.useState(false);

  const ageGroup = group as AgeGroup;
  const data = ageGroupData[ageGroup];
  const topicData = data?.topics.find((t) => t.id === topic);

  let subtopicData = topicData?.subtopics?.find((st) => st.id === subtopic);
  if (!subtopicData) {
    for (const st of topicData?.subtopics ?? []) {
      if ('subtopics' in st && (st as any).subtopics) {
        const found = (st as any).subtopics.find((s: any) => s.id === subtopic);
        if (found) { subtopicData = found; break; }
      }
    }
  }

  if (!data || !topicData || !subtopicData) return null;

  const hasSlides = subtopicData.slides && subtopicData.slides.length > 0;
  const hasSubtopics = subtopicData.subtopics && subtopicData.subtopics.length > 0;
  const hasInlineButtons = subtopicData.slides?.some(s => 'buttons' in s && (s as any).buttons?.length > 0);

  // 1. If subtopic has slides and they haven't finished yet → show slides
  if (hasSlides && !introFinished) {
    const isTerminal = !(hasSubtopics && !hasInlineButtons);
    return (
      <SlidesRunner 
        slides={subtopicData.slides!}
        groupTitle={data.title}
        onNavigate={(targetId) => router.push(`/age/${group}/${topic}/${targetId}`)}
        onFinish={() => {
          if (hasSubtopics && !hasInlineButtons) {
            setIntroFinished(true);
          } else {
            router.back();
          }
        }}
        onBackOut={() => router.back()}
        hideNextOnLast={isTerminal}
      />
    );
  }

  // 2. If subtopic has nested subtopics (and slides are either done or don't exist) → show menu
  if (hasSubtopics && !hasInlineButtons) {
    return (
      <NestedSubtopicMenuScreen
        group={group as string}
        topic={topic as string}
        subtopicId={subtopic as string}
        data={subtopicData}
      />
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    alignItems: 'center',
    gap: 8,
  },
});
