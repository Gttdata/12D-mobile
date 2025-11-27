import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { StackProps } from '../../routes';
import { apiPost, apiPut, useSelector } from '../../Modules';
import { Header, Icon, Modal, TextButton } from '../../Components';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import { WEEKLY_PLANNER_INTERFACE } from '../../Modules/interface';
import { Checkbox } from 'react-native-paper';
import AddTodoTask from './AddTodoTask';
import { noData } from '../../../assets';

type Props = StackProps<'TodoCalenderFilter'>;
const TodoCalenderFilter = ({ navigation }: Props) => {
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const { member } = useSelector(state => state.member);
  const [selected, setSelected] = useState<any>(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [allTaskData, setAllTaskData] = useState({
    data: [],
    loading: true,
  });
  const [taskData, setTaskData] = useState<any>({
    data: [],
    loading: true,
  });
  const [modal, setModal] = useState({
    createTask: false,
    isDeleteItem: false,
    openDeleteModal: false,
    selectDeleteAllItem: false,
    deleteLoading: false,
  });
  const [deleteItem, setDeleteItem] = useState<any>([]);
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
        },
      };
    });
    return markedDates;
  };

  useEffect(() => {
    getAllTasks();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      getTasks();
    }, [navigation, selected]),
  );
  const getAllTasks = async () => {
    try {
      const res = await apiPost('api/memberTodo/get', {
        filter: ` AND TYPE = 'TD' AND MEMBER_ID = ${member?.ID} AND STATUS=1`,
      });
      if (res && res.code == 200) {
        setAllTaskData({ ...allTaskData, data: res.data, loading: false });
      }
    } catch (error) {
      console.log('err,,,', error);
    }
  };
  const getTasks = async () => {
    setTaskData({
      ...taskData,
      loading: true,
    });
    const date = moment(selected).format('YYYY-MM-DD 00:00:00');
    // console.log(date);
    try {
      const res = await apiPost('api/memberTodo/get', {
        filter: ` AND TYPE = 'TD' AND DATE(CREATED_DATETIME) = "${date}" AND MEMBER_ID = ${member?.ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        // const filterDate =
        //   date < moment(new Date()).format('YYYY-MM-DD 00:00:00');
        // const data = filterDate
        //   ? res.data.filter((task: any) => task.IS_COMPLETED === 1)
        //   : res.data.filter(
        //       (task: any) => task.IS_COMPLETED === 0 || task.IS_COMPLETED === 1,
        //     );
        const sortedData = [...res.data].sort(
          (a, b) => a.IS_COMPLETED - b.IS_COMPLETED,
        );
        setTaskData({
          ...taskData,
          data: sortedData,
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
        //        CREATED_DATETIME: item.CREATED_DATETIME,
        TITLE: item.TITLE,
        DESCRIPTION: changeData ? JSON.stringify(changeData) : changeData,
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
      };
      // console.log('\n\n\n..body..', body);
      const res = await apiPut('api/memberTodo/update', body);
      if (res && res.code == 200) {
        getTasks();
      }
    } catch (error) {
      console.log('err,,,....', error);
    }
  };
  const DeleteTask = async () => {
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
      backgroundColor: isItemInDeleteList ? '#ADD8E6' : Colors.White,
    };
    const count =
      item.IS_SUB_TASK == 1 &&
      item.DESCRIPTION.length > 0 &&
      JSON.parse(item.DESCRIPTION).filter((desc: any) => desc.status == 1)
        .length;
    return (
      <View
        style={{
          margin: Sizes.Base,
          marginBottom: Sizes.Radius,
          borderRadius: Sizes.Radius,
          elevation: 5,
          shadowColor: Colors.Primary,
          marginHorizontal: Sizes.Padding,
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
              marginBottom: -Sizes.Radius,
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
                transform: [{ scale: 0.9 }],
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
            <Text style={{ color: Colors.PrimaryText1, ...Fonts.Medium2 }}>
              {item.TITLE}
            </Text>
          </View>
          {/* <Text
            style={{
              ...Fonts.Medium3,
              color: Colors.PrimaryText,
              marginLeft: 36,
              marginTop: -Sizes.Base,
            }}>
            {moment(item.CREATED_MODIFIED_DATE).format('DD/MMM/YYYY')}
          </Text> */}
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
      </View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#EAEDED' }}>
      <Header
        label="Daily Organizer"
        onBack={() => {
          navigation.goBack();
        }}
      />
      <Calendar
        onDayPress={(day: any) => {
          setSelected(day.dateString);
        }}
        markingType="custom"
        markedDates={{
          ...generateMarkedDates(allTaskData.data),
          [selected]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: Colors.Primary,
          },
        }}
      />
      <View style={{ flex: 1, marginVertical: Sizes.Radius }}>
        {taskData.loading ? (
          <ActivityIndicator color={Colors.Primary} />
        ) : taskData.data.length == 0 ? (
          <View style={{ alignItems: 'center' }}>
            <Image
              source={noData}
              style={{ height: 160, width: 160, tintColor: Colors.Primary }}
            />
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={taskData.data}
            contentContainerStyle={{}}
            renderItem={renderTask}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={false}
                colors={[Colors.Primary, Colors.Primary]}
                onRefresh={() => {
                  getTasks();
                }}
              />
            }
          />
        )}
      </View>
      {modal.isDeleteItem && deleteItem.length > 0 && (
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
      )}
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
    </View>
  );
};

export default TodoCalenderFilter;
