import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import LogoUnal from '../../assets/images/svgs/logo_UNAL.svg';
// Eliminamos HomiLogo como SVG porque contiene una imagen PNG incrustada que no soporta fill

interface FooterLogosProps {
  color?: 'white' | 'black';
}

export const FooterLogos = ({ color = 'black' }: FooterLogosProps) => {
  const iconColor = color === 'white' ? '#FFFFFF' : '#000000';
  const dividerColor = color === 'white' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)';

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/png\'s/homi_logo.png')} 
        style={[styles.homiLogo, { tintColor: iconColor }]} 
        resizeMode="contain"
      />
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
    opacity: 0.8,
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

