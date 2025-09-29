// import React, {useMemo, useState} from 'react';
// import {View, Text, StyleSheet, Dimensions, FlatList} from 'react-native';
// import Animated, {
//   clamp,
//   runOnJS,
//   useAnimatedStyle,
//   useSharedValue,
//   withDecay,
//   withSpring,
// } from 'react-native-reanimated';
// import {Gesture, GestureDetector} from 'react-native-gesture-handler';
// import {useSelector} from '../../../Modules';
// import {FlashList} from '@shopify/flash-list';

import {useMemo} from 'react';
import {useSelector} from '../../../Modules';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Text, View} from 'react-native';
import Slider from '@react-native-community/slider';

// const STEPS_DIFF: number = 5;
// type AnimatedSliderProps = {
//   value: number;
//   label: string;
//   onChange: (value: number) => void;
//   start: number;
//   end: number;
//   step: number;
// };
// const AnimatedSlider: React.FC<AnimatedSliderProps> = ({
//   end,
//   label,
//   onChange,
//   start,
//   step,
//   value,
// }) => {
//   const {Sizes, Colors, Fonts} = useSelector(state => state.app);
//   const TOTAL_LENGTH: number = useMemo(() => end - start + 1, [end, start]);
//   const arr: number[] = useMemo(() => {
//     return Array.from({length: TOTAL_LENGTH}, (_, index) => index + start);
//   }, [start, end, TOTAL_LENGTH]);
//   const STEPS: number = useMemo(() => step, [step]);
//   const distance = useSharedValue(0);
//   const animatedStyles = useAnimatedStyle(() => ({
//     transform: [{translateX: distance.value}],
//   }));
//   return (
//     <View style={{flex: 1, justifyContent: 'center'}}>
//       <View
//         style={{
//           top: '20%',
//           position: 'absolute',
//           alignSelf: 'center',
//           alignItems: 'center',
//         }}>
//         <Text
//           style={{
//             ...Fonts.Bold1,
//             color: Colors.Primary,
//             fontSize: 50,
//           }}>
//           {value}
//           <Text style={{fontSize: 40, textDecorationLine: undefined}}>
//             {` ${label}`}
//           </Text>
//         </Text>
//         <View
//           style={{
//             height: '100%',
//             width: 4,
//             borderRadius: 2,
//             backgroundColor: `${Colors.Primary}`,
//           }}
//         />
//       </View>
//       <Animated.FlatList
//         onScroll={Animated.event(
//           [{nativeEvent: {contentOffset: {x: distance}}}],
//           {useNativeDriver: true},
//         )}
//         horizontal
//         data={arr}
//         initialNumToRender={40}
//         maxToRenderPerBatch={40}
//         style={{flex: 1}}
//         ListHeaderComponent={<View style={{width: Sizes.Width / 2}} />}
//         ListFooterComponent={<View style={{width: Sizes.Width / 2}} />}
//         // estimatedListSize={{width: Dimensions.get('screen').width, height: 40}}
//         renderItem={({item, index}) => (
//           <View style={{alignItems: 'center', justifyContent: 'center'}}>
//             <View
//               key={`WEIGHT_${index}_${item}KG`}
//               style={{
//                 // backgroundColor: 'blue',
//                 flexDirection: 'row',
//                 alignItems: 'flex-end',
//               }}>
//               <Text
//                 style={{
//                   color: `${Colors.Primary}`,
//                   position: 'absolute',
//                   bottom: 40,
//                   right: '90%',
//                   fontSize: 12,
//                   fontWeight: 'bold',
//                 }}>{`${item}`}</Text>
//               <View
//                 key={`WEIGHT_${index}_${item}KG_${-1}`}
//                 style={{
//                   height: 40,
//                   width: 2,
//                   borderRadius: 30,
//                   backgroundColor: `${Colors.Primary}`,
//                   marginRight: STEPS_DIFF,
//                 }}
//               />
//               {item != end
//                 ? Array.from({length: STEPS - 1}, (_, i) => i).map((_, i) => (
//                     <View
//                       key={`WEIGHT_${index}_${item}KG_${i}`}
//                       style={{
//                         height:
//                           i == parseInt(((STEPS - 1) / 2).toString()) ? 30 : 20,
//                         width: 2,
//                         borderRadius: 30,
//                         backgroundColor: `${Colors.Primary}40`,
//                         marginRight: STEPS_DIFF,
//                       }}
//                     />
//                   ))
//                 : null}
//             </View>
//           </View>
//         )}
//         keyExtractor={item => item.toString()}
//         showsHorizontalScrollIndicator={false}
//       />
//     </View>
//   );
// };
// export default AnimatedSlider;

const STEPS_DIFF: number = 5;
type AnimatedSliderProps = {
  value: number;
  label: string;
  onChange: (value: number) => void;
  start: number;
  end: number;
  step: number;
};
const AnimatedSlider: React.FC<AnimatedSliderProps> = ({
  end,
  label,
  onChange,
  start,
  step,
  value,
}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const TOTAL_LENGTH: number = useMemo(() => end - start + 1, [end, start]);
  const arr: number[] = useMemo(() => {
    return Array.from({length: TOTAL_LENGTH}, (_, index) => index + start);
  }, [start, end, TOTAL_LENGTH]);
  const STEPS: number = useMemo(() => step, [step]);
  const distance = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: distance.value}],
  }));
  const gesture = Gesture.Pan()
    .onChange(ev => {
      distance.value += ev.changeX;
    })
    .onFinalize(ev => {
      const MAX_DISTANCE: number =
        STEPS * (STEPS_DIFF + 2) * (TOTAL_LENGTH - 1);
      const INDEX_WIDTH: number = STEPS * (STEPS_DIFF + 2);
      distance.value = withDecay(
        {
          velocity: ev.velocityX,
          clamp: [-MAX_DISTANCE, 0],
        },
        () => {
          let ACTIVE_INDEX: number = distance.value / INDEX_WIDTH;
          if (distance.value > 0) {
            distance.value = withSpring(0, {velocity: 2});
            ACTIVE_INDEX = 0;
          }
          if (distance.value < -MAX_DISTANCE) {
            ACTIVE_INDEX = TOTAL_LENGTH - 1;
            distance.value = withSpring(-MAX_DISTANCE, {
              velocity: ev.velocityX,
            });
          }
          let actualValue =
            Math.abs(parseFloat(ACTIVE_INDEX.toFixed(1))) + start;
          runOnJS(onChange)(actualValue);
        },
      );
    });

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View
        style={{
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            ...Fonts.Bold1,
            color: Colors.Primary,
            fontSize: 50,
          }}>
          {value}
          <Text style={{fontSize: 40, textDecorationLine: undefined}}>
            {` ${label}`}
          </Text>
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{...Fonts.Medium4, color: Colors.Primary}}>
          {'' + start}
        </Text>
        <Slider
          value={value}
          maximumValue={end}
          minimumValue={start}
          step={1}
          onValueChange={value => {
            let actualValue = Math.abs(parseFloat(value.toFixed(0)));
            onChange(actualValue);
          }}
          style={{width: '80%', alignSelf: 'center'}}
        />
        <Text style={{...Fonts.Medium4, color: Colors.Primary}}>
          {'' + end}
        </Text>
      </View>
    </View>
  );
};
export default AnimatedSlider;
