import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated as RNAnimated,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Header, Icon, Modal, TextButton, Toast} from '../../../Components';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {Checkbox} from 'react-native-paper';
import {apiPost, apiPut, useSelector} from '../../../Modules';
import FloatingAdd from '../../../Components/FloatingAdd';
import {StackProps} from '../../../routes';
import {noTasks} from '../../../../assets';
import {WEEKLY_PLANNER_INTERFACE} from '../../../Modules/interface';
import Shimmer from 'react-native-shimmer';
import CalendarStrip from 'react-native-calendar-strip';
import {BannerAds} from '../../../Modules/AdsUtils';

type Props = StackProps<'WeeklyTask'>;
const WeeklyTask = ({navigation}: Props) => {
  const {member} = useSelector(state => state.member);
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoaading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [updateTask, setUpdateTask] = useState(false);
  const [deleteTask, setDeleteTask] = useState(false);
  const [updateTaskItem, setUpdateTaskItem] = useState<any>();
  const [selectedTaskIndex, setSelectedTaskIndex] =
    useState<WEEKLY_PLANNER_INTERFACE>();
  const [completedTasks, setCompletedTasks] = useState([]);
  const formattedDate = moment(new Date()).format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState('');

  const offset = useSharedValue(70);
  const animationStyle = useAnimatedStyle(() => ({
    transform: [{translateX: offset.value}],
  }));
  useFocusEffect(
    useCallback(() => {
      getTasks();
    }, [navigation, selectedDate]),
  );
  useEffect(() => {
    offset.value = withRepeat(
      withTiming(-offset.value, {duration: 1500}),
      -1,
      true,
    );
  }, []);

  const getTasks = async () => {
    setLoadingData(true);
    const date = moment(selectedDate).format('YYYY-MM-DD 00:00:00');
    try {
      const res = await apiPost('api/memberTodo/get', {
        filter: ` AND TYPE = 'WP' AND DATE(CREATED_DATETIME) = "${date}" AND MEMBER_ID = ${member?.ID} AND STATUS = 1 `,
        sortKey: 'CREATED_DATETIME',
        sortValue: 'ASC',
      });
      
      
      if (res && res.code == 200) {
        // console.log('\n\n..tasks...', res);
        setLoadingData(false);
        const pending = res.data.filter((task: any) => task.IS_COMPLETED === 0);
        const completed = res.data.filter(
          (task: any) => task.IS_COMPLETED === 1,
        );
        setTasks(pending);
        setCompletedTasks(completed);
      }
    } catch (error) {
      console.log('err,,,', error);
    }
  };
  const CompleteTask = async () => {
    setLoaading(true);
    try {
      let body = {
        MEMBER_ID: member?.ID,
        ID: selectedTaskIndex?.ID,
        CREATED_DATETIME: moment(selectedTaskIndex?.CREATED_DATETIME ? selectedTaskIndex?.CREATED_DATETIME: new Date()).format('YYYY-MM-DD HH:mm:ss'),
        // CREATED_DATETIME: selectedTaskIndex?.CREATED_DATETIME,
        TITLE: selectedTaskIndex?.TITLE,
        DESCRIPTION: selectedTaskIndex?.DESCRIPTION,
        IS_REMIND: selectedTaskIndex?.IS_REMIND,
        REMIND_DATETIME: moment(selectedTaskIndex?.REMIND_DATETIME).format(
          'YYYY-MM-DD HH:mm:ss',
        ),
        REMIND_TYPE: selectedTaskIndex?.REMIND_TYPE,
        IS_COMPLETED: 1,
        STATUS: 1,
        CLIENT_ID: 1,
        TYPE: selectedTaskIndex?.TYPE,
        IS_SUB_TASK: 1,
        IS_FULL_WEEK: 0,
      };
      const res = await apiPut('api/memberTodo/update', body);
      if (res && res.code == 200) {
        getTasks();
        setLoaading(false);
        setOpenAlert(false);
      }
    } catch (error) {
      setLoaading(false);
      console.log('err,,,', error);
    }
  };
  const DeleteTask = async (item: WEEKLY_PLANNER_INTERFACE) => {
    try {
      let body = {
        MEMBER_ID: member?.ID,
        ID: item?.ID,
        CREATED_DATETIME: moment(item?.CREATED_DATETIME ? item?.CREATED_DATETIME: new Date()).format('YYYY-MM-DD HH:mm:ss'),
//        CREATED_DATETIME: item?.CREATED_DATETIME,
        TITLE: item?.TITLE,
        DESCRIPTION: item?.DESCRIPTION,
        IS_REMIND: item?.IS_REMIND,
        REMIND_DATETIME: moment(item?.REMIND_DATETIME).format('YYYY-MM-DD HH:mm:ss'),
        REMIND_TYPE: item?.REMIND_TYPE,
        IS_COMPLETED: item.IS_COMPLETED,
        STATUS: 0,
        CLIENT_ID: 1,
        TYPE: item.TYPE,
        IS_SUB_TASK: 1,
        IS_FULL_WEEK: 0,
      };
      const res = await apiPut('api/memberTodo/update', body);
      if (res && res.code == 200) {
        getTasks();
      }
    } catch (error) {
      console.log('err,,,', error);
    }
  };
  const DeleteSeriesTask = async (
    item: WEEKLY_PLANNER_INTERFACE,
    date: any,
  ) => {
    try {
      let body = {
        MEMBER_ID: member?.ID,
        WEEK_PLAN_DATES: date,
        TITLE: item.TITLE,
        DESCRIPTION: item.DESCRIPTION,
        IS_REMIND: item.IS_REMIND,
        REMIND_TIME: moment(item.REMIND_DATETIME).format('HH:mm'),
        REMIND_TYPE: item.REMIND_TYPE,
        STATUS: 0,
        IS_COMPLETED: item.IS_COMPLETED,
        CLIENT_ID: 1,
        TYPE: item.TYPE,
        GROUP_NO: item.GROUP_NO,
      };
      const res = await apiPost('api/memberTodo/updateSeries', body);
      if (res && res.code == 200) {
        getTasks();
      }
    } catch (error) {
      setLoadingData(false);
      console.log('err,,,', error);
    }
  };
  const renderTask = ({item, index}: any) => {
    const deletePosition = new RNAnimated.Value(0);
    const handleSwipe = () => {
      RNAnimated.timing(deletePosition, {
        toValue: 500,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        DeleteTask(updateTaskItem);
      });
    };
    const handleSeriesSwipe = () => {
      RNAnimated.timing(deletePosition, {
        toValue: 500,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        getUpdateTaskData(updateTaskItem, 'D');
      });
    };

    const swipeStyle = {
      transform: [{translateX: deletePosition}],
    };
    const text =
      item.COLOR_TAG == '#AF7AC5'
        ? 'Event'
        : item.COLOR_TAG == '#64D76C'
        ? 'Meeting'
        : item.COLOR_TAG == '#F39c12'
        ? 'Sport and Fitness'
        : item.COLOR_TAG == '#FF675D'
        ? 'Studies'
        : item.COLOR_TAG == '#4995FF'
        ? 'School/Function/ClassActivity'
        : item?.COLOR_TAG == '#FB8DA0'
        ? 'Travel/Trip'
        : '';

    return (
      <Animatable.View
        animation={'fadeInUp'}
        duration={500}
        delay={index * 100}>
        <RNAnimated.View
          style={[
            swipeStyle,
            {
              margin: Sizes.Base,
              marginBottom: Sizes.Base,
              borderRadius: Sizes.Radius,
              padding: Sizes.Radius,
              elevation: 6,
              shadowColor: 'blue',
              marginHorizontal: Sizes.ScreenPadding,
              backgroundColor: item.COLOR_TAG ? item.COLOR_TAG : Colors.White,
            },
          ]}>
          {/*for tag name*/}
          <View
            style={{
              position: 'absolute',
              backgroundColor: Colors.Background,
              right: 0,
              bottom: 0,
              paddingHorizontal: Sizes.Base,
              borderBottomRightRadius: Sizes.Radius,
              borderTopLeftRadius: Sizes.Radius,
            }}>
            <Text style={{color: Colors.PrimaryText, ...Fonts.Medium3}}>
              {text}
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} onPress={() => {}} style={{}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                margin: -Sizes.Base,
                width: '100%',
              }}>
              <View
                style={{
                  transform: [{scale: 0.9}],
                }}>
                <Checkbox
                  disabled={
                    item.IS_COMPLETED == 0
                      ? moment(item.CREATED_DATETIME).startOf('day') >
                        moment(new Date()).startOf('day')
                        ? true
                        : false
                      : true
                  }
                  uncheckedColor={
                    item.COLOR_TAG ? Colors.White : Colors.Primary2
                  }
                  color={Colors.Primary}
                  status={item.IS_COMPLETED === 1 ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setOpenAlert(true);
                    setSelectedTaskIndex(item);
                  }}
                />
              </View>

              <Text
                textBreakStrategy="simple"
                style={{
                  color: item.COLOR_TAG ? Colors.White : Colors.PrimaryText1,
                  ...Fonts.Medium2,
                  fontSize: 13,
                  marginLeft: 4,
                  width: '73%',
                  marginTop: Sizes.Base,
                }}>
                {item.TITLE}
              </Text>
            </View>
            {item.DESCRIPTION && (
              <Text
                style={{
                  marginLeft: 34,
                  color: item.COLOR_TAG ? Colors.White : Colors.PrimaryText,
                  ...Fonts.Medium3,
                  marginTop: Sizes.Base,
                }}>
                {item.DESCRIPTION}
              </Text>
            )}

            <View
              style={{flexDirection: 'row', margin: 4, alignItems: 'center'}}>
              <Icon
                name={
                  item.REMIND_TYPE == 'P' ? 'bell-ring-outline' : 'time-outline'
                }
                type={
                  item.REMIND_TYPE == 'P'
                    ? 'MaterialCommunityIcons'
                    : 'Ionicons'
                }
                size={17}
                color={item.COLOR_TAG ? Colors.White : Colors.Primary}
              />
              <Text
                style={{
                  ...Fonts.Medium2,
                  marginLeft: Sizes.Padding,
                  color: item.COLOR_TAG ? Colors.White : Colors.PrimaryText,
                  fontSize: 10,
                }}>
                {moment(item.REMIND_DATETIME).format('hh:mm A')}
              </Text>
            </View>
          </TouchableOpacity>
          {item.IS_COMPLETED != 1 && (
            <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                top: Sizes.Radius,
                right: Sizes.Base,
              }}>
              {moment(item.CREATED_DATETIME).startOf('day') <
              moment(new Date()).startOf('day') ? null : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{marginRight: Sizes.Radius}}
                  onPress={() => {
                    item.IS_COMPLETED == 0
                      ? item.IS_FULL_WEEK == 1
                        ? (setUpdateTaskItem(item), setUpdateTask(true))
                        : navigation.navigate('AddTaskForm', {
                            item: item,
                            type: 'U',
                            pageType: 'W',
                          })
                      : null;
                  }}>
                  <Icon
                    name="edit"
                    type="MaterialIcons"
                    size={17}
                    color={item.COLOR_TAG ? Colors.White : Colors.Primary}
                  />
                </TouchableOpacity>
              )}
              {moment(item.CREATED_DATETIME).startOf('day') <
              moment(new Date()).startOf('day') ? null : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{}}
                  onPress={() => {
                    setUpdateTaskItem(item);
                    setDeleteTask(true);
                  }}>
                  <Icon
                    name="delete"
                    type="MaterialIcons"
                    size={17}
                    color={item.COLOR_TAG ? Colors.White : Colors.Primary}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </RNAnimated.View>
      </Animatable.View>
    );
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

  const getUpdateTaskData = async (
    item: WEEKLY_PLANNER_INTERFACE,
    type: string,
  ) => {
    const date = moment(item.CREATED_DATETIME).format('YYYY-MM-DD 00:00:00');
    setLoadingData(true);
    try {
      const res = await apiPost('api/memberTodo/get', {
        filter: ` AND TYPE = '${item.TYPE}' AND GROUP_NO = ${item.GROUP_NO} AND MEMBER_ID = ${member?.ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        var dateTimeArray: any = [];
        res.data.forEach(function (obj: WEEKLY_PLANNER_INTERFACE) {
          dateTimeArray.push(new Date(obj.CREATED_DATETIME));
        });
        var deleteDateTimeArray: any = [];
        res.data.forEach(function (obj: WEEKLY_PLANNER_INTERFACE) {
          deleteDateTimeArray.push(
            moment(new Date(obj.CREATED_DATETIME)).format(
              'YYYY-MM-DD HH:mm:Ss',
            ),
          );
        });
        type == 'U'
          ? navigation.navigate('WeekPlanAddTask', {
              item,
              type: 'U',
              selectedDateArray: dateTimeArray,
            })
          : DeleteSeriesTask(item, deleteDateTimeArray);
      }
    } catch (error) {
      setLoadingData(false);
      console.log('err,,,', error);
    }
  };
  const onWeekChange = useCallback(
    (date: any) => {
      setCurrentMonth(moment(date).format('MMM yyyy'));
    },
    [currentMonth],
  );

  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Header
        label="Weekly Planner"
        onBack={() => navigation.goBack()}
        rightChild={
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="color-filter-outline"
              type="Ionicons"
              size={24}
              color={Colors.White}
              onPress={() => {
                navigation.navigate('ColorTagFilter');
              }}
            />
            <Icon
              name="calendar"
              type="EvilIcons"
              size={35}
              color={Colors.White}
              onPress={() => {
                navigation.navigate('WeeklyCalender', {animation: 'Flip'});
              }}
              style={{marginLeft: Sizes.Padding, marginRight: -Sizes.Base}}
            />
          </View>
        }
      />

      <Text
        style={{
          ...Fonts.Bold1,
          color: Colors.Primary,
          fontSize: Sizes.ScreenPadding,
          marginTop: Sizes.Padding,
          marginLeft: Sizes.ScreenPadding,
        }}>
        {currentMonth}
      </Text>

      <View style={{flex: 1}}>
        {/* <CalendarComponent
          dates={generateWeekDates()}
          onDatePress={handleDatePress}
        /> */}
        <CalendarStrip
          scrollable={false}
          scrollerPaging
          useNativeDriver={true}
          selectedDate={selectedDate}
          scrollToOnSetSelectedDate={true}
          style={{
            height: 70,
            paddingTop: Sizes.Base,
            marginHorizontal: 10,
            borderRadius: Sizes.Padding,
            marginVertical: Sizes.Base,
          }}
          calendarColor={Colors.Primary2}
          calendarHeaderStyle={{height: 0}}
          dateNameStyle={{
            ...Fonts.Bold3,
            color: Colors.White + 98,
          }}
          dateNumberStyle={{
            ...Fonts.Bold2,
            color: Colors.White,
          }}
          iconContainer={{flex: 0.1}}
          highlightDateNameStyle={{
            ...Fonts.Bold3,
            color: 'yellow',
          }}
          highlightDateNumberStyle={{
            ...Fonts.Bold2,
            color: 'yellow',
          }}
          upperCaseDays={false}
          markedDates={[
            {
              date: selectedDate,
              lines: [{color: 'red'}],
            },
          ]}
          leftSelector={
            <Icon
              type="Entypo"
              name="chevron-small-left"
              size={24}
              color="white"
            />
          }
          rightSelector={
            <Icon
              type="Entypo"
              name="chevron-small-right"
              size={24}
              color="white"
            />
          }
          onDateSelected={(date: any) => {
            setSelectedDate(date);
          }}
          onWeekChanged={onWeekChange}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={false}
              colors={[Colors.Primary, Colors.Primary]}
              onRefresh={() => {
                getTasks();
              }}
            />
          }>
          {loadingData ? (
            <FlatList
              data={[1, 1, 1, 1]}
              renderItem={() => (
                <Shimmer
                  duration={2000}
                  pauseDuration={1000}
                  animationOpacity={0.9}
                  opacity={0.5}
                  style={{
                    marginHorizontal: Sizes.ScreenPadding,
                    marginTop: Sizes.Padding,
                  }}>
                  <View
                    style={{
                      borderRadius: Sizes.Radius,
                      shadowColor: Colors.Primary,

                      padding: Sizes.Padding,
                      backgroundColor: Colors.Secondary + 50,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          height: 20,
                          width: 20,
                          backgroundColor: Colors.Primary2 + 90,
                        }}
                      />
                      <View
                        style={{
                          marginLeft: Sizes.ScreenPadding,
                          flex: 1,
                          height: 20,
                          borderRadius: Sizes.Radius,
                          backgroundColor: Colors.Primary2 + 90,
                        }}
                      />
                    </View>
                  </View>
                </Shimmer>
              )}
            />
          ) : tasks.length !== 0 || completedTasks.length != 0 ? (
            <View style={{marginBottom: Sizes.Padding}}>
              {tasks.length != 0 && (
                <Text
                  style={{
                    color: Colors.PrimaryText,
                    ...Fonts.Medium2,
                    marginTop: Sizes.Radius,
                    marginLeft: Sizes.ScreenPadding,
                  }}>
                  {`Pending ${tasks.length}`}
                </Text>
              )}
              <FlatList
                showsVerticalScrollIndicator={false}
                data={tasks}
                contentContainerStyle={{}}
                renderItem={renderTask}
                keyExtractor={(item, index) => index.toString()}
              />

              {completedTasks.length != 0 && (
                <Text
                  style={{
                    color: Colors.PrimaryText,
                    ...Fonts.Medium2,
                    marginTop: Sizes.Radius,
                    marginLeft: Sizes.ScreenPadding,
                  }}>
                  {`Completed ${completedTasks.length}`}
                </Text>
              )}
              <FlatList
                showsVerticalScrollIndicator={false}
                data={completedTasks}
                contentContainerStyle={{marginBottom: Sizes.ScreenPadding}}
                renderItem={renderTask}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          ) : (
            <View style={{flex: 1, alignItems: 'center'}}>
              <Image source={noTasks} style={{height: 220, width: 210}} />
              <Text style={{...Fonts.Medium2, color: Colors.Primary}}>
                Your Plan is Empty
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <FloatingAdd
        onPress={() => {
          navigation.navigate('WeekPlanAddTask', {
            item: {
              CREATED_DATETIME: moment(selectedDate).format(
                'YYYY-MM-DD HH:MM:00',
              ),
              REMIND_DATETIME: moment(new Date()).format('YYYY-MM-DD HH:mm:00'),
            },
            type: 'C',
            selectedDateArray: null,
          });
        }}
        style={{bottom: Sizes.ScreenPadding * 3.5}}
      />

      {openAlert && (
        <Modal
          onClose={() => {
            setOpenAlert(false);
          }}
          isVisible={openAlert}>
          <View style={{}}>
            <Text style={{color: Colors.PrimaryText1, ...Fonts.Bold2}}>
              Confirm Completion?
            </Text>
            <Text style={{color: Colors.PrimaryText1, ...Fonts.Medium3}}>
              Do you really want to mark this task as complete? This action
              cannot be undone.
            </Text>
            <View style={{flexDirection: 'row', marginTop: Sizes.Padding}}>
              <TextButton
                isBorder
                style={{flex: 1, borderColor: Colors.Secondary}}
                label="Cancel"
                loading={false}
                onPress={() => setOpenAlert(false)}
              />
              <View style={{width: 16}}></View>
              <TextButton
                style={{flex: 1}}
                label="Save"
                loading={loading}
                onPress={() => CompleteTask()}
              />
            </View>
          </View>
        </Modal>
      )}
      {updateTask && (
        <Modal
          onClose={() => {
            setUpdateTask(false);
          }}
          isVisible={updateTask}>
          <View style={{}}>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Bold2,
                textAlign: 'center',
              }}>
              Update Task
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: Sizes.ScreenPadding,
              }}>
              <TextButton
                isBorder
                textStyle={{fontSize: 12}}
                style={{flex: 1, borderColor: Colors.Secondary}}
                // label="Update One"
                label="Edit for a Day"
                loading={false}
                onPress={() => {
                  setUpdateTask(false);
                  navigation.navigate('AddTaskForm', {
                    item: updateTaskItem,
                    type: 'U',
                    pageType: 'W',
                  });
                }}
              />
              <View style={{width: 16}} />
              <TextButton
                textStyle={{fontSize: 12}}
                style={{flex: 1}}
                // label="Update Series"
                label="Edit for a week"
                loading={loading}
                onPress={() => {
                  getUpdateTaskData(updateTaskItem, 'U');
                  setUpdateTask(false);
                }}
              />
            </View>
          </View>
        </Modal>
      )}
      {deleteTask && (
        <Modal
          onClose={() => {
            setDeleteTask(false);
          }}
          isVisible={deleteTask}>
          <View style={{}}>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Bold2,
                textAlign: 'center',
              }}>
              Delete Task
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: Sizes.ScreenPadding,
              }}>
              <TextButton
                isBorder
                style={{flex: 1, borderColor: Colors.Secondary}}
                label="Delete One"
                loading={false}
                onPress={() => {
                  setDeleteTask(false);
                  DeleteTask(updateTaskItem);
                }}
              />
              <View style={{width: 16}}></View>
              <TextButton
                style={{flex: 1}}
                label="Delete Series"
                loading={loading}
                onPress={() => {
                  setDeleteTask(false);
                  getUpdateTaskData(updateTaskItem, 'D');
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      <BannerAds />
    </View>
  );
};

export default WeeklyTask;
