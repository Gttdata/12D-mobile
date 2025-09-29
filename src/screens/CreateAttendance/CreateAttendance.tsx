import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import SelectClassModal from '../Teacher/SelectClassModal';
import {
  CHAPTER_LIST,
  CLASS_TEACHER_MAPPING,
  GET_STUDENT_LIST,
  STUDENT_CLASS_MAPPING,
  STUDENT_DETAILS_INTERFACE,
  SUBJECT_TEACHER_MASTER,
} from '../../Modules/interface';
import SelectionComponent from '../../Components/SelectionComponent';
import { apiPost, useSelector } from '../../Modules';
import { Header, Icon, Modal, TextButton, Toast } from '../../Components';
import { StackProps } from '../../routes';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import CheckImage from '../../Components/CheckImage';
import { Checkbox, Switch } from 'react-native-paper';
import Animated, {
  FlipInEasyX,
  FlipOutEasyX,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import CalendarComponent from '../Tasks/CalendarComponent ';
import { noData } from '../../../assets';
import { useTranslation } from 'react-i18next';
import TitleComponent from '../../Components/TitleComponent';
interface selectData {
  className: CLASS_TEACHER_MAPPING;
  item: SUBJECT_TEACHER_MASTER;
}
interface StudentData {
  data: STUDENT_CLASS_MAPPING[];
  AbsentData: STUDENT_CLASS_MAPPING[];
  loading: boolean;
}
type Props = StackProps<'CreateAttendance'>;
const CreateAttendance = ({ navigation, route }: Props): JSX.Element => {
  const [mainModal, setMainModal] = useState(true);
  const [AbsentModal, setAbsentModal] = useState(false);
  const { Filter, Teacher } = route.params;
  const { t } = useTranslation();
  const [selectedData, setSelectedData] = useState({
    date: moment().format('YYYY-MM-DD'),
    showData: false,
    class: { CLASS_NAME: '', CLASS_ID: '' },
    div: { NAME: '' },
    subject: { SUBJECT_NAME: '' },
  });
  const [taskData, setTaskData] = useState({
    data: [],
    filterData: [],
    loading: false,
  });
  const { member } = useSelector(state => state.member);
  const [loading, setloading] = useState(true);

  const [StudentData, setStudentData] = useState<StudentData>({
    data: [],
    AbsentData: [],
    loading: false,
  });
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);

  const [selectedData1, setSelectedData1] = useState<selectData>(Filter);

  const [checked, setChecked] = useState<number[]>([]);
  const [modalSubmitLoader, setModalSubmitLoader] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);

  const toggleChecked = (seqNo: number) => {
    if (checked.includes(seqNo)) {
      setChecked(checked.filter(item => item !== seqNo));
    } else {
      setChecked([...checked, seqNo]);
    }
  };

  let scale = useSharedValue(0);
  const animation = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const startAnimation = async () => {
    return new Promise<void>((resolve, reject) => {
      scale.value = withTiming(1, { duration: 800 }, () => { });
    });
  };

  useEffect(() => {
    // getSubjectTeacherMaster();
    getStudentList();
  }, []);

  const handleDatePress = (date: any) => {
    setSelectedData({ ...selectedData, date: date });
  };

  const getSubjectTeacherMaster = async () => {
    try {
      const res = await apiPost('api/subjectTeacherMapping/get', {
        // filter: ` AND TEACHER_ID = ${member?.ID} AND STATUS = 1 `,
      });

      if (res && res.code == 200) {
        setTaskData({ ...taskData, filterData: res.data });
      }
    } catch (error) {
      console.log('error..', error);
    }
  };
  const getStudentList = async () => {
    try {
      const res = await apiPost('api/studentClassMapping/get', {
        filter: ` AND CLASS_ID = ${Filter.item.CLASS_ID} AND STATUS = 1 AND YEAR_ID = ${member?.YEAR_ID} AND DIVISION_ID = ${Filter.item.DIVISION_ID} `,
      });

      console.log('getStudentList', res.data);


      if (res && res.code == 200) {
        startAnimation();

        setloading(false);

        const ids = res.data.map(student => student.ID);

        setChecked(ids);

        setStudentData({ ...StudentData, data: res.data });
        // setChecked()
      }
    } catch (error) {
      console.log('error..', error);
    }
  };
  const CheckAbsentStudents = () => {
    setSubmitLoader(true);
    scale.value = 0;
    const absentStudents = StudentData.data.filter(
      item => !checked.includes(item.ID),
    );
    // Do something with absentStudents
    if (absentStudents.length !== 0) {
      setStudentData({ ...StudentData, AbsentData: absentStudents });
      setSubmitLoader(false);
      setAbsentModal(true);
      startAnimation();
    } else {
      handleSubmit();
    }
  };
  const handleSubmit = async () => {
    setModalSubmitLoader(true);
    const subjectDetails = StudentData.data.map(student => ({
      STUDENT_ID: student.STUDENT_ID.toString(),
      STATUS: checked.includes(student.ID) ? 'P' : 'A',
    }));

    let body = {
      SUBJECT_ID: Teacher == '1' ? '0' : selectedData1.item.SUBJECT_ID,
      TEACHER_ID: selectedData1.item.TEACHER_ID,
      LECTURE_TIME: moment().format('HH:mm:ss'),
      DIVISION_ID: selectedData1.item.DIVISION_ID,
      CLASS_ID: selectedData1.item.CLASS_ID,
      DATE: moment().format('YYYY-MM-DD'),
      IS_CLASS_ATTENDENCE: Teacher,
      SUBJECT_DETAILS: subjectDetails,
    };

    let res = await apiPost('api/attendance/markAttendance', body);

    console.log('MARK ATTENDANCE', res);

    if (res && res.code == 200) {
      Toast(t('classTeacherAttendance.toast'));
      setSubmitLoader(false);
      setModalSubmitLoader(false);
      setAbsentModal(false);
      navigation.goBack();
    } else {
      setSubmitLoader(false);
      setModalSubmitLoader(false);
      setAbsentModal(false);
    }
  };
  const generateWeekDates = () => {
    const dates = [];
    const today = new Date();
    const dayIndex = today.getDay();

    for (let i = 0; i < 7; i++) {
      const newDate = new Date(today);
      newDate.setDate(today.getDate() - dayIndex + i);
      dates.push(newDate.toDateString());
    }
    return dates;
  };
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
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        label={t('classTeacherAttendance.header')}
        onBack={() => {
          navigation.goBack();
        }}
      />

      <View style={{ flex: 1, padding: Sizes.Padding }}>
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
              `${Teacher == '2' ? selectedData1.item.SUBJECT_NAME : ''}`
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

        {loading ? (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size={'large'} color={Colors.Primary} />
          </View>
        ) : StudentData.data.length == 0 ? (
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
          <View style={{ flex: 1, marginTop: Sizes.Padding }}>
            <FlatList
              data={StudentData.data}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({
                item,
                index,
              }: {
                item: STUDENT_CLASS_MAPPING;
                index: number;
              }) => {
                return (
                  <Animated.View style={[animation]}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        toggleChecked(item.ID);
                      }}
                      style={{
                        paddingVertical: Sizes.Base,
                        borderRadius: Sizes.Base,
                        backgroundColor: Colors.Background,
                        marginVertical: Sizes.Base,
                        flexDirection: 'row',
                        elevation: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View style={{ marginHorizontal: Sizes.Base }}>
                        <Switch
                          value={checked.includes(item.ID)}
                          onValueChange={value => {
                            if (value) {
                              setChecked([...checked, item.ID]);
                            } else {
                              setChecked(checked.filter(id => id !== item.ID));
                            }
                          }}
                          color={Colors.Primary}
                        />
                      </View>
                      <View></View>
                      <View
                        style={{
                          marginStart: Sizes.Base,
                          flex: 1,
                          flexDirection: 'row',
                        }}>
                        <Text
                          numberOfLines={2}
                          style={{ ...Fonts.Medium2, color: Colors.Black }}>
                          {item.ROLL_NUMBER}
                        </Text>
                        <View style={{ width: Sizes.Base }} />
                        <Text
                          numberOfLines={2}
                          style={{ ...Fonts.Medium2, color: Colors.Black }}>
                          {item.STUDENT_NAME}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              }}
            />
          </View>
        )}
      </View>

      <View style={{ marginHorizontal: Sizes.Base, marginVertical: Sizes.Base }}>
        <TextButton
          onPress={CheckAbsentStudents}
          label={'Submit'}
          loading={submitLoader}
        />
      </View>

      {AbsentModal ? (
        <Modal
          onClose={() => {
            setAbsentModal(false);
          }}
          style={{ maxHeight: '50%', flex: 1 }}
          isVisible={AbsentModal}
          containerStyle={{}}>
          <Text style={{ ...Fonts.Bold1, color: Colors.PrimaryText1 }}>
            {'Here is the list of absent students'}
          </Text>

          <View style={{ flex: 1, marginTop: Sizes.Radius }}>
            <FlatList
              data={StudentData.AbsentData}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({
                item,
                index,
              }: {
                item: STUDENT_CLASS_MAPPING;
                index: number;
              }) => {
                return (
                  <Animated.View style={[animation]}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        toggleChecked(item.ID);
                      }}
                      style={{
                        paddingVertical: Sizes.Base,
                        borderRadius: Sizes.Base,
                        backgroundColor: Colors.Background,
                        marginVertical: Sizes.Base,
                        flexDirection: 'row',
                        elevation: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginHorizontal: 3,
                      }}>
                      <View style={{ marginHorizontal: Sizes.Base }}>
                        <Checkbox
                          status={
                            checked.includes(item.ID) ? 'checked' : 'unchecked'
                          }
                          color={Colors.Primary}
                        />
                      </View>
                      <View></View>
                      <View
                        style={{
                          marginStart: Sizes.Base,
                          flex: 1,
                          flexDirection: 'row',
                        }}>
                        <Text
                          numberOfLines={2}
                          style={{ ...Fonts.Medium2, color: Colors.Black }}>
                          {item.ROLL_NUMBER}
                        </Text>
                        <View style={{ width: Sizes.Base }} />
                        <Text
                          numberOfLines={2}
                          style={{ ...Fonts.Medium2, color: Colors.Black }}>
                          {item.STUDENT_NAME}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              }}
            />
            <Text
              style={{
                ...Fonts.Medium1,
                color: Colors.PrimaryText1,
                fontSize: 14,
              }}>
              {`Please reconfirm the absentee list. you cannot update it once submitted.`}
            </Text>

            <View style={{ flexDirection: 'row' }}>
              <TextButton
                onPress={() => {
                  setAbsentModal(false);
                }}
                label="No"
                isBorder
                loading={false}
                style={{ marginTop: Sizes.Padding, flex: 1 }}
              />
              <View style={{ width: Sizes.Base }} />

              <TextButton
                onPress={handleSubmit}
                label="Yes"
                loading={modalSubmitLoader}
                style={{ marginTop: Sizes.Padding, flex: 1 }}
              />
            </View>
          </View>
        </Modal>
      ) : null}
    </SafeAreaView>
  );
};

export default CreateAttendance;
