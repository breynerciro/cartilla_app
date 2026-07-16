import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CornerDecoration } from './CornerDecoration';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface HeaderProps {
  title?: string;
  decoration?: 'left' | 'right' | 'none';
  titleLines?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  decoration = 'none',
  titleLines = 2,
}) => {

  const hasLeftDeco = decoration === 'left';
  const hasRightDeco = decoration === 'right';

  return (
    <View style={styles.container}>
      {hasLeftDeco && <CornerDecoration position="bottom-left" />}
      {hasRightDeco && <CornerDecoration position="bottom-right" />}



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
