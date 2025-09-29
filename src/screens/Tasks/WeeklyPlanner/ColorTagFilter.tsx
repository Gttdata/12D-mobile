import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackProps} from '../../../routes';
import {apiPost, apiPut, useSelector} from '../../../Modules';
import {Header, Icon, Modal, TextButton} from '../../../Components';
import {Checkbox} from 'react-native-paper';
import moment from 'moment';
import Animated, {FadeInUp} from 'react-native-reanimated';
import {WEEKLY_PLANNER_INTERFACE} from '../../../Modules/interface';
import {noData, noTasks} from '../../../../assets';
import {useFocusEffect} from '@react-navigation/native';

const COLOR_CODE: any = [
  {name: 'Event', code: '#AF7AC5'},
  {name: 'Meeting', code: '#64D76C'},
  {name: 'Sport and Fitness', code: '#F39c12'},
  {name: 'Studies', code: '#FF675D'},
  {name: 'School/Function/ClassActivity', code: '#4995FF'},
  {name: 'Travel/Trip', code: '#FB8DA0'},
];
type Props = StackProps<'ColorTagFilter'>;
const ColorTagFilter = ({navigation}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {member} = useSelector(state => state.member);
  const [taskData, setTaskData] = useState({
    weekPlans: [],
    loading: true,
    selectedColorTag: '#AF7AC5',
    selectedColorName: 'Event',
  });
  const [modal, setModal] = useState({
    competeAlertMsg: false,
    updateModal: false,
    deleteModal: false,
  });
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [loading, setLoading] = useState({
    complete: false,
    update: false,
    deleteOne: false,
    deleteSeries: false,
  });
  useFocusEffect(
    React.useCallback(() => {
      getTasks();
    }, [navigation, taskData.selectedColorTag]),
  );
  const getTasks = async () => {
    setTaskData({
      ...taskData,
      loading: true,
    });
    try {
      const res = await apiPost('api/memberTodo/get', {
        filter: ` AND TYPE = 'WP' AND MEMBER_ID = ${member?.ID} AND STATUS = 1 AND IS_COMPLETED = 0 AND COLOR_TAG = '${taskData.selectedColorTag}' `,
        sortKey: 'CREATED_DATETIME',
        sortValue: 'ASC',
      });
      if (res && res.code == 200) {
        // console.log('\n\n..res...', res.data);
        setTaskData({
          ...taskData,
          weekPlans: res.data,
          loading: false,
        });
      }
    } catch (error) {
      setTaskData({
        ...taskData,
        loading: false,
      });
      console.log('err,,,', error);
    }
  };
  const CompleteTask = async () => {
    setLoading({...loading, complete: true});
    try {
      let body = {
        MEMBER_ID: member?.ID,
        ID: selectedItem?.ID,
        CREATED_DATETIME: moment(selectedItem?.CREATED_DATETIME ? selectedItem?.CREATED_DATETIME: new Date()).format('YYYY-MM-DD HH:mm:ss'),
        // CREATED_DATETIME: selectedItem?.CREATED_DATETIME,
        TITLE: selectedItem?.TITLE,
        DESCRIPTION: selectedItem?.DESCRIPTION,
        IS_REMIND: selectedItem?.IS_REMIND,
        REMIND_DATETIME: moment(selectedItem?.REMIND_DATETIME).format('YYYY-MM-DD HH:mm:ss'),
        REMIND_TYPE: selectedItem?.REMIND_TYPE,
        IS_COMPLETED: 1,
        STATUS: 1,
        CLIENT_ID: 1,
        TYPE: selectedItem?.TYPE,
        COLOR_TAG: selectedItem.COLOR_TAG,
        IS_SUB_TASK: 1,
        IS_FULL_WEEK: 0,
      };
      //   console.log('\n\n...body...', body);
      const res = await apiPut('api/memberTodo/update', body);
      if (res && res.code == 200) {
        setLoading({...loading, update: false});
        setModal({...modal, competeAlertMsg: false});
        getTasks();
      }
    } catch (error) {
      setLoading({...loading, complete: false});
      console.log('err,,,', error);
    }
  };
  const DeleteTask = async (item: WEEKLY_PLANNER_INTERFACE) => {
    setLoading({...loading, deleteOne: true});
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
        setLoading({...loading, deleteOne: false});
        setModal({...modal, deleteModal: false});
        getTasks();
      } else {
        setLoading({...loading, deleteOne: false});
        setModal({...modal, deleteModal: false});
      }
    } catch (error) {
      setLoading({...loading, deleteOne: false});
      console.log('err,,,', error);
    }
  };
  const DeleteSeriesTask = async (
    item: WEEKLY_PLANNER_INTERFACE,
    date: any,
  ) => {
    setLoading({...loading, deleteSeries: true});
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
        setLoading({...loading, deleteSeries: false});
        setModal({...modal, deleteModal: false});
        getTasks();
      } else {
        setLoading({...loading, deleteSeries: false});
        setModal({...modal, deleteModal: false});
      }
    } catch (error) {
      setLoading({...loading, deleteSeries: false});
      console.log('err,,,', error);
    }
  };
  const getUpdateTaskData = async (
    item: WEEKLY_PLANNER_INTERFACE,
    type: string,
  ) => {
    setLoading({...loading, deleteSeries: true, update: true});
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
        setLoading({...loading, deleteSeries: false, update: false});
        setModal({...modal, updateModal: false});
        type == 'U'
          ? navigation.navigate('WeekPlanAddTask', {
              item,
              type: 'U',
              selectedDateArray: dateTimeArray,
            })
          : DeleteSeriesTask(item, deleteDateTimeArray);
      }
    } catch (error) {
      console.log('err,,,', error);
    }
  };
  const renderTaskData = ({
    item,
    index,
  }: {
    item: WEEKLY_PLANNER_INTERFACE;
    index: number;
  }) => {
    return (
      <Animated.View
        entering={FadeInUp.duration(400)}
        style={{
          margin: 2,
          marginBottom: Sizes.Base,
          borderRadius: Sizes.Radius,
          padding: Sizes.Radius,
          elevation: 6,
          shadowColor: Colors.Primary,
          backgroundColor: item.COLOR_TAG ? item.COLOR_TAG : Colors.White,
        }}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => {}} style={{}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              margin: -Sizes.Base,
            }}>
            <View
              style={{
                transform: [{scale: 0.8}],
              }}>
              <Checkbox
                disabled={false}
                uncheckedColor={item.COLOR_TAG ? Colors.White : Colors.Primary2}
                color={Colors.Primary}
                status={item.IS_COMPLETED === 1 ? 'checked' : 'unchecked'}
                onPress={() => {
                  setSelectedItem(item);
                  setModal({...modal, competeAlertMsg: true});
                }}
              />
            </View>

            <View style={{marginLeft: 4, paddingRight: Sizes.ScreenPadding}}>
              <Text
                style={{
                  color: item.COLOR_TAG ? Colors.White : Colors.PrimaryText1,
                  ...Fonts.Medium2,
                }}>
                {item.TITLE}
              </Text>
            </View>
          </View>
          {item.DESCRIPTION && (
            <Text
              style={{
                marginLeft: 34,
                color: item.COLOR_TAG ? Colors.White : Colors.PrimaryText,
                ...Fonts.Medium3,
              }}>
              {item.DESCRIPTION}
            </Text>
          )}

          <View
            style={{
              flexDirection: 'row',
              margin: 4,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
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
                {moment(item.CREATED_DATETIME).format('hh:mm A')}
              </Text>
            </View>
            <Text
              style={{
                ...Fonts.Medium2,
                color: item.COLOR_TAG ? Colors.White : Colors.PrimaryText,
                fontSize: 10,
              }}>
              {moment(item.CREATED_DATETIME).format('DD/MMM/YYYY')}
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            top: Sizes.Radius,
            right: Sizes.Radius,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{marginRight: Sizes.Padding}}
            onPress={() => {
              setSelectedItem(item), setModal({...modal, updateModal: true});
            }}>
            <Icon
              name="edit"
              type="MaterialIcons"
              size={17}
              color={item.COLOR_TAG ? Colors.White : Colors.Primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={{}}
            onPress={() => {
              setSelectedItem(item);
              setModal({...modal, deleteModal: true});
            }}>
            <Icon
              name="delete"
              type="MaterialIcons"
              size={17}
              color={item.COLOR_TAG ? Colors.White : Colors.Primary}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Header
        label="Weekly Planner"
        onBack={() => {
          navigation.goBack();
        }}
      />
      <View style={{flex: 1, margin: Sizes.Padding}}>
        <View style={{marginTop: Sizes.Base, alignItems: 'center'}}>
          <FlatList
            data={COLOR_CODE}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}: {item: any; index: number}) => {
              return (
                <View
                  key={index}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: Sizes.Radius,
                  }}>
                  <View
                    style={{
                      height: 38,
                      width: 38,
                      borderRadius: 19,
                      backgroundColor: Colors.Background,
                      borderWidth: 2,
                      borderColor:
                        item.code == taskData.selectedColorTag
                          ? item.code
                          : Colors.Background,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        setTaskData({
                          ...taskData,
                          selectedColorName: item.name,
                          selectedColorTag: item.code,
                        });
                      }}
                      style={{
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        backgroundColor: item.code,
                      }}>
                      <Text></Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
          {taskData.selectedColorName && (
            <Text
              style={{
                ...Fonts.Bold2,
                fontSize: 11,
                color: taskData.selectedColorTag,
                marginTop: Sizes.Base,
                paddingVertical: Sizes.Base,
                paddingHorizontal: Sizes.Padding,
                elevation: 6,
                shadowColor: Colors.Primary,
                backgroundColor: Colors.Background,
                borderRadius: Sizes.Radius,
                width: 230,
                textAlign: 'center',
              }}>
              {taskData.selectedColorName}
            </Text>
          )}
        </View>

        <View style={{marginTop: Sizes.Padding}}>
          {taskData.loading ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: Sizes.Header * 2,
              }}>
              <ActivityIndicator color={Colors.Primary} />
            </View>
          ) : taskData.weekPlans.length == 0 ? (
            <View
              style={{
                alignItems: 'center',
                marginTop: Sizes.ScreenPadding,
              }}>
              <Image source={noTasks} style={{height: 220, width: 210}} />
              <Text style={{...Fonts.Medium2, color: Colors.Primary}}>
                Your Plan is Empty
              </Text>
            </View>
          ) : (
            <FlatList
              data={taskData.weekPlans}
              renderItem={renderTaskData}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
      </View>
      {modal.competeAlertMsg && (
        <Modal
          onClose={() => {
            setModal({...modal, competeAlertMsg: false});
          }}
          isVisible={modal.competeAlertMsg}>
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
                onPress={() => setModal({...modal, competeAlertMsg: false})}
              />
              <View style={{width: Sizes.Base}} />
              <TextButton
                style={{flex: 1}}
                label="Save"
                loading={loading.complete}
                onPress={() => CompleteTask()}
              />
            </View>
          </View>
        </Modal>
      )}
      {modal.updateModal && (
        <Modal
          onClose={() => {
            setModal({...modal, updateModal: false});
          }}
          isVisible={modal.updateModal}>
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
                  setModal({...modal, updateModal: false});
                  navigation.navigate('AddTaskForm', {
                    item: selectedItem,
                    type: 'U',
                    pageType: 'W',
                  });
                }}
              />
              <View style={{width: Sizes.Base}} />
              <TextButton
                style={{flex: 1}}
                label="Edit for a week"
                loading={loading.update}
                onPress={() => {
                  getUpdateTaskData(selectedItem, 'U');
                }}
              />
            </View>
          </View>
        </Modal>
      )}
      {modal.deleteModal && (
        <Modal
          onClose={() => {
            setModal({...modal, deleteModal: false});
          }}
          isVisible={modal.deleteModal}>
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
                loading={loading.deleteOne}
                onPress={() => {
                  DeleteTask(selectedItem);
                }}
              />
              <View style={{width: Sizes.Base}} />
              <TextButton
                style={{flex: 1}}
                label="Delete Series"
                loading={loading.deleteSeries}
                onPress={() => {
                  getUpdateTaskData(selectedItem, 'D');
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default ColorTagFilter;
