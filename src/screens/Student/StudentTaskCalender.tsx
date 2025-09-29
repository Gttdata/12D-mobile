import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Calendar} from 'react-native-calendars';
import {apiPost, apiPut, useSelector} from '../../Modules';
import {Header, Toast} from '../../Components';
import {StackProps} from '../../routes';
import {STUDENT_TASK_DATA_INTERFACE} from '../../Modules/interface';
import moment from 'moment';
import {Checkbox} from 'react-native-paper';
import Animated, {BounceIn, BounceOut} from 'react-native-reanimated';
import {noData} from '../../../assets';
import TaskDetailsModal from './TaskDetailsModal';
import {useTranslation} from 'react-i18next';

type Props = StackProps<'StudentTaskCalender'>;
type flatListProps = {
  item: STUDENT_TASK_DATA_INTERFACE;
  index: number;
};
const StudentTaskCalender = ({navigation, route}: Props): JSX.Element => {
  const {studentClassId} = route.params;
  console.log('studentClassId', studentClassId);
  const {member} = useSelector(state => state.member);
  const {t} = useTranslation();
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [selected, setSelected] = useState(new Date());
  const [selectedMarkDate, setSelectedMarkDate] = useState('');
  const [taskData, setTaskData] = useState<{
    pendingData: STUDENT_TASK_DATA_INTERFACE[];
    completeData: STUDENT_TASK_DATA_INTERFACE[];
    loading: boolean;
  }>({
    pendingData: [],
    completeData: [],
    loading: true,
  });
  const [openModal, setOpenModal] = useState(false);
  const [item, setItem] = useState({});
  useEffect(() => {
    getTask();
  }, [selected]);

  const getTask = async () => {
    setTaskData({...taskData, loading: true});
    try {
      const res = await apiPost('api/studentTaskDetails/get', {
        filter: ` AND STUDENT_ID = ${
          member?.ID
        } AND CLASS_ID = ${studentClassId}  AND STUDENT_ID = ${
          member?.ID
        }  AND ASSIGNED_DATE <= '${moment(selected).format(
          'YYYY-MM-DD',
        )}' AND SUBMISSION_DATE >= '${moment(selected).format(
          'YYYY-MM-DD 00:00:00',
        )}' `,
        sortKey: 'STATUS',
        sortValue: 'DESC',
      });
      if (res && res.code == 200) {
        // console.log('\n\n\nres..', res.data);
        const data = res.data.map((item: any) => ({
          ...item,
          SELECTED: false,
        }));
        const data1 = data.filter((it: any) => it.STATUS.includes('P'));
        const data2 = data.filter((it: any) => it.STATUS.includes('C'));
        setTaskData({
          ...taskData,
          pendingData: data1,
          completeData: data2,
          loading: false,
        });
      } else {
        setTaskData({...taskData, loading: false});
      }
    } catch (error) {
      setTaskData({...taskData, loading: false});
      console.log('error..', error);
    }
  };
  const updateTaskStatus = async (item: any, status: string) => {
    setTaskData({...taskData, loading: true});
    try {
      const res = await apiPut('api/studentTaskDetails/update', {
        ...item,
        STATUS: status,
        COMPLETION_DATE_TIME:
          status == 'C'
            ? moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            : null,
      });
      if (res && res.code == 200) {
        getTask();
      } else {
        setTaskData({...taskData, loading: false});
        Toast('Something Wrong...Please try again');
      }
    } catch (error) {
      setTaskData({...taskData, loading: false});
      console.log('error..', error);
    }
  };
  // 9865655565   7865435678   8564221522
  return (
    <View style={{flex: 1, backgroundColor: Colors.Background}}>
      <Header
        label={t('studentTask.header')}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <Calendar
        onDayPress={(day: any) => {
          const date = new Date(day.dateString);
          setSelected(date);
          setSelectedMarkDate(day.dateString);
        }}
        markedDates={{
          [selectedMarkDate]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: Colors.Primary,
          },
        }}
      />
      <View style={{flex: 1, margin: Sizes.ScreenPadding}}>
        <View style={{flex: 1}}>
          {taskData.loading ? (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size={'large'} color={Colors.Primary} />
            </View>
          ) : taskData.pendingData.length == 0 &&
            taskData.completeData.length == 0 ? (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  colors={[Colors.Primary, Colors.Primary]}
                  onRefresh={() => {
                    getTask();
                  }}
                />
              }>
              {taskData.pendingData.length != 0 && (
                <Text style={{...Fonts.Medium2, color: Colors.PrimaryText1}}>
                  {t('studentTask.pendingTask')}
                </Text>
              )}
              <FlatList
                data={taskData.pendingData}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}: flatListProps) => {
                  return (
                    <Animated.View
                      entering={BounceIn.delay(500).duration(1000)}
                      exiting={BounceOut}
                      style={{backgroundColor: Colors.White}}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          setItem(item);
                          setOpenModal(true);
                        }}
                        style={{
                          margin: Sizes.Base,
                          backgroundColor: Colors.White,
                          borderRadius: Sizes.Radius,
                          paddingVertical: Sizes.Padding,
                          paddingHorizontal: Sizes.Base,
                          elevation: 7,
                          marginBottom: Sizes.Radius,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          {item.TYPE != 'CW' && (
                            <View>
                              <Checkbox
                                status={
                                  item.STATUS == 'C' ? 'checked' : 'unchecked'
                                }
                                color={Colors.Primary2}
                                uncheckedColor={Colors.PrimaryText}
                                onPress={() => {
                                  Alert.alert(
                                    'Task Status',
                                    'Have you completed this task?',
                                    [
                                      {text: 'No', onPress: () => null},
                                      {
                                        text: 'Yes',
                                        // onPress: () => toggleSelectedItem(item.ID),
                                        onPress: () =>
                                          updateTaskStatus(item, 'C'),
                                      },
                                    ],
                                    {cancelable: true},
                                  );
                                }}
                                disabled={item.STATUS == 'C' ? true : false}
                              />
                            </View>
                          )}
                          <View
                            style={{
                              flex: 1,
                              marginTop: 6,
                              marginLeft: item.TYPE == 'CW' ? Sizes.Base : 0,
                            }}>
                            {item.SUBJECT_NAME && (
                              <Text
                                style={{
                                  ...Fonts.Medium2,
                                  color: Colors.PrimaryText1,
                                }}
                                onPress={() => {}}>
                                {item.SUBJECT_NAME}
                              </Text>
                            )}
                            <Text
                              style={{
                                ...Fonts.Medium3,
                                color: Colors.PrimaryText,
                              }}>
                              {item.TYPE == 'CW'
                                ? 'ClassWork'
                                : item.TYPE == 'HW'
                                ? 'HomeWork'
                                : 'Assignment'}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                              }}>
                              <Text
                                style={{
                                  ...Fonts.Regular2,
                                  color: Colors.Black,
                                }}
                                onPress={() => {}}>
                                {`${t('studentTask.task')} : `}
                              </Text>
                              <Text
                                textBreakStrategy="simple"
                                numberOfLines={2}
                                style={{
                                  ...Fonts.Medium3,
                                  color: Colors.PrimaryText1,
                                  paddingRight: Sizes.Padding,
                                  flex: 1,
                                  maxWidth: '80%',
                                  marginTop: 2,
                                }}>
                                {item.TASK}
                              </Text>
                              {item.TASK.length > 45 && (
                                <Text
                                  onPress={() => {
                                    setItem(item);
                                    setOpenModal(true);
                                  }}
                                  style={{
                                    ...Fonts.Medium3,
                                    color: '#000000',
                                    backgroundColor: '#FFFFFF',
                                    position: 'absolute',
                                    right: 0,
                                    top: 18,
                                  }}>
                                  {`...${t('studentTask.more')}`}
                                </Text>
                              )}
                            </View>
                            <Text
                              style={{
                                ...Fonts.Regular3,
                                color: Colors.Black,
                                marginTop: 3,
                              }}
                              onPress={() => {}}>
                              {`${t('studentTask.assignDate')} :`}
                              <Text
                                style={{
                                  ...Fonts.Regular3,
                                  color: Colors.PrimaryText,
                                }}
                                onPress={() => {}}>
                                {moment(item.ASSIGNED_DATE).format(
                                  'DD/MMM/YYYY',
                                )}
                              </Text>
                            </Text>
                            <Text
                              style={{
                                ...Fonts.Regular3,
                                color: Colors.Black,
                              }}
                              onPress={() => {}}>
                              {`${t('studentTask.submissionDate')} :`}
                              <Text
                                style={{
                                  ...Fonts.Regular3,
                                  color: Colors.PrimaryText,
                                }}
                                onPress={() => {}}>
                                {moment(item.SUBMISSION_DATE).format(
                                  'DD/MMM/YYYY',
                                )}
                              </Text>
                            </Text>
                            {item.STATUS == 'C' && (
                              <Text
                                style={{
                                  ...Fonts.Regular2,
                                  color: Colors.Black,
                                  marginTop: Sizes.Base,
                                }}
                                onPress={() => {}}>
                                {`${t('studentTask.completedDate')} :`}
                                <Text
                                  style={{
                                    ...Fonts.Regular2,
                                    color: Colors.PrimaryText,
                                  }}
                                  onPress={() => {}}>
                                  {moment(item.COMPLETION_DATE_TIME).format(
                                    'DD/MMM/YYYY',
                                  )}
                                </Text>
                              </Text>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                }}
              />
              {taskData.completeData.length != 0 && (
                <Text
                  style={{
                    ...Fonts.Medium2,
                    color: Colors.PrimaryText1,
                    marginVertical: Sizes.Base,
                  }}>
                  {`${t('studentTask.completedTask')} :`}
                </Text>
              )}
              <FlatList
                data={taskData.completeData}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}: flatListProps) => {
                  return (
                    <Animated.View
                      entering={BounceIn.delay(500).duration(1000)}
                      exiting={BounceOut}
                      style={{backgroundColor: Colors.White}}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          // setItem(item);
                          // setOpenModal(true);
                        }}
                        style={{
                          margin: Sizes.Base,
                          backgroundColor: Colors.White,
                          borderRadius: Sizes.Radius,
                          paddingVertical: Sizes.Padding,
                          paddingHorizontal: Sizes.Base,
                          elevation: 7,
                          marginBottom: Sizes.Radius,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          {item.TYPE != 'CW' && (
                            <View>
                              <Checkbox
                                status={
                                  item.STATUS == 'C' ? 'checked' : 'unchecked'
                                }
                                color={Colors.Primary2}
                                uncheckedColor={Colors.PrimaryText}
                                onPress={() => {
                                  Alert.alert(
                                    'Task Status',
                                    'Have you completed this task?',
                                    [
                                      {text: 'No', onPress: () => null},
                                      {
                                        text: 'Yes',
                                        // onPress: () => toggleSelectedItem(item.ID),
                                        onPress: () =>
                                          updateTaskStatus(item, 'C'),
                                      },
                                    ],
                                    {cancelable: true},
                                  );
                                }}
                                disabled={item.STATUS == 'C' ? true : false}
                              />
                            </View>
                          )}
                          <View
                            style={{
                              flex: 1,
                              marginTop: 6,
                              marginLeft: item.TYPE == 'CW' ? Sizes.Base : 0,
                            }}>
                            {item.SUBJECT_NAME && (
                              <Text
                                style={{
                                  ...Fonts.Medium2,
                                  color: Colors.PrimaryText1,
                                }}
                                onPress={() => {}}>
                                {item.SUBJECT_NAME}
                              </Text>
                            )}
                            <Text
                              style={{
                                ...Fonts.Medium3,
                                color: Colors.PrimaryText,
                              }}>
                              {item.TYPE == 'CW'
                                ? 'ClassWork'
                                : item.TYPE == 'HW'
                                ? 'HomeWork'
                                : 'Assignment'}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                              }}>
                              <Text
                                style={{
                                  ...Fonts.Regular2,
                                  color: Colors.Black,
                                }}
                                onPress={() => {}}>
                                {`${t('studentTask.task')} : `}
                              </Text>
                              <Text
                                textBreakStrategy="simple"
                                numberOfLines={2}
                                style={{
                                  ...Fonts.Medium3,
                                  color: Colors.PrimaryText1,
                                  paddingRight: Sizes.Padding,
                                  flex: 1,
                                  maxWidth: '80%',
                                  marginTop: 2,
                                }}>
                                {item.TASK}
                              </Text>
                              {item.TASK.length > 45 && (
                                <Text
                                  onPress={() => {
                                    setItem(item);
                                    setOpenModal(true);
                                  }}
                                  style={{
                                    ...Fonts.Medium3,
                                    color: '#000000',
                                    backgroundColor: '#FFFFFF',
                                    position: 'absolute',
                                    right: 0,
                                    top: 18,
                                  }}>
                                  {`...${t('studentTask.more')}`}
                                </Text>
                              )}
                            </View>
                            <Text
                              style={{
                                ...Fonts.Regular3,
                                color: Colors.Black,
                                marginTop: 3,
                              }}
                              onPress={() => {}}>
                              {`${t('studentTask.assignDate')} : `}
                              <Text
                                style={{
                                  ...Fonts.Regular3,
                                  color: Colors.PrimaryText,
                                }}
                                onPress={() => {}}>
                                {moment(item.ASSIGNED_DATE).format(
                                  'DD/MMM/YYYY',
                                )}
                              </Text>
                            </Text>
                            <Text
                              style={{
                                ...Fonts.Regular3,
                                color: Colors.Black,
                              }}
                              onPress={() => {}}>
                              {`${t('studentTask.submissionDate')} : `}
                              <Text
                                style={{
                                  ...Fonts.Regular3,
                                  color: Colors.PrimaryText,
                                }}
                                onPress={() => {}}>
                                {moment(item.SUBMISSION_DATE).format(
                                  'DD/MMM/YYYY',
                                )}
                              </Text>
                            </Text>
                            {item.STATUS == 'C' && (
                              <Text
                                style={{
                                  ...Fonts.Medium4,
                                  color: Colors.Black,
                                  marginTop: 3,
                                }}
                                onPress={() => {}}>
                                {`${t('studentTask.completedDate')} : `}
                                <Text
                                  style={{
                                    ...Fonts.Medium4,
                                    color: Colors.PrimaryText,
                                  }}
                                  onPress={() => {}}>
                                  {moment(item.COMPLETION_DATE_TIME).format(
                                    'DD/MMM/YYYY',
                                  )}
                                </Text>
                              </Text>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                }}
              />
            </ScrollView>
          )}
        </View>
      </View>
      {openModal && (
        <TaskDetailsModal
          visible={openModal}
          onClose={() => {
            setOpenModal(false);
          }}
          item={item}
          onSuccess={() => {
            setOpenModal(false);
            setTaskData({...taskData, loading: true});
            getTask();
          }}
        />
      )}
    </View>
  );
};

export default StudentTaskCalender;
