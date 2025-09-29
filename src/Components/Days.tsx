import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from '../Modules';

interface daysProps {
  startDay: any;
  totalDays: any;
  currentDay: any;
  onPress: (date: string) => void;
}
const Days = ({startDay, totalDays, currentDay, onPress}: daysProps) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const daysArray = Array.from(
    {length: totalDays - 1},
    (_, index) => index + 1,
  );
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Sizes.Radius,
    },
    dayCircle: {
      width: 48,
      height: 48,
      borderRadius: 48 / 2,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 5,
      paddingVertical: 5,
    },
    currentDayCircle: {
      borderColor: '#0075CB',
      borderWidth: 1,
      backgroundColor: Colors.Primary,
    },
    pastDayCircle: {
      backgroundColor: Colors.White,
    },
    futureDayCircle: {
      backgroundColor: '#CCD1D1',
    },
    selectedDayCircle: {
      borderWidth: 2,
      borderColor: Colors.Primary,
      backgroundColor: Colors.White,
    },
    dayText1: {
      ...Fonts.Medium3,
      marginTop: 5,
    },
    dayText: {
      ...Fonts.Bold2,
      marginTop: -5,
    },
    currentDayText: {
      color: Colors.White,
    },
    pastDayText: {
      color: Colors.PrimaryText1,
    },
    futureDayText: {
      color: '#808080',
    },
    selectedDayText: {
      color: Colors.PrimaryText1,
    },
  });
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {daysArray.map(day => {
        let dayStyle = styles.futureDayCircle;
        let textStyle = styles.futureDayText;

        if (day < currentDay) {
          dayStyle = styles.pastDayCircle;
          textStyle = styles.pastDayText;
        } else if (day === currentDay) {
          dayStyle = styles.currentDayCircle;
          textStyle = styles.currentDayText;
        }
        if (day === selectedDay) {
          dayStyle = styles.selectedDayCircle;
          textStyle = styles.selectedDayText;
        }

        if (day === selectedDay && day === currentDay) {
          dayStyle = styles.currentDayCircle;
          textStyle = styles.currentDayText;
        }
        return (
          <TouchableOpacity
            disabled={day > currentDay}
            onPress={() => {
              const selectedDate = startDay
                .clone()
                .add(day - 1, 'days')
                .format('YYYY-MM-DD');
              setSelectedDay(day);
              onPress(selectedDate);
            }}
            key={day}
            style={[styles.dayCircle, dayStyle]}>
            <Text style={[styles.dayText1, textStyle]}>{'Day'}</Text>
            <Text style={[styles.dayText, textStyle]}>{day}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default Days;
