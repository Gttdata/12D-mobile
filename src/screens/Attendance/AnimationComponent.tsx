import React from 'react';
import {View} from 'react-native';
import {Svg, Circle} from 'react-native-svg';

const CircularProgress = ({percentage}: any) => {
  const radius = 69;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return (
    <View>
      <Svg height={20} width={20} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <Circle
          cx={radius}
          cy={radius}
          r={radius}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="8"
        />
        <Circle
          cx={radius}
          cy={radius}
          r={radius}
          fill="none"
          stroke="green"
          strokeWidth="10"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />
      </Svg>
    </View>
  );
};

export default CircularProgress;
