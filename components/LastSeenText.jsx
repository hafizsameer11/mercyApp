import React from 'react';
import { Text, StyleSheet } from 'react-native';

/**
 * Display "Online" or "Last seen X ago"
 * @param {boolean} isOnline - Whether user is online
 * @param {string} lastSeen - Last seen text ("Online" or "5 minutes ago")
 * @param {object} style - Custom text style
 */
const LastSeenText = ({ isOnline, lastSeen, style }) => {
  const displayText = isOnline ? 'Active now' : (lastSeen || 'Offline');
  const textColor = isOnline ? '#4CAF50' : '#9E9E9E';

  return (
    <Text style={[styles.text, { color: textColor }, style]}>
      {displayText}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    fontWeight: '400',
  },
});

export default LastSeenText;

