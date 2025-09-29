import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {apiPost, useSelector} from '../../Modules';
import {CalendarList} from 'react-native-calendars';
import moment from 'moment';
import {StackProps} from '../../routes';
import {Header} from '../../Components';

type Props = StackProps<'ScrollCalender'>;
const ScrollCalender = ({navigation}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {member} = useSelector(state => state.member);
  const currentMonth = moment().month();
  const totalMonthsInYear = 12;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAllRecords();
  }, []);
  const getAllRecords = async () => {
    try {
      const res = await apiPost('api/periodTracking/get', {
        filter: ` AND USER_ID = ${member?.ID} `,
      });
      if (res && res.code == 200) {
        // console.log(res);
        setData(res.data);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('error..', error);
    }
  };

  const getDatesInRange = useCallback((startDate: any, endDate: any) => {
    const start = moment(startDate);
    const end = moment(endDate);
    const dates = [];
    while (start <= end) {
      dates.push(start.format('YYYY-MM-DD'));
      start.add(1, 'days');
    }
    return dates;
  }, []);

  const trackingData = useMemo(() => {
    const newTrackingData: any = {
      ovulation: [],
      fertile: [],
      period: [],
      safe: [],
    };

    data.forEach(item => {
      const {
        OVULATION_START_DATE,
        OVULATION_END_DATE,
        FERTILE_START_DATE,
        FERTILE_END_DATE,
        PERIOD_START_DATE,
        PERIOD_END_DATE,
        SAFE_START_DATE,
        SAFE_END_DATE,
      } = item;

      newTrackingData.ovulation.push(
        ...getDatesInRange(OVULATION_START_DATE, OVULATION_END_DATE),
      );
      newTrackingData.fertile.push(
        ...getDatesInRange(FERTILE_START_DATE, FERTILE_END_DATE),
      );
      newTrackingData.period.push(
        ...getDatesInRange(PERIOD_START_DATE, PERIOD_END_DATE),
      );
      newTrackingData.safe.push(
        ...getDatesInRange(SAFE_START_DATE, SAFE_END_DATE),
      );
    });

    return newTrackingData;
  }, [data, getDatesInRange]);

  const markedDates = useMemo(() => {
    const dates: any = {};

    trackingData.fertile.forEach((date: any) => {
      dates[date] = {
        customStyles: {
          container: {
            backgroundColor: '#CF9FFF90',
            height: 33,
            width: 33,
            borderRadius: 3,
          },
          text: {color: Colors.PrimaryText1},
        },
      };
    });
    trackingData.ovulation.forEach((date: any) => {
      dates[date] = {
        customStyles: {
          container: {
            backgroundColor: '#FF7F5090',
            height: 33,
            width: 33,
            borderRadius: 3,
          },
          text: {color: Colors.PrimaryText1},
        },
      };
    });

    trackingData.period.forEach((date: any) => {
      dates[date] = {
        customStyles: {
          container: {
            backgroundColor: '#FF69B490',
            height: 33,
            width: 33,
            borderRadius: 3,
          },
          text: {color: Colors.PrimaryText1},
        },
      };
    });

    trackingData.safe.forEach((date: any) => {
      dates[date] = {
        customStyles: {
          container: {
            backgroundColor: '#ABEBC6',
            height: 33,
            width: 33,
            borderRadius: 3,
          },
          text: {color: Colors.PrimaryText1},
        },
      };
    });
    setLoading(false);
    return dates;
  }, [trackingData]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.White,
      }}>
      <Header label="Calender" onBack={() => navigation.goBack()} />
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={Colors.Primary} />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            marginTop: Sizes.Padding,
          }}>
          <CalendarList
            onVisibleMonthsChange={months => {}}
            pastScrollRange={currentMonth}
            futureScrollRange={totalMonthsInYear - currentMonth - 1}
            scrollEnabled={true}
            markedDates={markedDates}
            markingType="custom"
            renderHeader={date => (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginHorizontal: -Sizes.Padding,
                }}>
                <Text
                  style={{
                    ...Fonts.Medium2,
                    fontSize: 17,
                    color: Colors.PrimaryText1,
                  }}>{`${new Date(date).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}`}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 5,
                  }}>
                  <View
                    style={{
                      height: 12,
                      width: 12,
                      borderRadius: 2,
                      backgroundColor: '#FF69B4',
                    }}
                  />
                  <Text
                    style={{
                      ...Fonts.Medium3,
                      color: Colors.PrimaryText1,
                      marginLeft: 3,
                      marginRight: 6,
                      fontSize: 10,
                    }}>
                    Periods
                  </Text>
                  <View
                    style={{
                      height: 12,
                      width: 12,
                      borderRadius: 2,
                      backgroundColor: '#CF9FFF',
                    }}
                  />
                  <Text
                    style={{
                      ...Fonts.Medium3,
                      color: Colors.PrimaryText1,
                      marginLeft: 3,
                      marginRight: 6,
                      fontSize: 10,
                    }}>
                    Fertility
                  </Text>
                  <View
                    style={{
                      height: 12,
                      width: 12,
                      borderRadius: 2,
                      backgroundColor: '#FF7F50',
                    }}
                  />
                  <Text
                    style={{
                      ...Fonts.Medium3,
                      color: Colors.PrimaryText1,
                      marginLeft: 3,
                      fontSize: 10,
                    }}>
                    Ovulation
                  </Text>
                </View>
              </View>
            )}
            headerStyle={{justifyContent: 'flex-start'}}
            showScrollIndicator={true}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

export default ScrollCalender;
