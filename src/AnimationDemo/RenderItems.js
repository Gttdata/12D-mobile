import { View, Text } from 'react-native'
import React from 'react'

import {
    GestureHandlerRootView,
    PanGestureHandler,
  } from 'react-native-gesture-handler';
  import Animated, {
      interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
  } from 'react-native-reanimated';
  import {useAnimatedGestureHandler} from 'react-native-reanimated';
  import {Icon, Toast} from '../Components';

const RenderItems = ({item}) => {
    // console.log("sdfghj",item.title)
    const animation = useSharedValue(0);
    const gestureHandler = useAnimatedGestureHandler({
      onStart: (e, v) => {
        v.startX = animation.value;
      },
      onActive: (e, v) => {
        animation.value = v.startX + e.translationX;
      },
      onEnd: (e, v) => {
        if (animation.value > 70 || animation.value < -70) {
          animation.value = v.startX + e.translationX;
        } else {
          animation.value = withSpring(0);
        }
      },
    });
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateX: animation.value}],
      };
    });
    const BackgroundAnimatedStyle = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        animation.value,
        [1, 0],
        ['green', 'red'],
      );
      return {
        backgroundColor,
      };
    });
    {
      /*ANIMATION FOR LEFT ICONS*/
    }
    const animatesStyleLeftIcon = useAnimatedStyle(() => {
      return {
        transform: [{scale: animation.value > 70 ? withSpring(2) : withSpring(1)}],
      };
    });
    {
      /*ANIMATION FOR RIGHT ICONS*/
    }
    const animatesStyleRightIcon = useAnimatedStyle(() => {
      return {
        transform: [{scale: animation.value < -70 ? withSpring(2) : withSpring(1)}],
      };
    });
      return (
        <GestureHandlerRootView style={{flex: 1}}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <PanGestureHandler onGestureEvent={gestureHandler}>
              <Animated.View
                style={[
                  {
                    width: '100%',
                    height: 100,
                    backgroundColor: 'green',
                    elevation: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  },
                  BackgroundAnimatedStyle,
                ]}>
                <Animated.View
                  style={[
                    {height: 20, width: 20, marginLeft: 20},
                    animatesStyleLeftIcon,
                  ]}>
                  <Icon
                    name="done"
                    type="MaterialIcons"
                    style={{width: '100%', height: '100%'}}
                    color="white"></Icon>
                </Animated.View>
                <Animated.View
                  style={[
                    {height: 20, width: 20, marginRight: 20},
                    animatesStyleRightIcon,
                  ]}>
                  <Icon
                    onPress={() => {
                      
                      Toast('delete');
                    }}
                    name="delete"
                    type="MaterialCommunityIcons"
                    style={{width: '100%', height: '100%'}}
                    color="white"></Icon>
                </Animated.View>
                <Animated.View
                  style={[
                    {
                      width: '100%',
                      height: 100,
                      backgroundColor: 'white',
                      position: 'absolute',
                    },
                    animatedStyle,
                  ]}>

                    <Text>{item.title}</Text>
                  </Animated.View>
              </Animated.View>
            </PanGestureHandler>
          </View>
        </GestureHandlerRootView>
       
      );
    };

export default RenderItems