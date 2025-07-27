// RecordingButton.js
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const RecordingButton = ({ isRecording, onStart, onStop }) => {
  const handlePress = () => {
    if (isRecording) {
      onStop?.();
    } else {
      onStart?.();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        backgroundColor: isRecording ? '#C84671' : '#992C55',
        padding: 14,
        borderRadius: 30,
        alignSelf: 'flex-start',
      }}
    >
      <Ionicons name={isRecording ? 'stop' : 'mic'} size={24} color="#fff" />
    </TouchableOpacity>
  );
};
