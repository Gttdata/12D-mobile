// import React, {useState} from 'react';
// import {View, Text, TouchableOpacity} from 'react-native';
// import {Colors, Sizes, Fonts} from '../../Modules/Modules';
// import {FlatList} from 'react-native-gesture-handler';
// import moment from 'moment';

// const CalendarComponent = ({dates, onDatePress}) => {
//   const [selectedDate, setSelectedDate] = useState(null);

//   // const isCurrentDate = (item) => {
//   //   const formattedDateItem = moment(item).format('YYYY-MM-DD');
//   //   const formattedDate = moment(new Date()).format('YYYY-MM-DD');
//   //   return formattedDateItem === formattedDate;
//   // };
//   const isCurrentDate = item => {
//     const formattedDateItem = moment(item).format('YYYY-MM-DD');
//     const formattedSelectedDate = moment(dates[selectedDate]).format(
//       'YYYY-MM-DD',
//     );
//     return formattedDateItem === formattedSelectedDate;
//   };
//   return (
//     <View>
//       <FlatList
//         style={{
//           backgroundColor: Colors.Primary2,
//           borderRadius: 16,
//           margin: 10,
//           alignSelf: 'center',
//           padding: Sizes.Padding,
//         }}
//         data={dates}
//         horizontal
//         renderItem={({item, index}) => {
//           // Splitting item into weekday and date
//           // console.log("index",index)
//           const [weekday, month, date] = item.split(' ');
//           // console.log('hhh', weekday, '\n\n', month, '\n\n', date);

//           return (
//             <TouchableOpacity
//               onPress={() => {
//                 setSelectedDate(index);
//                 onDatePress(item);
//               }}>
//               <View>
//                 <View
//                   style={{
//                     backgroundColor: isCurrentDate(item)
//                       ? 'white'
//                       : selectedDate === index
//                       ? 'white'
//                       : Colors.Primary2,
//                     paddingHorizontal: 10,
//                     paddingVertical: 10,
//                     borderRadius: 16,
//                   }}>
//                   <Text
//                     style={{
//                       textAlign: 'center',
//                       color: isCurrentDate(item)
//                         ? Colors.Primary
//                         : selectedDate === index
//                         ? Colors.Primary
//                         : Colors.White + 99,
//                       ...Fonts.B2,
//                     }}>
//                     {weekday}
//                   </Text>
//                   <Text
//                     style={{
//                       textAlign: 'center',
//                       color: isCurrentDate(item)
//                         ? Colors.Primary
//                         : selectedDate === index
//                         ? Colors.Primary
//                         : 'white',
//                       ...Fonts.B2,
//                     }}>
//                     {date}
//                   </Text>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           );
//         }}
//         keyExtractor={(item, index) => index.toString()} // Assuming each item has a unique index
//       />
//     </View>
//   );
// };

// export default CalendarComponent;

import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {useSelector} from '../../Modules';

const CalendarComponent = ({dates, onDatePress}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);

  const {t} = useTranslation();
  const [selectedDate, setSelectedDate] = useState(null);
  const isCurrentDate = item => {
    const formattedDateItem = moment(item).format('YYYY-MM-DD');
    const formattedSelectedDate = moment(dates[selectedDate]).format(
      'YYYY-MM-DD',
    );
    return formattedDateItem === formattedSelectedDate;
  };
  return (
    <View>
      <FlatList
        style={{
          backgroundColor: Colors.Primary2,
          borderRadius: 16,
          margin: 10,
          alignSelf: 'center',
          padding: Sizes.Padding,
        }}
        data={dates}
        horizontal
        renderItem={({item, index}) => {
          const [weekday, month, date] = item.split(' ');
          const week = [];
          week.push(weekday == 'Sun' && t('weekday.sun'));
          week.push(weekday == 'Mon' && t('weekday.mon'));
          week.push(weekday == 'Tue' && t('weekday.tue'));
          week.push(weekday == 'Wed' && t('weekday.wed'));
          week.push(weekday == 'Thu' && t('weekday.thu'));
          week.push(weekday == 'Fri' && t('weekday.fri'));
          week.push(weekday == 'Sat' && t('weekday.sat'));
          return (
            <TouchableOpacity
              onPress={() => {
                setSelectedDate(index);
                onDatePress(item);
              }}>
              <View>
                <View
                  style={{
                    backgroundColor: isCurrentDate(item)
                      ? 'white'
                      : selectedDate === index
                      ? 'white'
                      : Colors.Primary2,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderRadius: 16,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: isCurrentDate(item)
                        ? Colors.Primary
                        : selectedDate === index
                        ? Colors.Primary
                        : Colors.White + 99,
                      ...Fonts.Bold3,
                    }}>
                    {week}
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: isCurrentDate(item)
                        ? Colors.Primary
                        : selectedDate === index
                        ? Colors.Primary
                        : 'white',
                      ...Fonts.Bold3,
                    }}>
                    {date}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => index.toString()} // Assuming each item has a unique index
      />
    </View>
  );
};

export default CalendarComponent;
