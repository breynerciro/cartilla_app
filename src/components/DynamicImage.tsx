import React from 'react';
import { Image, ImageProps, StyleSheet } from 'react-native';

interface DynamicImageProps extends ImageProps {
  source: any;
}

export function DynamicImage({ source, style, ...props }: DynamicImageProps) {
  if (typeof source === 'function') {
    const SvgIcon = source as any;
    const flattenedStyle = StyleSheet.flatten(style) || {};
    const width = flattenedStyle.width || 50;
    const height = flattenedStyle.height || 50;
    
    return <SvgIcon width={width} height={height} style={style} />;
  }

  return <Image source={source} style={style} {...props} />;
}
