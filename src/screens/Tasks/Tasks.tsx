import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated as RNAnimated,
  Image,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Header, Icon, Modal, TextButton, Toast} from '../../Components';
import CalendarComponent from './CalendarComponent ';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';
import Animated, {
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {Checkbox, RadioButton} from 'react-native-paper';
import {apiPost, apiPut, useSelector} from '../../Modules';
import FloatingAdd from '../../Components/FloatingAdd';
import {StackProps} from '../../routes';
import {WEEKLY_PLANNER_INTERFACE} from '../../Modules/interface';
import Shimmer from 'react-native-shimmer';

type Props = StackProps<'Tasks'>;
const Tasks = ({navigation}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoaading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] =
    useState<WEEKLY_PLANNER_INTERFACE>();
  const [completedTasks, setCompletedTasks] = useState([]);
  const formattedDate = moment(new Date()).format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(formattedDate);
  const [selectMainTask, setSelectMainTask] = useState(false);
  const [selectSubPointItem, setSelectSubPointItem] = useState({
    text: '',
    status: 0,
  });
  const [deleteItem, setDeleteItem] = useState(false);

  const offset = useSharedValue(70);
  const animationStyle = useAnimatedStyle(() => ({
    transform: [{translateX: offset.value}],
  }));
  useFocusEffect(
    React.useCallback(() => {
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

  const {member} = useSelector(state => state.member);

  const getTasks = async () => {
    const date = moment(selectedDate).format('YYYY-MM-DD HH:mm:ss');
    try {
      const res = await apiPost('api/memberTodo/get', {
        filter: ` AND TYPE = 'TD' AND DATE(CREATED_DATETIME) = "${date}" AND MEMBER_ID = ${member?.ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        setLoadingData(false);
        const data = res.data.map((item: any) => ({
          ...item,
          SHOW_ICON: false,
        }));
        const pending = data.filter((task: any) => task.IS_COMPLETED === 0);
        const completed = data.filter((task: any) => task.IS_COMPLETED === 1);
        setTasks(pending);
        setCompletedTasks(completed);
      }
    } catch (error) {
      console.log('err,,,///', error);
    }
  };
  const CompleteTask = async () => {
    setLoaading(true);
    try {
      const convertData = JSON.parse(selectedTaskIndex?.DESCRIPTION);
      const changeData = convertData.map((item: any) => {
        if (selectMainTask) {
          return {...item, status: 1};
        } else if (item.text === selectSubPointItem.text) {
          return {...item, status: 1};
        } else {
          return item;
        }
      });
      const updateStatus =
        convertData.filter((item: any) => item.status === 0).length === 1;
      let body = {
        MEMBER_ID: member?.ID,
        ID: selectedTaskIndex?.ID,
        CREATED_DATETIME: moment(selectedTaskIndex?.CREATED_DATETIME ? selectedTaskIndex?.CREATED_DATETIME: new Date()).format('YYYY-MM-DD HH:mm:ss'),
        // CREATED_DATETIME: selectedTaskIndex?.CREATED_DATETIME,
        TITLE: selectedTaskIndex?.TITLE,
        DESCRIPTION: JSON.stringify(changeData),
        IS_REMIND: selectedTaskIndex?.IS_REMIND,
        REMIND_DATETIME: moment(selectedTaskIndex?.REMIND_DATETIME).format('YYYY-MM-DD HH:mm:ss'),
        REMIND_TYPE: selectedTaskIndex?.REMIND_TYPE,
        IS_COMPLETED: updateStatus || selectMainTask ? 1 : 0,
        STATUS: 1,
        CLIENT_ID: 1,
        TYPE: selectedTaskIndex?.TYPE,
      };
      const res = await apiPut('api/memberTodo/update', body);
      if (res && res.code == 200) {
        getTasks();
        setLoaading(false);
        setOpenAlert(false);
      }
    } catch (error) {
      setLoaading(false);
      console.log('err,,,....', error);
    }
  };
  const DeleteTask = async (item: any) => {
    try {
      let body = {
        MEMBER_ID: member?.ID,
        ID: item?.ID,
        // CREATED_DATETIME: item?.CREATED_DATETIME,
        CREATED_DATETIME: moment( item?.CREATED_DATETIME ?  item?.CREATED_DATETIME: new Date()).format('YYYY-MM-DD HH:mm:ss'),
        TITLE: item?.TITLE,
        DESCRIPTION: item?.DESCRIPTION,
        IS_REMIND: item?.IS_REMIND,
        REMIND_DATETIME: moment(item?.REMIND_DATETIME).format('YYYY-MM-DD HH:mm:ss'),
        REMIND_TYPE: item?.REMIND_TYPE,
        IS_COMPLETED: item.IS_COMPLETED,
        STATUS: 0,
        CLIENT_ID: 1,
        TYPE: item.TYPE,
      };
      const res = await apiPut('api/memberTodo/update', body);
      if (res && res.code == 200) {
        setDeleteItem(false);
        getTasks();
      }
    } catch (error) {
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
        DeleteTask(selectedTaskIndex);
      });
    };
    const swipeStyle = {
      transform: [{translateX: deletePosition}],
    };
    const taskStyle = {
      backgroundColor: item.IS_COMPLETED == 1 ? '#C8E6C9' : Colors.White,
    };
    const iconStyle = {
      transform: [{translateX: deletePosition}],
    };
    const convertData = JSON.parse(item.DESCRIPTION);
    const sortedData = [...convertData].sort((a, b) => a.status - b.status);
    const statusOneCount = sortedData.filter(item => item.status === 1).length;
    const toggleIcon = (itemId: number, isPending: boolean) => {
      if (isPending) {
        const updatedItems: any = tasks.map((item: any) =>
          item.ID === itemId ? {...item, SHOW_ICON: !item.SHOW_ICON} : item,
        );
        setTasks(updatedItems);
      } else {
        const updatedItems: any = completedTasks.map((item: any) =>
          item.ID === itemId ? {...item, SHOW_ICON: !item.SHOW_ICON} : item,
        );
        setCompletedTasks(updatedItems);
      }
    };
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
              elevation: 5,
              shadowColor: 'blue',
              marginHorizontal: Sizes.ScreenPadding,
              ...taskStyle,
            },
          ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              borderRadius: Sizes.Radius,
              paddingTop: Sizes.Base,
            }}
            onPress={() => {
              moment(item.CREATED_DATETIME).startOf('day') <
              moment(new Date()).startOf('day')
                ? null
                : item.IS_COMPLETED == 0
                ? navigation.navigate('AddTaskForm', {
                    item,
                    type: 'U',
                    pageType: 'T',
                  })
                : null;
            }}
            onLongPress={() => {
              setSelectedTaskIndex(item);
              setDeleteItem(true);
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: Sizes.Base,
                }}>
                <View
                  style={{
                    transform: [{scale: 0.8}],
                  }}>
                  <Checkbox
                    uncheckedColor={Colors.PrimaryText1}
                    color={Colors.Primary}
                    onPress={() => {
                      setOpenAlert(true);
                      setSelectMainTask(true);
                      setSelectedTaskIndex(item);
                    }}
                    status={item.IS_COMPLETED === 1 ? 'checked' : 'unchecked'}
                    disabled={
                      item.IS_COMPLETED == 0
                        ? moment(item.CREATED_DATETIME).startOf('day') <
                          moment(new Date()).startOf('day')
                          ? true
                          : false
                        : true
                    }
                  />
                </View>
                <Text style={{color: Colors.PrimaryText1, ...Fonts.Medium2}}>
                  {item.TITLE}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  marginRight: Sizes.Padding,
                  flexDirection: 'row',
                }}>
                <Text style={{...Fonts.Medium3, color: Colors.PrimaryText}}>
                  {statusOneCount + '/' + convertData.length}
                </Text>
                {sortedData.length > 0 && (
                  <RNAnimated.View
                    style={[
                      iconStyle,
                      {
                        height: 18,
                        width: 18,
                        borderRadius: 9,
                        backgroundColor: '#CCD1D1',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 8,
                        marginBottom: Sizes.Base,
                      },
                    ]}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => {
                        toggleIcon(
                          item.ID,
                          item.IS_COMPLETED == 0 ? true : false,
                        );
                      }}
                      style={{
                        height: 18,
                        width: 18,
                        borderRadius: 9,
                      }}>
                      <Icon
                        name={
                          item.SHOW_ICON
                            ? 'chevron-small-down'
                            : 'chevron-small-up'
                        }
                        type="Entypo"
                        size={18}
                      />
                    </TouchableOpacity>
                  </RNAnimated.View>
                )}
              </View>
            </View>
            {sortedData.map((it: any) => {
              return (
                <View>
                  {item.SHOW_ICON && (
                    <Animated.View
                      entering={FadeInUp}
                      exiting={FadeOutUp}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: Sizes.ScreenPadding,
                        marginTop: -Sizes.Radius,
                      }}>
                      <View
                        style={{
                          transform: [{scale: 0.8}],
                        }}>
                        <Checkbox
                          uncheckedColor={Colors.PrimaryText}
                          color={Colors.Primary}
                          onPress={() => {
                            setOpenAlert(true);
                            setSelectMainTask(false);
                            setSelectSubPointItem(it);
                            setSelectedTaskIndex(item);
                          }}
                          status={it.status === 1 ? 'checked' : 'unchecked'}
                          disabled={it.status === 1 ? true : false}
                        />
                      </View>
                      <Text
                        style={{
                          color: Colors.PrimaryText,
                          ...Fonts.Medium3,
                        }}>
                        {it.text}
                      </Text>
                    </Animated.View>
                  )}
                </View>
              );
            })}
          </TouchableOpacity>

          {openAlert && (
            <Modal
              onClose={() => {
                setOpenAlert(false);
              }}
              isVisible={openAlert}>
              <View style={{}}>
                <Text style={{color: Colors.PrimaryText1, ...Fonts.Bold2}}>
                  Are you sure mark as Complete?
                </Text>
                <Text style={{color: Colors.PrimaryText1, ...Fonts.Medium3}}>
                  You are unable to Change it later.
                </Text>
                <View style={{flexDirection: 'row', marginTop: Sizes.Padding}}>
                  <TextButton
                    isBorder
                    style={{flex: 1, borderColor: Colors.Secondary}}
                    label="Cancel"
                    loading={false}
                    onPress={() => setOpenAlert(false)}
                  />
                  <View style={{width: 16}} />
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
          {deleteItem && (
            <Modal
              isVisible={deleteItem}
              onClose={() => {
                setDeleteItem(false);
              }}
              containerStyle={{justifyContent: 'flex-end'}}
              style={{margin: 0, borderRadius: 0}}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: Sizes.Padding,
                }}>
                <Icon
                  name="delete"
                  type="AntDesign"
                  color={Colors.PrimaryText1}
                  size={25}
                  onPress={handleSwipe}
                />
                <Text
                  onPress={() => {
                    setDeleteItem(false);
                    handleSwipe();
                  }}
                  style={{
                    ...Fonts.Regular2,
                    color: Colors.PrimaryText1,
                    marginTop: Sizes.Base,
                  }}>
                  Delete
                </Text>
              </View>
            </Modal>
          )}
        </RNAnimated.View>
      </Animatable.View>
      // <Animatable.View
      //   animation={'fadeInUp'}
      //   duration={1000}
      //   delay={index * 100}>
      //   <RNAnimated.View
      //     style={[
      //       swipeStyle,
      //       {
      //         margin: Sizes.Base,
      //         marginBottom: Sizes.Padding,
      //         borderRadius: Sizes.Radius,
      //         padding: Sizes.Radius,
      //         elevation: 8,
      //         shadowColor: 'blue',
      //         marginHorizontal: Sizes.ScreenPadding,
      //         ...taskStyle,
      //       },
      //     ]}>
      //     <TouchableOpacity
      //       activeOpacity={0.8}
      //       onPress={() => {}}
      //       style={{
      //         justifyContent: 'center',
      //       }}>
      //       <View
      //         style={{
      //           flexDirection: 'row',
      //           alignItems: 'center',
      //           margin: -Sizes.Base,
      //         }}>
      //         <View
      //           style={{
      //             transform: [{scale: 0.9}],
      //           }}>
      //           <Checkbox
      //             disabled={
      //               item.IS_COMPLETED == 0
      //                 ? moment(item.CREATED_DATETIME).startOf('day') <
      //                   moment(new Date()).startOf('day')
      //                   ? true
      //                   : false
      //                 : true
      //             }
      //             uncheckedColor={Colors.Primary2}
      //             color={Colors.Primary}
      //             status={item.IS_COMPLETED === 1 ? 'checked' : 'unchecked'}
      //             onPress={() => {
      //               setOpenAlert(true);
      //               setSelectedTaskIndex(item);
      //             }}
      //           />
      //         </View>

      //         <View
      //           style={{
      //             marginLeft: 4,
      //             paddingRight: Sizes.ScreenPadding,
      //           }}>
      //           <Text style={{color: Colors.PrimaryText1, ...Fonts.Medium2}}>
      //             {item.TITLE}
      //           </Text>
      //         </View>
      //       </View>
      //       {item.DESCRIPTION && (
      //         <Text
      //           style={{
      //             marginLeft: 35,
      //             color: Colors.PrimaryText,
      //             ...Fonts.Medium3,
      //           }}>
      //           {item.DESCRIPTION}
      //         </Text>
      //       )}

      //       <View style={{flexDirection: 'row', marginTop: 4}}>
      //         <Icon
      //           name={
      //             item.REMIND_TYPE == 'P' ? 'bell-ring-outline' : 'time-outline'
      //           }
      //           type={
      //             item.REMIND_TYPE == 'P'
      //               ? 'MaterialCommunityIcons'
      //               : 'Ionicons'
      //           }
      //           size={19}
      //           color={Colors.Primary}
      //         />
      //         <Text
      //           style={{
      //             ...Fonts.Medium2,
      //             marginLeft: Sizes.Radius,
      //             color: Colors.PrimaryText,
      //             fontSize: 11,
      //           }}>
      //           {moment(item.CREATED_DATETIME).format('hh:mm A')}
      //         </Text>
      //       </View>
      //     </TouchableOpacity>

      //     {item.IS_COMPLETED != 1 && (
      //       <View
      //         style={{
      //           flexDirection: 'row',
      //           position: 'absolute',
      //           top: Sizes.Radius,
      //           right: Sizes.Base,
      //         }}>
      //         {moment(item.CREATED_DATETIME).startOf('day') <
      //         moment(new Date()).startOf('day') ? null : (
      //           <TouchableOpacity
      //             activeOpacity={0.8}
      //             style={{marginRight: Sizes.Padding}}
      //             onPress={() => {
      //               item.IS_COMPLETED == 0
      //                 ? navigation.navigate('AddTaskForm', {
      //                     item,
      //                     type: 'U',
      //                     pageType: 'T',
      //                   })
      //                 : null;
      //             }}>
      //             <Icon
      //               name="edit"
      //               type="MaterialIcons"
      //               size={18}
      //               color={Colors.Primary}
      //             />
      //           </TouchableOpacity>
      //         )}
      //         {moment(item.CREATED_DATETIME).startOf('day') <
      //         moment(new Date()).startOf('day') ? null : (
      //           <TouchableOpacity
      //             activeOpacity={0.8}
      //             style={{}}
      //             onPress={handleSwipe}>
      //             <Icon
      //               name="delete"
      //               type="MaterialIcons"
      //               size={18}
      //               color={Colors.Primary}
      //             />
      //           </TouchableOpacity>
      //         )}
      //       </View>
      //     )}

      //     <Modal
      //       onClose={() => {
      //         setOpenAlert(false);
      //       }}
      //       isVisible={openAlert}>
      //       <View style={{}}>
      //         <Text style={{color: Colors.PrimaryText1, ...Fonts.Bold2}}>
      //           Are you sure mark as Complete?
      //         </Text>
      //         <Text style={{color: Colors.PrimaryText1, ...Fonts.Medium3}}>
      //           Are You sure mark that Task as done, you are unable to Change it
      //           later.
      //         </Text>
      //         <View style={{flexDirection: 'row', marginTop: Sizes.Padding}}>
      //           <TextButton
      //             isBorder
      //             style={{flex: 1, borderColor: Colors.Secondary}}
      //             label="Cancel"
      //             loading={false}
      //             onPress={() => setOpenAlert(false)}
      //           />
      //           <View style={{width: 16}}></View>
      //           <TextButton
      //             style={{flex: 1}}
      //             label="Save"
      //             loading={loading}
      //             onPress={() => CompleteTask()}
      //           />
      //         </View>
      //       </View>
      //     </Modal>
      //   </RNAnimated.View>
      // </Animatable.View>
    );
  };
  const handleDatePress = (date: any) => {
    setSelectedDate(date);
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

  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Header
        label="ToDo List"
        onBack={() => navigation.goBack()}
        rightChild={
          <Icon
            name="calendar"
            type="EvilIcons"
            size={32}
            color={Colors.White}
            onPress={() => {
              navigation.navigate('CustomCalendar', {animation: 'Flip'});
            }}
          />
        }
      />

      <Text
        style={{
          color: Colors.Primary,
          ...Fonts.Bold1,
          fontSize: Sizes.ScreenPadding,
          marginTop: Sizes.Padding,
          marginLeft: Sizes.ScreenPadding,
        }}>
        {moment(selectedDate).format('MMM yyyy')}
      </Text>

      <View style={{flex: 1}}>
        <CalendarComponent
          dates={generateWeekDates()}
          onDatePress={handleDatePress}
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
                    color: Colors.PrimaryText,
                    ...Fonts.Medium2,
                    marginTop: Sizes.Radius,
                    marginLeft: Sizes.ScreenPadding,
                  }}>
                  {`Pending (${tasks.length})`}
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
                  {`Completed (${completedTasks.length})`}
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
            <Animated.View
              style={[{flex: 1, alignItems: 'center'}, animationStyle]}>
              <Image
                source={require('../../../assets/images/noTasks.png')}
                style={{height: 250, width: 250}}
              />
            </Animated.View>
          )}
        </ScrollView>
      </View>

      {/* <TouchableOpacity
        onPress={() =>
          navigation.navigate('AddTaskForm', {item: null, type: 'C'})
        }
        style={{
          position: 'absolute',
          alignSelf: 'center',
          bottom: Sizes.ScreenPadding,
          elevation: 10,
        }}>
        <LottieView
          source={require('../../../assets/LottieAnimation/addButton.json')}
          style={{
            height: 70,
            width: 70,
            alignSelf: 'center',
            // borderRadius: 100,
          }}
          autoPlay={true}
        />
      </TouchableOpacity> */}

      <FloatingAdd
        onPress={() => {
          navigation.navigate('AddTaskForm', {
            item: null,
            type: 'C',
            pageType: 'T',
          });
        }}
      />
    </View>
  );
};

export default Tasks;
