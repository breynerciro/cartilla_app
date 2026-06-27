import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

export const FooterLogos = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/png\'s/homi_logo.png')} 
        style={styles.homiLogo} 
        resizeMode="contain"
      />
      <View style={styles.divider} />
      <Image 
        // We will use a fallback or require the SVG with react-native-svg, but for now let's use the SVG component or PNG if available.
        // Wait, logo_UNAL is only available as SVG in assets/images/svgs/logo_UNAL.svg. 
        // Let's create a generic wrapper or just use the local SVG.
        // For simplicity right now we'll use an Image wrapper or require the SVG directly if metro-config is set up for it.
        // Let's use react-native-svg for the UNAL logo or an image if we can transform it.
        source={require('../../assets/images/adaptive-icon.png')} // Fallback until SVG is configured
        style={styles.unalLogo} 
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  homiLogo: {
    height: 40,
    width: '40%',
    maxWidth: 100,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 15,
  },
  unalLogo: {
    height: 40,
    width: '40%',
    maxWidth: 100,
  },
});
