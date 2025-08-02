import React, { useMemo } from 'react';
import { View } from 'react-native';

const WaveformPreview = ({ uri, highlightCount = 0 }) => {
  const waveformData = useMemo(() => {
    return Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 35 + 10)
    );
  }, []); // only once on mount

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        marginVertical: 10,
      }}
    >
      {waveformData.map((height, index) => (
        <View
          key={index}
          style={{
            width: 3,
            height,
            marginHorizontal: 1,
            borderRadius: 2,
            backgroundColor: index <= highlightCount ? '#992C55' : '#ddd',
          }}
        />
      ))}
    </View>
  );
};

export default WaveformPreview;
