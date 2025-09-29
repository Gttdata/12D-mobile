// import React from 'react';
// import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import { PanGestureHandler, State } from 'react-native-gesture-handler';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   useAnimatedGestureHandler,
//   withSpring,
//   clamp,
//   runOnJS,
// } from 'react-native-reanimated';

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// const ITEM_HEIGHT = 40; // Height of each item
// const HOURS = Array.from({ length: 24 }, (_, i) => ('0' + i).slice(-2)); // Array of hours (00 to 23)
// const MINUTES = Array.from({ length: 60 }, (_, i) => ('0' + i).slice(-2)); // Array of minutes (00 to 59)

// const TimePicker = ({ onSelect }) => {
//   const translateY = useSharedValue(0);

//   const handleSelection = (translateYValue) => {
//     const closestIndex = Math.round(-translateYValue / ITEM_HEIGHT);
//     const selectedHour = HOURS[closestIndex % HOURS.length];
//     const selectedMinute = MINUTES[closestIndex % MINUTES.length];
//     onSelect(`${selectedHour}:${selectedMinute}`);
//   };

//   const gestureHandler = useAnimatedGestureHandler({
//     onStart: (_, ctx) => {
//       ctx.startY = translateY.value;
//     },
//     onActive: (event, ctx) => {
//       translateY.value = clamp(
//         ctx.startY + event.translationY,
//         -ITEM_HEIGHT * (HOURS.length + MINUTES.length - 1),
//         0
//       );
//     },
//     onEnd: () => {
//       translateY.value = withSpring(
//         Math.round(translateY.value / ITEM_HEIGHT) * ITEM_HEIGHT
//       );
//       runOnJS(handleSelection)(translateY.value);
//     },
//   });

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateY: translateY.value }],
//   }));

//   return (
//     <View style={styles.container}>
//       <View style={styles.mask} />
//       <View style={styles.picker}>
//         <PanGestureHandler
//           onGestureEvent={gestureHandler}
//           onHandlerStateChange={({ nativeEvent }) => {
//             if (nativeEvent.state === State.END) {
//               translateY.value = withSpring(
//                 Math.round(translateY.value / ITEM_HEIGHT) * ITEM_HEIGHT
//               );
//             }
//           }}
//         >
//           <Animated.View style={[styles.itemContainer, animatedStyle]}>
//             {HOURS.map((hour, index) => (
//               <Text key={index} style={styles.itemText}>{hour}</Text>
//             ))}
//             {/* {MINUTES.map((minute, index) => (
//               <Text key={index} style={styles.itemText}>{minute}</Text>
//             ))} */}
//           </Animated.View>
//         </PanGestureHandler>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//    // flex: 1,
//     justifyContent: 'center',
//     backgroundColor:'white',
//     alignItems: 'center',
//   },
//   mask: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor:'white'
//     // backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   picker: {
//     height: ITEM_HEIGHT,
//     width: '80%',
//     backgroundColor: 'white',
//     borderRadius: 10,
//    // overflow: 'hidden',
//   },
//   itemContainer: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   itemText: {
//     fontSize: 20,
//     height: ITEM_HEIGHT,
//     lineHeight: ITEM_HEIGHT,
//   },
// });

// export default TimePicker;



import React, { useRef, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';

const StaticUI = () => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const itemHeight = Dimensions.get('window').height;
    const newIndex = Math.floor(contentOffsetY / itemHeight);
    setSelectedItemIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        vertical
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        ref={scrollViewRef}
      >
        {[1, 2, 3, 4, 5].map((item, index) => (
          <View key={index} style={[styles.itemContainer, index === selectedItemIndex ? styles.selectedItem : null]}>
            <Text style={styles.itemText}>{`Item ${item}`}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    height: Dimensions.get('window').height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
  },
  selectedItem: {
    backgroundColor: 'lightblue',
  },
  itemText: {
    fontSize: 24,
  },
});

export default StaticUI;
