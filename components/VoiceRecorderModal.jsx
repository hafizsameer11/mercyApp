import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import WaveformPreview from './WaveformPreview'; // Optional
import ThemedText from './ThemedText'; // Optional

const VoiceRecorderModal = ({ visible, onCancel, onSend, audioUri }) => {
  const [sound, setSound] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);

  // Cleanup on unmount or re-render
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadAndPlay = async () => {
    try {
      if (sound) {
        await sound.unloadAsync(); // 🔥 prevent double loading
        setSound(null);
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        {},
        (status) => {
          if (status.isLoaded) {
            setPositionMillis(status.positionMillis);
            setDurationMillis(status.durationMillis);
            if (status.didJustFinish) {
              setPlaying(false);
              setPositionMillis(0);
            }
          }
        }
      );

      setSound(newSound);
      await newSound.playAsync();
      setPlaying(true);
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const stopPlayback = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setPlaying(false);
      setPositionMillis(0);
    }
  };

  const formatMillis = (ms) => {
    const total = Math.floor(ms / 1000);
    const min = Math.floor(total / 60);
    const sec = total % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleCancel = async () => {
    await stopPlayback();
    onCancel();
  };

  const handleSend = async () => {
    await stopPlayback();
    onSend(audioUri);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <ThemedText style={styles.timer}>
          {formatMillis(positionMillis)} / {formatMillis(durationMillis)}
        </ThemedText>

        {audioUri ? <WaveformPreview uri={audioUri} /> : <Text>No preview</Text>}

        <View style={styles.controls}>
          <TouchableOpacity onPress={handleCancel}>
            <Ionicons name="trash" size={28} color="#ff4444" />
          </TouchableOpacity>

          <TouchableOpacity onPress={playing ? stopPlayback : loadAndPlay}>
            <Ionicons name={playing ? 'pause' : 'play'} size={32} color="#992C55" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSend}>
            <Ionicons name="send" size={28} color="#28a745" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default VoiceRecorderModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    elevation: 10,
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  timer: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
});
