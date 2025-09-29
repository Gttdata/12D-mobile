import {
  View,
  Text,
  NativeModules,
  TouchableOpacity,
  Platform,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {apiPost, apiPut, useSelector} from '../../Modules';
import {Icon, TextButton, TextInput, Toast} from '../../Components';
import DropdownSimple from '../../Components/DropdownSimple';
import moment from 'moment';
import {Checkbox} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutUp,
} from 'react-native-reanimated';
import {StackProps} from '../../routes';
import DatePicker from 'react-native-date-picker';

const COLOR_CODE: any = [
  {name: 'Event', code: '#AF7AC5'},
  {name: 'Meeting', code: '#64D76C'},
  {name: 'Sport and Fitness', code: '#F39c12'},
  {name: 'Studies', code: '#FF675D'},
  {name: 'School/Function/ClassActivity', code: '#4995FF'},
  {name: 'Travel/Trip', code: '#FB8DA0'},
];
type Props = StackProps<'AddTaskForm'>;
const AddTaskForm = ({navigation, route}: Props) => {
  const {Colors, Sizes, Fonts} = useSelector(state => state.app);
  const {t} = useTranslation();
  const {item, type, pageType} = route.params;
  const {member} = useSelector(state => state.member);

  const [data, setData] = useState({
    loading: false,
    title: item ? item.TITLE : '',
    description: item?.DESCRIPTION ? item.DESCRIPTION : '',
    reminderStatus: item?.IS_REMIND ? item.IS_REMIND : false,
    reminderType: item?.REMIND_TYPE ? item.REMIND_TYPE : '',
    selectedColorTag: item?.COLOR_TAG ? item.COLOR_TAG : '',
    selectedColorName:
      item?.COLOR_TAG == '#AF7AC5'
        ? 'Event'
        : item?.COLOR_TAG == '#64D76C'
        ? 'Meeting'
        : item?.COLOR_TAG == '#F39c12'
        ? 'Sport and Fitness'
        : item?.COLOR_TAG == '#FF675D'
        ? 'Studies'
        : item?.COLOR_TAG == '#4995FF'
        ? 'School/Function/ClassActivity'
        : '',
  });
  const [date, setDate] = useState(
    item ? new Date(item.CREATED_DATETIME) : new Date(),
  );
  const [time, setTime] = useState(
    item ? new Date(item.CREATED_DATETIME) : new Date(),
  );
  const [reminderDate, setReminderDate] = useState(
    item ? new Date(item.REMIND_DATETIME) : new Date(),
  );
  const [reminderTime, setReminderTime] = useState(
    item
      ? new Date(item.REMIND_DATETIME)
      : new Date(new Date().setMinutes(new Date().getMinutes() - 5)),
  );
  const [showPicker, setShowPicker] = useState({
    date: false,
    reminderDate: false,
  });
  const [showTimePicker, setShowTimePicker] = useState({
    time: false,
    reminderTime: false,
  });

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  };
  const onChangeTime = (event: any, selectedTime: any) => {
    const currentTime = selectedTime;
    setTime(currentTime);
    setReminderTime(new Date(currentTime.getTime() - 5 * 60000));
  };

  const onChangeReminderDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setReminderDate(currentDate);
  };
  const onChangeReminderTime = (event: any, selectedTime: any) => {
    const currentTime = selectedTime || time;
    setReminderTime(currentTime);
  };
  const validate = () => {
    if (data.title.trim() == '') {
      Toast('Please Enter Title');
      return true;
    } else if (data.reminderStatus && data.reminderType == '') {
      Toast('Please select Reminder Type');
      return true;
    } else {
      return false;
    }
  };
  const creteTask = async () => {
    if (validate()) {
      return;
    }
    setData({...data, loading: true});
    try {
      let body = {
        MEMBER_ID: member?.ID,
        CREATED_DATETIME:
          moment(date).format('YYYY-MM-DD') +
          ' ' +
          moment(time).format('HH:mm'),
        TITLE: data.title,
        DESCRIPTION: data.description,
        IS_REMIND: data.reminderStatus,
        REMIND_DATETIME:
          moment(reminderDate).format('YYYY-MM-DD') +
          ' ' +
          moment(reminderTime).format('HH:mm'),
        IS_COMPLETED: 0,
        REMIND_TYPE: data.reminderType,
        STATUS: 1,
        CLIENT_ID: 1,
        TYPE: 'TD',
      };
      const res = await apiPost('api/memberTodo/create', body);
      if (res && res.code == 200) {
        setData({...data, loading: false});
        Toast('Task Added Successfully');
        navigation.goBack();
      }
    } catch (error) {
      setData({...data, loading: false});
      console.log('err,,,', error);
    }
  };
  const UpdateTask = async () => {
    setData({...data, loading: true});
    try {
      let body = {
        MEMBER_ID: member?.ID,
        ID: item?.ID,
        CREATED_DATETIME:
          moment(date).format('YYYY-MM-DD') +
          ' ' +
          moment(time).format('HH:mm'),
        TITLE: data.title,
        DESCRIPTION: data.description,
        IS_REMIND: data.reminderStatus,
        REMIND_DATETIME:
          moment(reminderDate).format('YYYY-MM-DD') +
          ' ' +
          moment(reminderTime).format('HH:mm'),
        REMIND_TYPE: data.reminderType,
        STATUS: 1,
        IS_COMPLETED: 0,
        CLIENT_ID: 1,
        TYPE: pageType == 'W' ? 'WP' : 'TD',
        COLOR_TAG: data.selectedColorTag ? data.selectedColorTag : '',
        IS_FULL_WEEK: 0,
        IS_SUB_TASK: 1,
      
      };
      const res = await apiPut('api/memberTodo/update', body);
      if (res && res.code == 200) {
        Toast('Task Updated Successfully');
        setData({...data, loading: false});
        navigation.goBack();
      }
    } catch (error) {
      console.log('err,,,', error);
    }
  };
  // console.log(item);
  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutDown}
      style={{
        flex: 1,
        backgroundColor: '#00000050',
        // transform: [{translateY: drawerTranslateX}],
      }}>
      <Text
        style={{flex: 1}}
        onPress={() => {
          navigation.goBack();
        }}></Text>
      <View
        style={{
          height: '85%',
          backgroundColor: Colors.White,
          borderTopRightRadius: Sizes.Radius,
          borderTopLeftRadius: Sizes.Radius,
          elevation: 10,
          padding: Sizes.Padding,
        }}>
        <View
          style={{
            height: 5,
            width: 80,
            alignSelf: 'center',
            backgroundColor: Colors.Primary2,
            borderRadius: 3,
            marginBottom: Sizes.Padding,
          }}
        />
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View style={{marginHorizontal: Sizes.Base}}>
            {/*date time row*/}
            {/* <View style={{flexDirection: 'row'}}>
              <DropdownSimple
                selectTextStyle={{...Fonts.Medium2, color: Colors.PrimaryText1}}
                leftIcon={
                  <Icon
                    name="calendar"
                    type="EvilIcons"
                    size={26}
                    style={{alignSelf: 'flex-start'}}
                  />
                }
                containerStyle={{
                  marginRight: 0,
                  borderBottomWidth: 0,
                  flex: 1,
                }}
                style={{
                  elevation: 6,
                  padding: Sizes.Base,
                  borderRadius: Sizes.Radius,
                  backgroundColor: Colors.White,
                }}
                labelText={moment(date).format('DD/MMM/YYYY')}
                selectText={'Date'}
                onPress={() => {
                  setShowPicker({...showPicker, date: true});
                }}
                imp={false}
              />
              <View style={{width: Sizes.Radius}} />
              <DropdownSimple
                selectTextStyle={{...Fonts.Medium2, color: Colors.PrimaryText1}}
                leftIcon={
                  <Icon
                    name="clock"
                    type="EvilIcons"
                    size={25}
                    style={{alignSelf: 'flex-start'}}
                  />
                }
                containerStyle={{
                  marginRight: 0,
                  borderBottomWidth: 0,
                  flex: 1,
                }}
                style={{
                  elevation: 6,
                  padding: Sizes.Base,
                  borderRadius: Sizes.Radius,
                  backgroundColor: Colors.White,
                }}
                labelText={moment(time).format('HH:mm')}
                selectText={'Time'}
                onPress={() => {
                  setShowTimePicker({...showTimePicker, time: true});
                }}
                imp={false}
              />
            </View> */}
            <View style={{height: Sizes.Base}} />
            <TextInput
              labelStyle={{...Fonts.Medium2, color: Colors.PrimaryText1}}
              label="Title"
              placeholder="Enter Title"
              onChangeText={value => {
                setData({...data, title: value});
              }}
              value={data.title}
              autoFocus={true}
            />
            <View style={{height: Sizes.Base}} />
            <TextInput
              labelStyle={{
                marginTop: Sizes.Radius,
                ...Fonts.Medium2,
                color: Colors.PrimaryText1,
              }}
              multiline
              label="Description"
              placeholder="Enter Description"
              onChangeText={value => {
                setData({...data, description: value});
              }}
              value={data.description}
              autoFocus={false}
            />

            {/* color tags */}
            <View style={{height: Sizes.Base}} />
            <View style={{marginTop: Sizes.Padding}}>
              <Text
                style={{
                  ...Fonts.Medium2,
                  color: Colors.PrimaryText1,
                  marginBottom: 4,
                }}>
                Tags 
              </Text>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FlatList
                  data={COLOR_CODE}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}: {item: any; index: number}) => {
                    return (
                      <View
                        key={index}
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: Sizes.Padding,
                        }}>
                        <View
                          style={{
                            height: 29,
                            width: 29,
                            borderRadius: 14,
                            backgroundColor: Colors.Background,
                            borderWidth: 2,
                            borderColor:
                              item.code == data.selectedColorTag
                                ? item.code
                                : Colors.Background,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                              setData({
                                ...data,
                                selectedColorName: item.name,
                                selectedColorTag: item.code,
                              });
                            }}
                            style={{
                              height: 22,
                              width: 22,
                              borderRadius: 11,
                              backgroundColor: item.code,
                            }}>
                            <Text></Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                />
                {data.selectedColorName && (
                  <Text
                    style={{
                      ...Fonts.Bold2,
                      fontSize: 11,
                      color: data.selectedColorTag,
                      marginTop: Sizes.Base,
                      paddingVertical: Sizes.Base,
                      paddingHorizontal: Sizes.Padding,
                      elevation: 6,
                      shadowColor: Colors.Primary,
                      backgroundColor: Colors.White,
                      borderRadius: Sizes.Radius,
                      width: 230,
                      textAlign: 'center',
                    }}>
                    {data.selectedColorName}
                  </Text>
                )}
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: Sizes.Radius,
                marginLeft: -Sizes.Base,
              }}>
              <View
                style={{
                  transform: [{scale: 0.9}],
                  alignItems: 'center',
                }}>
                <Checkbox
                  status={
                    data.reminderStatus == false ? 'unchecked' : 'checked'
                  }
                  color={Colors.Primary}
                  onPress={() =>
                    setData({...data, reminderStatus: !data.reminderStatus})
                  }
                />
              </View>
              <Text
                onPress={() =>
                  setData({...data, reminderStatus: !data.reminderStatus})
                }
                style={{color: Colors.PrimaryText1, ...Fonts.Medium2}}>
                Remind Me
              </Text>
            </View>

            {/*SHOW IF REMINDER CHECKED*/}
            {data.reminderStatus && (
              <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
                <View style={{flexDirection: 'row'}}>
                  <DropdownSimple
                    selectTextStyle={{
                      ...Fonts.Medium2,
                      color: Colors.PrimaryText1,
                    }}
                    leftIcon={
                      <Icon
                        name="calendar"
                        type="EvilIcons"
                        size={26}
                        style={{alignSelf: 'flex-start'}}
                      />
                    }
                    containerStyle={{
                      marginRight: 0,
                      borderBottomWidth: 0,
                      flex: 1,
                    }}
                    style={{
                      elevation: 6,
                      padding: Sizes.Base,
                      paddingVertical: Sizes.Radius,
                      borderRadius: Sizes.Radius,
                      backgroundColor: Colors.White,
                    }}
                    labelText={moment(reminderDate).format('DD/MMM/YYYY')}
                    selectText={'Date'}
                    onPress={() => {
                      setShowPicker({...showPicker, reminderDate: true});
                    }}
                    imp={false}
                  />
                  <View style={{width: Sizes.Radius}} />
                  <DropdownSimple
                    selectTextStyle={{
                      ...Fonts.Medium2,
                      color: Colors.PrimaryText1,
                    }}
                    leftIcon={
                      <Icon
                        name="clock"
                        type="EvilIcons"
                        size={25}
                        style={{alignSelf: 'flex-start'}}
                      />
                    }
                    containerStyle={{
                      marginRight: 0,
                      borderBottomWidth: 0,
                      flex: 1,
                    }}
                    style={{
                      elevation: 6,
                      padding: Sizes.Base,
                      paddingVertical: Sizes.Radius,
                      borderRadius: Sizes.Radius,
                      backgroundColor: Colors.White,
                    }}
                    labelText={moment(reminderTime).format('HH:mm')}
                    selectText={'Time'}
                    onPress={() => {
                      setShowTimePicker({
                        ...showTimePicker,
                        reminderTime: true,
                      });
                    }}
                    imp={false}
                  />
                </View>

                {/*ALARM OR POPUP BUTTONS*/}
                <View
                  style={{flexDirection: 'row', marginVertical: Sizes.Padding}}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setData({...data, reminderType: 'A'})}
                    style={{
                      backgroundColor:
                        data.reminderType == 'A'
                          ? Colors.Secondary
                          : Colors.Background,
                      padding: Sizes.Base,
                      borderRadius: Sizes.Padding,
                      flex: 1,
                      paddingVertical: Sizes.Radius,
                      elevation: Sizes.Base,
                      shadowColor: Colors.Primary,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon
                        name="alarm"
                        type="MaterialCommunityIcons"
                        color={Colors.Primary}
                      />
                      <Text
                        style={{
                          color: Colors.Primary,
                          marginLeft: Sizes.Base,
                          ...Fonts.Medium2,
                        }}>
                        Alarm
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{width: Sizes.Radius}} />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setData({...data, reminderType: 'P'})}
                    style={{
                      backgroundColor:
                        data.reminderType == 'P'
                          ? Colors.Secondary
                          : Colors.Background,
                      padding: Sizes.Base,
                      borderRadius: Sizes.Padding,
                      flex: 1,
                      paddingVertical: Sizes.Radius,
                      elevation: Sizes.Base,
                      shadowColor: Colors.Primary,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon
                        name="bell-ring-outline"
                        type="MaterialCommunityIcons"
                        color={Colors.Primary}
                      />
                      <Text
                        style={{
                          color: Colors.Primary,
                          marginLeft: Sizes.Base,
                          ...Fonts.Medium2,
                        }}>
                        Pop Up
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
          </View>
        </ScrollView>
        <View style={{height: Sizes.ScreenPadding}} />
        <TextButton
          label={type == 'U' ? 'Update' : 'Save'}
          loading={data.loading}
          onPress={() => {
            type == 'U' ? UpdateTask() : creteTask();
          }}
        />
      </View>
      {showPicker.date && (
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
      {showPicker.reminderDate && (
        <DateTimePicker
          minimumDate={new Date()}
          testID="dateTimePicker"
          value={reminderDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChangeReminderDate}
        />
      )}
      {/* {showTimePicker.time && (
        <DateTimePicker
          testID="timePicker"
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeTime}
        />
      )}
      {showTimePicker.reminderTime && (
        <DateTimePicker
          testID="timePicker"
          value={reminderTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeReminderTime}
        />
      )} */}

      {showTimePicker.time && (
        <DatePicker
          modal
          open={showTimePicker.time}
          mode="time"
          date={time}
          buttonColor={Colors.Primary}
          dividerColor={Colors.Primary}
          onConfirm={t => {
            console.log('time', t);
            setShowTimePicker({...showTimePicker, time: false});
            setTime(t);
          }}
          onCancel={() => {
            setShowTimePicker({...showTimePicker, time: false});
          }}
        />
      )}

      {showTimePicker.reminderTime && (
        <DatePicker
          modal
          open={showTimePicker.reminderTime}
          mode="time"
          date={reminderTime}
          buttonColor={Colors.Primary}
          dividerColor={Colors.Primary}
          onConfirm={t => {
            console.log('time', t);
            setShowTimePicker({...showTimePicker, reminderTime: false});
            setReminderTime(t);
          }}
          onCancel={() => {
            setShowTimePicker({...showTimePicker, reminderTime: false});
          }}
        />
      )}
    </Animated.View>
  );
};

export default AddTaskForm;
