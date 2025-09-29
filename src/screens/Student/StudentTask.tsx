import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { BASE_URL, apiPost, apiPut, useSelector } from '../../Modules';
import { StackProps } from '../../routes';
import { Header, Icon, Toast } from '../../Components';
import { Checkbox } from 'react-native-paper';
import { STUDENT_TASK_DATA_INTERFACE } from '../../Modules/interface';
import moment from 'moment';
import { noData } from '../../../assets';
import TaskDetailsModal from './TaskDetailsModal';
import Animated, { BounceIn, BounceOut } from 'react-native-reanimated';
import CalendarComponent from '../Tasks/CalendarComponent ';
import { useTranslation } from 'react-i18next';
import ImageView from 'react-native-image-viewing';
import PurchaseSubscriptionModal from '../../Components/PurchaseSubscriptionModal';
import { isSubscriptionActive } from '../../Functions';
import { BannerAds } from '../../Modules/AdsUtils';

type Props = StackProps<'StudentTask'>;
type flatListProps = {
  item: STUDENT_TASK_DATA_INTERFACE;
  index: number;
};
const StudentTask = ({ navigation }: Props) => {
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const { member } = useSelector(state => state.member);
  const [studentClassId, setStudentClassId] = useState<any>(null);
  const { t } = useTranslation();
  const formattedDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const [selectedDate, setSelectedDate] = useState(new Date());
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
  const [item, setItem] = useState<any>({});
  const [tabIndex, setTabIndex] = useState(1);
  const [openImage, setOpenImage] = useState(false);
  const purchase = !isSubscriptionActive() ? true : false;
  const [openPurchaseModal, setOpenPurchaseModal] = useState(purchase);
  // useEffect(() => {
  //   getTask(selectedDate, tabIndex);
  // }, []);
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

  useEffect(() => {
    getClass();
  }, []);
  const getClass = async () => {
    try {
      const res = await apiPost('api/studentClassMapping/get', {
        filter: `AND STUDENT_ID=${member?.ID}`,
      });

      if (res && res.code == 200) {
        setStudentClassId(res.data[0].CLASS_ID);
        getTask(selectedDate, tabIndex, res.data[0].CLASS_ID);
      } else {
        setTaskData({ ...taskData, loading: false });
      }
    } catch (error) {
      setTaskData({ ...taskData, loading: false });
      console.log('error..', error);
    }
  };
  const handleDatePress = (date: any) => {
    const dates = new Date(date);
    setSelectedDate(dates);
    getTask(dates, tabIndex, studentClassId);
  };

  const getTask = async (date: any, tabIndex: number, classID: any) => {
    setTaskData({ ...taskData, loading: true });
    try {
      let fil = ` AND CLASS_ID = ${classID}  AND STUDENT_ID = ${member?.ID
        } AND ASSIGNED_DATE <= '${moment(date).format(
          'YYYY-MM-DD',
        )}' AND SUBMISSION_DATE >= '${moment(date).format(
          'YYYY-MM-DD 00:00:00',
        )}' `;
      tabIndex == 1
        ? (fil += ` AND TYPE = 'CW' `)
        : tabIndex == 2
          ? (fil += ` AND TYPE = 'HW' `)
          : (fil += ` AND TYPE = 'AS' `);
      const res = await apiPost('api/studentTaskDetails/get', {
        filter: fil,
        sortKey: 'STATUS',
        sortValue: 'DESC',
      });
      if (res && res.code == 200) {
        setTabIndex(tabIndex);
        const data = res.data.map((item: any) => ({
          ...item,
          SELECTED: false,
        }));
        const data1 = data.filter((it: any) => it.STATUS.includes('P'));
        const data2 = data.filter((it: any) => it.STATUS.includes('C'));

        // setTaskData({...taskData, data: data1.concat(data2), loading: false});
        setTaskData({
          ...taskData,
          pendingData: data1,
          completeData: data2,
          loading: false,
        });
      } else {
        setTaskData({ ...taskData, loading: false });
      }
    } catch (error) {
      setTaskData({ ...taskData, loading: false });
      console.log('error..', error);
    }
  };

  const updateTaskStatus = async (item: any, status: string) => {
    setTaskData({ ...taskData, loading: true });
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
        // console.log('\n\nres...', res);
        getTask(selectedDate, tabIndex, studentClassId);
      } else {
        setTaskData({ ...taskData, loading: false });
        Toast('Something Wrong...Please try again');
      }
    } catch (error) {
      setTaskData({ ...taskData, loading: false });
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.Background }}>
      <Header
        label={t('studentTask.header')}
        onBack={() => {
          navigation.goBack();
        }}
        rightChild={
          <Icon
            name="calendar"
            type="EvilIcons"
            size={35}
            color={Colors.White}
            onPress={() => {
              navigation.navigate('StudentTaskCalender', { studentClassId });
            }}
          />
        }
      />
      <View style={{ height: Sizes.Padding }} />

      <View style={{ flex: 1 }}>
        <CalendarComponent
          dates={generateWeekDates()}
          onDatePress={handleDatePress}
        />
        {/* tab  */}
        <View
          style={{
            height: 50,
            marginHorizontal: Sizes.ScreenPadding,
            borderRadius: Sizes.Padding * 2,
            elevation: 6,
            shadowColor: Colors.Primary2,
            marginTop: Sizes.Base,
            flexDirection: 'row',
            backgroundColor: Colors.Background,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setTabIndex(1);
              getTask(selectedDate, 1, studentClassId);
            }}
            style={{
              width: '32%',
              height: '100%',
              borderRadius: Sizes.Padding * 2,
              backgroundColor:
                tabIndex == 1 ? Colors.Primary2 : Colors.Background,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...Fonts.Medium3,
                color: tabIndex == 1 ? Colors.White : Colors.Primary2,
              }}>
              Class Work
            </Text>
          </TouchableOpacity>
          {tabIndex == 3 && (
            <View
              style={{
                height: 17,
                width: 1,
                backgroundColor: Colors.Primary,
                alignSelf: 'center',
              }}
            />
          )}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setTabIndex(2);
              getTask(selectedDate, 2, studentClassId);
            }}
            style={{
              width: '32%',
              height: '100%',
              borderRadius: Sizes.Padding * 2,
              backgroundColor:
                tabIndex == 2 ? Colors.Primary2 : Colors.Background,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...Fonts.Medium3,
                color: tabIndex == 2 ? Colors.White : Colors.Primary2,
              }}>
              Home Work
            </Text>
          </TouchableOpacity>
          {tabIndex == 1 && (
            <View
              style={{
                height: 17,
                width: 1,
                backgroundColor: Colors.Primary,
                alignSelf: 'center',
              }}
            />
          )}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setTabIndex(3);
              getTask(selectedDate, 3, studentClassId);
            }}
            style={{
              width: '36%',
              height: '100%',
              borderRadius: Sizes.Padding * 2,
              backgroundColor:
                tabIndex == 3 ? Colors.Primary2 : Colors.Background,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...Fonts.Medium3,
                color: tabIndex == 3 ? Colors.White : Colors.Primary2,
                textAlign: 'center',
              }}>
              Notice
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            ...Fonts.Medium4,
            color: Colors.PrimaryText,
            marginHorizontal: Sizes.Padding,
            textAlign: 'justify',
            marginTop: Sizes.Padding,
          }}>
          {tabIndex === 1
            ? 'Get information on the daily syllabus taught in school by date and subject'
            : tabIndex === 2
              ? 'Get information on the daily homework assigned in school by date and subject'
              : 'Get information on upcoming events, holidays, important announcements and other notices'}
        </Text>
        <View style={{ flex: 1, margin: Sizes.ScreenPadding }}>
          <View style={{ flex: 1 }}>
            {taskData.loading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ActivityIndicator size={'large'} color={Colors.Primary} />
              </View>
            ) : taskData.pendingData.length == 0 &&
              taskData.completeData.length == 0 ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
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
                      getTask(selectedDate, tabIndex, studentClassId);
                    }}
                  />
                }>
                {/* Pending task */}
                {tabIndex != 1 && taskData.pendingData.length != 0 && (
                  <Text style={{ ...Fonts.Medium2, color: Colors.PrimaryText1 }}>
                    {`Pending (${taskData.pendingData.length})`}
                  </Text>
                )}
                <FlatList
                  data={taskData.pendingData}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }: flatListProps) => {
                    return (
                      <Animated.View
                        entering={BounceIn.delay(500).duration(1000)}
                        style={{ backgroundColor: Colors.Background }}>
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => {
                            setItem(item);
                            setOpenModal(true);
                          }}
                          style={{
                            margin: Sizes.Base,
                            backgroundColor: Colors.Background,
                            borderRadius: Sizes.Radius,
                            paddingVertical: Sizes.Base,
                            paddingHorizontal: Sizes.Base,
                            elevation: 7,
                            marginBottom: Sizes.Padding,
                          }}>
                          {/* checkbox and subject  */}
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <View>
                              {tabIndex != 1 && (
                                <Checkbox
                                  status={
                                    item.STATUS == 'C' ? 'checked' : 'unchecked'
                                  }
                                  color={Colors.Primary2}
                                  uncheckedColor={Colors.Primary2}
                                  onPress={() => {
                                    Alert.alert(
                                      'Task Status',
                                      'Have you completed this task?',
                                      [
                                        { text: 'No', onPress: () => null },
                                        {
                                          text: 'Yes',
                                          // onPress: () => toggleSelectedItem(item.ID),
                                          onPress: () =>
                                            updateTaskStatus(item, 'C'),
                                        },
                                      ],
                                      { cancelable: true },
                                    );
                                  }}
                                  disabled={item.STATUS == 'C' ? true : false}
                                />
                              )}
                            </View>
                            <View
                              style={{
                                flex: 1,
                                marginTop: 6,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              {item.SUBJECT_NAME && (
                                <Text
                                  style={{
                                    ...Fonts.Medium2,
                                    color: Colors.PrimaryText1,
                                    marginLeft: Sizes.Radius,
                                  }}
                                  onPress={() => { }}>
                                  {item.SUBJECT_NAME}
                                </Text>
                              )}
                              {item.ATTACMENT && (
                                <Icon
                                  style={{
                                    position: 'absolute',
                                    top: 3,
                                    right: Sizes.Base,
                                  }}
                                  name="attach"
                                  type="Ionicons"
                                  color={Colors.PrimaryText1}
                                  size={25}
                                  onPress={() => {
                                    setItem(item);
                                    setOpenImage(true);
                                  }}
                                />
                              )}
                            </View>
                          </View>
                          <View style={{ marginLeft: Sizes.Base, flex: 1 }}>
                            {/* task name */}
                            <View
                              style={{
                                flexDirection: 'row',
                              }}>
                              <Text
                                textBreakStrategy="simple"
                                numberOfLines={2}
                                style={{
                                  ...Fonts.Regular2,
                                  color: Colors.PrimaryText,
                                  paddingRight: Sizes.Padding,
                                  flex: 1,
                                  maxWidth: '80%',
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
                                    backgroundColor: Colors.Background,
                                    position: 'absolute',
                                    right: 0,
                                    top: 32,
                                  }}>
                                  {`...${t('studentTask.more')}`}
                                </Text>
                              )}
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: Sizes.Base,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Icon
                                  name="clock"
                                  type="EvilIcons"
                                  color={Colors.PrimaryText1}
                                  size={23}
                                />
                                <Text
                                  style={{
                                    ...Fonts.Regular2,
                                    color: Colors.PrimaryText1,
                                    marginLeft: Sizes.Base,
                                  }}
                                  onPress={() => { }}>
                                  {tabIndex == 1
                                    ? moment(item.ASSIGNED_DATE).format(
                                      'DD/MM/YYYY',
                                    )
                                    : tabIndex == 2
                                      ? moment(item.CREATED_MODIFIED_DATE).format(
                                        'hh:mm A',
                                      )
                                      : moment(item.ASSIGNED_DATE).format(
                                        'DD/MM/YYYY',
                                      )}
                                </Text>
                              </View>
                              {tabIndex == 3 && (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <Icon
                                    name="check-circle"
                                    type="Feather"
                                    color={Colors.PrimaryText1}
                                    size={15}
                                  />
                                  <Text
                                    style={{
                                      ...Fonts.Regular2,
                                      color: Colors.PrimaryText1,
                                      marginLeft: Sizes.Base,
                                    }}
                                    onPress={() => { }}>
                                    {moment(item.SUBMISSION_DATE).format(
                                      'DD/MM/YYYY',
                                    )}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </TouchableOpacity>
                      </Animated.View>
                    );
                  }}
                />

                {/* Completed task */}
                {taskData.completeData.length != 0 && (
                  <Text
                    style={{
                      ...Fonts.Medium2,
                      color: Colors.PrimaryText1,
                      marginVertical: Sizes.Base,
                    }}>
                    {`Completed.. (${taskData.completeData.length})`}
                  </Text>
                )}
                <FlatList
                  data={taskData.completeData}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }: flatListProps) => {
                    return (
                      <Animated.View
                        entering={BounceIn.delay(500).duration(1000)}
                        style={{ backgroundColor: Colors.Background }}>
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => {
                            setItem(item);
                            setOpenModal(true);
                          }}
                          style={{
                            margin: Sizes.Base,
                            backgroundColor: '#E0FFDF',
                            borderRadius: Sizes.Radius,
                            paddingVertical: Sizes.Base,
                            paddingHorizontal: Sizes.Base,
                            elevation: 7,
                            marginBottom: Sizes.Padding,
                          }}>
                          {/* checkbox and subject */}
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
                                  color={'#0AFA6F'}
                                  uncheckedColor={'#0AFA6F'}
                                // disabled={item.STATUS == 'C' ? true : false}
                                />
                              </View>
                            )}
                            <View
                              style={{
                                flex: 1,
                                marginTop: 6,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              {item.SUBJECT_NAME && (
                                <Text
                                  style={{
                                    ...Fonts.Medium2,
                                    color: Colors.PrimaryText1,
                                  }}
                                  onPress={() => { }}>
                                  {item.SUBJECT_NAME}
                                </Text>
                              )}
                              {item.ATTACMENT && (
                                <Icon
                                  style={{
                                    position: 'absolute',
                                    top: 3,
                                    right: Sizes.Base,
                                  }}
                                  name="attach"
                                  type="Ionicons"
                                  color={Colors.PrimaryText1}
                                  size={25}
                                  onPress={() => {
                                    setItem(item);
                                    setOpenImage(true);
                                  }}
                                />
                              )}
                            </View>
                          </View>

                          <View style={{ marginLeft: Sizes.Base }}>
                            <View
                              style={{
                                flexDirection: 'row',
                              }}>
                              <Text
                                textBreakStrategy="simple"
                                numberOfLines={2}
                                style={{
                                  ...Fonts.Regular2,
                                  color: Colors.PrimaryText,
                                  paddingRight: Sizes.Padding,
                                  flex: 1,
                                  maxWidth: '80%',
                                }}>
                                {item.TASK}
                              </Text>
                              {/* {item.TASK.length > 45 && (
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
                                )} */}
                            </View>
                            <Text
                              style={{
                                ...Fonts.Medium4,
                                color: Colors.PrimaryText,
                                marginTop: 3,
                              }}
                              onPress={() => { }}>
                              {`${t('studentTask.completedDate')} : `}
                              <Text
                                style={{
                                  ...Fonts.Medium4,
                                  color: Colors.PrimaryText,
                                }}
                                onPress={() => { }}>
                                {moment(item.COMPLETION_DATE_TIME).format(
                                  'DD/MM/YYYY',
                                )}
                              </Text>
                            </Text>
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
      </View>
      <BannerAds />

      {/* {openPurchaseModal && (
        <PurchaseSubscriptionModal
          navigation={navigation}
          setOpenPurchaseModal={setOpenPurchaseModal}
          isVisible={openPurchaseModal}
          onClose={() => {}}
        />
      )} */}
      {openModal && (
        <TaskDetailsModal
          visible={openModal}
          onClose={() => {
            setOpenModal(false);
          }}
          item={item}
          onSuccess={() => {
            setOpenModal(false);
            setTaskData({ ...taskData, loading: true });
            getTask(selectedDate, tabIndex, studentClassId);
          }}
        />
      )}
      {openImage && (
        <ImageView
          images={[
            {
              // uri: BASE_URL+'static/classWiseTask/'+item.ATTACMENT,
              uri: BASE_URL + 'static/taskAttachment/' + item.ATTACMENT,
            },
          ]}
          imageIndex={0}
          visible={openImage}
          onRequestClose={() => {
            setOpenImage(false);
            console.log(
              'oooooooo',
              BASE_URL + 'static/taskAttachment/' + item.ATTACMENT,
            );
          }}
        />
      )}
    </View>
  );
};

export default StudentTask;
