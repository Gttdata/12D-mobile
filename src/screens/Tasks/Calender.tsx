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
import {Header, Icon, Modal, TextButton} from '../../Components';
import {useTranslation} from 'react-i18next';
import {apiPost, apiPut, useSelector} from '../../Modules';
import {ActivityIndicator, Checkbox} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {StackProps} from '../../routes';
import Animated, {FadeInUp, FadeOutUp} from 'react-native-reanimated';
import Shimmer from 'react-native-shimmer';

type Props = StackProps<'CustomCalendar'>;
const CustomCalendar = ({navigation}: Props) => {
  const {t} = useTranslation();
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);

  const [selected, setSelected] = useState<any>(new Date());
  const [tasks, setTasks] = useState([]);
  const [tasksDates, setTasksDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<any>(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const {member} = useSelector(state => state.member);
  const [selectMainTask, setSelectMainTask] = useState(false);
  const [selectSubPointItem, setSelectSubPointItem] = useState({
    text: '',
    status: 0,
  });
  const [deleteItem, setDeleteItem] = useState(false);
  useEffect(() => {
    getAllTasks();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      getTasks();
    }, [navigation, selected]),
  );

  const getTasks = async () => {
    const date = moment(selected).format('YYYY-MM-DD 00:00:00');
    try {
      const res = await apiPost('api/memberTodo/get', {
        filter: ` AND TYPE = 'TD' AND  DATE(CREATED_DATETIME) = "${date}" AND MEMBER_ID = ${member?.ID} AND STATUS = 1`,
      });
      if (res && res.code == 200) {
        setLoadingData(false);
        const pending = res.data.filter((task: any) => task.IS_COMPLETED === 0);
        const completed = res.data.filter(
          (task: any) => task.IS_COMPLETED === 1,
        );
        setTasks(pending);
        setCompletedTasks(completed);
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
        filter: ` AND TYPE = 'TD' AND MEMBER_ID = ${member?.ID} AND STATUS=1`,
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
        // CREATED_DATETIME: selectedTaskIndex?.CREATED_DATETIME,
        TITLE: selectedTaskIndex?.TITLE,
        DESCRIPTION: selectedTaskIndex?.DESCRIPTION,
        IS_REMIND: selectedTaskIndex?.IS_REMIND,
        REMIND_DATETIME: moment(selectedTaskIndex?.REMIND_DATETIME).format('YYYY-MM-DD HH:mm:ss'),
        REMIND_TYPE: selectedTaskIndex?.REMIND_TYPE,
        IS_COMPLETED: 1,
        STATUS: 1,
        CLIENT_ID: 1,
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
  const DeleteTask = async (item: any) => {
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
    );
  };

  // const renderTask = ({item, index}: any) => {
  //   const deletePosition = new RNAnimated.Value(0);
  //   const handleSwipe = () => {
  //     RNAnimated.timing(deletePosition, {
  //       toValue: 500,
  //       duration: 500,
  //       useNativeDriver: true,
  //     }).start(() => {
  //       DeleteTask(item);
  //     });
  //   };

  //   const swipeStyle = {
  //     transform: [{translateX: deletePosition}],
  //   };

  //   const taskStyle = {
  //     backgroundColor: item.IS_COMPLETED == 1 ? '#C8E6C9' : Colors.White,
  //   };

  //   return (
  //     <Animatable.View
  //       animation={'fadeInUp'}
  //       duration={1000}
  //       delay={index * 100}>
  //       <RNAnimated.View
  //         style={[
  //           swipeStyle,
  //           {
  //             margin: Sizes.Base,
  //             marginBottom: Sizes.Padding,
  //             borderRadius: Sizes.Radius,
  //             padding: Sizes.Radius,
  //             elevation: 8,
  //             shadowColor: 'blue',
  //             marginHorizontal: Sizes.ScreenPadding,
  //             ...taskStyle,
  //           },
  //         ]}>
  //         <TouchableOpacity
  //           activeOpacity={0.8}
  //           onPress={() => {}}
  //           style={{
  //             justifyContent: 'center',
  //           }}>
  //           <View
  //             style={{
  //               flexDirection: 'row',
  //               alignItems: 'center',
  //               margin: -Sizes.Base,
  //             }}>
  //             <View
  //               style={{
  //                 transform: [{scale: 0.9}],
  //               }}>
  //               <Checkbox
  //                 disabled={
  //                   item.IS_COMPLETED == 0
  //                     ? moment(item.CREATED_DATETIME).startOf('day') <
  //                       moment(new Date()).startOf('day')
  //                       ? true
  //                       : false
  //                     : true
  //                 }
  //                 uncheckedColor={Colors.Primary2}
  //                 color={Colors.Primary}
  //                 status={item.IS_COMPLETED === 1 ? 'checked' : 'unchecked'}
  //                 onPress={() => {
  //                   setOpenAlert(true);
  //                   setSelectedTaskIndex(item);
  //                 }}
  //               />
  //             </View>

  //             <View
  //               style={{
  //                 marginLeft: 3,
  //                 paddingRight: Sizes.ScreenPadding,
  //               }}>
  //               <Text style={{color: Colors.PrimaryText1, ...Fonts.Medium2}}>
  //                 {item.TITLE}
  //               </Text>
  //             </View>
  //           </View>
  //           {item.DESCRIPTION && (
  //             <Text
  //               style={{
  //                 marginLeft: 35,
  //                 color: Colors.PrimaryText,
  //                 ...Fonts.Medium3,
  //               }}>
  //               {item.DESCRIPTION}
  //             </Text>
  //           )}

  //           <View style={{flexDirection: 'row', margin: 4}}>
  //             <Icon
  //               name={
  //                 item.REMIND_TYPE == 'P' ? 'bell-ring-outline' : 'time-outline'
  //               }
  //               type={
  //                 item.REMIND_TYPE == 'P'
  //                   ? 'MaterialCommunityIcons'
  //                   : 'Ionicons'
  //               }
  //               size={19}
  //               color={Colors.Primary}
  //             />
  //             <Text
  //               style={{
  //                 marginLeft: Sizes.Radius,
  //                 color: Colors.PrimaryText,
  //                 ...Fonts.Medium2,
  //                 fontSize: 11,
  //               }}>
  //               {moment(item.CREATED_DATETIME).format('hh:mm A')}
  //             </Text>
  //           </View>
  //         </TouchableOpacity>
  //         {item.IS_COMPLETED != 1 && (
  //           <View
  //             style={{
  //               flexDirection: 'row',
  //               position: 'absolute',
  //               top: Sizes.Radius,
  //               right: Sizes.Base,
  //             }}>
  //             <TouchableOpacity
  //               activeOpacity={0.8}
  //               style={{marginRight: Sizes.Padding}}
  //               onPress={() =>
  //                 navigation.navigate('AddTaskForm', {
  //                   item,
  //                   type: 'U',
  //                   pageType: 'T',
  //                 })
  //               }>
  //               <Icon
  //                 name="edit"
  //                 type="MaterialIcons"
  //                 size={18}
  //                 color={Colors.Primary}
  //               />
  //             </TouchableOpacity>
  //             <TouchableOpacity
  //               activeOpacity={0.8}
  //               style={{}}
  //               onPress={handleSwipe}>
  //               <Icon
  //                 name="delete"
  //                 type="MaterialIcons"
  //                 size={18}
  //                 color={Colors.Primary}
  //               />
  //             </TouchableOpacity>
  //           </View>
  //         )}

  //         <Modal
  //           onClose={() => {
  //             setOpenAlert(false);
  //           }}
  //           isVisible={openAlert}>
  //           <View style={{}}>
  //             <Text style={{color: Colors.PrimaryText1, ...Fonts.Bold2}}>
  //               Are you sure mark as Complete?
  //             </Text>
  //             <Text style={{color: Colors.PrimaryText1, ...Fonts.Medium3}}>
  //               Are You sure mark that Task as done, you are unable to Change it
  //               later.
  //             </Text>
  //             <View style={{flexDirection: 'row', marginTop: Sizes.Padding}}>
  //               <TextButton
  //                 isBorder
  //                 style={{flex: 1, borderColor: Colors.Secondary}}
  //                 label="Cancel"
  //                 loading={false}
  //                 onPress={() => setOpenAlert(false)}
  //               />
  //               <View style={{width: 16}}></View>
  //               <TextButton
  //                 style={{flex: 1}}
  //                 label="Save"
  //                 loading={loading}
  //                 onPress={() => CompleteTask()}
  //               />
  //             </View>
  //           </View>
  //         </Modal>
  //       </RNAnimated.View>
  //     </Animatable.View>
  //   );
  // };

  const generateMarkedDates = (tasks: any) => {
    const markedDates: any = {};

    tasks.forEach((task: any) => {
      const formattedDate: any = moment(task.CREATED_DATETIME).format(
        'YYYY-MM-DD',
      );
      markedDates[formattedDate] = {marked: true};
    });
    return markedDates;
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Header label={t('Tasks.tasks')} onBack={() => navigation.goBack()} />
      <Calendar
        onDayPress={day => {
          setSelected(day.dateString);
        }}
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
                       flex:1,
                       height: 20,
                       borderRadius:Sizes.Radius,
                       // width: 200,
                       backgroundColor: Colors.Primary2 + 90,
                     }}>
                    
                   
                   </View>
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
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>no tasks</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CustomCalendar;
