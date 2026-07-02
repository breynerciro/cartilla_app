import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CornerDecoration } from './CornerDecoration';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface HeaderProps {
  title?: string;
  decoration?: 'left' | 'right' | 'none';
  showBack?: boolean;
  onBack?: () => void;
  titleLines?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  decoration = 'none',
  showBack = false,
  onBack,
  titleLines = 2,
}) => {
  const router = useRouter();
  
  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  const hasLeftDeco = decoration === 'left';
  const hasRightDeco = decoration === 'right';

  return (
    <View style={styles.container}>
      {hasLeftDeco && <CornerDecoration position="bottom-left" />}
      {hasRightDeco && <CornerDecoration position="bottom-right" />}

      {showBack && (
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="chevron-back" size={32} color={Colors.blue} />
        </TouchableOpacity>
      )}

      {title && (
        <Text 
          style={[
            styles.title,
            hasLeftDeco ? styles.titleRight : styles.titleLeft,
          ]}
          adjustsFontSizeToFit 
          numberOfLines={titleLines}
        >
          {title}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    minHeight: 80,
    justifyContent: 'flex-end',
    paddingBottom: 4,
    marginTop: 10,
    marginBottom: 10,
  },
  backBtn: {
    position: 'absolute',
    top: 0,
    left: 12,
    zIndex: 10,
    padding: 8,
  },
  title: {
    fontFamily: Typography.fonts.ubuntuBold,
    fontSize: Typography.sizes.heading,
    color: Colors.blue,
    lineHeight: Typography.sizes.heading * 1.1,
  },
  titleLeft: {
    textAlign: 'left',
    paddingLeft: 20,
    paddingRight: 90, // Evita pisar la decoracion derecha
  },
  titleRight: {
    textAlign: 'right',
    paddingRight: 20,
    paddingLeft: 90, // Evita pisar la decoracion izquierda
  },
});
