import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const scale = width / 390;

const normalize = (size: number) => {
  const newSize = size * scale;
  return Math.round(Math.max(size * 0.75, Math.min(newSize, size * 1.2)));
};

export const Typography = {
  fonts: {
    ubuntu:      'UbuntuSans_400Regular',
    ubuntuBold:  'UbuntuSans_700Bold',
    unkempt:     'Unkempt_400Regular',
    unkemptBold: 'Unkempt_700Bold',
  },
  sizes: {
    // Sizes are calculated dynamically based on the device width on load
    small:    normalize(12),
    base:     normalize(16),
    subtitle: normalize(20),
    body:     normalize(22),
    title:    normalize(26),
    heading:  normalize(28),
    card:     normalize(22),
    display:  normalize(38),
  },
  lineHeight: {
    tight: 0.95,
    normal: 1.25,
  },
};
