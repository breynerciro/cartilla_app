import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ageGroupData, AgeGroup } from '../../../../src/data/content';
import { SlidesRunner } from '../../../../src/components/SlidesRunner';

export default function SubtopicScreen() {
  const { group, topic, subtopic } = useLocalSearchParams();
  const router = useRouter();

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

  return (
    <SlidesRunner 
      slides={subtopicData.slides ?? []}
      groupTitle={data.title}
      onFinish={() => router.back()}
    />
  );
}
