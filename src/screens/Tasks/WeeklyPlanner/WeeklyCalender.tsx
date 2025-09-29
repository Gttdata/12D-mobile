import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  View,
  Animated as RNAnimated,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import * as Animatable from 'react-native-animatable';
import {Header, Icon, Modal, TextButton} from '../../../Components';
import {useTranslation} from 'react-i18next';
import {apiPost, apiPut, useSelector} from '../../../Modules';
import {Checkbox} from 'react-native-paper';
import {StackProps} from '../../../routes';
import {WEEKLY_PLANNER_INTERFACE} from '../../../Modules/interface';
import {useFocusEffect} from '@react-navigation/native';
import Shimmer from 'react-native-shimmer';

type Props = StackProps<'WeeklyCalender'>;
const WeeklyCalender = ({navigation}: Props) => {
  const {t} = useTranslation();
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [selected, setSelected] = useState<any>(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [tasks, setTasks] = useState([]);
  const [tasksDates, setTasksDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [updateTask, setUpdateTask] = useState(false);
  const [deleteTask, setDeleteTask] = useState(false);
  const [updateTaskItem, setUpdateTaskItem] = useState<any>();
  const [selectedTaskIndex, setSelectedTaskIndex] =
    useState<WEEKLY_PLANNER_INTERFACE>();
  const [completedTasks, setCompletedTasks] = useState([]);
  const {member} = useSelector(state => state.member);

  useEffect(() => {
    getAllTasks();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      getTasks();
    }, [navigation, selected]),
  );
  const getTasks = async () => {
    setLoadingData(true);
    const date = moment(selected).format('YYYY-MM-DD 00:00:00');
    try {
      const res = await apiPost('api/memberTodo/get', {
        filter: ` AND TYPE = 'WP' AND DATE(CREATED_DATETIME) = "${date}" AND MEMBER_ID = ${member?.ID} AND STATUS = 1 `,
        sortKey: 'CREATED_DATETIME',
        sortValue: 'ASC',
      });
      if (res && res.code == 200) {
        const pending = res.data.filter((task: any) => task.IS_COMPLETED === 0);
        const completed = res.data.filter(
          (task: any) => task.IS_COMPLETED === 1,
        );
        setTasks(pending);
        setCompletedTasks(completed);
        setLoadingData(false);
      }
    } catch (error) {
      setLoadingData(false);
      console.log('err,,,', error);
    }
  };
  const getAllTasks = async () => {
    const date = moment(selected).format('YYYY-MM-DD HH:mm:ss');
    try {
      const res = await apiPost('api/memberTodo/get', {
        filter: ` AND TYPE = 'WP' AND MEMBER_ID = ${member?.ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        setTasksDates(res.data);
      }
    } catch (error) {
      console.log('err,,,', error);
    }
  };
  const CompleteTask = async () => {
    setLoading(true);
    try {
      let body = {
        MEMBER_ID: member?.ID,
        ID: selectedTaskIndex?.ID,
        CREATED_DATETIME: moment(selectedTaskIndex?.CREATED_DATETIME ? selectedTaskIndex?.CREATED_DATETIME: new Date()).format('YYYY-MM-DD HH:mm:ss'),
//        CREATED_DATETIME: selectedTaskIndex?.CREATED_DATETIME,
        TITLE: selectedTaskIndex?.TITLE,
        DESCRIPTION: selectedTaskIndex?.DESCRIPTION,
        IS_REMIND: selectedTaskIndex?.IS_REMIND,
        REMIND_DATETIME: moment(selectedTaskIndex?.REMIND_DATETIME).format('YYYY-MM-DD HH:mm:ss'),
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
        setLoading(false);
        getTasks();
        setOpenAlert(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('err,,,', error);
    }
  };
  const DeleteTask = async (item: WEEKLY_PLANNER_INTERFACE) => {
    try {
      let body = {
        MEMBER_ID: member?.ID,
        ID: item?.ID,
        CREATED_DATETIME: moment(item?.CREATED_DATETIME ? item?.CREATED_DATETIME: new Date()).format('YYYY-MM-DD HH:mm:ss'),
        // CREATED_DATETIME: item?.CREATED_DATETIME,
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
  const renderTask = ({item, index}: any) => {
    const deletePosition = new RNAnimated.Value(0);
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
        : '';

    return (
      <Animatable.View
        animation={'fadeInUp'}
        duration={1000}
        delay={index * 100}>
        <RNAnimated.View
          style={[
            swipeStyle,
            {
              margin: Sizes.Base,
              marginBottom: Sizes.Padding,
              borderRadius: Sizes.Radius,
              padding: Sizes.Radius,
              elevation: 8,
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

              <View style={{marginLeft: Sizes.Base}}>
                <Text
                  style={{
                    color: item.COLOR_TAG ? Colors.White : Colors.PrimaryText1,
                    ...Fonts.Medium2,
                    fontSize: 13,
                  }}>
                  {item.TITLE}
                </Text>
              </View>
            </View>
            {item.DESCRIPTION && (
              <Text
                style={{
                  marginLeft: 35,
                  color: item.COLOR_TAG ? Colors.White : Colors.PrimaryText,
                  ...Fonts.Medium3,
                }}>
                {item.DESCRIPTION}
              </Text>
            )}

            <View style={{flexDirection: 'row', margin: 4}}>
              <Icon
                name={
                  item.REMIND_TYPE == 'P' ? 'bell-ring-outline' : 'time-outline'
                }
                type={
                  item.REMIND_TYPE == 'P'
                    ? 'MaterialCommunityIcons'
                    : 'Ionicons'
                }
                size={19}
                color={item.COLOR_TAG ? Colors.White : Colors.Primary}
              />
              <Text
                style={{
                  ...Fonts.Medium2,
                  marginLeft: Sizes.Radius,
                  color: item.COLOR_TAG ? Colors.White : Colors.PrimaryText,
                  fontSize: 11,
                }}>
                {moment(item.CREATED_DATETIME).format('hh:mm A')}
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
                  style={{marginRight: Sizes.Padding}}
                  onPress={() => {
                    item.IS_COMPLETED == 0
                      ? (setUpdateTaskItem(item), setUpdateTask(true))
                      : null;
                  }}>
                  <Icon
                    name="edit"
                    type="MaterialIcons"
                    size={18}
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
                    size={18}
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
  const generateMarkedDates = (tasks: any) => {
    const markedDates: any = {};
    tasks.forEach((task: any) => {
      const formattedDate: any = moment(task.CREATED_DATETIME).format(
        'YYYY-MM-DD',
      );
      markedDates[formattedDate] = {
        // marked: true,
        customStyles: {
          container: {
            backgroundColor: '#D6EAF8',
          },
          text: {
            // color: Colors.Primary2,
          },
        },
      };
    });
    return markedDates;
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Header label="Weekly Planner" onBack={() => navigation.goBack()} />
      <Calendar
        onDayPress={day => {
          setSelected(day.dateString);
        }}
        markingType="custom"
        markedDates={{
          ...generateMarkedDates(tasksDates),
          [selected]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: Colors.Primary,
          },
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
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
                    // marginVertical: Sizes.Radius,
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
                        // borderRadius: 30,
                      }}></View>
                    <View
                      style={{
                        marginLeft: Sizes.ScreenPadding,
                        flex: 1,
                        height: 20,
                        borderRadius: Sizes.Radius,
                        // width: 200,
                        backgroundColor: Colors.Primary2 + 90,
                      }}></View>
                  </View>
                </View>
              </Shimmer>
            )}></FlatList>
        ) : tasks.length !== 0 || completedTasks.length != 0 ? (
          <View style={{marginBottom: Sizes.Padding}}>
            {tasks.length != 0 && (
              <Text
                style={{
                  ...Fonts.Medium2,
                  color: Colors.PrimaryText,
                  marginTop: Sizes.Radius,
                  marginLeft: Sizes.ScreenPadding,
                }}>
                {`Pending ${tasks.length}`}
              </Text>
            )}
            <FlatList
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  colors={[Colors.Primary, Colors.Primary]}
                  onRefresh={() => {
                    getTasks();
                  }}
                />
              }
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
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  colors={[Colors.Primary, Colors.Primary]}
                  onRefresh={() => {
                    getTasks();
                  }}
                />
              }
              data={completedTasks}
              contentContainerStyle={{marginBottom: Sizes.ScreenPadding}}
              renderItem={renderTask}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        ) : (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>no tasks</Text>
          </View>
        )}
      </ScrollView>

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
                style={{flex: 1, borderColor: Colors.Secondary}}
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
              <View style={{width: 16}}></View>
              <TextButton
                style={{flex: 1}}
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
    </View>
  );
};

export default WeeklyCalender;
