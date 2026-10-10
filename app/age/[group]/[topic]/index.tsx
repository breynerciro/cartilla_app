import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ageGroupData, AgeGroup } from '../../../../src/data/content';
import { BackButton } from '../../../../src/components/BackButton';
import { TopicMenuList } from '../../../../src/components/TopicMenuList';
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
    const isTerminal = !(hasSubtopics && !hasInlineButtons);
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
        onBackOut={() => router.back()}
        hideNextOnLast={isTerminal}
      />
    );
  }

  // 2. If topic has subtopics (and slides are either done or don't exist) → show menu
  if (hasSubtopics && !hasInlineButtons) {
    return (
      <TopicMenuList
        title={topicData.title}
        items={topicData.subtopics!}
        onSelect={(subtopicId) => router.push(`/age/${group}/${topic}/${subtopicId}`)}
        action={<BackButton onPress={() => router.back()} />}
      />
    );
  }

  return null;
}
