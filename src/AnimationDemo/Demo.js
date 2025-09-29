{
  /*using itnerpolate*/
}

// import { View, Text, TouchableOpacity } from 'react-native'
// import React, { useState } from 'react'
// import { Sizes } from '../Modules/Modules'
// import Animated, {interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

// const Demo = () => {
//     const animation = useSharedValue(1);
//     const [clicked,setClicked]=useState(false);
//     const animatedStyle = useAnimatedStyle(() => {
//         const Width= interpolate(animation.value,[1,0],[150,200]);
//         const borderRadius= interpolate(animation.value,[1,0],[0,100]);
//         const backgroundColor=interpolateColor(animation.value,[1,0],['red','blue'])
//         return {
//             width: Width,
//             height: Width,
//             backgroundColor,
//             borderRadius
//         }
//     })
//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//             <Animated.View style={[{ backgroundColor: 'red', height: 150, width: 150 }, animatedStyle]}></Animated.View>
//             <TouchableOpacity style={{ borderWidth: 1, padding: 5, marginTop: 30 }} onPress={() => {
//                 if(clicked)
//                 {
//                     animation.value = withSpring(0);
//                 }
//                 else
//                 {
//                     animation.value = withSpring(1);
//                 }
//                 setClicked(!clicked);

//             }}>
//                 <Text>start animation</Text>
//             </TouchableOpacity>
//         </View>
//     )
// }

// export default Demo

{
  /*using gesture handler*/
}

// import { View, Text, TouchableOpacity } from 'react-native'
// import React, { useState } from 'react'
// import { Sizes } from '../Modules/Modules'
// import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
// import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler'
// import { useAnimatedGestureHandler } from 'react-native-reanimated'

// const Demo = () => {
//     const x = useSharedValue(0);
//     const y = useSharedValue(0);
//     const gestureHandler = useAnimatedGestureHandler({
//         onStart: (e, value) => {
//             value.startX = x.value;
//             value.startY = y.value;
//         },
//         onActive: (e, value) => {
//             x.value = value.startX + e.translationX;
//             y.value = value.startY + e.translationY;
//         },
//         onEnd: (e, value) => {
//             x.value = withSpring(0);
//             y.value = withSpring(0);
//         }
//     })
//     const animatedStyle = useAnimatedStyle(() => {
//         return {
//             transform: [{ translateX: x.value }, { translateY: y.value }]
//         }
//     })
//     return (
//         <GestureHandlerRootView style={{ flex: 1 }}>
//             <View style={{ flex: 1,alignItems:'center',justifyContent:'center' }}>
//                 <PanGestureHandler onGestureEvent={gestureHandler}>
//                     <Animated.View style={[{ height: 100, width: 100, backgroundColor: 'red' }, animatedStyle]}>

//                     </Animated.View>

//                 </PanGestureHandler>
//             </View>
//         </GestureHandlerRootView>
//     )
// }

// export default Demo

/*ANIMATED SEARCH BAR*/
// import { View, Text, TouchableOpacity, TextInput } from 'react-native';
// import React, { useState } from 'react';
// import { Sizes } from '../Modules/Modules';
// import Animated, {
//     interpolate,
//     interpolateColor,
//     useAnimatedStyle,
//     useSharedValue,
//     withSpring,
//     withTiming,
// } from 'react-native-reanimated';
// import {
//     GestureHandlerRootView,
//     PanGestureHandler,
// } from 'react-native-gesture-handler';
// import { useAnimatedGestureHandler } from 'react-native-reanimated';
// import { width } from '../Functions';
// import { Icon } from '../Components';

// const Demo = () => {
//     const [value, setValue] = useState(0);
//     const animation = useSharedValue(1);
//     const animatedStyle = useAnimatedStyle(() => {
//         return {
//             width:
//                 animation.value == 1
//                     ? withTiming('100%', { duration: 500 })
//                     : withTiming(0, { duration: 500 }),

//         };

//     });
//     return (
//         <View
//             style={{
//                 flex: 1,
//                 justifyContent: 'center',
//                 alignItems: 'flex-end',
//                 paddingHorizontal: Sizes.ScreenPadding,
//             }}>
//             <Animated.View
//                 style={[
//                     {
//                         height: 40,
//                         backgroundColor: '#E7E7E7',
//                         width: '100%',
//                         flexDirection: 'row',
//                         borderRadius: 10,
//                         alignItems: 'center',
//                         justifyContent: 'flex-end',
//                     },
//                     animatedStyle,
//                 ]}>
//                 <TextInput placeholder="Search here..." style={{ flex: 0.9 }}></TextInput>
//                 <TouchableOpacity
//                     style={{ flex: 0.1, marginRight: value == 0 ? Sizes.ScreenPadding : 0 }}
//                     onPress={() => {
//                         if (animation.value == 1) {
//                             animation.value = 0;
//                             setValue(0);
//                         } else {
//                             animation.value = 1;
//                             setValue(1);
//                         }
//                     }}>
//                     {value == 0 ? (
//                         <Icon
//                             name="search1"
//                             type="AntDesign"
//                             style={{ height: 30, width: 30 }}
//                         />
//                     ) : (
//                         <Icon
//                             name="close"
//                             type="AntDesign"
//                             style={{ height: 30, width: 30, marginRight: -Sizes.ScreenPadding }}
//                         />
//                     )}
//                 </TouchableOpacity>
//             </Animated.View>
//         </View>
//     );
// };

// export default Demo;

/*LIST VIEW LIKE GMAIL*/

// import {View, Text} from 'react-native';
// import React from 'react';
// import {
//   GestureHandlerRootView,
//   PanGestureHandler,
// } from 'react-native-gesture-handler';
// import Animated, {
//     interpolateColor,
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
// } from 'react-native-reanimated';
// import {useAnimatedGestureHandler} from 'react-native-reanimated';
// import {Icon, Toast} from '../Components';

// const Demo = () => {
//   const animation = useSharedValue(0);
//   const gestureHandler = useAnimatedGestureHandler({
//     onStart: (e, v) => {
//       v.startX = animation.value;
//     },
//     onActive: (e, v) => {
//       animation.value = v.startX + e.translationX;
//     },
//     onEnd: (e, v) => {
//       if (animation.value>70 ||animation.value<-70) {
//         animation.value = v.startX + e.translationX;
//       } else {
//         animation.value = withSpring(0);
//       }
//     },
//   });
//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{translateX: animation.value}],
//     };
//   });
//   const BackgroundAnimatedStyle = useAnimatedStyle(() => {
//     const backgroundColor=interpolateColor(animation.value,[1,0],['green','red'])
//     return {

//       backgroundColor
//     };
//   });
//   {/*ANIMATION FOR LEFT ICONS*/}
//   const animatesStyleLeftIcon=useAnimatedStyle(()=>{
//    return{
//     transform:[{scale:animation.value>70?withSpring(2):withSpring(1)}]
//    }
//   })
//    {/*ANIMATION FOR RIGHT ICONS*/}
//    const animatesStyleRightIcon=useAnimatedStyle(()=>{
//     return{
//      transform:[{scale:animation.value<-70?withSpring(2):withSpring(1)}]
//     }
//    })

//   return (
//     <GestureHandlerRootView style={{flex: 1}}>
//       <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//         <PanGestureHandler onGestureEvent={gestureHandler}>
//           <Animated.View
//             style={[{
//               width: '100%',
//               height: 100,
//               backgroundColor: 'green',
//               elevation: 5,
//               flexDirection: 'row',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//             },BackgroundAnimatedStyle]}>
//             <Animated.View style={[{height: 20, width: 20, marginLeft: 20},animatesStyleLeftIcon]}>
//               <Icon
//                 name="done"
//                 type="MaterialIcons"
//                 style={{width: '100%', height: '100%'}}
//                 color="white"></Icon>
//             </Animated.View>
//             <Animated.View style={[{height: 20, width: 20, marginRight: 20},animatesStyleRightIcon]}>
//               <Icon onPress={()=>{
//                 deleteItem();
//                 Toast("delete")}}
//                 name="delete"
//                 type="MaterialCommunityIcons"
//                 style={{width: '100%', height: '100%'}}
//                 color="white"></Icon>
//             </Animated.View>
//             <Animated.View
//               style={[
//                 {
//                   width: '100%',
//                   height: 100,
//                   backgroundColor: 'white',
//                   position: 'absolute',
//                 },
//                 animatedStyle,
//               ]}></Animated.View>
//           </Animated.View>
//         </PanGestureHandler>
//       </View>
//     </GestureHandlerRootView>
//   );
// };

// export default Demo;

{
  /*gmail animation for list*/
}
import {View, Text, FlatList} from 'react-native';
import React from 'react';
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
import RenderItems from './RenderItems';
const data = [
  {id: '1', title: 'Item 1'},
  {id: '2', title: 'Item 2'},
  {id: '3', title: 'Item 3'},
  {id: '4', title: 'Item 4'},
  {id: '5', title: 'Item 5'},
  // Add more items as needed
];

const Demo = () => {
  return (
    <FlatList
      data={data}
      renderItem={item => {
        return <RenderItems {...item} />;
      }}
      keyExtractor={item => item.id}
    />
  );
};

export default Demo;
