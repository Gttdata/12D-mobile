import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { StackProps } from '../../routes';
import { apiPost, apiPut, useSelector } from '../../Modules';
import { Header, Icon, Modal, TextButton } from '../../Components';
import FloatingAdd from '../../Components/FloatingAdd';
import AddTodoTask from './AddTodoTask';
import moment from 'moment';
import { checklist } from '../../../assets';
import { Checkbox } from 'react-native-paper';
import { WEEKLY_PLANNER_INTERFACE } from '../../Modules/interface';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BannerAds } from '../../Modules/AdsUtils';

type Props = StackProps<'TodoList'>;
const TodoList = ({ navigation }: Props) => {
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const { member } = useSelector(state => state.member);
  const [modal, setModal] = useState({
    createTask: false,
    isDeleteItem: false,
    openDeleteModal: false,
    selectDeleteAllItem: false,
    deleteLoading: false,
  });
  const [taskData, setTaskData] = useState<any>({
    pending: [],
    completed: [],
    loading: true,
  });
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [deleteItem, setDeleteItem] = useState<any>([]);
  const [searchText, setSearchText] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      getTasks();
    }, [navigation]),
  );

  const getTasks = async () => {
    setTaskData({
      ...taskData,
      loading: true,
    });
    const date = moment(selectedDate).format('YYYY-MM-DD HH:mm:ss');
    const startDate = moment().startOf('month').format('YYYY-MM-DD 00:00:00');
    const yesterdayDate = moment()
      .subtract(1, 'days')
      .format('YYYY-MM-DD HH:mm:ss');
    try {
      const res = await apiPost('api/memberTodo/get', {
        filter: ` AND TYPE = 'TD' AND (DATE(CREATED_DATETIME) = "${date}" OR ((DATE(CREATED_DATETIME) BETWEEN "${startDate}" AND "${yesterdayDate}" AND IS_COMPLETED = 0 ))) AND MEMBER_ID = ${member?.ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        const data = res.data.map((item: any) => ({
          ...item,
          SHOW_ICON: true,
        }));
        const pending = data.filter((task: any) => task.IS_COMPLETED === 0);
        const sortedData = [...data].sort(
          (a, b) => a.IS_COMPLETED - b.IS_COMPLETED,
        );
        const completed = data.filter((task: any) => task.IS_COMPLETED === 1);
        setTaskData({
          ...taskData,
          pending: pending,
          completed: completed,
          loading: false,
        });
      }
    } catch (error) {
      setTaskData({
        ...taskData,
        loading: false,
      });
      console.log('err,,,///', error);
    }
  };
  const CompleteTask = async (item: WEEKLY_PLANNER_INTERFACE) => {
    setTaskData({
      ...taskData,
      loading: true,
    });
    try {
      const convertData =
        item.IS_SUB_TASK == 0
          ? item.DESCRIPTION
          : item.DESCRIPTION.length > 0
            ? JSON.parse(item.DESCRIPTION)
            : '';
      const changeData =
        item.IS_SUB_TASK == 0
          ? item.DESCRIPTION
          : item?.DESCRIPTION.length > 0
            ? convertData.map((it: any) => {
              return { ...it, status: item.IS_COMPLETED == 0 ? 1 : 0 };
            })
            : '';
      let body = {
        MEMBER_ID: member?.ID,
        ID: item.ID,
        CREATED_DATETIME: moment(item?.CREATED_DATETIME ? item?.CREATED_DATETIME : new Date()).format('YYYY-MM-DD HH:mm:ss'),

        // CREATED_DATETIME: item.CREATED_DATETIME,
        TITLE: item.TITLE,
        // Create the body for the API request
        DESCRIPTION:
          item.IS_SUB_TASK == 0
            ? item.DESCRIPTION
            : changeData

              ? JSON.stringify(changeData)
              : changeData,
        IS_REMIND: item.IS_REMIND,
        REMIND_DATETIME:
          item.IS_REMIND == 1 &&
            item.REMIND_DATETIME &&
            moment(item.REMIND_DATETIME).isValid()
            ? moment(item.REMIND_DATETIME).format('YYYY-MM-DD HH:mm:ss')
            : null,
        REMIND_TYPE: item.REMIND_TYPE,
        IS_COMPLETED: item.IS_COMPLETED == 0 ? 1 : 0,
        STATUS: 1,
        CLIENT_ID: 1,
        TYPE: item.TYPE,
        IS_SUB_TASK: item.IS_SUB_TASK,
      };
      console.log('\n\n\n..body..', body);
      const res = await apiPut('api/memberTodo/update', body);
      if (res && res.code == 200) {
        getTasks();
      }
    } catch (error) {
      console.log('err,,,....', error);
    }
    // Make the API request
  };
  const DeleteTask = async () => {
    // Get the tasks again
    setModal({ ...modal, deleteLoading: true });
    try {
      let body = deleteItem.map((item: any) => {
        return item.ID;
      });
      const res = await apiPost('api/memberTodo/remove', { IDS: body });
      if (res && res.code == 200) {
        setDeleteItem([]);
        setModal({ ...modal, deleteLoading: false });
        setModal({ ...modal, isDeleteItem: false, openDeleteModal: false });
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
  const renderTask = ({
    item,
    index,
  }: {
    item: WEEKLY_PLANNER_INTERFACE;
    index: number;
  }) => {
    const isItemInDeleteList = deleteItem.some(
      (deleteIt: any) => deleteIt.ID === item.ID,
    );
    const taskStyle = {
      backgroundColor: isItemInDeleteList
        ? '#ADD8E6'
        : item.IS_COMPLETED === 1
          ? '#EBF5FB'
          : Colors.White,
    };
    const count =
      item.IS_SUB_TASK == 1 &&
      item.DESCRIPTION.length > 0 &&
      JSON.parse(item.DESCRIPTION).filter((desc: any) => desc.status == 1)
        .length;
    return (
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={{
          margin: Sizes.Base,
          marginBottom: Sizes.Radius,
          borderRadius: Sizes.Radius,
          elevation: 5,
          shadowColor: Colors.Primary,
          marginHorizontal: Sizes.ScreenPadding,
          paddingBottom: Sizes.Radius,
          ...taskStyle,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            borderRadius: Sizes.Radius,
            paddingTop: Sizes.Base,
          }}
          onPress={() => {
            if (modal.isDeleteItem && deleteItem.length > 0) {
              toggleDeleteItem(item);
            } else {
              item.IS_SUB_TASK == 1
                ? navigation.navigate('SubTaskList', { item })
                : null;
            }
          }}
          onLongPress={() => {
            setModal({ ...modal, isDeleteItem: true });
            setDeleteItem((prevData: any) => [...prevData, item]);
          }}>
          <Text
            style={{
              ...Fonts.Medium3,
              color: Colors.Primary,
              textAlign: 'right',
              marginRight: Sizes.Padding,
              // marginBottom: -Sizes.Radius,
            }}>
            {moment(item.CREATED_DATETIME).format('DD/MMM/YYYY')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                transform: [{ scale: 1 }],
                paddingLeft: Sizes.Base,
              }}>
              <Checkbox
                uncheckedColor={Colors.PrimaryText}
                color={Colors.Primary}
                onPress={() => {
                  CompleteTask(item);
                }}
                status={item.IS_COMPLETED === 1 ? 'checked' : 'unchecked'}
              />
            </View>
            <Text
              style={{
                color:
                  item.IS_COMPLETED === 1
                    ? Colors.Primary
                    : Colors.PrimaryText1,
                ...Fonts.Medium2,
              }}>
              {item.TITLE}
            </Text>
          </View>
          {item.IS_SUB_TASK == 0 && item.DESCRIPTION && (
            <Text
              style={{
                ...Fonts.Medium3,
                fontSize: 10,
                color: Colors.PrimaryText,
                marginLeft: 36,
                marginTop: -4,
              }}>
              {item.DESCRIPTION}
            </Text>
          )}
          {item.IS_SUB_TASK == 1 && item.DESCRIPTION.length > 0 && (
            <Text
              style={{
                ...Fonts.Medium3,
                fontSize: 10,
                color: Colors.PrimaryText,
                marginLeft: 36,
                marginTop: -4,
              }}>
              {`${count} of ${JSON.parse(item.DESCRIPTION).length} ${count > 1 ? 'tasks' : 'task'
                } completed`}
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#EAEDED' }}>
      <Header
        label="Daily Organizer"
        onBack={() => {
          navigation.goBack();
        }}
        rightChild={
          <Icon
            name="calendar"
            type="EvilIcons"
            size={30}
            color={Colors.White}
            onPress={() => {
              navigation.navigate('TodoCalenderFilter');
            }}
            style={{ marginLeft: Sizes.Radius }}
          />
        }
        onSearch={(txt: any) => {
          setSearchText(txt);
        }}
      />
      {/* <View
        style={{
          flexDirection: 'row',
          margin: Sizes.ScreenPadding,
          marginBottom: 0,
        }}>
        <View style={{flex: 1}}>
          <TextInput
            onChangeText={txt => {
              setSearchText(txt);
              if (txt.length == 0) {
                // setList({data: [], loader: true});
              }
            }}
            value={searchText}
            placeholder={'Search task'}
            rightChild={
              <Icon
                name="search1"
                type="AntDesign"
                style={{paddingRight: Sizes.Padding}}
                onPress={() => {
                  // setList({data: [], loader: true});
                }}
              />
            }
          />
        </View>
      </View> */}
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {modal.isDeleteItem && deleteItem.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: Sizes.Padding,
                marginHorizontal: Sizes.Padding,
                alignItems: 'center',
                marginBottom: -Sizes.Base,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ flex: 0.1 }}
                onPress={() => {
                  setModal({
                    ...modal,
                    selectDeleteAllItem: !modal.selectDeleteAllItem,
                  });
                  if (modal.selectDeleteAllItem) {
                    setDeleteItem([]);
                    setDeleteItem(taskData.pending);
                  } else {
                    setDeleteItem([]);
                  }
                }}>
                <Image
                  source={checklist}
                  style={{ height: 27, width: 32, marginBottom: 4 }}
                />
              </TouchableOpacity>
              <View style={{ flex: 0.8 }}>
                <Text
                  style={{
                    ...Fonts.Medium2,
                    color: Colors.PrimaryText1,
                    textAlign: 'center',
                  }}>
                  {`${deleteItem.length} ${deleteItem.length > 1 ? 'items' : 'item'
                    } selected`}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ flex: 0.1 }}
                onPress={() => {
                  setDeleteItem([]);
                  setModal({ ...modal, isDeleteItem: false });
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
            {taskData.loading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: Sizes.Header,
                }}>
                <ActivityIndicator color={Colors.Primary} />
              </View>
            ) : taskData.pending.length == 0 &&
              taskData.completed.length == 0 ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: Sizes.Header,
                }}>
                <Image
                  source={require('../../../assets/images/noTasks.png')}
                  style={{ height: 220, width: 210 }}
                />
                <Text style={{ ...Fonts.Medium2, color: Colors.Primary }}>
                  Your To-Do is Empty
                </Text>
              </View>
            ) : (
              <View style={{ flex: 1, marginVertical: Sizes.Padding }}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={
                    searchText.length == 0
                      ? taskData.pending
                      : taskData.pending.filter(
                        (item: WEEKLY_PLANNER_INTERFACE) => {
                          return item.TITLE.toLowerCase().includes(
                            searchText.toLowerCase(),
                          );
                        },
                      )
                  }
                  contentContainerStyle={{}}
                  renderItem={renderTask}
                  keyExtractor={(item, index) => index.toString()}
                />
                {taskData.completed.length != 0 && (
                  <Text
                    style={{
                      color: Colors.PrimaryText,
                      ...Fonts.Medium2,
                      fontSize: 11,
                      marginTop: Sizes.Radius,
                      marginLeft: Sizes.ScreenPadding,
                    }}>
                    {`Completed`}
                  </Text>
                )}
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={
                    searchText.length == 0
                      ? taskData.completed
                      : taskData.completed.filter(
                        (item: WEEKLY_PLANNER_INTERFACE) => {
                          return item.TITLE.toLowerCase().includes(
                            searchText.toLowerCase(),
                          );
                        },
                      )
                  }
                  contentContainerStyle={{ marginBottom: Sizes.ScreenPadding }}
                  renderItem={renderTask}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            )}
          </ScrollView>
        </View>
        {modal.isDeleteItem && deleteItem.length > 0 ? (
          <View
            style={{
              backgroundColor: Colors.White,
              elevation: 13,
              flexDirection: 'row',
            }}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: Sizes.Padding,
              }}>
              <Icon
                name="delete"
                type="AntDesign"
                color={Colors.Primary}
                size={25}
                onPress={() => {
                  setModal({ ...modal, openDeleteModal: true });
                }}
              />
              <Text
                onPress={() => {
                  setModal({ ...modal, openDeleteModal: true });
                }}
                style={{
                  ...Fonts.Regular2,
                  color: Colors.Primary,
                  marginTop: Sizes.Base,
                }}>
                Delete
              </Text>
            </View>
            {deleteItem[0].IS_COMPLETED == 0 && deleteItem.length < 2 && (
              <View
                style={{
                  height: 50,
                  width: 1,
                  backgroundColor: Colors.Primary,
                  marginTop: Sizes.Padding,
                }}
              />
            )}
            {deleteItem[0].IS_COMPLETED == 0 && deleteItem.length < 2 && (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: Sizes.Padding,
                }}>
                <Icon
                  name="clock-edit-outline"
                  type="MaterialCommunityIcons"
                  color={Colors.Primary}
                  size={25}
                  onPress={() => {
                    setModal({ ...modal, createTask: true });
                  }}
                />
                <Text
                  onPress={() => {
                    setModal({ ...modal, createTask: false });
                  }}
                  style={{
                    ...Fonts.Regular2,
                    color: Colors.Primary,
                    marginTop: Sizes.Base,
                  }}>
                  Edit
                </Text>
              </View>
            )}
          </View>
        ) : (
          <FloatingAdd
            onPress={() => {
              setModal({ ...modal, createTask: true });
            }}
            style={{
              elevation: Sizes.Base,
            }}
          />
        )}
      </View>
      {modal.createTask && (
        <AddTodoTask
          visible={modal.createTask}
          onClose={() => {
            setModal({ ...modal, createTask: false });
          }}
          onSuccess={() => {
            setModal({ ...modal, createTask: false, isDeleteItem: false });
            setDeleteItem([]);
            getTasks();
          }}
          item={deleteItem[0]}
        />
      )}
      {modal.openDeleteModal && (
        <Modal
          isVisible={modal.openDeleteModal}
          onClose={() => {
            setModal({ ...modal, openDeleteModal: false });
          }}
          containerStyle={{ justifyContent: 'flex-end' }}
          style={{ borderRadius: Sizes.Padding }}>
          <View style={{}}>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Bold2,
                textAlign: 'center',
              }}>
              {`Delete ${deleteItem.length} ${deleteItem.length > 1 ? 'Tasks' : 'Task'
                }?`}
            </Text>
            <View style={{ flexDirection: 'row', marginTop: Sizes.Padding }}>
              <TextButton
                isBorder
                style={{ flex: 1, borderColor: Colors.Secondary }}
                label="Cancel"
                loading={false}
                onPress={() => setModal({ ...modal, openDeleteModal: false })}
              />
              <View style={{ width: Sizes.Radius }} />
              <TextButton
                style={{ flex: 1 }}
                label="Delete"
                loading={modal.deleteLoading}
                onPress={() => {
                  DeleteTask();
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

export default TodoList;
