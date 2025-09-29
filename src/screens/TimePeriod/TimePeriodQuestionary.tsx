import {View, Text, TouchableOpacity, FlatList, Image} from 'react-native';
import React, {useState} from 'react';
import {apiPost, apiPut, useSelector} from '../../Modules';
import {StackProps} from '../../routes';
import {Icon, TextButton, Toast} from '../../Components';
import {
  iDontKnow,
  irregular,
  leaf,
  regular,
  reminderDateTime,
} from '../../../assets';
import AveragePeriodLength from './AveragePeriodLength';
import AverageCycleLength from './AverageCycleLength';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import {Switch} from 'react-native-paper';
import ReminderDays from './ReminderDays';
import DateTimePicker from '@react-native-community/datetimepicker';
import {formatAM_PM} from '../../Functions';
import DatePicker from 'react-native-date-picker';

// What was the date of the first day of your last menstrual period?

type Props = StackProps<'TimePeriodQuestionary'>;
const TimePeriodQuestionary = ({navigation, route}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {member} = useSelector(state => state.member);
  const {item, type} = route.params;
  const [questionIndex, setQuestionIndex] = useState(0);
  const [data, setData] = useState({
    isRegularStatus: 'R',
    periodLastDate: moment(new Date()).format('YYYY-MM-DD'),
    isRemind: true,
    loading: false,
  });
  const [selectedPeriodLength, setSelectedPeriodLength] = useState('5');
  const [selectedCycleLength, setSelectedCycleLength] = useState('30');
  const [selectedReminderDays, setSelectedReminderDays] = useState('2');
  const [reminderTime, setReminderTime] = useState<{
    time: any;
    mode: any;
    show: boolean;
  }>({
    time: new Date(),
    mode: 'time',
    show: false,
  });
  const minDate = moment().subtract(2, 'months').startOf('month').format('MM');
  const [currentMonth, setCurrentMonth] = useState(moment().format('MM'));
  const changeReminderTime = (event: any, selectedDate: any) => {
    if (selectedDate) {
      setReminderTime({...reminderTime, time: selectedDate, show: false});
    } else {
      setReminderTime({...reminderTime, show: false});
    }
  };

  const createPeriodTrackingRecord = async () => {
    setData({...data, loading: true});
    const dayReminderDate = moment(data.periodLastDate)
      .add(selectedCycleLength, 'days')
      .format('YYYY-MM-DD 00:00:00');
    const dayReminderEndDate = moment(dayReminderDate)
      .add(7, 'days')
      .format('YYYY-MM-DD 00:00:00');
    const remindDateTime = moment(dayReminderDate)
      .subtract(selectedReminderDays, 'days')
      .format('YYYY-MM-DD');
    const lastPeriod = moment(data.periodLastDate);
    const cycleLengthDays = parseInt(selectedCycleLength, 10);
    const periodDays = parseInt(selectedPeriodLength, 10);

    const nextPeriodStart = lastPeriod.clone().add(cycleLengthDays, 'days');
    const nextPeriodEnd = nextPeriodStart.clone().add(periodDays - 1, 'days');
    const nextOvulationDay = nextPeriodStart.clone().subtract(14, 'days');
    const nextOvulationStart = nextOvulationDay.clone();
    const nextOvulationEnd = nextOvulationDay.clone().add(1, 'day');
    const nextFertileStart = nextOvulationDay.clone().subtract(5, 'days');
    const nextFertileEnd = nextOvulationDay.clone().add(1, 'day');
    const nextSafeStart = nextFertileEnd.clone().add(1, 'day');
    const nextSafeEnd = nextPeriodStart.clone().subtract(1, 'day');
    try {
      const body = {
        USER_ID: member?.ID,
        MONTH: moment(new Date()).format('MM'),
        YEAR: moment(new Date()).format('YYYY'),
        PERIOD_DAYS_LENGTH: selectedPeriodLength,
        CYCLE_LENGTH: selectedCycleLength,
        LAST_PERIOD_DATE: moment(new Date(data.periodLastDate)).format(
          'YYYY-MM-DD',
        ),
        IS_REGULAR_STATUS: data.isRegularStatus,
        IS_REMIND: data.isRemind ? 1 : 0,
        REMIND_DATE_TIME:
          remindDateTime + ' ' + moment(reminderTime.time).format('HH:mm:00'),
        REMIND_DATE_COUNT: selectedReminderDays,
        DAY_REMINDER_DATE: dayReminderDate,
        DAY_REMINDER_END_DATE: dayReminderEndDate,
        IS_DONE: 0,
        CLIENT_ID: 1,
        PERIOD_START_DATE: nextPeriodStart.format('YYYY-MM-DD 00:00:00'),
        PERIOD_END_DATE: nextPeriodEnd.format('YYYY-MM-DD 00:00:00'),
        FERTILE_START_DATE: nextFertileStart.format('YYYY-MM-DD 00:00:00'),
        FERTILE_END_DATE: nextFertileEnd.format('YYYY-MM-DD 00:00:00'),
        OVULATION_START_DATE: nextOvulationStart.format('YYYY-MM-DD 00:00:00'),
        OVULATION_END_DATE: nextOvulationEnd.format('YYYY-MM-DD 00:00:00'),
        SAFE_START_DATE: nextSafeStart.format('YYYY-MM-DD 00:00:00'),
        SAFE_END_DATE: nextSafeEnd.format('YYYY-MM-DD 00:00:00'),
        IS_QUESTIONARY_COMPLETE: 1,
      };
      // console.log('body...', body);
      const res = await apiPost('api/periodTracking/create', body);
      if (res && res.code == 200) {
        setData({...data, loading: false});
        Toast('Information saved successfully');
        navigation.navigate('CircleCalender', {
          openPopUp: false,
        });
      } else {
        setData({...data, loading: false});
      }
    } catch (error) {
      setData({...data, loading: false});
      console.log('error...', error);
    }
  };
  const UpdatePeriodTrackingRecord = async () => {
    setData({...data, loading: true});
    const dayReminderDate = moment(data.periodLastDate)
      .add(selectedCycleLength, 'days')
      .format('YYYY-MM-DD 00:00:00');
    const dayReminderEndDate = moment(dayReminderDate)
      .add(7, 'days')
      .format('YYYY-MM-DD 00:00:00');
    const remindDateTime = moment(dayReminderDate)
      .subtract(selectedReminderDays, 'days')
      .format('YYYY-MM-DD');
    const lastPeriod = moment(data.periodLastDate);
    const cycleLengthDays = parseInt(selectedCycleLength, 10);
    const periodDays = parseInt(selectedPeriodLength, 10);

    const nextPeriodStart = lastPeriod.clone().add(cycleLengthDays, 'days');
    const nextPeriodEnd = nextPeriodStart.clone().add(periodDays - 1, 'days');
    const nextOvulationDay = nextPeriodStart.clone().subtract(14, 'days');
    const nextOvulationStart = nextOvulationDay.clone();
    const nextOvulationEnd = nextOvulationDay.clone().add(1, 'day');
    const nextFertileStart = nextOvulationDay.clone().subtract(5, 'days');
    const nextFertileEnd = nextOvulationDay.clone().add(1, 'day');
    const nextSafeStart = nextFertileEnd.clone().add(1, 'day');
    const nextSafeEnd = nextPeriodStart.clone().subtract(1, 'day');
    try {
      const body = {
        USER_ID: member?.ID,
        MONTH: moment(new Date()).format('MM'),
        YEAR: moment(new Date()).format('YYYY'),
        PERIOD_DAYS_LENGTH: selectedPeriodLength,
        CYCLE_LENGTH: selectedCycleLength,
        LAST_PERIOD_DATE: moment(new Date(data.periodLastDate)).format(
          'YYYY-MM-DD',
        ),
        IS_REGULAR_STATUS: data.isRegularStatus,
        IS_REMIND: data.isRemind ? 1 : 0,
        REMIND_DATE_TIME:
          remindDateTime + ' ' + moment(reminderTime.time).format('HH:mm:00'),
        REMIND_DATE_COUNT: selectedReminderDays,
        DAY_REMINDER_DATE: dayReminderDate,
        DAY_REMINDER_END_DATE: dayReminderEndDate,
        IS_DONE: 0,
        CLIENT_ID: 1,
        PERIOD_START_DATE: nextPeriodStart.format('YYYY-MM-DD 00:00:00'),
        PERIOD_END_DATE: nextPeriodEnd.format('YYYY-MM-DD 00:00:00'),
        FERTILE_START_DATE: nextFertileStart.format('YYYY-MM-DD 00:00:00'),
        FERTILE_END_DATE: nextFertileEnd.format('YYYY-MM-DD 00:00:00'),
        OVULATION_START_DATE: nextOvulationStart.format('YYYY-MM-DD 00:00:00'),
        OVULATION_END_DATE: nextOvulationEnd.format('YYYY-MM-DD 00:00:00'),
        SAFE_START_DATE: nextSafeStart.format('YYYY-MM-DD 00:00:00'),
        SAFE_END_DATE: nextSafeEnd.format('YYYY-MM-DD 00:00:00'),
        IS_QUESTIONARY_COMPLETE: 1,
        ID: item.ID,
      };
      // console.log('body...', body);
      const res = await apiPut('api/periodTracking/update', body);
      if (res && res.code == 200) {
        setData({...data, loading: false});
        Toast('Information updated successfully');
        navigation.navigate('CircleCalender', {
          openPopUp: false,
        });
      } else {
        setData({...data, loading: false});
      }
    } catch (error) {
      setData({...data, loading: false});
      console.log('error...', error);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.White,
      }}>
      <View
        style={{
          flex: 1,
          marginHorizontal: Sizes.Padding,
          marginVertical: Sizes.ScreenPadding,
        }}>
        {/* header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              backgroundColor: Colors.Primary,
              height: 30,
              width: 30,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              questionIndex > 0
                ? setQuestionIndex(questionIndex - 1)
                : navigation.goBack();
            }}>
            <Icon
              name="arrow-back"
              type="Ionicons"
              size={19}
              color={Colors.White}
            />
          </TouchableOpacity>
          <View>
            <FlatList
              data={[1, 1, 1, 1, 1]}
              horizontal={true}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={{
                      alignSelf: 'center',
                      height: index == questionIndex ? 12 : 9,
                      width: index == questionIndex ? 12 : 9,
                      borderRadius: index == questionIndex ? 6 : 5,
                      backgroundColor:
                        index == questionIndex
                          ? Colors.Primary
                          : Colors.Secondary,
                      marginHorizontal: 2,
                    }}
                  />
                );
              }}
            />
          </View>
          <Text
            style={{...Fonts.Bold2, color: Colors.PrimaryText1}}
            // onPress={() => {
            //   questionIndex < 4 ? setQuestionIndex(questionIndex + 1) : null;
            // }}
          >
            {/* Skip */}
          </Text>
        </View>

        {/* {questionIndex == 0 && (
          <View
            style={{
              flex: 1,
              marginTop: Sizes.ScreenPadding * 2,
            }}>
            <Text
              style={{
                ...Fonts.Bold1,
                color: Colors.PrimaryText1,
                marginBottom: Sizes.ScreenPadding,
              }}>
              What shall i call you?
            </Text>
            <TextInput
              onChangeText={() => {}}
              value=""
              placeholder="Enter Name"
              style={{elevation: 3}}
            />
            <View style={{marginTop: Sizes.Padding * 4}}>
              <Image
                source={girlImage}
                style={{height: 180, width: 220, alignSelf: 'center'}}
              />
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <TextButton label="Next" loading={false} onPress={() => {}} />
            </View>
          </View>
        )} */}

        {/* first index */}
        {questionIndex == 0 && (
          <View
            style={{
              flex: 1,
              marginTop: Sizes.ScreenPadding * 2,
            }}>
            <Text
              style={{
                ...Fonts.Bold1,
                color: Colors.PrimaryText1,
                marginBottom: Sizes.Base,
              }}>
              Your average period length?
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Icon
                style={{marginRight: Sizes.Base}}
                name="info-with-circle"
                type="Entypo"
                size={17}
              />
              <Text
                style={{
                  ...Fonts.Medium4,
                  color: Colors.PrimaryText,
                  marginBottom: Sizes.Radius,
                }}>
                How many days you bleed each month
              </Text>
            </View>
            <Text
              style={{
                ...Fonts.Medium2,
                color: Colors.PrimaryText1,
                marginBottom: Sizes.ScreenPadding,
              }}>
              If you are unsure of your cycle length or if it is irregular, than
              tap on "
              <Text
                style={{
                  ...Fonts.Medium2,
                  color: Colors.Primary,
                  marginBottom: Sizes.ScreenPadding,
                }}>
                Not Sure
              </Text>
              " button
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 40,
              }}>
              <AveragePeriodLength
                selectedPeriodLength={selectedPeriodLength}
                setSelectedPeriodLength={setSelectedPeriodLength}
              />
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
                flexDirection: 'row',
              }}>
              <TextButton
                label="Not Sure"
                loading={false}
                onPress={() => {
                  setSelectedPeriodLength('5');
                  setQuestionIndex(questionIndex + 1);
                }}
                style={{flex: 1}}
                isBorder
              />
              <View style={{width: Sizes.Base}} />
              <TextButton
                label="Next"
                loading={false}
                onPress={() => {
                  setQuestionIndex(questionIndex + 1);
                }}
                style={{flex: 1}}
              />
            </View>
          </View>
        )}

        {/* second index */}
        {questionIndex == 1 && (
          <View
            style={{
              flex: 1,
              marginTop: Sizes.ScreenPadding * 2,
            }}>
            <Text
              style={{
                ...Fonts.Bold1,
                color: Colors.PrimaryText1,
                marginBottom: Sizes.Base,
              }}>
              Your average cycle length?
            </Text>
            <View
              style={{flexDirection: 'row', marginRight: Sizes.Padding * 3}}>
              <Icon
                style={{marginRight: Sizes.Base}}
                name="info-with-circle"
                type="Entypo"
                size={17}
              />
              <Text
                style={{
                  ...Fonts.Medium4,
                  color: Colors.PrimaryText,
                  marginBottom: Sizes.Radius,
                }}>
                The number of days between the start of one period and the start
                of the next
              </Text>
            </View>
            <Text
              style={{
                ...Fonts.Medium2,
                color: Colors.PrimaryText1,
                marginBottom: Sizes.ScreenPadding,
              }}>
              If you are unsure of your cycle length or if it is irregular, than
              tap on "
              <Text
                style={{
                  ...Fonts.Medium2,
                  color: Colors.Primary,
                  marginBottom: Sizes.ScreenPadding,
                }}>
                Not Sure
              </Text>
              " button
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 40,
              }}>
              <AverageCycleLength
                selectedCycleLength={selectedCycleLength}
                setSelectedCycleLength={setSelectedCycleLength}
              />
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
                flexDirection: 'row',
              }}>
              <TextButton
                label="Not Sure"
                loading={false}
                onPress={() => {
                  setSelectedCycleLength('30');
                  setQuestionIndex(questionIndex + 1);
                }}
                style={{flex: 1}}
                isBorder
              />
              <View style={{width: Sizes.Base}} />
              <TextButton
                label="Next"
                loading={false}
                onPress={() => {
                  setQuestionIndex(questionIndex + 1);
                }}
                style={{flex: 1}}
              />
            </View>
          </View>
        )}

        {/* third index */}
        {questionIndex == 2 && (
          <View
            style={{
              flex: 1,
              marginTop: Sizes.ScreenPadding * 2,
            }}>
            <Text
              style={{
                ...Fonts.Bold1,
                color: Colors.PrimaryText1,
                marginBottom: Sizes.Radius,
                marginRight: Sizes.ScreenPadding * 2,
              }}>
              is your menstrual cycle regular?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
              }}>
              {/* first image */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  height: 170,
                  width: '48%',
                  borderRadius: Sizes.Radius,
                  borderWidth: 1,
                  borderColor:
                    data.isRegularStatus == 'R'
                      ? Colors.Primary
                      : Colors.Secondary,
                  paddingVertical: Sizes.Padding,
                }}
                onPress={() => {
                  setData({...data, isRegularStatus: 'R'});
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      ...Fonts.Medium2,
                      color: Colors.PrimaryText1,
                      paddingHorizontal: Sizes.Padding,
                    }}>
                    My Cycle is regular
                  </Text>
                  {data.isRegularStatus == 'R' && (
                    <View
                      style={{
                        backgroundColor: Colors.Primary2,
                        height: 21,
                        width: 21,
                        borderRadius: 11,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon
                        name="check"
                        type="MaterialCommunityIcons"
                        size={16}
                        color={Colors.White}
                      />
                    </View>
                  )}
                </View>
                <Image
                  source={regular}
                  style={{
                    height: 90,
                    width: 120,
                    alignSelf: 'flex-end',
                  }}
                />
              </TouchableOpacity>
              <View style={{width: '4%'}} />
              {/* second image */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  height: 170,
                  width: '48%',
                  borderRadius: Sizes.Radius,
                  borderWidth: 1,
                  borderColor:
                    data.isRegularStatus == 'I'
                      ? Colors.Primary
                      : Colors.Secondary,
                  paddingVertical: Sizes.Padding,
                }}
                onPress={() => {
                  setData({...data, isRegularStatus: 'I'});
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      ...Fonts.Medium2,
                      color: Colors.PrimaryText1,
                      paddingHorizontal: Sizes.Padding,
                    }}>
                    My Cycle is irregular
                  </Text>
                  {data.isRegularStatus == 'I' && (
                    <View
                      style={{
                        backgroundColor: Colors.Primary2,
                        height: 21,
                        width: 21,
                        borderRadius: 11,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon
                        name="check"
                        type="MaterialCommunityIcons"
                        size={16}
                        color={Colors.White}
                      />
                    </View>
                  )}
                </View>
                <Image
                  source={irregular}
                  style={{
                    height: 80,
                    width: 100,
                    alignSelf: 'flex-end',
                    marginTop: Sizes.Radius,
                    marginRight: Sizes.Base,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={{height: Sizes.Padding}} />
            {/* third image */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                height: 150,
                width: '100%',
                borderRadius: Sizes.Radius,
                borderWidth: 1,
                borderColor:
                  data.isRegularStatus == 'D'
                    ? Colors.Primary
                    : Colors.Secondary,
                padding: Sizes.Padding,
              }}
              onPress={() => {
                setData({...data, isRegularStatus: 'D'});
              }}>
              {data.isRegularStatus == 'D' ? (
                <View
                  style={{
                    backgroundColor: Colors.Primary2,
                    height: 21,
                    width: 21,
                    borderRadius: 11,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                  }}>
                  <Icon
                    name="check"
                    type="MaterialCommunityIcons"
                    size={16}
                    color={Colors.White}
                  />
                </View>
              ) : (
                <View
                  style={{
                    height: 21,
                    width: 21,
                    alignSelf: 'flex-end',
                  }}
                />
              )}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <Image
                  source={iDontKnow}
                  style={{
                    height: 100,
                    width: '30%',
                    alignSelf: 'flex-start',
                    marginRight: Sizes.Base,
                    marginTop: -Sizes.Padding,
                  }}
                />
                <View
                  style={{
                    width: '50%',
                    marginLeft: Sizes.Base,
                    marginTop: -Sizes.ScreenPadding * 2,
                  }}>
                  <Text
                    style={{
                      ...Fonts.Medium2,
                      color: Colors.PrimaryText1,
                    }}>
                    I don't know
                  </Text>
                  <Text
                    style={{
                      ...Fonts.Medium3,
                      color: Colors.PrimaryText1,
                      marginTop: Sizes.Base,
                    }}>
                    I don't take care of my dates
                  </Text>
                </View>
                <Image
                  source={leaf}
                  style={{
                    height: 64,
                    width: '20%',
                    alignSelf: 'flex-end',
                    marginBottom: -Sizes.Padding,
                    marginRight: Sizes.Base,
                  }}
                />
              </View>
            </TouchableOpacity>

            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
                flexDirection: 'row',
              }}>
              <TextButton
                label="Not Sure"
                loading={false}
                onPress={() => {
                  setData({...data, isRegularStatus: 'R'});
                  setQuestionIndex(questionIndex + 1);
                }}
                style={{flex: 1}}
                isBorder
              />
              <View style={{width: Sizes.Base}} />
              <TextButton
                label="Next"
                loading={false}
                onPress={() => {
                  setQuestionIndex(questionIndex + 1);
                }}
                style={{flex: 1}}
              />
            </View>
          </View>
        )}

        {/* fourth index */}
        {questionIndex == 3 && (
          <View
            style={{
              flex: 1,
              marginTop: Sizes.ScreenPadding * 2,
            }}>
            <Text
              style={{
                ...Fonts.Bold1,
                color: Colors.PrimaryText1,
                marginBottom: Sizes.ScreenPadding,
                marginRight: Sizes.ScreenPadding * 2,
              }}>
              When did your last period start?
            </Text>
            <View
              style={{
                marginTop: Sizes.Padding,
                borderWidth: 1,
                borderColor: Colors.Primary,
                borderRadius: Sizes.Radius,
                padding: Sizes.Padding,
              }}>
              <Calendar
                maxDate={moment().format('YYYY-MM-DD')}
                onDayPress={(day: any) => {
                  setData({...data, periodLastDate: day.dateString});
                }}
                markingType="custom"
                markedDates={{
                  [data.periodLastDate]: {
                    selected: true,
                    disableTouchEvent: true,
                    selectedColor: Colors.Primary2,
                  },
                }}
                onMonthChange={(month: any) => {
                  setCurrentMonth(moment(month.dateString).format('MM'));
                }}
                disableArrowRight={
                  moment().endOf('month').format('MM') == currentMonth
                    ? true
                    : false
                }
                disableArrowLeft={minDate == currentMonth ? true : false}
              />
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <TextButton
                label="Next"
                loading={false}
                onPress={() => {
                  setQuestionIndex(questionIndex + 1);
                }}
              />
            </View>
          </View>
        )}

        {/* fifth index */}
        {questionIndex == 4 && (
          <View
            style={{
              flex: 1,
              marginTop: Sizes.ScreenPadding * 2,
            }}>
            <Text
              style={{
                ...Fonts.Bold1,
                color: Colors.PrimaryText1,
                marginBottom: Sizes.Base,
                marginRight: Sizes.ScreenPadding * 2,
              }}>
              Set a Reminder?
            </Text>
            <Text
              style={{
                ...Fonts.Regular2,
                color: Colors.PrimaryText1,
                marginBottom: Sizes.ScreenPadding,
                marginRight: Sizes.ScreenPadding,
              }}>
              Don't forget your periods! Set a remainder
            </Text>
            <View
              style={{
                marginTop: Sizes.Base,
                borderRadius: Sizes.Radius,
                padding: Sizes.ScreenPadding,
                backgroundColor: Colors.Secondary + 60,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  ...Fonts.Medium2,
                  color: Colors.PrimaryText1,
                }}>
                Remind me
              </Text>
              <View
                style={{
                  transform: [{scale: 1}],
                }}>
                <Switch
                  value={data.isRemind}
                  onValueChange={() => {
                    setData({...data, isRemind: !data.isRemind});
                  }}
                  color={Colors.Primary}
                />
              </View>
            </View>
            {data.isRemind ? (
              <View>
                <View
                  style={{
                    marginTop: Sizes.ScreenPadding,
                    borderRadius: Sizes.Radius,
                    padding: Sizes.Padding,
                    borderColor: Colors.Primary2,
                    borderWidth: 1,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        ...Fonts.Medium2,
                        color: Colors.PrimaryText1,
                      }}>
                      Period Starts
                    </Text>
                    <Text
                      style={{
                        ...Fonts.Medium2,
                        fontSize: 11,
                        color: Colors.Primary,
                      }}>
                      {`in ${
                        selectedReminderDays == '1'
                          ? selectedReminderDays + ' day'
                          : selectedReminderDays + ' days'
                      }`}
                    </Text>
                  </View>
                  <Text
                    style={{
                      ...Fonts.Medium3,
                      color: Colors.PrimaryText,
                      marginTop: Sizes.Base,
                    }}>
                    How many days before your period do you want the remainder?
                  </Text>
                  <View
                    style={{
                      marginTop: Sizes.Padding,
                      marginBottom: Sizes.Base,
                    }}>
                    <ReminderDays
                      selectedReminderDays={selectedReminderDays}
                      setSelectedReminderDays={setSelectedReminderDays}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: Sizes.ScreenPadding,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      setReminderTime({...reminderTime, show: true})
                    }
                    style={{
                      borderRadius: Sizes.Radius,
                      borderWidth: 1,
                      borderColor: Colors.Primary2,
                      alignSelf: 'flex-start',
                      paddingHorizontal: Sizes.ScreenPadding * 2,
                      paddingVertical: Sizes.Base,
                    }}>
                    <Text style={{...Fonts.Medium2, color: Colors.Primary}}>
                      Select Time
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...Fonts.Medium2,
                      color: Colors.PrimaryText1,
                      marginLeft: Sizes.Padding,
                    }}>
                    {formatAM_PM(reminderTime.time)}
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: Sizes.ScreenPadding * 2,
                }}>
                <Image
                  source={reminderDateTime}
                  style={{height: 160, width: 220}}
                />
              </View>
            )}

            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <TextButton
                label="Save"
                loading={data.loading}
                onPress={() => {
                  type == 'C'
                    ? createPeriodTrackingRecord()
                    : UpdatePeriodTrackingRecord();
                }}
              />
            </View>
          </View>
        )}
      </View>
      {/* {reminderTime.show && (
        <DateTimePicker
          value={reminderTime.time}
          mode={'time'}
          is24Hour={false}
          display="default"
          onChange={changeReminderTime}
        />
      )} */}

      {reminderTime.show && (
        <DatePicker
          modal
          open={reminderTime.show}
          mode="time"
          date={reminderTime.time}
          buttonColor={Colors.Primary}
          dividerColor={Colors.Primary}
          onConfirm={t => {
            setReminderTime({...reminderTime, time: t, show: false});
          }}
          onCancel={() => {
            setReminderTime({
              ...reminderTime,
              show: false,
            });
          }}
        />
      )}
    </View>
  );
};

export default TimePeriodQuestionary;
