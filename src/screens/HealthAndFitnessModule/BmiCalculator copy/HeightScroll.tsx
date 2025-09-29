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
import AntDesign from 'react-native-vector-icons/AntDesign';

const WIDTH: number = Dimensions.get('window').width;
const HEIGHT: number = Dimensions.get('window').height;
// const LOWEST_HEIGHT: number = 30;
// const HIGHEST_HEIGHT: number = 120;
const STEPS: number = 10;
const STEPS_DIFF: number = 5;
const BAR_COLOR: string = '#4e2351';

interface WeightScrollProps {
OnHeightChange:(HEIGHT:number)=>void;
TabIndex:number;
}
const HeightScroll: React.FC<WeightScrollProps> = ({OnHeightChange,TabIndex}) => {
  const scrollX = useSharedValue(0);


  const { LOWEST_HEIGHT, HIGHEST_HEIGHT, TOTAL_LENGTH, arr } = useMemo(() => {
    let lowestWeight = 90;
    let highestWeight = 250;

    if (TabIndex === 1) {
      lowestWeight = 91;
      highestWeight = 244;
    } else if (TabIndex === 2) {
      lowestWeight = 3;
      highestWeight = 8;
    }
    // Add more conditions as needed

    const totalLength = highestWeight - lowestWeight + 1;
    const arr = Array.from({ length: totalLength }, (_, index) => index + lowestWeight);

    return { LOWEST_HEIGHT: lowestWeight, HIGHEST_HEIGHT: highestWeight, TOTAL_LENGTH: totalLength, arr: arr };
  }, [TabIndex]);
  const [height, setHeight] = useState<number>(LOWEST_HEIGHT);

  const prevScrollX = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: scrollX.value}],
  }));
  // console.log("arry",arr);
  const updateValue = (index: number) => {
    let actualHight = Math.abs(parseFloat(index.toFixed(1))) + LOWEST_HEIGHT;
    // console.log('INDEX', actualWeight, 'KG');
    OnHeightChange(actualHight)
    setHeight(actualHight);

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
          <View
            style={{
              top: `15%`,
              position: 'absolute',
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 40,
                color: `${BAR_COLOR}`,
                fontWeight: 'bold',
              }}>{`${height} ${TabIndex==2?"cm":"ft"}`}</Text>
            <AntDesign name="caretdown" size={40} color={BAR_COLOR} />
          </View>
          <Animated.View
            style={[
              animatedStyles,
              {
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}>
            <View style={{width: WIDTH / 2}} />
            {arr.map((KG, index) => {
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
                  {KG == HIGHEST_HEIGHT ? (
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
export default HeightScroll;
const styles = StyleSheet.create({});
