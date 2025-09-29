import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Header, Icon, Modal, TextButton, Toast } from '../../Components';
import { StackProps } from '../../routes';
import { apiPost, useSelector } from '../../Modules';
import moment from 'moment';
import { Edit, noData } from '../../../assets';
import AddAssignment from './AddAssignment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  SUBJECT_TEACHER_MASTER,
  TEACHER_CLASS_TASK,
} from '../../Modules/interface';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import FloatingAdd from '../../Components/FloatingAdd';
import LinearGradient from 'react-native-linear-gradient';
import { BannerAds } from '../../Modules/AdsUtils';

type Props = StackProps<'Assignment'>;
interface selectData {
  item: SUBJECT_TEACHER_MASTER;
}
interface flatListProps {
  item: TEACHER_CLASS_TASK;
  index: number;
}
const Assignment = ({ navigation }: Props): JSX.Element => {
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const { teacherClassMapping }: any = useSelector(state => state.teacher);
  const { member } = useSelector(state => state.member);
  const { t } = useTranslation();
  const [date, setDate] = useState<{
    myDate: any;
    mode: any;
    show: boolean;
  }>({
    myDate: new Date(),
    mode: 'date',
    show: false,
  });
  const [openModal, setOpenModal] = useState({
    classModal: false,
    yearModal: false,
    addModal: false,
  });
  const [mainModal, setMainModal] = useState(true);
  const [isClassTeacher, setIsClassTeacher] = useState(false);
  const [selectedData, setSelectedData] = useState<selectData>({
    item: {},
  });
  const [taskData, setTaskData] = useState({
    data: [],
    filterData: [],
    filterClassData: [],
    loading: false,
  });
  const [editData, setEditData] = useState({});
  const [taskCompletionStatus, setTaskCompletionStatus] = useState([]);
  const [openTaskDetailsModal, setOpenTaskDetailsModal] = useState(false);

  useEffect(() => {
    // getSubjectTeacherMaster();
    getTeacherData();
  }, []);

  const getTeacherData = async () => {
    setTaskData({ ...taskData, loading: true });
    let calls = await Promise.all([
      apiPost('api/subjectTeacherMapping/get', {
        filter: ` AND TEACHER_ID = ${member?.ID} AND YEAR_ID = ${member?.YEAR_ID} AND STATUS = 1 AND CLASS_STATUS = 1 `,
        // filter: ` AND TEACHER_ID = ${member?.ID}  AND STATUS = 1 `,
      }),
      apiPost('api/classTeacherMapping/get', {
        filter: ` AND TEACHER_ID = ${member?.ID} AND YEAR_ID = ${member?.YEAR_ID} AND SCHOOL_ID = ${member?.SCHOOL_ID} AND STATUS = 1 AND CLASS_STATUS = 1 `,
        // filter: ` AND TEACHER_ID = ${member?.ID}  AND SCHOOL_ID = ${member?.SCHOOL_ID} AND STATUS = 1 `,
      }),
    ]);
    if (calls[0].code == 200 && calls[1].code == 200) {
      setTaskData({
        ...taskData,
        filterData: calls[0].data,
        filterClassData: calls[1].data,
        loading: false,
      });
    } else {
      Toast('Something Wrong...Please try again');
      setTaskData({ ...taskData, loading: false });
    }
  };

  const changeSelectedDate = (event: any, selectedDate: any) => {
    if (selectedDate) {
      setDate({ ...date, myDate: selectedDate, show: false });
      getClassWiseTask(selectedData.item, selectedDate, isClassTeacher);
    } else {
      setDate({ ...date, show: false });
    }
  };

  const getSubjectTeacherMaster = async () => {
    setTaskData({ ...taskData, loading: true });
    try {
      const res = await apiPost('api/subjectTeacherMapping/get', {
        filter: ` AND TEACHER_ID = ${member?.ID} AND YEAR_ID = ${member?.YEAR_ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        setTaskData({ ...taskData, filterData: res.data, loading: false });
      }
    } catch (error) {
      setTaskData({ ...taskData, loading: false });
      console.log('error..', error);
    }
  };

  const getClassWiseTask = async (
    item: SUBJECT_TEACHER_MASTER,
    date: any,
    classTeacher: boolean,
  ) => {
    console.log('item', taskData.filterData.CLASS_ID);
    setTaskData({ ...taskData, loading: true });
    try {
      let fil = ` AND CLASS_ID = ${item.CLASS_ID} AND YEAR_ID = ${item.YEAR_ID
        } AND DIVISION_ID = ${item.DIVISION_ID} AND DATE LIKE '${moment(
          date,
        ).format('YYYY-MM-DD')}' `;
      !classTeacher && (fil += ` AND SUBJECT_ID = ${item.SUBJECT_ID} `);

      const res = await apiPost('api/classWiseTask/get', {
        filter: fil,
      });
      console.log("Response from classWiseTask/get:", res);

      if (res && res.code == 200) {
        //  console.log('\n\n\n.res...', res);
        startAnimation();
        setTaskData({ ...taskData, data: res.data, loading: false });
        setMainModal(false);
      } else {
        setTaskData({ ...taskData, loading: false });
      }
    } catch (error) {
      setTaskData({ ...taskData, loading: false });
      console.log('err....', error);
    }
  };

  const assignTaskToStudent = async (item: TEACHER_CLASS_TASK) => {
    try {
      const res = await apiPost('api/classwiseTask/assignTask', item);
      if (res && res.code == 200) {
        getClassWiseTask(selectedData.item, date.myDate, isClassTeacher);
      }
    } catch (error) {
      console.log('err..', error);
    }
  };

  const toggleSelectedItem = (
    item: SUBJECT_TEACHER_MASTER,
    classTeacher: boolean,
  ) => {
    console.log('classTeacher', classTeacher);
    const selectedItems = classTeacher
      ? taskData.filterClassData.filter(
        (it: SUBJECT_TEACHER_MASTER) => item.ID === it.ID,
      )
      : taskData.filterData.filter(
        (it: SUBJECT_TEACHER_MASTER) => item.ID === it.ID,
      );
    setSelectedData({
      ...selectedData,
      item: selectedItems[0],
    });
    getClassWiseTask(selectedItems[0], date.myDate, classTeacher);
  };
  let scale = useSharedValue(2);
  const animation = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const startAnimation = async () => {
    return new Promise((resolve, reject) => {
      scale.value = withSpring(1);
    });
  };
  const endAnimation = async () => {
    return new Promise((resolve, reject) => {
      scale.value = withSpring(2);
    });
  };

  const getTask = async (item: any) => {
    try {
      let fil = ` AND CLASS_ID = ${item.CLASS_ID} AND TASK_ID = ${item.ID} AND TYPE = '${item.TYPE}' `;
      const res = await apiPost('api/studentTaskDetails/get', {
        filter: fil,
        sortKey: 'STATUS',
        sortValue: 'DESC',
      });
      if (res && res.code == 200) {
        // console.log('\n\nres...', res);
        const data1 = res.data.filter((it: any) => it.STATUS.includes('P'));
        const data2 = res.data.filter((it: any) => it.STATUS.includes('C'));
        setTaskCompletionStatus(res.data);
        setOpenTaskDetailsModal(true);
      } else {
      }
    } catch (error) {
      console.log('error..', error);
    }
  };
  // console.log('\n\ntaskCompletionStatus....', taskCompletionStatus);
  return (
    <View style={{ flex: 1, backgroundColor: Colors.Background }}>
      <Header
        label={'School Assignments'}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <View style={{ flex: 1, margin: Sizes.Padding }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flex: 2,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: Sizes.Base,
              paddingHorizontal: Sizes.Radius,
              borderRadius: Sizes.Radius,
              elevation: 6,
              shadowColor: Colors.Primary,
              backgroundColor: Colors.White,
              marginHorizontal: 3,
              alignSelf: 'flex-end',
              marginBottom: Sizes.ScreenPadding,
              marginTop: Sizes.Base,
            }}
            onPress={() => {
              endAnimation();
              setMainModal(true);
            }}>
            <Text style={{ ...Fonts.Medium2, color: Colors.PrimaryText }}>
              {selectedData.item?.CLASS_NAME
                ? '' + selectedData.item.CLASS_NAME
                : 'Class'}

              {selectedData.item?.DIVISION_NAME
                ? ' ' + selectedData.item.DIVISION_NAME
                : 'Div'}
              {!isClassTeacher
                ? selectedData.item?.SUBJECT_NAME
                  ? ' ' + selectedData.item?.SUBJECT_NAME
                  : 'Sub'
                : ''}
            </Text>
          </TouchableOpacity>
          <View style={{ width: Sizes.Base }} />
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: Sizes.Base,
              paddingHorizontal: Sizes.Radius,
              borderRadius: Sizes.Radius,
              elevation: 6,
              shadowColor: Colors.Primary,
              backgroundColor: Colors.White,
              marginHorizontal: 3,
              alignSelf: 'flex-end',
              marginBottom: Sizes.ScreenPadding,
              marginTop: Sizes.Base,
            }}
            onPress={() => {
              endAnimation();
              setDate({ ...date, show: true });
            }}>
            <Text
              style={{ ...Fonts.Medium2, color: Colors.PrimaryText }}
              numberOfLines={1}>
              {moment(date.myDate).format('DD/MMM')}
            </Text>
          </TouchableOpacity>
        </View>
        {taskData.loading ? (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size={'large'} color={Colors.Primary} />
          </View>
        ) : taskData.data.length == 0 ? (
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
          <View style={{ marginBottom: Sizes.Base, flex: 1 }}>
            <FlatList
              data={taskData.data}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }: flatListProps) => {
                return (
                  <Animated.View>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: Colors.White,
                        borderRadius: Sizes.Radius,
                        shadowColor: Colors.Primary,
                        elevation: Sizes.Radius,
                        padding: Sizes.Padding,
                        margin: Sizes.Base,
                      }}
                      onPress={() => {
                        navigation.navigate('AssignmentDetails', { item });
                      }}>
                      <View style={{ flexDirection: 'row' }}>
                        {
                          <Text
                            style={{
                              ...Fonts.Medium2,
                              color: Colors.PrimaryText1,
                              flex: 1,
                            }}>
                            {item.SUBJECT_NAME ? item.SUBJECT_NAME : ''}
                          </Text>
                        }
                        {item.STATUS != 'D' && (
                          <Icon
                            name="info"
                            type="Feather"
                            style={{ alignSelf: 'flex-end' }}
                            size={21}
                            onPress={() => {
                              getTask(item);
                            }}
                          />
                        )}
                      </View>
                      {item.STATUS == 'D' && (
                        <Icon
                          name="edit"
                          type="MaterialIcons"
                          style={{
                            position: 'absolute',
                            top: Sizes.Radius,
                            right: Sizes.Radius,
                          }}
                          size={19}
                          color={Colors.Primary2}
                          onPress={() => {
                            setEditData(item);
                            setOpenModal({ ...openModal, addModal: true });
                          }}
                        />
                      )}
                      <Text
                        style={{ ...Fonts.Medium3, color: Colors.PrimaryText1 }}>
                        {item.TYPE == 'CW'
                          ? 'ClassWork'
                          : item.TYPE == 'HW'
                            ? 'HomeWork'
                            : 'Assignment'}
                      </Text>

                      <Text
                        style={{ ...Fonts.Regular3, color: Colors.PrimaryText1 }}>
                        {item.DESCRIPTION}
                      </Text>

                      {item.STATUS == 'D' && (
                        <TextButton
                          label={t('teacherAssignTask.assignButton')}
                          loading={false}
                          onPress={() => {
                            assignTaskToStudent(item);
                          }}
                          style={{
                            marginTop: Sizes.Padding,
                            alignSelf: 'flex-start',
                          }}
                          isBorder={true}
                        />
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                );
              }}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  colors={[Colors.Primary, Colors.Primary]}
                  onRefresh={() => {
                    endAnimation();
                    getClassWiseTask(
                      selectedData.item,
                      date.myDate,
                      isClassTeacher,
                    );
                  }}
                />
              }
            />
          </View>
        )}
      </View>
      {moment(date.myDate).startOf('day') >=
        moment(new Date()).startOf('day') ? (
        <FloatingAdd
          onPress={() => {
            setEditData({});
            setOpenModal({ ...openModal, addModal: true });
          }}
        />
      ) : null}
      {date.show && (
        <DateTimePicker
          value={date.myDate}
          mode={date.mode}
          is24Hour={true}
          display="default"
          onChange={changeSelectedDate}
        />
      )}
      {openModal.addModal && (
        <AddAssignment
          visible={openModal.addModal}
          onClose={() => {
            setOpenModal({ ...openModal, addModal: false });
          }}
          date={date.myDate}
          item={editData}
          data={selectedData.item}
          mainData={
            isClassTeacher ? taskData.filterClassData : taskData.filterData
          }
          onSuccess={() => {
            setOpenModal({ ...openModal, addModal: false });
            getClassWiseTask(selectedData.item, date.myDate, isClassTeacher);
          }}
          classTeacher={isClassTeacher}
        />
      )}
      {mainModal && (
        <Modal
          isVisible={mainModal}
          onClose={() => {
            taskData.filterData.length == 0
              ? navigation.goBack()
              : selectedData.item?.ID
                ? setMainModal(false)
                : navigation.goBack();
          }}
          style={{
            borderRadius: 0,
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
          }}>
          <Header
            label={'School Assignments'}
            onBack={() => {
              taskData.filterData.length == 0
                ? navigation.goBack()
                : selectedData.item?.ID
                  ? setMainModal(false)
                  : navigation.goBack();
            }}
          />
          {member?.IS_ERP_MAPPED == 1 ? (
            <ScrollView
              style={{
                width: '100%',
                marginBottom: Sizes.ScreenPadding,
                marginTop: Sizes.Padding,
                flex: 1,
              }}>
              {taskData.loading ? (
                <View
                  style={{
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator size={'large'} color={Colors.Primary} />
                </View>
              ) : taskData.filterData.length == 0 &&
                taskData.filterClassData.length == 0 ? (
                <View
                  style={{
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      ...Fonts.Bold2,
                      color: Colors.Primary,
                      textAlign: 'center',
                    }}>
                    You have not been assigned any class. Please contact the
                    admin
                  </Text>
                </View>
              ) : (
                <View>
                  {taskData.filterClassData.length != 0 && (
                    <View style={{ marginHorizontal: Sizes.Padding }}>
                      <Text
                        style={{
                          ...Fonts.Bold2,
                          color: Colors.Primary,
                        }}>
                        {t('teacherAssignTask.classTitle')}
                      </Text>
                      <FlatList
                        data={taskData.filterClassData}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={
                          <RefreshControl
                            refreshing={false}
                            colors={[Colors.Primary, Colors.Primary]}
                            onRefresh={() => {
                              getTeacherData();
                            }}
                          />
                        }
                        renderItem={({ item, index }: any) => {
                          const gradients = [
                            ['#b1cfa7', '#b1cfa7'],
                            ['#f49d9d', '#f49d9d'],
                            ['#cbf188', '#cbf188'],
                            ['#9f9ee2', '#9f9ee2'],
                            ['#e595cd', '#e595cd'],
                            ['#71c8d5', '#71c8d5'],
                            ['#e9de0d', '#e9de0d'],
                          ];
                          const gradient = gradients[index % gradients.length];

                          return (
                            <LinearGradient
                              colors={gradient}
                              style={{
                                paddingHorizontal: Sizes.Padding,
                                paddingVertical: Sizes.Base,
                                borderRadius: Sizes.Radius,
                                backgroundColor:
                                  selectedData.item?.ID == item?.ID
                                    ? Colors.Primary + 70
                                    : Colors.Background,
                                margin: Sizes.Base,
                              }}>
                              <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                  setIsClassTeacher(true);
                                  toggleSelectedItem(item, true);
                                }}
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <View>
                                  <Image
                                    source={require('../../../assets/images/subject.png')}
                                    style={{
                                      height: 35,
                                      width: 35,
                                    }}
                                  />
                                </View>
                                <View
                                  style={{
                                    flex: 1,
                                    marginLeft: Sizes.ScreenPadding,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                  }}>
                                  <Text
                                    style={{
                                      ...Fonts.Regular2,
                                      color: Colors.Black,
                                    }}>
                                    {`Class : ${item.CLASS_NAME ? item.CLASS_NAME : 'N/A'
                                      }`}
                                  </Text>
                                  <Text
                                    style={{
                                      ...Fonts.Medium2,
                                      color: Colors.Black,
                                    }}>
                                    {`Div : ${item.DIVISION_NAME
                                      ? item.DIVISION_NAME
                                      : 'N/A'
                                      }`}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </LinearGradient>
                          );
                        }}
                      />
                    </View>
                  )}

                  {taskData.filterData.length != 0 && (
                    <View
                      style={{
                        marginTop: Sizes.Padding,
                        marginHorizontal: Sizes.Padding,
                      }}>
                      <Text
                        style={{
                          ...Fonts.Bold2,
                          color: Colors.Primary,
                        }}>
                        {t('teacherAssignTask.subjectTitle')}
                      </Text>
                      <FlatList
                        data={taskData.filterData}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={
                          <RefreshControl
                            refreshing={false}
                            colors={[Colors.Primary, Colors.Primary]}
                            onRefresh={() => {
                              // getSubjectTeacherMaster();
                              getTeacherData();
                            }}
                          />
                        }
                        renderItem={({ item, index }: any) => {
                          const gradients = [
                            ['#9f9ee2', '#9f9ee2'],
                            ['#e595cd', '#e595cd'],
                            ['#71c8d5', '#71c8d5'],
                            ['#e9de0d', '#e9de0d'],
                            ['#b1cfa7', '#b1cfa7'],
                            ['#f49d9d', '#f49d9d'],
                            ['#cbf188', '#cbf188'],
                          ];
                          const gradient = gradients[index % gradients.length];

                          return (
                            <LinearGradient
                              colors={gradient}
                              style={{
                                paddingHorizontal: Sizes.Padding,
                                paddingVertical: Sizes.Base,
                                borderRadius: Sizes.Radius,
                                backgroundColor:
                                  selectedData.item?.ID == item?.ID
                                    ? Colors.Primary + 70
                                    : Colors.Background,
                                margin: Sizes.Base,
                              }}>
                              <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                  setIsClassTeacher(false);
                                  toggleSelectedItem(item, false);
                                  console.log('kkkk', item);
                                }}
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <View>
                                  <Image
                                    source={require('../../../assets/images/subject.png')}
                                    style={{
                                      height: 35,
                                      width: 35,
                                    }}
                                  />
                                </View>
                                <View
                                  style={{
                                    flex: 1,
                                    marginLeft: Sizes.ScreenPadding,
                                  }}>
                                  <View
                                    style={{
                                      flex: 1,
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                    }}>
                                    <Text
                                      style={{
                                        ...Fonts.Regular2,
                                        color: Colors.Black,
                                      }}>
                                      {`Class : ${item.CLASS_NAME
                                        ? item.CLASS_NAME
                                        : 'N/A'
                                        }`}
                                    </Text>
                                    <Text
                                      style={{
                                        ...Fonts.Medium2,
                                        color: Colors.Black,
                                      }}>
                                      {`Div : ${item.DIVISION_NAME
                                        ? item.DIVISION_NAME
                                        : 'N/A'
                                        }`}
                                    </Text>
                                  </View>
                                  <Text
                                    style={{
                                      ...Fonts.Medium2,
                                      color: Colors.PrimaryText1,
                                    }}
                                    numberOfLines={2}>
                                    {item.SUBJECT_NAME
                                      ? item.SUBJECT_NAME
                                      : 'N/A'}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </LinearGradient>
                          );
                        }}
                      />
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: Colors.Primary,
                  ...Fonts.Bold2,
                }}>
                Sorry, you are not eligible to access this functionality.
              </Text>
            </View>
          )}
          <BannerAds />
        </Modal>
      )}

      {openTaskDetailsModal && (
        <Modal
          title="Task Completion Status"
          isVisible={openTaskDetailsModal}
          onClose={() => {
            setOpenTaskDetailsModal(false);
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
          <View style={{ marginTop: Sizes.Padding }}>
            <FlatList
              data={taskCompletionStatus}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }: any) => {
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: Sizes.Base,
                    }}>
                    <Text
                      style={{ ...Fonts.Medium2, color: Colors.PrimaryText1 }}>
                      {item.STUDENT_NAME}
                    </Text>
                    <Text
                      style={{ ...Fonts.Medium2, color: Colors.PrimaryText1 }}>
                      {item.STATUS == 'P' ? 'Pending' : 'Completed'}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Assignment;
