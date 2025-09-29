import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  BackHandler,
} from 'react-native';

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
import {
  Approved,
  FemaleUser,
  Green,
  MaleUser,
  Red,
  noData,
} from '../../../assets';
import moment from 'moment';
import AttendanceRenderItem from './AttendanceRenderItem';
import AnimatedCircularProgress from './AnimationComponent';
import FloatingAdd from '../../Components/FloatingAdd';
import SelectionComponent from '../../Components/SelectionComponent';
import Animated, {
  FlipInEasyX,
  FlipOutEasyX,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import TitleComponent from '../../Components/TitleComponent';
import { Loader } from '../Dashboard';
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
interface AttendanceDateWise {
  ABSENT: number;
  PRESENT: number;
  TOTAL: number;
  PERCENTAGE: number;
  DATE: string;
}

type Props = StackProps<'ClassTeacherAttendance'>;
const ClassTeacherAttendance = ({ navigation, route }: Props): JSX.Element => {
  const { teacherClassMapping }: any = useSelector(state => state.teacher);
  const { member } = useSelector(state => state.member);
  const { t } = useTranslation();

  const { item, Teacher } = route.params;
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const [mainModal, setMainModal] = useState(true);
  const [selectedData1, setSelectedData1] = useState<selectData>({
    className: {
      ARCHIVE_FLAG: '',
      CLASS_ID: 0,
      CLASS_NAME: '',
      CLIENT_ID: 0,
      CREATED_MODIFIED_DATE: '',
      ID: 0,
      READ_ONLY: '',
      SCHOOL_ID: 0,
      STATUS: 0,
      TEACHER_ID: 0,
    },
    item: route.params.item,
  });
  const [taskData, setTaskData] = useState({
    data: [],
    filterData: [],
    loading: false,
  });
  const [loading1, setloading1] = useState(true);
  const [attendanceListLoader, setAttendanceListLoader] = useState(false);

  const [openModal, setOpenModal] = useState({
    class: false,
    div: false,
    subject: false,
    PresentModal: false,
    AbsentModal: false,
  });

  const [AttendanceDateWise, setAttendanceDateWise] = useState<
    AttendanceDateWise[]
  >([]);

  const [SubjectData, setSubjectData] = useState<SubjectData>({
    data: [],
    loading: false,
  });

  let scale = useSharedValue(0);
  const animation = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const startAnimation = async () => {
    return new Promise<void>((resolve, reject) => {
      scale.value = withTiming(1, { duration: 800 }, () => { });
    });
  };
  const [selectedData, setSelectedData] = useState({
    date: moment().format('YYYY-MM-DD'),
    showData: false,
    class: { CLASS_NAME: '', CLASS_ID: '' },
    div: { NAME: '' },
    subject: { SUBJECT_NAME: '' },
  });
  const [data, setData] = useState({
    division: [],
    teacherSubject: [],
  });

  const [Month, setMonth] = useState({
    FirstDay: moment().startOf('month').format('YYYY-MM-DD'),
    LastDate: moment().endOf('month').format('YYYY-MM-DD'),
  });

  const isFirstRender = useRef(true);
  const isFirstRender1 = useRef(true);

  useEffect(() => {
    scale.value = 0;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    getAttendanceDataSubjectCount(selectedData1.item);
  }, [selectedData.date]);

  useFocusEffect(
    React.useCallback(() => {
      scale.value = 0;

      if (isFirstRender1.current) {
        isFirstRender1.current = false;
        return;
      }
      getAttendanceDataSubjectCount(selectedData1.item);
    }, [navigation]),
  );

  const [AttendanceData, setAttendanceData] = useState<AttendanceData>({
    PresentStudents: [],
    AbsentStudents: [],
  });

  const attendanceData: any = {
    '2024-03-01': {
      Math: { present: 2, total: 6 },
    },
    '2024-03-02': {
      Math: { present: 6, total: 6 },
    },
  };

  const calculateAttendancePercentage = (data: AttendanceDateWise): number => {
    const presentPercentage = (data.PRESENT / data.TOTAL) * 100;
    return presentPercentage;
  };

  useEffect(() => {
    getAttendanceDatePresent();
  }, [Month]);

  const CustomDayComponent = ({
    date,
    state,
    AttendanceDateWise,
    selectedData,
    setSelectedData,
    attendanceData, // Assuming attendanceData is accessible here
  }: any) => {
    // Function to calculate attendance percentage for a specific date
    const calculateAttendancePercentageForDate = (date: string) => {
      const attendanceDataForDate = AttendanceDateWise.find(
        item => item.DATE === date,
      );

      if (attendanceDataForDate) {
        return calculateAttendancePercentage(attendanceDataForDate);
      }

      return 0; // Default to 0 if attendance data is not available for the date
    };

    // Get attendance percentage for the current date
    const attendancePercentage = calculateAttendancePercentageForDate(
      date.dateString,
    );


    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const progress = circumference * (attendancePercentage / 100);

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
        {state !== 'disabled' && (
          <Circle
            cx="20"
            cy="20"
            r={19}
            fill={
              date.dateString === selectedData.date ? Colors.Primary : '#ffffff'
            }
            stroke="#e6e6e6"
            opacity={0.2}
            strokeWidth="2"
          />
        )}
        {state !== 'disabled' && (
          <Circle
            cx="20"
            cy="20"
            r={19}
            fill={
              date.dateString === selectedData.date
                ? Colors.Primary
                : 'transparent'
            }
            stroke={attendancePercentage >= 50 ? 'green' : 'red'}
            strokeWidth={attendancePercentage > 0 ? '2' : '0'}
            strokeDasharray={`${progress},${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 20 20)"
          />
        )}
        {state !== 'disabled' && (
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

  const getAttendanceDatePresent = async () => {
    try {
      const res = await apiPost('api/attendanceDetails/getCount', {
        // filter: `AND DATE BETWEEN '${Month.FirstDay}' AND '${Month.LastDate}' AND CLASS_ID = ${selectedData1.item.CLASS_ID} AND DIVISION_ID = ${selectedData1.item.DIVISION_ID} `,
        filter: `AND DATE BETWEEN '${Month.FirstDay}' AND '${Month.LastDate}'`,
      });

      if (res && res.code === 200) {
        setAttendanceDateWise(res.data);
      }
    } catch (error) {
      console.log('err...', error);
    }
  };
  const toggleSelectedItem = (item: SUBJECT_TEACHER_MASTER) => {
    const selectedItems = taskData.filterData.filter(
      (it: SUBJECT_TEACHER_MASTER) => item.ID === it.ID,
    );

    setSelectedData1({
      ...selectedData1,
      item: selectedItems[0],
    });
    getAttendanceDataSubjectCount(selectedItems[0]);
    setMainModal(false);
  };
  const getSubjectTeacherMaster = async () => {
    try {
      const res = await apiPost('api/subjectTeacherMapping/get', {
        filter: ` AND TEACHER_ID = ${member?.ID} AND YEAR_ID = ${member?.YEAR_ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        setTaskData({ ...taskData, filterData: res.data });
      }
    } catch (error) {
      console.log('error..', error);
    }
  };
  const getAttendanceData = async (item: SUBJECT_TEACHER_MASTER) => {
    setAttendanceListLoader(true);
    try {
      const res = await apiPost('api/attendanceDetails/get', {
        filter: `AND DATE = '${selectedData.date}' AND CLASS_ID = ${selectedData1.item.CLASS_ID} AND DIVISION_ID = ${selectedData1.item.DIVISION_ID} AND SUBJECT_ID = ${item.SUBJECT_ID} AND LECTURE_TIME = '${item.LECTURE_TIME}'`,
      });
      if (res && res.code === 200) {
        const presentStudents = res.data.filter(
          (student: any) => student.STATUS === 'P',
        );
        const absentStudents = res.data.filter(
          (student: any) => student.STATUS === 'A',
        );
        setOpenModal({ ...openModal, PresentModal: true });
        setAttendanceData({
          PresentStudents: presentStudents,
          AbsentStudents: absentStudents,
        });
      }
      setAttendanceListLoader(false);
    } catch (error) {
      setAttendanceListLoader(false);
      console.log('err...', error);
    }
  };
  const getAttendanceDataA = async (item: SUBJECT_TEACHER_MASTER) => {
    setAttendanceListLoader(true);
    try {
      const res = await apiPost('api/attendanceDetails/get', {
        filter: `AND DATE = '${selectedData.date}' AND CLASS_ID = ${route.params.item.CLASS_ID} AND DIVISION_ID = ${selectedData1.item.DIVISION_ID} AND SUBJECT_ID = ${item.SUBJECT_ID} AND LECTURE_TIME = '${item.LECTURE_TIME}'`,
      });
      if (res && res.code === 200) {
        const presentStudents = res.data.filter(
          (student: any) => student.STATUS === 'P',
        );
        const absentStudents = res.data.filter(
          (student: any) => student.STATUS === 'A',
        );
        setAttendanceData({
          PresentStudents: presentStudents,
          AbsentStudents: absentStudents,
        });
        setOpenModal({ ...openModal, AbsentModal: true });
      }
      setAttendanceListLoader(false);
    } catch (error) {
      setAttendanceListLoader(false);
      console.log('err...', error);
    }
  };
  useEffect(() => {
    setSelectedData1({
      ...selectedData1,
      item: route.params.item,
    });
    getAttendanceDataSubjectCount(route.params.item);
    const backAction = () => {
      navigation.popToTop();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  const getAttendanceSubjectData = async (item: SUBJECT_TEACHER_MASTER) => {
    try {
      const res = await apiPost('api/attendanceReport/getSubjectwiseCount', {
        filter: `AND DATE = '${selectedData.date} AND CLASS_ID = ${item.CLASS_ID} AND DIVISION_ID = ${item.DIVISION_ID} '`,
      });
      if (res && res.code === 200) {
        startAnimation();
        setloading1(false);
        setSubjectData({ ...SubjectData, data: res.data });
      }
    } catch (error) {
      console.log('err...', error);
    }
  };
  const getAttendanceDataSubjectCount = async (
    item: SUBJECT_TEACHER_MASTER,
  ) => {
    try {
      const res = await apiPost('api/attendanceDetails/getSubjectCount', {
        filter: `AND DATE = '${selectedData.date}' AND CLASS_ID = ${item.CLASS_ID} AND DIVISION_ID = ${item.DIVISION_ID}`,
        sortValue: 'DESC',
        sortKey: 'LECTURE_TIME',
      });
      console.log("getAttendanceDataSubjectCount res...", res.data);
      if (res && res.code === 200) {
        startAnimation();
        setloading1(false);
        setSubjectData({ ...SubjectData, data: res.data });
      }
    } catch (error) {
      console.log('err...', error);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.Background }}>
      <Header
        label={'Attendance'}
        onBack={() => {
          navigation.goBack();
        }}
      />

      <View style={{ padding: Sizes.Padding, flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <TitleComponent
            label={
              selectedData1.item.CLASS_NAME +
              ' ' +
              selectedData1.item.DIVISION_NAME
            }
            style={{ flex: 0.5 }}
            onPress={() => { }}
            ViewStyle={{ borderRadius: Sizes.Base }}
            isBorder={true}
            textStyle={{ ...Fonts.Medium2, color: Colors.PrimaryText1 }}
            loading={false}
          />
          <View style={{ width: Sizes.Base }} />

          <TitleComponent
            label={moment(selectedData.date).format('MMM YYYY')}
            style={{
              flex: 0.5,
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
            }}
            onPress={() => { }}
            leftChild={<Icon size={30} name="calendar" type="EvilIcons" />}
            ViewStyle={{ borderRadius: Sizes.Base }}
            isBorder={true}
            textStyle={{ ...Fonts.Medium2, color: Colors.PrimaryText1 }}
            loading={false}
          />
        </View>

        <View style={{ height: Sizes.Padding }} />

        <View
          style={{
            elevation: 10,
            backgroundColor: Colors.White,
            borderRadius: Sizes.Radius,
          }}>
          <Calendar
            style={{ borderRadius: Sizes.Radius }}
            hideArrows
            dayComponent={({ date, state }: any) => (
              <CustomDayComponent
                date={date}
                state={state}
                AttendanceDateWise={AttendanceDateWise}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
              />
            )}
          />
        </View>

        <View style={{ height: Sizes.Base }} />

        {loading1 ? (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size={'large'} color={Colors.Primary} />
          </View>
        ) : SubjectData.data.length == 0 ? (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              resizeMode={'contain'}
              style={{
                width: 170,
                height: 170,
              }}
              source={noData}
              tintColor={Colors.Primary}
            />
          </View>
        ) : (
          <View style={{ flex: 1, marginBottom: Sizes.ScreenPadding }}>
            <FlatList
              data={SubjectData.data}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({
                item,
                index,
              }: {
                item: SUBJECT_WISE_ATTENDANCE | any;
                index: number;
              }) => {
                return (
                  <Animated.View style={[animation]}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => { }}
                      style={{
                        padding: Sizes.Padding,
                        borderRadius: Sizes.Radius,
                        backgroundColor: Colors.Background,
                        marginVertical: Sizes.Base,
                        justifyContent: 'space-between',
                        elevation: 5,
                        marginHorizontal: 2,
                      }}>
                      <Text
                        style={{
                          ...Fonts.Medium4,
                          color: Colors.PrimaryText1,
                          textAlign: 'right',
                          marginBottom: 6,
                        }}>
                        {moment(item.LECTURE_TIME, 'HH:mm:ss').format(
                          'hh:mm A',
                        )}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                          alignContent: 'center',
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            getAttendanceData(item);
                          }}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                          }}>
                          <Green
                            style={{ marginEnd: Sizes.Base }}
                            width={15}
                            height={15}
                            onPress={() => {
                              getAttendanceData(item);
                            }}
                          />
                          <Text
                            numberOfLines={2}
                            style={{
                              ...Fonts.Medium2,
                              color: Colors.Black,
                              textAlign: 'center',
                            }}>
                            {`${item.PRESENT} Present`}
                          </Text>
                          <View style={{ width: Sizes.Base }} />
                          <Icon name="info" type="Feather" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            getAttendanceDataA(item);
                          }}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Red
                            style={{ marginEnd: Sizes.Base }}
                            width={15}
                            height={15}
                            onPress={() => { }}
                          />
                          <Text
                            numberOfLines={2}
                            style={{
                              ...Fonts.Medium2,
                              color: Colors.Black,
                              textAlign: 'center',
                            }}>
                            {`${item.ABSENT} Absent`}
                          </Text>
                          <View style={{ width: Sizes.Base }} />
                          <Icon name="info" type="Feather" />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              }}
            />
          </View>
        )}
      </View>
      {moment(selectedData.date).format('YYYY-MM-DD') ==
        moment(new Date()).format('YYYY-MM-DD') ? (
        <FloatingAdd
          onPress={() => {
            navigation.navigate('CreateAttendance', {
              Teacher: '1',
              Filter: selectedData1,
            });
          }}
        />
      ) : null}

      {openModal.PresentModal ? (
        <Modal
          containerStyle={{ justifyContent: 'flex-end' }}
          title={`${t('classTeacherAttendance.present')} : ${AttendanceData.PresentStudents.length
            }`}
          style={{
            margin: 0,
            marginTop: Sizes.Header,
            borderTopStartRadius: Sizes.Radius,
            borderTopEndRadius: Sizes.Radius,
            maxHeight: '50%',
          }}
          animation="slide"
          isVisible={openModal.PresentModal}
          onClose={() => {
            setOpenModal({ ...openModal, PresentModal: false });
          }}>
          <View style={{ marginVertical: Sizes.Base }}>
            <FlatList
              data={AttendanceData.PresentStudents}
              keyExtractor={item => item.ID.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => <AttendanceRenderItem item={item} />}
            />
          </View>
        </Modal>
      ) : null}
      {openModal.AbsentModal ? (
        <Modal
          containerStyle={{ justifyContent: 'flex-end' }}
          title={`${t('classTeacherAttendance.absent')} : ${AttendanceData.AbsentStudents.length
            } `}
          style={{
            margin: 0,
            marginTop: Sizes.Header,
            borderTopStartRadius: Sizes.Radius,
            borderTopEndRadius: Sizes.Radius,
            maxHeight: '50%',
          }}
          animation="slide"
          isVisible={openModal.AbsentModal}
          onClose={() => {
            setOpenModal({ ...openModal, AbsentModal: false });
          }}>
          <View style={{ marginVertical: Sizes.Base }}>
            <FlatList
              data={AttendanceData.AbsentStudents}
              keyExtractor={item => item.ID.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => <AttendanceRenderItem item={item} />}
            />
          </View>
        </Modal>
      ) : null}

      {attendanceListLoader && (
        <Loader
          navigation={navigation}
          closeLoader={() => {
            setAttendanceListLoader(false);
          }}
        />
      )}
    </View>
  );
};

export default ClassTeacherAttendance;
