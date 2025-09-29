import {View, Text} from 'react-native';
import React from 'react';

import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {StackProps} from '../routes';
import {useSelector} from '../Modules';

type Props = StackProps<'AnimationBoard'>;

const AnimationBoard = ({navigation}: Props): JSX.Element => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({x: 0, y: 0});
  const start = useSharedValue({x: 0, y: 0});
  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate(e => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: offset.value.x},
        {translateY: offset.value.y},
        {scale: withSpring(isPressed.value ? 1.2 : 1)},
      ],
      backgroundColor: isPressed.value ? 'yellow' : 'blue',
    };
  });
  return (
    <GestureHandlerRootView>
      <View
        style={{
          flex: 1,
          margin: Sizes.Padding,
          backgroundColor: Colors.White,
        }}>
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              {
                width: 100,
                height: 100,
                backgroundColor: Colors.Primary,
              },
              animatedStyle,
            ]}></Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

export default AnimationBoard;
