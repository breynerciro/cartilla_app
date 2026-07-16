import React from 'react';
import { View, StyleSheet } from 'react-native';
import LogoHomi from '../../assets/images/svgs/logo_HOMI.svg';
import LogoUnal from '../../assets/images/svgs/logo_UNAL.svg';

interface FooterLogosProps {
  color?: 'white' | 'black';
}

export const FooterLogos = ({ color = 'black' }: FooterLogosProps) => {
  const iconColor = color === 'white' ? '#FFFFFF' : '#000000';
  const dividerColor = color === 'white' ? '#ffffffa9' : '#0000004f';

  return (
    <View style={styles.container}>
      <LogoHomi width={120} height={40} fill={iconColor} style={styles.homiLogo} />
      <View style={[styles.divider, { backgroundColor: dividerColor }]} />
      <LogoUnal width={120} height={40} fill={iconColor} style={styles.unalLogo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    width: '100%',
    opacity: 0.6,
  },
  homiLogo: {
    height: 35,
    width: '35%',
    maxWidth: 90,
  },
  divider: {
    width: 1,
    height: 25,
    marginHorizontal: 15,
  },
  unalLogo: {
    // Style applied to SVG wrapper if needed
  },
});

