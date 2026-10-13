import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ageGroupData, AgeGroup } from '../../../../../../src/data/content';
import { BackButton } from '../../../../../../src/components/BackButton';
import { TopicMenuList } from '../../../../../../src/components/TopicMenuList';
import { SlidesRunner } from '../../../../../../src/components/SlidesRunner';

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
      <TopicMenuList
        title={subtopicData.title}
        items={subtopicData.subtopics!}
        onSelect={(nestedId) => router.push(`/age/${group}/${topic}/${nestedId}`)}
        action={<BackButton onPress={() => router.back()} />}
      />
    );
  }

  return null;
}
