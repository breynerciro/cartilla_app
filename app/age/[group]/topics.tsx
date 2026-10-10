import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ageGroupData, AgeGroup } from '../../../src/data/content';
import { Button } from '../../../src/components/Button';
import { TopicMenuList } from '../../../src/components/TopicMenuList';

export default function TopicMenuScreen() {
  const { group } = useLocalSearchParams();
  const router = useRouter();

  const ageGroup = group as AgeGroup;
  const data = ageGroupData[ageGroup];
  if (!data) return null;

  return (
    <TopicMenuList
      title={data.title}
      items={data.topics}
      // La primera tarjeta lleva la imagen a la derecha (alterna desde ahi).
      firstImagePosition="right"
      onSelect={(topicId) => router.push(`/age/${group}/${topicId}`)}
      action={
        <Button
          title="Finalizar"
          variant="dark"
          onPress={() => router.replace('/age-selector')}
        />
      }
    />
  );
}
