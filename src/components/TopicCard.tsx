import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image, ImageSourcePropType } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Ionicons } from '@expo/vector-icons';

interface TopicCardProps {
  title: string;
  image?: ImageSourcePropType;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export const TopicCard = ({ title, image, icon = 'document-text-outline', onPress }: TopicCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.leftSection}>
        {image ? (
          <Image source={image} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={32} color={Colors.white} />
          </View>
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name="chevron-forward" size={24} color={Colors.white} style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white, // Left side bg
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.blue1, // Navy border
    overflow: 'hidden',
    height: 120,
    shadowColor: Colors.blue1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  leftSection: {
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA', // Light bg for image
  },
  image: {
    width: 80,
    height: 80,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: Colors.blue3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    backgroundColor: Colors.blue1, // Right side bg (Blue1 Oscuro)
    height: '100%',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  title: {
    flex: 1,
    fontFamily: Typography.fonts.font2, // Unkempt
    fontSize: Typography.sizes.subtitle,
    color: Colors.white,
  },
  chevron: {
    marginLeft: 8,
  }
});
