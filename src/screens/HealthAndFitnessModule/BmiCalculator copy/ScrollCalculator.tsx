import React, {useMemo, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  clamp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { Icon } from '../../../Components';

const WIDTH: number = Dimensions.get('window').width;
const HEIGHT: number = Dimensions.get('window').height;
const LOWEST_WEIGHT: number = 30;
const HIGHEST_WEIGHT: number = 120;
const TOTAL_LENGTH = HIGHEST_WEIGHT - LOWEST_WEIGHT + 1;
// const STEPS: number = 10;
// const STEPS_DIFF: number = 5;
// const BAR_COLOR: string = '#4e2351';

interface WeightScrollProps {
  onValueChange: (value: number) => void;
  HEIGHTS_NUMBER:number;
  LOWEST_NUMBER:number;
  STEPS:number;
  STEPS_DIFF:number;
  BAR_COLOR:string;
}
const ScrollCalculator: React.FC<WeightScrollProps> = ({onValueChange,LOWEST_NUMBER,HEIGHTS_NUMBER,STEPS,STEPS_DIFF,BAR_COLOR}) => {
  const scrollX = useSharedValue(0);
const TOTAL_LENGTH = HEIGHTS_NUMBER - LOWEST_NUMBER + 1;

let Data: number[] = Array.from(
  {length: TOTAL_LENGTH},
  (_, index) => index + LOWEST_WEIGHT,
);
  const prevScrollX = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: scrollX.value}],
  }));
  const updateValue = (index: number) => {
    let actualWeight = Math.abs(parseFloat(index.toFixed(1))) + LOWEST_NUMBER;
    // console.log('INDEX', index, 'KG');
    onValueChange(actualWeight)
    // setWeight(actualWeight);
  };
  const gesture = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevScrollX.value = scrollX.value;
    })
    .onUpdate(event => {
      scrollX.value = prevScrollX.value + event.translationX;
    })
    .onEnd(event => {
      const MAX_DISTANCE: number = STEPS * (STEPS_DIFF + 2) * TOTAL_LENGTH;
      const INDEX_WIDTH: number = STEPS * (STEPS_DIFF + 2);
      let ACTIVE_INDEX: number = scrollX.value / INDEX_WIDTH;
      if (scrollX.value > 0) {
        scrollX.value = withSpring(0, {velocity: event.velocityX});
        ACTIVE_INDEX = 0;
      }
      if (scrollX.value < -MAX_DISTANCE) {
        ACTIVE_INDEX = TOTAL_LENGTH;
        scrollX.value = withSpring(-MAX_DISTANCE, {velocity: event.velocityX});
      }
      runOnJS(updateValue)(ACTIVE_INDEX);
    });
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <GestureDetector gesture={gesture}>
        <View style={{flex: 1}}>
          
          <Animated.View
            style={[
              animatedStyles,
              {
                flex: 1,
                flexDirection: 'row',
                alignItems: 'flex-start',
              },
            ]}>
            <View style={{width: WIDTH / 2}} />
            {Data.map((KG, index) => {
              return (
                <View
                  key={`WEIGHT_${index}_${KG}KG`}
                  style={{
                    // backgroundColor: 'blue',
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                  }}>
                  <Text
                    style={{
                      color: `${BAR_COLOR}`,
                      position: 'absolute',
                      bottom: 40,
                      right: '90%',
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}>{`${KG}`}</Text>
                  <View
                    key={`WEIGHT_${index}_${KG}KG_${-1}`}
                    style={{
                      height: 40,
                      width: 2,
                      borderRadius: 30,
                      backgroundColor: `${BAR_COLOR}`,
                      marginRight: STEPS_DIFF,
                    }}
                  />
                  {Array.from({length: STEPS - 1}, (_, i) => i).map((_, i) => (
                    <View
                      key={`WEIGHT_${index}_${KG}KG_${i}`}
                      style={{
                        height:
                          i == parseInt(((STEPS - 1) / 2).toString()) ? 30 : 20,
                        width: 2,
                        borderRadius: 30,
                        backgroundColor: `${BAR_COLOR}40`,
                        marginRight: STEPS_DIFF,
                      }}
                    />
                  ))}
                  {KG == HEIGHTS_NUMBER ? (
                    <View
                      key={`WEIGHT_${index}_${KG}KG`}
                      style={{
                        // backgroundColor: 'blue',
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                      }}>
                      <Text
                        style={{
                          color: `${BAR_COLOR}`,
                          position: 'absolute',
                          bottom: 40,
                          right: '90%',
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}>{`${KG + 1}`}</Text>
                      <View
                        key={`WEIGHT_${index}_${KG}KG_${-1}`}
                        style={{
                          height: 40,
                          width: 2,
                          borderRadius: 30,
                          backgroundColor: `${BAR_COLOR}`,
                          marginRight: STEPS_DIFF,
                        }}
                      />
                    </View>
                  ) : null}
                </View>
              );
            })}
          </Animated.View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
export default ScrollCalculator;
const styles = StyleSheet.create({});
