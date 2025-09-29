import {
  View,
  Text,
  TouchableOpacity,
  Animated as RNAnimated,
  ScrollView,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {apiPost, apiPut, useSelector} from '../../Modules';
import {Header, Icon, Modal, TextButton} from '../../Components';
import {StackProps} from '../../routes';
import FloatingAdd from '../../Components/FloatingAdd';
import AddTodoTask from './AddTodoTask';
import moment from 'moment';
import Animated, {
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
import {Checkbox} from 'react-native-paper';
import {WEEKLY_PLANNER_INTERFACE} from '../../Modules/interface';
import {checklist} from '../../../assets';

type Props = StackProps<'TodoList'>;
const TodoList = ({navigation}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {member} = useSelector(state => state.member);
  const [openAddModal, setAddOpenModal] = useState(false);
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
  const [deleteItem, setDeleteItem] = useState<any>([]);
  const [isDeleteItem, setIsDeleteItem] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectDeleteAllItem, setSelectDeleteAllItem] = useState(false);

  const offset = useSharedValue(70);
  const animationStyle = useAnimatedStyle(() => ({
    transform: [{translateX: offset.value}],
  }));
  useEffect(() => {
    getTasks();
  }, []);
  useEffect(() => {
    offset.value = withRepeat(
      withTiming(-offset.value, {duration: 1500}),
      -1,
      true,
    );
  }, []);
  const getTasks = async () => {
    const date = moment(selectedDate).format('YYYY-MM-DD HH:mm:ss');
    try {
      const res = await apiPost('api/memberTodo/get', {
        filter: ` AND TYPE = 'TD' AND DATE(CREATED_DATETIME) = "${date}" AND MEMBER_ID = ${member?.ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        // console.log('\n\n\nres....',res)
        setLoadingData(false);
        const data = res.data.map((item: any) => ({
          ...item,
          SHOW_ICON: true,
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
      const convertData =
        selectedTaskIndex?.DESCRIPTION.length > 0
          ? JSON.parse(selectedTaskIndex?.DESCRIPTION)
          : selectedTaskIndex?.DESCRIPTION;

      const changeData =
        selectedTaskIndex?.DESCRIPTION.length > 0
          ? convertData.map((item: any) => {
              if (selectMainTask) {
                return {...item, status: 1};
              } else if (item.text === selectSubPointItem.text) {
                return {...item, status: 1};
              } else {
                return item;
              }
            })
          : '';

      const updateStatus =
        selectedTaskIndex?.DESCRIPTION.length > 0
          ? convertData.filter((item: any) => item.status === 0).length === 1
          : true;

      let body = {
        MEMBER_ID: member?.ID,
        ID: selectedTaskIndex?.ID,
                CREATED_DATETIME: moment(selectedTaskIndex?.CREATED_DATETIME ? selectedTaskIndex?.CREATED_DATETIME: new Date()).format('YYYY-MM-DD HH:mm:ss'),
//        CREATED_DATETIME: selectedTaskIndex?.CREATED_DATETIME,
        TITLE: selectedTaskIndex?.TITLE,
        DESCRIPTION: changeData ? JSON.stringify(changeData) : changeData,
        IS_REMIND: selectedTaskIndex?.IS_REMIND,
        REMIND_DATETIME: moment(selectedTaskIndex?.REMIND_DATETIME).format('YYYY-MM-DD HH:mm:ss'),
        REMIND_TYPE: selectedTaskIndex?.REMIND_TYPE,
        IS_COMPLETED: updateStatus || selectMainTask ? 1 : 0,
        STATUS: 1,
        CLIENT_ID: 1,
        TYPE: selectedTaskIndex?.TYPE,
      };
      // console.log('\n\n\n..body..', body);
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

  const DeleteTask = async () => {
    setLoaading(true);
    try {
      let body = deleteItem.map((item: any) => {
        return item.ID;
      });
      console.log('\n\n...body...', body);
      const res = await apiPost('api/memberTodo/remove', {IDS: body});
      if (res && res.code == 200) {
        setDeleteItem([]);
        setLoaading(false);
        setIsDeleteItem(false);
        setOpenDeleteModal(false);
        getTasks();
      }
    } catch (error) {
      console.log('err,,,', error);
    }
  };
  const toggleDeleteItem = (item: WEEKLY_PLANNER_INTERFACE) => {
    setDeleteItem((prevData: WEEKLY_PLANNER_INTERFACE[]) => {
      const existingIndex = prevData.findIndex(
        (it: WEEKLY_PLANNER_INTERFACE) => it.ID === item.ID,
      );
      if (existingIndex !== -1) {
        const updatedData = [...prevData];
        updatedData.splice(existingIndex, 1);
        return updatedData;
      } else {
        return [...prevData, item];
      }
    });
  };
  const renderTask = ({item, index}: any) => {
    const deletePosition = new RNAnimated.Value(0);
    const swipeStyle = {
      transform: [{translateX: deletePosition}],
    };
    const isItemInDeleteList = deleteItem.some(
      (deleteIt: any) => deleteIt.ID === item.ID,
    );
    const taskStyle = {
      backgroundColor: isItemInDeleteList ? '#ADD8E6' : Colors.White,
    };
    const iconStyle = {
      transform: [{translateX: deletePosition}],
    };
    const convertData =
      item.DESCRIPTION.length > 0
        ? JSON.parse(item.DESCRIPTION)
        : item.DESCRIPTION;
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
              if (isDeleteItem && deleteItem.length > 0) {
                toggleDeleteItem(item);
              } else if (item.IS_COMPLETED === 0) {
                setAddOpenModal(true);
                setSelectedTaskIndex(item);
              }
            }}
            onLongPress={() => {
              setSelectedTaskIndex(item);
              setIsDeleteItem(true);
              setDeleteItem((prevData: any) => [...prevData, item]);
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
                {isDeleteItem ? (
                  <View style={{padding: Sizes.Radius}}>
                    <Icon
                      name="menu"
                      type="Entypo"
                      size={18}
                      color={Colors.PrimaryText2}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      transform: [{scale: 0.8}],
                    }}>
                    <Checkbox
                      uncheckedColor={Colors.PrimaryText}
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
                )}
                <Text style={{color: Colors.PrimaryText1, ...Fonts.Medium2}}>
                  {item.TITLE}
                </Text>
              </View>
              {
                <View
                  style={{
                    alignItems: 'center',
                    marginRight: Sizes.Padding,
                    flexDirection: 'row',
                  }}>
                  {item.DESCRIPTION.length > 0 && (
                    <Text style={{...Fonts.Medium3, color: Colors.PrimaryText}}>
                      {statusOneCount + '/' + convertData.length}
                    </Text>
                  )}
                  {isDeleteItem && isItemInDeleteList ? (
                    <RNAnimated.View
                      style={[
                        iconStyle,
                        {
                          height: 18,
                          width: 18,
                          borderRadius: 9,
                          backgroundColor: Colors.Primary,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginLeft: 8,
                          marginBottom: Sizes.Base,
                        },
                      ]}>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {}}
                        style={{
                          height: 18,
                          width: 18,
                          borderRadius: 9,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {isItemInDeleteList && (
                          <Icon
                            name={'check'}
                            type="AntDesign"
                            size={14}
                            color={Colors.White}
                          />
                        )}
                      </TouchableOpacity>
                    </RNAnimated.View>
                  ) : (
                    item.DESCRIPTION.length > 0 && (
                      <RNAnimated.View
                        style={[
                          iconStyle,
                          {
                            height: 18,
                            width: 18,
                            borderRadius: 9,
                            backgroundColor: '#ADD8E6',
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
                            color={Colors.Primary}
                          />
                        </TouchableOpacity>
                      </RNAnimated.View>
                    )
                  )}
                </View>
              }
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
                          transform: [{scale: 0.7}],
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
        </RNAnimated.View>
      </Animatable.View>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: '#EAEDED'}}>
      <Header
        label="Todo List"
        onBack={() => {
          navigation.goBack();
        }}
      />
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          {isDeleteItem && deleteItem.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: Sizes.Padding,
                marginHorizontal: Sizes.Padding,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{flex: 0.1}}
                onPress={() => {
                  setSelectDeleteAllItem(!selectDeleteAllItem);
                  if (selectDeleteAllItem) {
                    setDeleteItem([]);
                    const mergedArray = [...tasks, ...completedTasks];
                    setDeleteItem(mergedArray);
                  } else {
                    setDeleteItem([]);
                  }
                }}>
                <Image
                  source={checklist}
                  style={{height: 27, width: 32, marginBottom: 4}}
                />
              </TouchableOpacity>
              <View style={{flex: 0.8}}>
                <Text
                  style={{
                    ...Fonts.Medium2,
                    color: Colors.PrimaryText1,
                    textAlign: 'center',
                  }}>
                  {`${deleteItem.length} ${
                    deleteItem.length > 1 ? 'items' : 'item'
                  } selected`}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{flex: 0.1}}
                onPress={() => {
                  setDeleteItem([]);
                  setIsDeleteItem(false);
                }}>
                <Icon
                  name="close"
                  type="AntDesign"
                  size={18}
                  color={Colors.PrimaryText1}
                />
              </TouchableOpacity>
            </View>
          )}
          <ScrollView showsVerticalScrollIndicator={false}>
            {loadingData ? (
              <ActivityIndicator color={Colors.Primary} />
            ) : tasks.length !== 0 || completedTasks.length != 0 ? (
              <View style={{marginVertical: Sizes.Padding}}>
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
                      fontSize: 11,
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
        {isDeleteItem && deleteItem.length > 0 ? (
          <View
            style={{
              //   backgroundColor: '#E5E7E9',
              backgroundColor: Colors.White,
              elevation: 13,
            }}>
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
                onPress={() => {
                  setOpenDeleteModal(true);
                }}
              />
              <Text
                onPress={() => {
                  setOpenDeleteModal(true);
                  //   handleSwipe();
                }}
                style={{
                  ...Fonts.Regular2,
                  color: Colors.PrimaryText1,
                  marginTop: Sizes.Base,
                }}>
                Delete
              </Text>
            </View>
          </View>
        ) : (
          <FloatingAdd
            onPress={() => {
              setSelectedTaskIndex(null);
              setAddOpenModal(true);
            }}
          />
        )}
      </View>
      {openAddModal && (
        <AddTodoTask
          visible={openAddModal}
          onClose={() => {
            setAddOpenModal(false);
          }}
          onSuccess={() => {
            setAddOpenModal(false);
            setLoadingData(true);
            getTasks();
          }}
          item={selectedTaskIndex}
        />
      )}
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
      {openDeleteModal && (
        <Modal
          isVisible={openDeleteModal}
          onClose={() => {
            setOpenDeleteModal(false);
          }}
          containerStyle={{justifyContent: 'flex-end'}}
          style={{borderRadius: Sizes.Padding}}>
          <View style={{}}>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Bold2,
                textAlign: 'center',
              }}>
              {`Delete ${deleteItem.length} ${
                deleteItem.length > 1 ? 'Tasks' : 'Task'
              }?`}
            </Text>
            <View style={{flexDirection: 'row', marginTop: Sizes.Padding}}>
              <TextButton
                isBorder
                style={{flex: 1, borderColor: Colors.Secondary}}
                label="Cancel"
                loading={false}
                onPress={() => setOpenDeleteModal(false)}
              />
              <View style={{width: Sizes.Radius}} />
              <TextButton
                style={{flex: 1}}
                label="Delete"
                loading={loading}
                onPress={() => {
                  DeleteTask();
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default TodoList;
