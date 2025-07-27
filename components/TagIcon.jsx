import React from 'react';
import Svg, { Path } from 'react-native-svg';

const TagIcon = ({ color = '#000', width = 30, height = 20 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 30 20">
      <Path
        d="M0 0 H20 L30 10 L20 20 H0 Z"
        fill={color}
      />
    </Svg>
  );
};

export default TagIcon;
