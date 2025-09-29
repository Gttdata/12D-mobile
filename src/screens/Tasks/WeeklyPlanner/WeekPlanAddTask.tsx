import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import React, { useState } from 'react';
import { apiPost, useSelector } from '../../../Modules';
import { Icon, TextButton, TextInput, Toast } from '../../../Components';
import DropdownSimple from '../../../Components/DropdownSimple';
import moment from 'moment';
import { Checkbox, Switch } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
} from 'react-native-reanimated';
import { StackProps } from '../../../routes';
import DatePicker from 'react-native-date-picker';

const COLOR_CODE: any = [
  { name: 'Event', code: '#AF7AC5' },
  { name: 'Meeting', code: '#64D76C' },
  { name: 'Sport and Fitness', code: '#F39c12' },
  { name: 'Studies', code: '#FF675D' },
  { name: 'School/Function/ClassActivity', code: '#4995FF' },
  { name: 'Travel/Trip', code: '#FB8DA0' },
];
type Props = StackProps<'WeekPlanAddTask'>;
const WeekPlanAddTask = ({ navigation, route }: Props) => {
  const { Colors, Sizes, Fonts } = useSelector(state => state.app);
  const { t } = useTranslation();
  const { item, type, selectedDateArray } = route.params;
  const { member } = useSelector(state => state.member);
  const [data, setData] = useState({
    loading: false,
    title: item ? item.TITLE : '',
    description: item?.DESCRIPTION ? item.DESCRIPTION : '',
    reminderStatus: true,
    reminderType: item?.REMIND_TYPE ? item.REMIND_TYPE : '',
    selectedColorTag: item?.COLOR_TAG ? item.COLOR_TAG : '',
    selectedColorName:
      item?.COLOR_TAG == '#AF7AC5'
        ? 'Event'
        : item?.COLOR_TAG == '#64D76C'
          ? 'Meeting'
          : item?.COLOR_TAG == '#F39c12'
            ? 'Sport ad Fitness'
            : item?.COLOR_TAG == '#FF675D'
              ? 'Studies'
              : item?.COLOR_TAG == '#4995FF'
                ? 'School/Function/ClassActivity'
                : item?.COLOR_TAG == '#FB8DA0'
                  ? 'Travel/Trip'
                  : '',
  });
  const [date, setDate] = useState(
    item ? new Date(item.CREATED_DATETIME) : new Date(),
  );
  const [time, setTime] = useState(
    item
      ? type == 'C'
        ? new Date(item.REMIND_DATETIME)
        : new Date(item.CREATED_DATETIME)
      : new Date(),
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
    setShowPicker({ ...showPicker, date: false });
    const currentDate = selectedDate;
    setDate(currentDate);
    setSelectedDates([currentDate]);
    setWeekDates(getWeekDates(currentDate));
  };
  const onChangeTime = (event: any, selectedTime: any) => {
    const currentTime = selectedTime;
    setTime(currentTime);
    setReminderTime(new Date(currentTime.getTime() - 5 * 60000));
  };
  const onChangeReminderDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
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
    } else if (isFullWeek && selectedDates.length == 0) {
      Toast('Please select any day');
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
    setData({ ...data, loading: true });
    try {
      let body = {
        MEMBER_ID: member?.ID,
        WEEK_PLAN_DATES: isFullWeek
          ? selectedDates.map((item: any) => {
            return (
              moment(item).format('YYYY-MM-DD') +
              ' ' +
              moment(time).format('HH:mm:00')
            );
          })
          : [
            moment(date).format('YYYY-MM-DD') +
            ' ' +
            moment(time).format('HH:mm:00'),
          ],
        TITLE: data.title,
        DESCRIPTION: data.description,
        IS_REMIND: data.reminderStatus,
        REMIND_TIME: moment(reminderTime).format('HH:mm'),
        IS_COMPLETED: 0,
        REMIND_TYPE: data.reminderType,
        STATUS: 1,
        CLIENT_ID: 1,
        TYPE: 'WP',
        COLOR_TAG: data.selectedColorTag ? data.selectedColorTag : '',
        IS_FULL_WEEK: !isFullWeek || selectedDates.length == 1 ? 0 : 1,
      };
      // console.log('\n\n..body..', body);
      const res = await apiPost('api/memberTodo/add', body);
      if (res && res.code == 200) {
        setData({ ...data, loading: false });
        Toast('Task Added Successfully');
        navigation.goBack();
      } else {
        Toast('Something wrong please try again');
        setData({ ...data, loading: false });
      }
    } catch (error) {
      setData({ ...data, loading: false });
      console.log('err,,,', error);
    }
  };
  const UpdateTask = async () => {
    setData({ ...data, loading: true });
    try {
      let body = {
        MEMBER_ID: member?.ID,
        WEEK_PLAN_DATES: isFullWeek
          ? selectedDates.map((item: any) => {
            return (
              moment(item).format('YYYY-MM-DD') +
              ' ' +
              moment(time).format('HH:mm:00')
            );
          })
          : [
            moment(date).format('YYYY-MM-DD') +
            ' ' +
            moment(time).format('HH:mm:00'),
          ],
        TITLE: data.title,
        DESCRIPTION: data.description,
        IS_REMIND: data.reminderStatus,
        REMIND_TIME: moment(reminderTime).format('HH:mm'),
        REMIND_TYPE: data.reminderType,
        STATUS: 1,
        IS_COMPLETED: 0,
        CLIENT_ID: 1,
        TYPE: 'WP',
        GROUP_NO: item?.GROUP_NO,
        COLOR_TAG: data.selectedColorTag ? data.selectedColorTag : '',
        IS_FULL_WEEK: !isFullWeek || selectedDates.length == 1 ? 0 : 1,
      };
      // console.log('\n\n...body..', body);
      const res = await apiPost('api/memberTodo/updateSeries', body);
      if (res && res.code == 200) {
        setData({ ...data, loading: false });
        navigation.goBack();
        Toast('Task Updated Successfully');
      }
    } catch (error) {
      setData({ ...data, loading: false });
      console.log('err,,,', error);
    }
  };
  const getWeekDates = (selectDate: any) => {
    const dates = [];
    const startOfWeek = new Date(selectDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };
  const [weekDates, setWeekDates] = useState(getWeekDates(date));
  const [selectedDates, setSelectedDates] = useState<any>(
    selectedDateArray != null ? selectedDateArray : [date],
  );
  const [isFullWeek, setIsFullWeek] = useState(true);
  const toggleDateSelection = (item: any, index: any) => {
    const newWeekDates: any = [...weekDates];
    newWeekDates[index].selected = !newWeekDates[index].selected;
    setWeekDates(newWeekDates);
    const updatedSelectedDates = newWeekDates.filter(
      (date: any) => date.selected,
    );
    setSelectedDates(updatedSelectedDates);
  };

  // console.log('okk', !isFullWeek || selectedDates.length == 1);
  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutDown}
      style={{
        flex: 1,
        backgroundColor: '#00000050',
      }}>
      <Text
        style={{ flex: 1 }}
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
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ marginHorizontal: Sizes.Base }}>
            {/*date time row*/}
            {/* <View style={{ flexDirection: 'row' }}>
              <DropdownSimple
                selectTextStyle={{ ...Fonts.Medium2, color: Colors.PrimaryText1 }}
                leftIcon={
                  <Icon
                    name="calendar"
                    type="EvilIcons"
                    size={26}
                    style={{ alignSelf: 'flex-start' }}
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
                }}
                labelText={moment(date).format('DD/MMM/YYYY')}
                selectText={'Date'}
                onPress={() => {
                  setShowPicker({ ...showPicker, date: true });
                }}
                imp={false}
              />
              <View style={{ width: Sizes.Radius }} />
              <DropdownSimple
                selectTextStyle={{ ...Fonts.Medium2, color: Colors.PrimaryText1 }}
                leftIcon={
                  <Icon
                    name="clock"
                    type="EvilIcons"
                    size={25}
                    style={{ alignSelf: 'flex-start' }}
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
                  justifyContent: 'flex-start',
                }}
                labelText={moment(time).format('HH:mm')}
                selectText={'Time'}
                onPress={() => {
                  setShowTimePicker({ ...showTimePicker, time: true });
                }}
                imp={false}
              />
            </View> */}
            <View style={{ height: Sizes.Base }} />
            <TextInput
              labelStyle={{ ...Fonts.Medium2, color: Colors.PrimaryText1 }}
              label="Title"
              placeholder="Enter Title"
              onChangeText={value => {
                setData({ ...data, title: value });
              }}
              value={data.title}
              autoFocus={true}
            />
            <View style={{ height: Sizes.Base }} />
            <TextInput
              labelStyle={{
                marginTop: Sizes.Radius,
                ...Fonts.Medium2,
                color: Colors.PrimaryText1,
              }}
              label="Description"
              placeholder="Enter Description"
              onChangeText={value => {
                setData({ ...data, description: value });
              }}
              multiline
              value={data.description}
              autoFocus={false}
            />

            {/* color tags */}
            <View style={{ height: Sizes.Base }} />
            <View style={{ marginTop: Sizes.Padding }}>
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
                  renderItem={({ item, index }: { item: any; index: number }) => {
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

            {/* Switch */}
            <View
              style={{
                marginTop: Sizes.Padding,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  ...Fonts.Medium2,
                  color: Colors.PrimaryText1,
                }}>
                Set for the week?
              </Text>
              <Switch
                value={isFullWeek}
                onValueChange={() => {
                  setIsFullWeek(!isFullWeek);
                }}
                color={Colors.Primary}
              />
            </View>

            {/* select dates of week */}
            {isFullWeek && (
              <View style={{ width: '100%', marginTop: Sizes.Base }}>
                <FlatList
                  data={weekDates}
                  horizontal={false}
                  numColumns={4}
                  renderItem={({ item, index }: any) => {
                    const weekday = item.toLocaleDateString('en-US', {
                      weekday: 'short',
                    });

                    return (
                      <View style={{ width: '25%' }}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          disabled={
                            moment(item).format('YYYY-MM-DD') <
                              moment(new Date()).format('YYYY-MM-DD')
                              ? true
                              : false
                          }
                          style={{
                            width: '93%',
                            borderRadius: Sizes.Radius,
                            borderColor: Colors.Primary2,
                            elevation: 6,
                            shadowColor: Colors.Primary,
                            paddingVertical: Sizes.Base,
                            marginHorizontal: 3,
                            backgroundColor:
                              moment(item).format('YYYY-MM-DD') <
                                moment(new Date()).format('YYYY-MM-DD')
                                ? Colors.Disable
                                : selectedDates
                                  ? selectedDates.find(
                                    (it: any) =>
                                      moment(it).format('YYYY-MM-DD') ==
                                      moment(item).format('YYYY-MM-DD'),
                                  )
                                    ? Colors.Primary2
                                    : Colors.White
                                  : Colors.White,

                            marginVertical: Sizes.Base,
                          }}
                          onPress={() => toggleDateSelection(item, index)}>
                          <Text
                            style={{
                              ...Fonts.Medium2,
                              fontSize: 11,
                              color: selectedDates
                                ? selectedDates.find(
                                  (it: any) =>
                                    moment(it).format('YYYY-MM-DD') ==
                                    moment(item).format('YYYY-MM-DD'),
                                )
                                  ? Colors.White
                                  : Colors.PrimaryText1
                                : Colors.PrimaryText1,
                              textAlign: 'center',
                              textAlignVertical: 'center',
                            }}>
                            {weekday}
                          </Text>
                        </TouchableOpacity>
                        <View style={{ width: '2%' }} />
                      </View>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            )}

            {/* Remind me */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: Sizes.Radius,
                marginLeft: -Sizes.Base,
                marginBottom: -Sizes.Base,
              }}>
              <View
                style={{
                  transform: [{ scale: 0.9 }],
                  alignItems: 'center',
                }}>
                <Checkbox
                  status={
                    data.reminderStatus == false ? 'unchecked' : 'checked'
                  }
                  color={Colors.Primary}
                  onPress={() =>
                    setData({ ...data, reminderStatus: !data.reminderStatus })
                  }
                />
              </View>
              <Text
                style={{ color: Colors.PrimaryText1, ...Fonts.Medium2 }}
                onPress={() =>
                  setData({ ...data, reminderStatus: !data.reminderStatus })
                }>
                Remind Me
              </Text>
            </View>

            {/*SHOW IF REMINDER CHECKED*/}
            {data.reminderStatus && (
              <Animated.View
                entering={FadeInUp}
                exiting={FadeOutUp}
                style={{ marginBottom: Sizes.Base, marginVertical: Sizes.Base }}>
                
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: Sizes.Base,
                  }}>
                  <Text
                    style={{
                      ...Fonts.Medium2,
                      color: Colors.PrimaryText1,
                      flex: 0.3,
                      marginLeft: Sizes.Padding,
                      textAlign: 'center',
                    }}
                    allowFontScaling={false}>
                    Date
                  </Text>
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
                        style={{ alignSelf: 'flex-start' }}
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
                      justifyContent: 'flex-start',
                    }}
                    labelText={moment(date).format('DD/MMM/YYYY')}
                    // selectText={'Date'}
                    onPress={() => {
                      setShowPicker({ ...showPicker, date: true });
                    }}
                    imp={false}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: Sizes.Base,
                  }}>
                  <Text
                    style={{
                      ...Fonts.Medium2,
                      color: Colors.PrimaryText1,
                      flex: 0.3,
                      marginLeft: Sizes.Padding,
                      textAlign: 'center',
                    }}>
                    Time
                  </Text>
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
                        style={{ alignSelf: 'flex-start' }}
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
                      justifyContent: 'flex-start',
                    }}
                    textStyle={{
                      textAlign: 'justify',
                      marginLeft: Sizes.Base,
                    }}
                    labelText={moment(reminderTime).format('HH:mm')}
                    // selectText={'Time'}
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
                  style={{ flexDirection: 'row', marginVertical: Sizes.Padding }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setData({ ...data, reminderType: 'A' })}
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
                  <View style={{ width: Sizes.Radius }} />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setData({ ...data, reminderType: 'P' })}
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
      {/* {showTimePicker.time && (
        <DateTimePicker
          testID="timePicker"
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeTime}
        />
      )} */}
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
      {/* {showTimePicker.reminderTime && (
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
            setShowTimePicker({ ...showTimePicker, time: false });
            setTime(t);
          }}
          onCancel={() => {
            setShowTimePicker({ ...showTimePicker, time: false });
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
            setShowTimePicker({ ...showTimePicker, reminderTime: false });
            setReminderTime(t);
          }}
          onCancel={() => {
            setShowTimePicker({ ...showTimePicker, reminderTime: false });
          }}
        />
      )}
    </Animated.View>
  );
};

export default WeekPlanAddTask;