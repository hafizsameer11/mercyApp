// components/ThemedText.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';

const ThemedText = ({
  children,
  style,
  fontFamily = 'apercu', // 'apercu' or 'monaque'
  weight = 'regular',
  italic = false,
  ...rest
}) => {
  const fontMap = {
    apercu: {
      regular: italic ? 'ApercuPro-Italic' : 'ApercuPro-Regular',
      medium: italic ? 'ApercuPro-MediumItalic' : 'ApercuPro-Medium',
      bold: italic ? 'ApercuPro-BoldItalic' : 'ApercuPro-Bold',
    },
    monaque: {
      regular: italic ? 'Monaque-Italic' : 'Monaque-Regular',
      semiBold: italic ? 'Monaque-SemiBoldItalic' : 'Monaque-SemiBold',
      bold: italic ? 'Monaque-BoldItalic' : 'Monaque-Bold',
      light: italic ? 'Monaque-LightItalic' : 'Monaque-Light',
      thin: italic ? 'Monaque-ThinItalic' : 'Monaque-Thin',
    },
  };

  const selectedFont =
    fontMap[fontFamily]?.[weight] || fontMap.apercu.regular;

  return (
    <Text
      style={[styles.text, { fontFamily: selectedFont }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#000',
    fontSize: 16,
  },
});

export default ThemedText;
