// VoiceRecorderModal.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import WaveformPreview from './WaveformPreview'; // Optional visualizer
import ThemedText from './ThemedText';           // Optional typography

const VoiceRecorderModal = ({ visible, onCancel, onSend, audioUri }) => {
  const [sound, setSound] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);

  const intervalRef = useRef(null);

  // ---- Preload the audio when modal opens so duration shows immediately ----
  useEffect(() => {
    let isMounted = true;
    let preloaded;

    const preload = async () => {
      if (!visible || !audioUri) return;

      try {
        // clear previous polling + sound
        clearInterval(intervalRef.current);
        if (sound) {
          await sound.stopAsync().catch(() => {});
          await sound.unloadAsync().catch(() => {});
          setSound(null);
        }

        const { sound: s, status } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: false } // don't autostart
        );

        // listen for finish + ensure duration is captured
        s.setOnPlaybackStatusUpdate((st) => {
          if (!st?.isLoaded) return;
          if (typeof st.durationMillis === 'number') {
            setDurationMillis(st.durationMillis);
          }
          if (st.didJustFinish) {
            setPlaying(false);
            setPositionMillis(0);
            clearInterval(intervalRef.current);
          }
        });

        if (!isMounted) {
          await s.unloadAsync();
          return;
        }

        preloaded = s;
        setSound(s);

        // ensure duration available before first play
        const st = status?.isLoaded ? status : await s.getStatusAsync();
        if (st?.isLoaded && typeof st.durationMillis === 'number') {
          setDurationMillis(st.durationMillis);
        } else {
          setDurationMillis(0);
        }

        setPositionMillis(0);
        setPlaying(false);
      } catch (e) {
        console.warn('Preload failed:', e?.message || e);
      }
    };

    preload();

    // cleanup when modal closes or component unmounts
    return () => {
      isMounted = false;
      clearInterval(intervalRef.current);
      if (preloaded) preloaded.unloadAsync().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, audioUri]);

  // ---- Play / Pause ----
  const play = async () => {
    try {
      let s = sound;

      // edge: if not preloaded yet (rare), load now
      if (!s && audioUri) {
        const res = await Audio.Sound.createAsync({ uri: audioUri }, { shouldPlay: false });
        s = res.sound;
        setSound(s);
        s.setOnPlaybackStatusUpdate((st) => {
          if (!st?.isLoaded) return;
          if (typeof st.durationMillis === 'number') setDurationMillis(st.durationMillis);
          if (st.didJustFinish) {
            setPlaying(false);
            setPositionMillis(0);
            clearInterval(intervalRef.current);
          }
        });
        const st = await s.getStatusAsync();
        if (st?.isLoaded && typeof st.durationMillis === 'number') {
          setDurationMillis(st.durationMillis);
        }
      }

      if (!s) return;

      await s.playAsync();
      setPlaying(true);

      // poll current position during playback
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(async () => {
        const st = await s.getStatusAsync();
        if (st?.isLoaded) {
          setPositionMillis(st.positionMillis || 0);
          if (!st.isPlaying) {
            clearInterval(intervalRef.current);
          }
        }
      }, 200);
    } catch (err) {
      console.error('Error playing audio:', err);
    }
  };

  const pause = async () => {
    if (!sound) return;
    try {
      await sound.pauseAsync();
    } catch {}
    setPlaying(false);
    clearInterval(intervalRef.current);
  };

  // stop and keep loaded (so user can play again without delay)
  const stopPlayback = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
      } catch {}
      clearInterval(intervalRef.current);
      setPlaying(false);
      setPositionMillis(0);
    }
  };

  // ---- Actions ----
  const handleCancel = async () => {
    await stopPlayback();
    // we unload on close to free memory (preload will occur on next open)
    if (sound) {
      await sound.unloadAsync().catch(() => {});
      setSound(null);
    }
    onCancel && onCancel();
  };

  const handleSend = async () => {
    await stopPlayback();
    if (sound) {
      await sound.unloadAsync().catch(() => {});
      setSound(null);
    }
    onSend && onSend(audioUri);
  };

  // ---- Utils ----
  const formatMillis = (ms) => {
    if (!Number.isFinite(ms) || ms <= 0) return '0:00';
    const total = Math.floor(ms / 1000);
    const min = Math.floor(total / 60);
    const sec = total % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const totalBars = 40;
  const highlightCount =
    durationMillis > 0 ? Math.floor((positionMillis / durationMillis) * totalBars) : 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleCancel}>
      <View style={styles.modalContainer}>
        <ThemedText style={styles.timer}>
          {formatMillis(positionMillis)} / {formatMillis(durationMillis)}
        </ThemedText>

        {audioUri ? (
          <WaveformPreview uri={audioUri} highlightCount={highlightCount} />
        ) : (
          <Text>No preview</Text>
        )}

        <View style={styles.controls}>
          <TouchableOpacity onPress={handleCancel}>
            <Ionicons name="trash" size={28} color="#ff4444" />
          </TouchableOpacity>

          <TouchableOpacity onPress={playing ? pause : play}>
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
