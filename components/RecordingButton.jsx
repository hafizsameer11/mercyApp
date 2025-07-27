import { useRef, useState } from "react";
import { PanResponder, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export const RecordingButton = ({ onStart, onStop, onLock }) => {
  const [locked, setLocked] = useState(false);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < -30) {
          setLocked(true);
          onLock?.();
        }
      },
      onPanResponderRelease: () => {
        if (!locked) onStop();
      },
    })
  ).current;

  return (
    <View {...panResponder.panHandlers}>
      <TouchableOpacity
        onPressIn={onStart}
        style={{
          backgroundColor: '#992C55',
          padding: 14,
          borderRadius: 30,
        }}
      >
        <Ionicons name="mic" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};