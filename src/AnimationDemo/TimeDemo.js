// import React, { useState } from 'react';
// import { View, StyleSheet, Text } from 'react-native';
// import TimePicker from '../Components/TimePicker';

// const YourComponent = () => {
//   const [selectedTime, setSelectedTime] = useState('');

//   const handleTimeSelect = (time) => {
//     setSelectedTime(time);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.selectedTime}>{selectedTime}</Text>
//       <TimePicker onSelect={handleTimeSelect} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   selectedTime: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
// });

// export default YourComponent;

import { View, Text } from 'react-native'
import React from 'react'

const TimeDemo = () => {
  return (
    <View>
      <Text>TimeDemo</Text>
    </View>
  )
}

export default TimeDemo