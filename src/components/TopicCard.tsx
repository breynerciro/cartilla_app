import { DynamicImage } from './DynamicImage';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ImageSourcePropType } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius } from '../theme/radius';
import { Shadows } from '../theme/shadows';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';
import { Ionicons } from '@expo/vector-icons';

interface TopicCardProps {
  title: string;
  image?: ImageSourcePropType;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  imagePosition?: 'left' | 'right';
}

export const TopicCard = ({ title, image, icon = 'document-text-outline', onPress, imagePosition = 'left' }: TopicCardProps) => {
  const ImageComponent = (
    <View style={[styles.imageContainer, imagePosition === 'right' ? { marginLeft: Spacing.lg, marginRight: 0 } : { marginRight: Spacing.lg }]}>
      {image ? (
        <DynamicImage source={image} style={styles.image} resizeMode="contain" />
      ) : (
        <View style={styles.iconFallback}>
          <Ionicons name={icon} size={32} color={Colors.white} />
        </View>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {imagePosition === 'left' && ImageComponent}
      <View style={[styles.textContainer, imagePosition === 'right' && { alignItems: 'flex-end' }]}>
        <Text style={[styles.title, imagePosition === 'right' && { textAlign: 'right' }]}>{title}</Text>
      </View>
      {imagePosition === 'right' && ImageComponent}
      <Ionicons name="chevron-forward" size={24} color={Colors.lavender} style={styles.chevron} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: Radius.lgPlus,
    backgroundColor: Colors.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  image: {
    width: 64,
    height: 64,
  },
  iconFallback: {
    width: 60,
    height: 60,
    borderRadius: Radius.lg,
    backgroundColor: Colors.lavender,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: 20,
    color: Colors.navy,
  },
  chevron: {
    marginLeft: Spacing.sm,
  }
});
