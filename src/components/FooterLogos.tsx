import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import LogoHomi from '../../assets/images/svgs/logo_HOMI.svg';
import LogoUnal from '../../assets/images/svgs/logo_UNAL.svg';

interface FooterLogosProps {
  color?: 'white' | 'black';
}

// Aspect ratios derived from each SVG's viewBox
const HOMI_RATIO = 300 / 123.8;   // ~2.42
const UNAL_RATIO = 675 / 285;     // ~2.37

export const FooterLogos = ({ color = 'black' }: FooterLogosProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const iconColor = color === 'white' ? '#FFFFFF' : '#000000';
  const dividerColor = color === 'white' ? '#ffffffa9' : '#0000004f';

  // Each logo takes ~18% of screen width, keeping them discrete
  const logoWidth = Math.min(screenWidth * 0.18, 90);
  const homiHeight = logoWidth / HOMI_RATIO;
  const unalHeight = logoWidth / UNAL_RATIO;

  return (
    <View style={styles.container}>
      <LogoHomi
        width={logoWidth}
        height={homiHeight}
        fill={iconColor}
      />
      <View style={[styles.divider, { backgroundColor: dividerColor, height: homiHeight * 0.7 }]} />
      <LogoUnal
        width={logoWidth}
        height={unalHeight}
        fill={iconColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    width: '100%',
    opacity: 0.45,
  },
  divider: {
    width: 1,
    marginHorizontal: 12,
  },
});
