import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ActivityIndicator,
  ScrollView,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackProps} from '../../routes';
import {apiPost, useSelector} from '../../Modules';
import {Header, Icon, Modal, TextButton} from '../../Components';
import {PieChart} from 'react-native-gifted-charts';
import moment from 'moment';
import {
  NeverMenstruated,
  breastCancerPrevention,
  fertilityIcon,
  flower,
  ovulationDuringPregnancy,
  ovulationIcon,
  shortMenstrualDelay,
  significantMenstrualDelay,
  symptomsOfOvulation,
} from '../../../assets';
import {PERIOD_TRACKING_RECORD} from '../../Modules/interface';
import {FlatList} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';

type CalenderDates = {
  DATE: moment.Moment;
  value: number;
  textSize: number;
  text: string;
  peripheral: boolean;
  color: string;
  textBackgroundColor: string;
};
const flatListData = [
  {
    name: 'Never menstruated',
    image: NeverMenstruated,
    height: 100,
    width: 90,
    marginTop: 14,
    marginLeft: 0,
    navigation: 'NeverMenstruate',
  },
  {
    name: 'Short menstruated delay',
    image: shortMenstrualDelay,
    height: 75,
    width: 120,
    marginTop: -2,
    marginLeft: 35,
    navigation: 'ShortMenstruatedDelay',
  },
  {
    name: 'Significant menstruated delay',
    image: significantMenstrualDelay,
    height: 60,
    width: 90,
    marginTop: 9,
    marginLeft: -10,
    navigation: 'SignificantMenstruatedDelay',
  },
  {
    name: 'Ovulation during pregnancy',
    image: ovulationDuringPregnancy,
    height: 80,
    width: 90,
    marginTop: -3,
    marginLeft: 0,
    navigation: 'OvulationDuringPregnancy',
  },
  {
    name: 'Symptoms of ovulation',
    image: symptomsOfOvulation,
    height: 70,
    width: 99,
    marginTop: 10,
    marginLeft: 0,
    navigation: 'SymptomsOfOvulation',
  },
  {
    name: 'Breast cancer prevention',
    image: breastCancerPrevention,
    height: 70,
    width: 70,
    marginTop: 20,
    navigation: 'BreastCancerPrevention',
  },
];
type Props = StackProps<'CircleCalender'>;
const CircleCalender = ({navigation, route}: Props): JSX.Element => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {member} = useSelector(state => state.member);
  const {openPopUp} = route.params;
  const [Days, setDays] = useState<CalenderDates[]>([]);
  const [data, setData] = useState<{
    mainData: PERIOD_TRACKING_RECORD;
  }>({
    mainData: {},
    loading: true,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopUp, setShowPopUp] = useState<boolean>(openPopUp);
  const [circleData, setCircleData] = useState<any>({});
  const getDaysUntilNextPeriodType = (startDate: string) =>
    moment(startDate).diff(moment(), 'days');

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

  const getCurrentMonthData = async () => {
    try {
      const res = await apiPost('api/periodTracking/get', {
        filter: ` AND USER_ID = ${member?.ID} `,
      });
      if (res && res.code == 200) {
        setData({...data, mainData: res.data[0]});
        const circleData = checkCurrentDate(res.data[0]);
        setCircleData(circleData);
        getAllDatesInCurrentMonth(res.data[0]);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('error..', error);
    }
  };

  const getAllDatesInCurrentMonth = (datesData: PERIOD_TRACKING_RECORD) => {
    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');
    const dates: CalenderDates[] = [];

    const nextPeriodStart = moment(datesData.PERIOD_START_DATE);
    const nextPeriodEnd = moment(datesData.PERIOD_END_DATE);
    const nextFertileStart = moment(datesData.FERTILE_START_DATE);
    const nextFertileEnd = moment(datesData.FERTILE_END_DATE);
    const nextOvulationStart = moment(datesData.OVULATION_START_DATE);
    const nextOvulationEnd = moment(datesData.OVULATION_END_DATE);
    const nextSafeStart = moment(datesData.SAFE_START_DATE);
    const nextSafeEnd = moment(datesData.SAFE_END_DATE);

    const periodColor = '#FF69B4';
    const fertileColor = '#CF9FFF';
    const ovulationColor = '#F08000';
    const safeColor = '#58D68D';

    let currentDate = startOfMonth;
    while (currentDate <= endOfMonth) {
      let color = '#B2BABB';
      if (currentDate.isBetween(nextPeriodStart, nextPeriodEnd, 'day', '[]')) {
        color = periodColor;
      } else if (
        currentDate.isBetween(nextOvulationStart, nextOvulationEnd, 'day', '[]')
      ) {
        color = ovulationColor;
      } else if (
        currentDate.isBetween(nextFertileStart, nextFertileEnd, 'day', '[]')
      ) {
        color = fertileColor;
      } else if (
        currentDate.isBetween(nextSafeStart, nextSafeEnd, 'day', '[]')
      ) {
        color = safeColor;
      }
      dates.push({
        DATE: currentDate.clone(),
        value: 1,
        text: currentDate.date().toString(),
        peripheral: false,
        color: color,
        textSize: currentDate.date() === moment().date() ? 13 : 10,
        textBackgroundColor:
          currentDate.date() === moment().date() ? Colors.Primary : color,
      });

      currentDate = currentDate.add(1, 'day');
    }
    setDays(dates);
    setLoading(false);
  };
  const checkCurrentDate = (record: PERIOD_TRACKING_RECORD) => {
    const today = moment();
    const getDayCount = (startDate: string) =>
      today.diff(moment(startDate), 'days') + 1;
    if (
      today.isBetween(
        moment(record.PERIOD_START_DATE),
        moment(record.PERIOD_END_DATE),
        'day',
        '[]',
      )
    ) {
      const dayCount = getDayCount(record.PERIOD_START_DATE);
      return {
        periodType: 'periodDays',
        message: `Period Day ${dayCount}`,
        description: 'Take care of yourself and rest if needed',
      };
    } else if (
      today.isBetween(
        moment(record.FERTILE_START_DATE),
        moment(record.FERTILE_END_DATE),
        'day',
        '[]',
      )
    ) {
      const dayCount = getDayCount(record.FERTILE_START_DATE);
      return {
        periodType: 'fertileDays',
        message: `Fertile Day ${dayCount}`,
        description: 'Increased chance of conception',
      };
    } else if (
      today.isBetween(
        moment(record.OVULATION_START_DATE),
        moment(record.OVULATION_END_DATE),
        'day',
        '[]',
      )
    ) {
      const dayCount = getDayCount(record.OVULATION_START_DATE);
      return {
        periodType: 'ovulationDays',
        message: `Ovulation Day ${dayCount}`,
        description: 'Highest chance of conception',
      };
    } else if (
      today.isBetween(
        moment(record.SAFE_START_DATE),
        moment(record.SAFE_END_DATE),
        'day',
        '[]',
      )
    ) {
      const dayCount = getDayCount(record.SAFE_START_DATE);
      return {
        periodType: 'safeDays',
        message: `Safe Day ${dayCount}`,
        description: 'Lower chance of conception',
      };
    } else {
      return {
        periodType: 'none',
        message: '',
        description: '',
      };
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getCurrentMonthData();
    }, [navigation]),
  );

  const daysUntilPeriodStart = getDaysUntilNextPeriodType(
    data.mainData.PERIOD_START_DATE,
  );
  const daysUntilFertileStart = getDaysUntilNextPeriodType(
    data.mainData.FERTILE_START_DATE,
  );
  const daysUntilOvulationStart = getDaysUntilNextPeriodType(
    data.mainData.OVULATION_START_DATE,
  );
  const daysUntilSafeStart = getDaysUntilNextPeriodType(
    data.mainData.SAFE_START_DATE,
  );

  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Header
        label="Period Tracker"
        onBack={() => navigation.navigate('Dashboard')}
        rightChild={
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="calendar"
              type="EvilIcons"
              size={34}
              color={Colors.White}
              onPress={() => {
                navigation.navigate('ScrollCalender');
              }}
            />
            <Icon
              name="setting"
              type="AntDesign"
              size={25}
              color={Colors.White}
              onPress={() => {
                navigation.navigate('TimePeriodQuestionary', {
                  type: 'U',
                  item: data.mainData,
                });
              }}
              style={{marginLeft: Sizes.Radius, marginRight: -Sizes.Base}}
            />
          </View>
        }
      />
      {loading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator color={Colors.Primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            margin: Sizes.Padding,
          }}>
          <View
            style={{
              alignContent: 'center',
              paddingVertical: Sizes.Padding,
              alignItems: 'center',
              backgroundColor: Colors.White,
            }}>
            <PieChart
              data={Days}
              showText
              donut
              textColor={Colors.White}
              textSize={10}
              fontWeight="bold"
              innerRadius={104}
              labelsPosition="onBorder"
              showTextBackground
              textBackgroundColor={Colors.Primary}
              backgroundColor={Colors.White}
              innerCircleBorderWidth={4}
              innerCircleBorderColor={Colors.BorderColor}
              centerLabelComponent={() => (
                <View
                  style={{
                    backgroundColor: Colors.White,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {circleData.periodType == 'safeDays' ||
                  circleData.periodType == 'ovulationDays' ||
                  circleData.periodType == 'periodDays' ||
                  circleData.periodType == 'fertileDays' ? (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          ...Fonts.Medium1,
                          fontSize: 12,
                          color: Colors.Black,
                        }}>
                        {moment(new Date()).format('MMMM DD')}
                      </Text>
                      <Text
                        style={{
                          ...Fonts.Bold1,
                          fontSize: 14,
                          color:
                            circleData.periodType == 'safeDays'
                              ? '#145A32'
                              : circleData.periodType == 'ovulationDays'
                              ? '#D35400'
                              : circleData.periodType == 'periodDays'
                              ? '#AA336A'
                              : '#896BCD',
                        }}>
                        {circleData.message}
                      </Text>
                      <Text
                        style={{
                          ...Fonts.Regular1,
                          fontSize: 12,
                          color: Colors.PrimaryText1,
                          marginHorizontal: 27,
                          textAlign: 'center',
                        }}>
                        {circleData.description}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          ...Fonts.Medium1,
                          fontSize: 14,
                          color: Colors.Black,
                        }}>
                        {moment(new Date()).format('MMMM DD')}
                      </Text>
                      <Image
                        source={flower}
                        style={{
                          height: 65,
                          width: 65,
                          marginTop: Sizes.Base,
                        }}
                      />
                    </View>
                  )}
                </View>
              )}
            />
          </View>

          <View style={{marginTop: Sizes.Base}}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
              }}>
              <View
                style={{
                  width: '48%',
                  backgroundColor: '#ABEBC6',
                  borderRadius: Sizes.Radius,
                  padding: Sizes.Padding,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Icon
                    name="Safety"
                    type="AntDesign"
                    size={22}
                    color={'#145A32'}
                  />
                  <Text
                    style={{
                      ...Fonts.Medium3,
                      fontSize: 10,
                      color: Colors.Black,
                    }}>
                    {circleData.periodType == 'safeDays'
                      ? 'Current Cycle'
                      : daysUntilSafeStart > 0
                      ? daysUntilSafeStart + ' Days left'
                      : 'Done'}
                  </Text>
                </View>
                <Text
                  style={{
                    ...Fonts.Bold1,
                    color: '#145A32',
                    marginTop: Sizes.Base,
                  }}>
                  Safe Days
                </Text>
                <Text
                  style={{
                    ...Fonts.Medium3,
                    fontSize: 11,
                    color: Colors.Black,
                  }}>
                  {`${moment(data.mainData.SAFE_START_DATE).format(
                    'MMM DD',
                  )} - ${moment(data.mainData.SAFE_END_DATE).format('MMM DD')}`}
                </Text>
              </View>
              <View style={{width: '4%'}} />
              <View
                style={{
                  width: '48%',
                  backgroundColor: '#EDBB99',
                  borderRadius: Sizes.Radius,
                  padding: Sizes.Padding,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Image
                    source={ovulationIcon}
                    style={{width: 22, height: 22, tintColor: '#D35400'}}
                  />
                  <Text
                    style={{
                      ...Fonts.Medium3,
                      fontSize: 10,
                      color: Colors.Black,
                    }}>
                    {circleData.periodType == 'ovulationDays'
                      ? 'Current Cycle'
                      : daysUntilOvulationStart > 0
                      ? daysUntilOvulationStart + ' Days left'
                      : 'Done'}
                  </Text>
                </View>
                <Text
                  style={{
                    ...Fonts.Bold1,
                    color: '#D35400',
                    marginTop: Sizes.Base,
                  }}>
                  Ovulation
                </Text>
                <Text
                  style={{
                    ...Fonts.Medium3,
                    fontSize: 11,
                    color: Colors.Black,
                  }}>
                  {`${moment(data.mainData.OVULATION_START_DATE).format(
                    'MMM DD',
                  )} - ${moment(data.mainData.OVULATION_END_DATE).format(
                    'MMM DD',
                  )}`}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                marginTop: Sizes.Radius,
              }}>
              <View
                style={{
                  width: '48%',
                  backgroundColor: '#FF69B490',
                  borderRadius: Sizes.Radius,
                  padding: Sizes.Padding,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Icon
                    name="clock-time-five-outline"
                    type="MaterialCommunityIcons"
                    size={21}
                    color={'#AA336A'}
                  />
                  <Text
                    style={{
                      ...Fonts.Medium3,
                      fontSize: 10,
                      color: Colors.Black,
                    }}>
                    {circleData.periodType == 'periodDays'
                      ? 'Current Cycle'
                      : daysUntilPeriodStart > 0
                      ? daysUntilPeriodStart + ' Days left'
                      : 'Done'}
                  </Text>
                </View>
                <Text
                  style={{
                    ...Fonts.Bold1,
                    color: '#AA336A',
                    marginTop: Sizes.Base,
                  }}>
                  Period Days
                </Text>
                <Text
                  style={{
                    ...Fonts.Medium3,
                    fontSize: 11,
                    color: Colors.Black,
                  }}>
                  {`${moment(data.mainData.PERIOD_START_DATE).format(
                    'MMM DD',
                  )} - ${moment(data.mainData.PERIOD_END_DATE).format(
                    'MMM DD',
                  )}`}
                </Text>
              </View>
              <View style={{width: '4%'}} />
              <View
                style={{
                  width: '48%',
                  backgroundColor: '#CF9FFF90',
                  borderRadius: Sizes.Radius,
                  padding: Sizes.Padding,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Image
                    source={fertilityIcon}
                    style={{width: 24, height: 24, tintColor: '#896BCD'}}
                  />
                  <Text
                    style={{
                      ...Fonts.Medium3,
                      fontSize: 10,
                      color: Colors.Black,
                    }}>
                    {circleData.periodType == 'fertileDays'
                      ? 'Current Cycle'
                      : daysUntilFertileStart > 0
                      ? daysUntilFertileStart + ' Days left'
                      : 'Done'}
                  </Text>
                </View>
                <Text
                  style={{
                    ...Fonts.Bold1,
                    color: '#896BCD',
                    marginTop: Sizes.Base,
                  }}>
                  Fertility
                </Text>
                <Text
                  style={{
                    ...Fonts.Medium3,
                    fontSize: 11,
                    color: Colors.Black,
                  }}>
                  {`${moment(data.mainData.FERTILE_START_DATE).format(
                    'MMM DD',
                  )} - ${moment(data.mainData.FERTILE_END_DATE).format(
                    'MMM DD',
                  )}`}
                </Text>
              </View>
            </View>

            <View style={{marginTop: Sizes.ScreenPadding, width: '100%'}}>
              <FlatList
                data={flatListData}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index}: any) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        navigation.navigate(item.navigation);
                      }}
                      style={{
                        marginRight: Sizes.Radius,
                        paddingHorizontal: Sizes.Padding,
                        paddingTop: Sizes.Padding,
                        width: 120,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: Colors.Primary,
                        borderRadius: Sizes.Radius,
                      }}>
                      <Text
                        style={{
                          ...Fonts.Bold2,
                          fontSize: 11,
                          color: Colors.PrimaryText1,
                          textAlign: 'center',
                        }}>
                        {item.name}
                      </Text>
                      <Image
                        source={item.image}
                        style={{
                          height: item.height,
                          width: item.width,
                          marginTop: item.marginTop,
                          marginLeft: item.marginLeft,
                          alignSelf: 'center',
                        }}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            <View
              style={{
                borderRadius: Sizes.Radius,
                borderWidth: 1,
                borderColor: Colors.Primary,
                padding: Sizes.Padding,
                marginVertical: Sizes.ScreenPadding,
              }}>
              <Text style={{...Fonts.Medium1, color: Colors.Black}}>
                My Cycle
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  marginTop: Sizes.Base,
                }}>
                <View
                  style={{
                    width: '48%',
                    backgroundColor: '#fdeaf7',
                    borderRadius: Sizes.Radius,
                    padding: Sizes.Padding,
                    borderWidth: 1,
                    borderColor: '#f58cd5',
                  }}>
                  <Text
                    style={{
                      ...Fonts.Medium1,
                      color: '#AA336A',
                    }}>
                    Normal
                  </Text>
                  <Text
                    style={{
                      ...Fonts.Medium1,
                      color: Colors.PrimaryText1,
                    }}>
                    {data.mainData.CYCLE_LENGTH}
                  </Text>
                  <Text
                    style={{
                      ...Fonts.Medium2,
                      color: Colors.PrimaryText1,
                    }}>
                    Cycle Length
                  </Text>
                </View>
                <View style={{width: '4%'}} />
                <View
                  style={{
                    width: '48%',
                    backgroundColor: '#D5F5E390',
                    borderRadius: Sizes.Radius,
                    padding: Sizes.Padding,
                    borderWidth: 1,
                    borderColor: '#2ECC71',
                  }}>
                  <Text
                    style={{
                      ...Fonts.Medium1,
                      color: '#196F3D',
                    }}>
                    Normal
                  </Text>
                  <Text
                    style={{
                      ...Fonts.Medium1,
                      color: Colors.PrimaryText1,
                    }}>
                    {data.mainData.PERIOD_DAYS_LENGTH}
                  </Text>
                  <Text
                    style={{
                      ...Fonts.Medium2,
                      // fontSize: 11,
                      color: Colors.PrimaryText1,
                    }}>
                    Period Length
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {showPopUp && (
        <Modal
          onClose={() => {
            navigation.navigate('Dashboard');
            setShowPopUp(false);
          }}
          isVisible={showPopUp}>
          <View style={{}}>
            <Text style={{color: Colors.PrimaryText1, ...Fonts.Bold2}}>
              Reminder
            </Text>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Medium3,
                fontSize: 10,
                marginTop: Sizes.Base,
              }}>
              "If you're done with last month, don't let last month's data go
              untracked! Update your period tracking now and take the first step
              towards a healthier, happier you."
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: Sizes.ScreenPadding,
              }}>
              <TextButton
                isBorder
                style={{flex: 1, borderColor: Colors.Secondary}}
                label="No"
                loading={false}
                onPress={() => {
                  setShowPopUp(false);
                }}
              />
              <View style={{width: Sizes.Padding}} />
              <TextButton
                style={{flex: 1}}
                label="Yes"
                loading={false}
                onPress={() => {
                  setShowPopUp(false);
                  navigation.navigate('UpdateData', {item: data.mainData});
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default CircleCalender;
