import {View, Text, BackHandler} from 'react-native';
import React, {useState} from 'react';
import {StackProps} from '../../routes';
import {apiPost, apiPut, useSelector} from '../../Modules';
import {Header, TextButton, Toast} from '../../Components';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';

type Props = StackProps<'UpdateData'>;
const UpdateData = ({navigation, route}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {member} = useSelector(state => state.member);
  const {item} = route.params;
  const [data, setData] = useState({
    periodLastDate: moment(new Date()).format('YYYY-MM-DD'),
    loading: false,
  });
  const minDate = moment().subtract(2, 'months').startOf('month').format('MM');
  const [currentMonth, setCurrentMonth] = useState(moment().format('MM'));

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        navigation.navigate('Dashboard');
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, [navigation]),
  );

  const UpdatePeriodTrackingRecord = async () => {
    setData({...data, loading: true});
    try {
      const body = {
        ...item,
        IS_DONE: 1,
      };
      //   console.log('body...', body);
      const res = await apiPut('api/periodTracking/update', body);
      if (res && res.code == 200) {
        createNewPeriodTrackingRecord();
      } else {
        Toast('Something wrong..Please try again later');
        setData({...data, loading: false});
      }
    } catch (error) {
      setData({...data, loading: false});
      console.log('error...', error);
    }
  };

  const createNewPeriodTrackingRecord = async () => {
    const dayReminderDate = moment(data.periodLastDate)
      .add(item.CYCLE_LENGTH, 'days')
      .format('YYYY-MM-DD 00:00:00');
    const dayReminderEndDate = moment(dayReminderDate)
      .add(7, 'days')
      .format('YYYY-MM-DD 00:00:00');
    const remindDateTime = moment(dayReminderDate)
      .subtract(item.REMIND_DATE_COUNT, 'days')
      .format('YYYY-MM-DD');
    const lastPeriod = moment(data.periodLastDate);
    const cycleLengthDays = parseInt(item.CYCLE_LENGTH, 10);
    const periodDays = parseInt(item.PERIOD_DAYS_LENGTH, 10);

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
        PERIOD_DAYS_LENGTH: item.PERIOD_DAYS_LENGTH,
        CYCLE_LENGTH: item.CYCLE_LENGTH,
        LAST_PERIOD_DATE: moment(new Date(data.periodLastDate)).format(
          'YYYY-MM-DD',
        ),
        IS_REGULAR_STATUS: item.IS_REGULAR_STATUS,
        IS_REMIND: item.IS_REMIND,
        REMIND_DATE_TIME:
          remindDateTime +
          ' ' +
          moment(item.REMIND_DATE_TIME).format('HH:mm:00'),
        REMIND_DATE_COUNT: item.REMIND_DATE_COUNT,
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
      //   console.log('body...', body);
      const res = await apiPost('api/periodTracking/create', body);
      if (res && res.code == 200) {
        setData({...data, loading: false});
        Toast('Information saved successfully');
        navigation.navigate('CircleCalender', {
          openPopUp: false,
        });
      } else {
        Toast('Something wrong..Please try again later');
        setData({...data, loading: false});
      }
    } catch (error) {
      setData({...data, loading: false});
      console.log('error...', error);
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Header
        label="Update Data"
        onBack={() => {
          navigation.navigate('Dashboard');
        }}
      />
      <View
        style={{
          flex: 1,
          marginHorizontal: Sizes.Padding,
          marginVertical: Sizes.ScreenPadding,
        }}>
        <View
          style={{
            flex: 1,
            marginTop: Sizes.Padding,
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
              label="Save"
              loading={data.loading}
              onPress={() => {
                UpdatePeriodTrackingRecord();
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default UpdateData;
