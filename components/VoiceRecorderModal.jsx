import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import WaveformPreview from './WaveformPreview'; // Assuming you have a waveform preview component
import ThemedText from './ThemedText'; // Assuming you have a themed text component

const VoiceRecorderModal = ({ visible, onCancel, onSend, audioUri }) => {
  const [sound, setSound] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);


  const playSound = async () => {
    const { sound: s } = await Audio.Sound.createAsync(
      { uri: audioUri },
      {},
      (status) => {
        if (status.isLoaded) {
          setPositionMillis(status.positionMillis);
          setDurationMillis(status.durationMillis);
          if (!status.isPlaying && status.didJustFinish) setPlaying(false);
        }
      }
    );
    setSound(s);
    await s.playAsync();
    setPlaying(true);
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setPlaying(false);
    }
  };

  const formatMillis = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <ThemedText style={styles.timer}>{formatMillis(positionMillis)} / {formatMillis(durationMillis)}</ThemedText>
        <WaveformPreview uri={audioUri} />

        <View style={styles.controls}>
          <TouchableOpacity onPress={onCancel}><Ionicons name="trash" size={28} color="#ff4444" /></TouchableOpacity>
          <TouchableOpacity onPress={playing ? stopSound : playSound}>
            <Ionicons name={playing ? 'pause' : 'play'} size={32} color="#992C55" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSend(audioUri)}>
            <Ionicons name="send" size={28} color="#28a745" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

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

export default VoiceRecorderModal;
