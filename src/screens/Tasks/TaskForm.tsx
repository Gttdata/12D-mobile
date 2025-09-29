
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Colors, Sizes} from '../../Modules/Modules';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { TextButton, Toast } from '../../Components';

const AddTaskForm = ({navigation, route}) => {
  const [taskName, setTaskName] = useState('');
  // const [date, setDate] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  };
  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };
  const handleSubmit = async () => {
    if(taskName=='')
    {
      Toast("Please Enter Task Name")
    }
    else
    {
      const onSubmit = route.params.onSubmit;
      if (onSubmit) {
        await onSubmit({taskName, date, time});
        setTaskName('');
        onChange;
        onChangeTime;
        navigation.goBack();
    }
    
    }
    // Navigate back to previous screen
  };
 // console.log('date', date);
  return (
    <View style={{padding: Sizes.ScreenPadding,backgroundColor:Colors.White,flex:1}}>
      <Text>Task Name:</Text>
      <TextInput
        value={taskName}
        onChangeText={setTaskName}
        placeholder="Enter task name"
      />
      <Text>Date:</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TextInput value={moment(date).format('DD/MMM/YYYY')} />
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Text style={{color: Colors.Primary, textAlign: 'right'}}>select Date</Text>
        </TouchableOpacity>
      </View>

      <Text>Time:</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TextInput value={moment(time).format('HH:mm')} />
        <TouchableOpacity onPress={() => setShowTimePicker(true)}>
          <Text style={{color: Colors.Primary, textAlign: 'right'}}>select Time</Text>
        </TouchableOpacity>
      </View>

      
 
<TextButton label='Add Task' loading={false} onPress={handleSubmit }/>
      {/* <Button title="Add Task" onPress={handleSubmit}/> */}
      {showPicker && (
        <DateTimePicker
        minimumDate={new Date()}
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
        
          testID="timePicker"
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeTime}
        />
      )}
    </View>
  );
};

export default AddTaskForm;
