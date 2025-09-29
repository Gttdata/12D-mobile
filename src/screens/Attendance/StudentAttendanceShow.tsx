import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { apiPost, useSelector } from '../../Modules';
import { Calendar } from 'react-native-calendars';
import { Svg, Circle, Text as SvgText } from 'react-native-svg';
import { Header, Icon, Modal } from '../../Components';
import { StackProps } from '../../routes';
import ModalPicker from '../../Components/ModalPicker';
import {
  ATTENDANCE_LIST,
  CLASS_TEACHER_MAPPING,
  SUBJECT_TEACHER_MASTER,
  SUBJECT_WISE_ATTENDANCE,
} from '../../Modules/interface';
import moment from 'moment';
import AttendanceRenderItem from './AttendanceRenderItem';
import AnimatedCircularProgress from './AnimationComponent';
import FloatingAdd from '../../Components/FloatingAdd';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { isSubscriptionActive } from '../../Functions';
import PurchaseSubscriptionModal from '../../Components/PurchaseSubscriptionModal';
import { BannerAds } from '../../Modules/AdsUtils';
interface AttendanceData {
  PresentStudents: ATTENDANCE_LIST[];
  AbsentStudents: ATTENDANCE_LIST[];
}
interface selectData {
  className: CLASS_TEACHER_MAPPING;
  item: SUBJECT_TEACHER_MASTER;
}
interface SubjectData {
  data: SUBJECT_WISE_ATTENDANCE[];
  loading: boolean;
}

type Props = StackProps<'StudentAttendanceShow'>;
const StudentAttendanceShow = ({ navigation }: Props): JSX.Element => {
  const { teacherClassMapping }: any = useSelector(state => state.teacher);
  const { member } = useSelector(state => state.member);
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const [mainModal, setMainModal] = useState(true);
  const purchase = !isSubscriptionActive() ? true : false;
  const [openPurchaseModal, setOpenPurchaseModal] = useState(purchase);
  let scale = useSharedValue(0);
  const animation = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const startAnimation = async () => {
    return new Promise((resolve, reject) => {
      scale.value = withTiming(1, { duration: 800 });
    });
  };
  const [taskData, setTaskData] = useState({
    data: [],
    filterData: [],
    loading: false,
  });

  const [selectedItem, setSelectedItem] = useState<any>({});
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [studentClassId, setStudentClassId] = useState(null);

  const [SubjectData, setSubjectData] = useState<SubjectData>({
    data: [],
    loading: false,
  });

  const [selectedData, setSelectedData] = useState({
    date: moment().format('YYYY-MM-DD'),
    showData: false,
    class: { CLASS_NAME: '', CLASS_ID: '' },
    div: { NAME: '' },
    subject: { SUBJECT_NAME: '' },
  });

  const attendanceData: any = {
    '2024-03-01': {
      Math: { present: 2, total: 6 },
    },
    '2024-03-02': {
      Math: { present: 6, total: 6 },
    },
  };
  const calculateAttendancePercentage = (date: any, subject: any) => {
    const attendanceCount = attendanceData[date]?.[subject]?.present || 0;
    const totalCount = attendanceData[date]?.[subject]?.total || 1;
    return ((attendanceCount / totalCount) * 100).toFixed(0);
  };

  const CustomDayComponent = ({ date, state }: any) => {
    const attendancePercentage: any = calculateAttendancePercentage(
      date.dateString,
      'Math',
    );
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const progress = circumference * (attendancePercentage / 100);
    // console.log('\n\nstate,,,,', state);
    return (
      <Svg
        width="40"
        height="40"
        onPress={() => {
          setSelectedData({
            ...selectedData,
            showData: true,
            date: date.dateString,
          });
        }}>
        {state != 'disabled' && (
          <Circle
            cx="20"
            cy="20"
            r={19}
            fill="#ffffff"
            stroke="#e6e6e6"
            strokeWidth="2"
          />
        )}
        {state != 'disabled' && (
          <Circle
            cx="20"
            cy="20"
            r={19}
            fill={'transparent'}
            stroke={attendancePercentage >= 50 ? 'green' : 'red'}
            strokeWidth="2"
            strokeDasharray={`${progress},${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 20 20)"
          />
        )}
        {state != 'disabled' && (
          <SvgText
            x="50%"
            y="50%"
            fontSize="10"
            fill="black"
            textAnchor="middle"
            alignmentBaseline="middle">
            {date.day}
          </SvgText>
        )}
      </Svg>
    );
  };

  useEffect(() => {
    getAttendanceSubjectData();
  }, [selectedData.date]);

  useEffect(() => {
    getClass();
    // getAttendanceSubjectData()
  }, []);
  const getClass = async () => {
    try {
      const res = await apiPost('api/studentClassMapping/get', {
        filter: `AND STUDENT_ID=${member?.ID}`,
      });
      console.log("Class Mapping", res);

      if (res && res.code == 200) {
        setStudentClassId(res.data[0].CLASS_NAME + res.data[0].DIVISION_NAME);
      } else {
        setTaskData({ ...taskData, loading: false });
      }
    } catch (error) {
      setTaskData({ ...taskData, loading: false });
      console.log('error..', error);
    }
  };

  const getAttendanceData = async (SUBJECT_ID: number) => {
    try {
      const res = await apiPost('api/attendance/get', {
        // filter: `AND DATE = '${selectedData.date}' AND CLASS_ID = ${selectedData1.item.CLASS_ID} AND DIVISION_ID = ${selectedData1.item.DIVISION_ID} AND SUBJECT_ID = ${SUBJECT_ID}`,
      });
      if (res && res.code === 200) {
      }
    } catch (error) {
      console.log('err...', error);
    }
  };
  const getAttendanceSubjectData = async () => {
    try {
      const res = await apiPost('api/attendanceDetails/get', {
        filter: `AND DATE = '${selectedData.date}' AND STUDENT_ID = ${member?.ID} `,
      });
      if (res && res.code === 200) {
        startAnimation();
        setSubjectData({ ...SubjectData, data: res.data });
      }
    } catch (error) {
      console.log('err...', error);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.Background }}>
      <Header
        label="Attendance"
        onBack={() => {
          navigation.goBack();
        }}
      />

      <View style={{ flex: 1 }}>
        <Calendar
          onDayPress={(day: any) => {
            setSelectedData({ ...selectedData, date: day.dateString });
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e',
          }}
          markedDates={{
            [selectedData.date]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: Colors.Primary,
            },
          }}
        />

        <View style={{ height: Sizes.Padding }} />
        <View style={{ flex: 1, margin: Sizes.Padding }}>
          <FlatList
            data={SubjectData.data}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({
              item,
              index,
            }: {
              item: SUBJECT_WISE_ATTENDANCE;
              index: number;
            }) => {
              return (
                <Animated.View
                  style={[animation]}
                // entering={FlipInEasyX}
                // exiting={FlipOutEasyX}
                // style={{ backgroundColor: Colors.White }}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      // getAttendanceData(item.SUBJECT_ID);
                    }}
                    style={{
                      padding: Sizes.Padding,
                      borderRadius: Sizes.Radius,
                      backgroundColor: Colors.Background,
                      margin: Sizes.Base,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      elevation: 5,
                    }}>
                    <Text
                      numberOfLines={2}
                      style={{ ...Fonts.Medium2, color: Colors.Black }}>
                      {item.SUBJECT_NAME ? item.SUBJECT_NAME : studentClassId}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: Sizes.Base }} />
                      <Icon
                        name="info"
                        type="Feather"
                        color={item.STATUS === 'A' ? 'red' : 'green'}
                        onPress={() => {
                          setSelectedItem(item);
                          setOpenDetailsModal(true);
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            }}
          />
        </View>
      </View>
      <BannerAds />
      {openDetailsModal && console.log(selectedItem)}
      {openDetailsModal && (
        <Modal
          title="Details"
          isVisible={openDetailsModal}
          onClose={() => {
            setOpenDetailsModal(false);
          }}
          containerStyle={{
            justifyContent: 'flex-end',
          }}
          style={{
            margin: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            paddingVertical: Sizes.ScreenPadding,
          }}>
          <View style={{ marginTop: Sizes.Radius }}>
            {selectedItem.SUBJECT_NAME && (
              <View style={{ flexDirection: 'row' }}>
                <Icon name="book" type="Entypo" />
                <Text
                  style={{
                    ...Fonts.Medium2,
                    color: Colors.Black,
                    marginLeft: Sizes.Radius,
                  }}>
                  Subject Name :{'   '}
                </Text>
                <Text style={{ ...Fonts.Medium2, color: Colors.PrimaryText1 }}>
                  {selectedItem.SUBJECT_NAME}
                </Text>
              </View>
            )}

            <View
              style={{
                flexDirection: 'row',
                marginTop: Sizes.Base,
              }}>
              <Icon
                name="clock-time-two-outline"
                type="MaterialCommunityIcons"
              />
              <Text
                style={{
                  ...Fonts.Medium2,
                  color: Colors.Black,
                  marginLeft: Sizes.Radius,
                }}>
                Lecture Time :{'   '}
              </Text>
              <Text style={{ ...Fonts.Medium2, color: Colors.PrimaryText1 }}>
                {'' +
                  moment(
                    moment().format('YYYY-MM-DD ') + selectedItem.LECTURE_TIME,
                  ).format('hh:mm A')}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', marginTop: Sizes.Base }}>
              <Icon name="user" type="Feather" />
              <Text
                style={{
                  ...Fonts.Medium2,
                  color: Colors.Black,
                  marginLeft: Sizes.Radius,
                }}>
                Teacher Name :{'   '}
              </Text>
              <Text style={{ ...Fonts.Medium2, color: Colors.PrimaryText1 }}>
                {selectedItem.TEACHER_NAME}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: Sizes.Base }}>
              <Icon name="alert-circle" type="Feather" />
              <Text style={{ ...Fonts.Medium2, color: Colors.PrimaryText1 }}>
                {'   '}
                {selectedItem.STATUS === 'A' ? 'Absent' : 'Present'}
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default StudentAttendanceShow;
