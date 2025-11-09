import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * Green dot to indicate user is online
 * @param {boolean} isOnline - Whether user is online
 * @param {number} size - Dot size (default: 12)
 * @param {string} position - Position: 'absolute' or 'relative' (default: 'relative')
 */
const OnlineIndicator = ({ isOnline, size = 12, position = 'relative' }) => {
  if (!isOnline) return null;

  const dotStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: '#4CAF50',
  };

  if (position === 'absolute') {
    return (
      <View style={[styles.dotAbsolute, dotStyle]} />
    );
  }

  return (
    <View style={[styles.dotRelative, dotStyle]} />
  );
};

const styles = StyleSheet.create({
  dotRelative: {
    marginRight: 6,
  },
  dotAbsolute: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default OnlineIndicator;

