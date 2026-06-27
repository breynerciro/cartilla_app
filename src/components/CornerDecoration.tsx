import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';

/**
 * Decoración superior exacta del Figma.
 *
 * Props:
 *   position: 'bottom-left' | 'bottom-right'
 *   topOffset: Permite subir la decoración para ignorar el SafeAreaView
 */
interface CornerDecorationProps {
  position?: 'bottom-left' | 'bottom-right';
  topOffset?: number;
}

export const CornerDecoration: React.FC<CornerDecorationProps> = ({
  position = 'bottom-left',
  topOffset = 0,
}) => {
  const isLeft = position === 'bottom-left';
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrapper,
        isLeft ? styles.wrapperLeft : styles.wrapperRight,
        { top: topOffset - insets.top }
      ]}
    >
      <Svg 
        width="100%" 
        height="100%" 
        viewBox="20 20 120 80" 
        fill="none"
        preserveAspectRatio={isLeft ? "xMinYMin meet" : "xMaxYMin meet"}
      >
        {/* Superior 1 (Navy) */}
        <Path d="M20 20H85C98.2548 20 109 30.7452 109 44C109 57.2548 98.2548 68 85 68H20V20Z" fill={Colors.navy} />
        {/* Superior 2 (Lavender) */}
        <Path d="M20 52H116C129.255 52 140 62.7452 140 76C140 89.2548 129.255 100 116 100H20V52Z" fill={Colors.lavender} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: 90, 
    height: 60, // Ajustado a la proporción del viewBox (120x80)
    zIndex: -1, 
  },
  wrapperLeft: {
    left: 0,
  },
  wrapperRight: {
    right: 0,
    transform: [{ scaleX: -1 }],
  },
});
