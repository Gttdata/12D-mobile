import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface SliderBMIProps extends LinearGradientProps {
  maxWidth: number;
  value: number;
}
function calculatePercentage(inputValue: number) {
  let startPoint = 18.5,
    endPoint = 40;
  if (inputValue < startPoint) {
    return 0;
  }
  if (inputValue > endPoint) {
    return 100;
  }
  const range = endPoint - startPoint;
  const difference = inputValue - startPoint;
  const percentage = (difference / range) * 100;
  return percentage;
}
const SliderBMI: React.FC<SliderBMIProps> = ({
  colors = ['#ADD8E6', '#00FF00', '#FFFF00', '#FFA500', '#FF8C00', '#FF0000'],
  maxWidth,
  value,
}) => {
  const animatedValue = useSharedValue(0);
  useEffect(() => {
    let percent = calculatePercentage(value);
    animatedValue.value = withTiming(percent, {duration: 500});
  }, []);
  let SliderStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        animatedValue.value,
        [0, 20, 40, 60, 80, 100],
        ['#ADD8E6', '#00FF00', '#FFFF00', '#FFA500', '#FF8C00', '#FF0000'],
      ),
      transform: [
        {
          translateX: interpolate(
            animatedValue.value,
            [0, 100],
            [0, maxWidth - 8],
          ),
        },
      ],
    };
  });
  return (
    <LinearGradient
      colors={colors}
      style={{
        height: 10,
        width: maxWidth,
        backgroundColor: '#222',
        borderRadius: 10,
        flexDirection: 'row',
      }}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}>
      <View style={{width: maxWidth - 8, flexDirection: 'row'}}>
        <Animated.View
          style={[
            SliderStyle,
            {
              borderWidth: 2,
              // borderColor: 'white',
              padding: 2,
              // position: 'absolute',
              // left: `100%`,

              height: 20,
              borderRadius: 10,
              alignSelf: 'center',
            },
          ]}
        />
      </View>
    </LinearGradient>
  );
};
export default SliderBMI;
const styles = StyleSheet.create({});
