import React from 'react';
import { View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

const WaveformPreview = ({ uri }) => {
  const data = [10, 30, 15, 40, 25, 10, 35, 15]; // Replace with real waveform data if needed

  return (
    <View style={{ height: 50, width: '100%' }}>
      <Svg height="50" width="100%">
        <Polyline
          points={data.map((d, i) => `${i * 20},${50 - d}`).join(' ')}
          fill="none"
          stroke="#992C55"
          strokeWidth="2"
        />
      </Svg>
    </View>
  );
};

export default WaveformPreview;