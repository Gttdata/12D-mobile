import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  BackHandler,
  ActivityIndicator,
  Image,
} from 'react-native';
import {apiPost, useSelector} from '../../Modules';
import {Calendar} from 'react-native-calendars';
import {Svg, Circle, Text as SvgText} from 'react-native-svg';
import {Header, Icon, Modal} from '../../Components';
import {StackProps} from '../../routes';
import ModalPicker from '../../Components/ModalPicker';
import {
  ATTENDANCE_LIST,
  CLASS_TEACHER_MAPPING,
  SUBJECT_TEACHER_MASTER,
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
import SelectionComponent from '../../Components/SelectionComponent';
import FloatingAdd from '../../Components/FloatingAdd';
import {useTranslation} from 'react-i18next';
import TitleComponent from '../../Components/TitleComponent';
import {AttendanceRecord} from '../../Modules/interface2';
import Animated from 'react-native-reanimated';
import {useFocusEffect} from '@react-navigation/native';
import {Loader} from '../Dashboard';

interface selectData {
  className: CLASS_TEACHER_MAPPING;
  item: SUBJECT_TEACHER_MASTER;
}
interface AttendanceDateWise {
  ABSENT: number;
  PRESENT: number;
  TOTAL: number;
  PERCENTAGE: number;
  DATE: string;
}
interface AttendanceData {
  PresentStudents: ATTENDANCE_LIST[];
  AbsentStudents: ATTENDANCE_LIST[];
}

type Props = StackProps<'SubjectTeachAttendance'>;
const SubjectTeachAttendance = ({navigation, route}: Props): JSX.Element => {
  const {teacherClassMapping}: any = useSelector(state => state.teacher);
  const {member} = useSelector(state => state.member);
  const {t} = useTranslation();
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [mainModal, setMainModal] = useState(false);
  const [selectedData1, setSelectedData1] = useState<selectData>({
    className: {
      ARCHIVE_FLAG: '',
      CLASS_ID: 0,
      CLASS_NAME: '',
      CLIENT_ID: 1,
      CREATED_MODIFIED_DATE: '',
      ID: 0,
      READ_ONLY: '',
      SCHOOL_ID: 0,
      STATUS: 0,
      TEACHER_ID: 0,
    },
    item: {
      ARCHIVE_FLAG: '',
      CLASS_ID: 0,
      CLASS_NAME: '',
      CLIENT_ID: 1,
      CREATED_MODIFIED_DATE: '',
      DIVISION_ID: 0,
      DIVISION_NAME: '',
      ID: 0,
      READ_ONLY: '',
      STATUS: 0,
      SUBJECT_ID: 0,
      SUBJECT_NAME: undefined,
      TEACHER_ID: 0,
      TEACHER_NAME: '',
      YEAR_ID: 0,
    },
  });
  const [AttendanceDateWise, setAttendanceDateWise] = useState<
    AttendanceDateWise[]
  >([]);

  const [Month, setMonth] = useState({
    FirstDay: moment().startOf('month').format('YYYY-MM-DD'),
    LastDate: moment().endOf('month').format('YYYY-MM-DD'),
  });

  const [taskData, setTaskData] = useState({
    data: [],
    filterData: [],
    loading: false,
  });
  const [AttendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);

  const [openModal, setOpenModal] = useState({
    class: false,
    div: false,
    subject: false,
    PresentModal: false,
    AbsentModal: false,
  });
  const [selectedData, setSelectedData] = useState({
    date: moment().format('YYYY-MM-DD'),
    showData: false,
    class: {CLASS_NAME: '', CLASS_ID: ''},
    div: {NAME: ''},
    subject: {SUBJECT_NAME: ''},
  });
  const [data, setData] = useState({
    division: [],
    teacherSubject: [],
  });

  const [loading, setloading] = useState(true);
  const [attendanceListLoader, setAttendanceListLoader] = useState(false);
  const {SUBJECT_SELECTED}: any = useSelector(state => state.QuestionPaperType);

  const [AttendanceData, setAttendanceData] = useState<AttendanceData>({
    PresentStudents: [],
    AbsentStudents: [],
  });
  const attendanceData: any = {
    '2024-03-01': {
      Math: {present: 2, total: 6},
    },
    '2024-03-02': {
      Math: {present: 6, total: 6},
    },
  };

  const calculateAttendancePercentage = (data: AttendanceDateWise): number => {
    const presentPercentage = (data.PRESENT / data.TOTAL) * 100;
    return presentPercentage;
  };

  let selectedColor = '';
  const markedDates: any = {};
  let totalPresent = 0;
  let totalStudents = 0;

  AttendanceDateWise.forEach(item => {
    totalPresent += item.PRESENT;
    totalStudents += item.TOTAL;
  });

  const percentage = (totalPresent / totalStudents) * 100;

  if (percentage >= 75) {
    selectedColor = 'green';
  } else if (percentage >= 50) {
    selectedColor = 'yellow';
  } else {
    selectedColor = 'blue';
  }
  AttendanceDateWise.forEach(item => {
    markedDates[item.DATE] = {
      selected: true,
      disableTouchEvent: true,
      selectedColor: selectedColor,
    };
  });
  markedDates[selectedData.date.toString()] = {
    selected: true,
    disableTouchEvent: true,
    selectedColor: selectedColor,
  };
  const currentDate = new Date();
  const firstDateOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const lastDateOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );

  const CustomDayComponent = ({
    date,
    state,
    AttendanceDateWise,
    selectedData,
    setSelectedData,
    attendanceData,
  }: any) => {
    const calculateAttendancePercentageForDate = (date: string) => {
      const attendanceDataForDate = AttendanceDateWise.find(
        item => item.DATE === date,
      );

      if (attendanceDataForDate) {
        return calculateAttendancePercentage(attendanceDataForDate);
      }

      return 0; // Default to 0 if attendance data is not available for the date
    };
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
  const CustomCalendarHeader = ({item}: any) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 10,
        }}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          Custom Calendar Header
        </Text>
      </View>
    );
  };
  useEffect(() => {
    getAttendanceDatePresent();
  }, [Month]);
  const toggleSelectedItem = (item: SUBJECT_TEACHER_MASTER) => {
    const selectedItems = taskData.filterData.filter(
      (it: SUBJECT_TEACHER_MASTER) => item.ID === it.ID,
    );
    setSelectedData1({
      ...selectedData1,
      item: selectedItems[0],
    });
    setMainModal(false);
  };
  const getSubjectTeacherMaster = async () => {
    try {
      const res = await apiPost('api/subjectTeacherMapping/get', {
        filter: ` AND TEACHER_ID = ${member?.ID} AND YEAR_ID = ${member?.YEAR_ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        setloading(false);
        setTaskData({...taskData, filterData: res.data});
      }
    } catch (error) {
      console.log('error..', error);
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
  useFocusEffect(
    React.useCallback(() => {
      getAttendanceDataSubjectCount(route.params.item);
    }, [route.params.item]),
  );
  const getAttendanceData = async (item: SUBJECT_TEACHER_MASTER) => {
    setAttendanceListLoader(true);
    try {
      const res = await apiPost('api/attendanceDetails/get', {
        filter: `AND DATE = '${selectedData.date}' AND CLASS_ID = ${route.params.item.CLASS_ID} AND DIVISION_ID = ${route.params.item.DIVISION_ID} AND SUBJECT_ID = ${route.params.item.SUBJECT_ID} AND LECTURE_TIME = '${item.LECTURE_TIME}'`,
      });
      if (res && res.code === 200) {
        setloading(false);
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
        setOpenModal({...openModal, PresentModal: true});
      }
      setAttendanceListLoader(false);
    } catch (error) {
      setloading(false);
      setAttendanceListLoader(false);
      console.log('err...', error);
    }
  };
  const getAttendanceDataA = async (item: SUBJECT_TEACHER_MASTER) => {
    setAttendanceListLoader(true);
    try {
      const res = await apiPost('api/attendanceDetails/get', {
        filter: `AND DATE = '${selectedData.date}' AND CLASS_ID = ${route.params.item.CLASS_ID} AND DIVISION_ID = ${route.params.item.DIVISION_ID} AND SUBJECT_ID = ${route.params.item.SUBJECT_ID} AND LECTURE_TIME = '${item.LECTURE_TIME}'`,
      });

      if (res && res.code === 200) {
        setloading(false);
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
        setOpenModal({...openModal, AbsentModal: true});
      }
      setAttendanceListLoader(false);
    } catch (error) {
      setloading(false);
      setAttendanceListLoader(false);
      console.log('err...', error);
    }
  };
  const getAttendanceDataSubjectCount = async (
    item: SUBJECT_TEACHER_MASTER,
  ) => {
    try {
      const res = await apiPost('api/attendanceDetails/getSubjectCount', {
        filter: `AND DATE = '${selectedData.date}' AND CLASS_ID = ${item.CLASS_ID} AND DIVISION_ID = ${item.DIVISION_ID} AND SUBJECT_ID = ${item.SUBJECT_ID}`,
        sortValue: 'DESC',
        sortKey: 'LECTURE_TIME',
      });
      console.log("getAttendanceDataSubjectCount res...", res.data);
      
      if (res && res.code === 200) {
        setloading(false);
        setAttendanceRecords(res.data);
      }
    } catch (error) {
      setloading(false);
      console.log('err...', error);
    }
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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.Background,
      }}>
      <Header
        label={t('classTeacherAttendance.header')}
        onBack={() => {
          navigation.goBack();
        }}
      />

      <View
        style={{
          padding: Sizes.Padding,
          flex: 1,
          marginBottom: Sizes.ScreenPadding * 2,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <TitleComponent
            label={
              selectedData1.item.CLASS_NAME +
              ' ' +
              selectedData1.item.DIVISION_NAME +
              ' ' +
              selectedData1.item.SUBJECT_NAME
            }
            style={{flex: 0.5}}
            onPress={() => {}}
            ViewStyle={{borderRadius: Sizes.Base}}
            isBorder={true}
            textStyle={{...Fonts.Medium2, color: Colors.PrimaryText1}}
            loading={false}
          />
          <View style={{width: Sizes.Base}} />

          <TitleComponent
            label={moment(selectedData.date).format('MMM YYYY')}
            style={{
              flex: 0.5,
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
            }}
            onPress={() => {}}
            leftChild={<Icon size={30} name="calendar" type="EvilIcons" />}
            ViewStyle={{borderRadius: Sizes.Base}}
            isBorder={true}
            textStyle={{...Fonts.Medium2, color: Colors.PrimaryText1}}
            loading={false}
          />
        </View>
        <View style={{height: Sizes.Padding}} />
        <View
          style={{
            elevation: 10,
            backgroundColor: Colors.White,
            borderRadius: Sizes.Radius,
          }}>
          <Calendar
            style={{borderRadius: Sizes.Radius}}
            hideArrows
            hideExtraDays
            dayComponent={({date, state}: any) => (
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

        {loading ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={'large'} color={Colors.Primary} />
          </View>
        ) : AttendanceRecords.length == 0 ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image
              resizeMode="contain"
              style={{
                width: 170,
                height: 170,
              }}
              source={noData}
              tintColor={Colors.Primary}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              marginTop: Sizes.Radius,
            }}>
            <FlatList
              data={AttendanceRecords}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({
                item,
                index,
              }: {
                item: AttendanceRecord | any;
                index: number;
              }) => {
                return (
                  <View
                    style={{
                      elevation: 5,
                      backgroundColor: Colors.White,
                      borderRadius: Sizes.Padding,
                      marginTop: Sizes.Padding,
                      paddingVertical: Sizes.Radius,
                      paddingHorizontal: Sizes.Padding,
                      marginHorizontal: 3,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 6,
                      }}>
                      <Text
                        style={{...Fonts.Medium2, color: Colors.PrimaryText1}}>
                        {selectedData1.item.SUBJECT_NAME}
                      </Text>
                      <Text
                        style={{...Fonts.Medium4, color: Colors.PrimaryText1}}>
                        {moment(item.LECTURE_TIME, 'HH:mm:ss').format(
                          'hh:mm A',
                        )}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignContent: 'center',
                      }}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onLongPress={() => {}}
                        onPress={() => {
                          getAttendanceData(item);
                        }}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Green
                          style={{marginEnd: Sizes.Base}}
                          width={15}
                          height={15}
                        />
                        <Text
                          style={{
                            color: Colors.PrimaryText,
                            ...Fonts.Bold2,
                          }}>
                          {`${item.PRESENT} Present`}
                        </Text>
                        <Icon
                          style={{
                            marginStart: Sizes.Padding,
                            alignSelf: 'center',
                          }}
                          name="info"
                          type="Feather"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          getAttendanceDataA(item);
                        }}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Red
                          style={{marginEnd: Sizes.Base}}
                          width={15}
                          height={15}
                        />
                        <Text
                          style={{
                            color: Colors.PrimaryText,
                            ...Fonts.Bold2,
                          }}>
                          {`${item.ABSENT} Absent`}
                        </Text>
                        <Icon
                          style={{
                            marginStart: Sizes.Padding,
                            alignSelf: 'center',
                          }}
                          name="info"
                          type="Feather"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        )}

        {openModal.class && (
          <ModalPicker
            title="Select Class"
            visible={openModal.class}
            onClose={() => {
              setOpenModal({...openModal, class: false});
            }}
            data={teacherClassMapping}
            labelField={'CLASS_NAME'}
            onChange={item => {
              setSelectedData({...selectedData, class: item});
            }}
            value={selectedData.class}
          />
        )}
        {openModal.div && (
          <ModalPicker
            title="Select Division"
            visible={openModal.div}
            onClose={() => {
              setOpenModal({...openModal, div: false});
            }}
            data={data.division}
            labelField={'NAME'}
            onChange={item => {
              // getSubjectTeacherMaster(item);
              // setSelectedData({...selectedData, div: item});
            }}
            value={selectedData.div}
          />
        )}
        {openModal.subject && (
          <ModalPicker
            title="Select Subject"
            visible={openModal.subject}
            onClose={() => {
              setOpenModal({...openModal, subject: false});
            }}
            data={data.teacherSubject}
            labelField={'SUBJECT_NAME'}
            onChange={item => {
              setSelectedData({...selectedData, subject: item});
            }}
            value={selectedData.subject}
          />
        )}

        {openModal.PresentModal ? (
          <Modal
            containerStyle={{justifyContent: 'flex-end'}}
            title={t('classTeacherAttendance.presentStudent')}
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
              setOpenModal({...openModal, PresentModal: false});
            }}>
            <View style={{marginVertical: Sizes.Base}}>
              <FlatList
                data={AttendanceData.PresentStudents}
                keyExtractor={item => item.ID.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => <AttendanceRenderItem item={item} />}
              />
            </View>
          </Modal>
        ) : null}
        {openModal.AbsentModal ? (
          <Modal
            containerStyle={{justifyContent: 'flex-end'}}
            title={`${t('classTeacherAttendance.absentStudent')} : ${
              AttendanceData.AbsentStudents.length
            }`}
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
              setOpenModal({...openModal, AbsentModal: false});
            }}>
            <View style={{marginVertical: Sizes.Base}}>
              <FlatList
                data={AttendanceData.AbsentStudents}
                keyExtractor={item => item.ID.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => <AttendanceRenderItem item={item} />}
              />
            </View>
          </Modal>
        ) : null}
      </View>
      <FloatingAdd
        onPress={() => {
          navigation.navigate('CreateAttendance', {
            Teacher: '0',
            Filter: selectedData1,
          });
        }}
      />
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

export default SubjectTeachAttendance;
