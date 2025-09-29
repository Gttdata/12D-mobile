import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Header, Icon, Toast} from '../../Components';
import {noData} from '../../../assets';
import {StackProps} from '../../routes';
import {Reducers, apiPost, useDispatch, useSelector} from '../../Modules';
import {TASK_DATA} from '../../Modules/interface2';
import {useFocusEffect} from '@react-navigation/native';

type Props = StackProps<'Questionnaires'>;
const Questionnaires = ({navigation, route}: Props) => {
  const [TaskData, setTaskData] = useState<TASK_DATA[]>([]);
  const [questionData, setQuestionData] = useState<TASK_DATA[]>([]);
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [Loading, setLoading] = useState(true);
  const {Item} = route.params;
  const {selectedTrackData} = useSelector(state => state.trackModule);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      getTrackQuestion();
    }, [navigation]),
  );

  const getTrackQuestion = async () => {
    try {
      const res = await apiPost('api/ticketGroup/get', {
        filter: ` AND PARENT_ID = ${
          Item && Item.ID ? Item.ID : 0
        }  AND TYPE = 'Q'  `,
      });
      if (res && res.code == 200) {
        if (res.data.length > 0) {
          setQuestionData(res.data);
          getTrackOption(res.data[0].ID);
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getTrackOption = async (id: any) => {
    try {
      const res = await apiPost('api/ticketGroup/get', {
        filter: ` AND PARENT_ID = ${id} AND TYPE = 'O' `,
      });
      if (res && res.code == 200) {
        setTaskData(res.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getTicketGroup = async () => {
    let calls = await Promise.all([
      apiPost('api/ticketGroup/get', {
        filter: ` AND PARENT_ID = ${
          Item && Item.ID ? Item.ID : 0
        } AND TYPE = 'Q' `,
      }),
      apiPost('api/ticketGroup/get', {
        filter: ` AND PARENT_ID = ${
          Item && Item.ID ? Item.ID + 1 : 1
        } AND TYPE = 'O' AND STATUS = 1 `,
      }),
    ]);
    if (calls[0].code == 200 && calls[1].code == 200) {
      // console.log('\n\n..response 0.////......', calls[0].data);
      // console.log('\n\n..response 1.////......', calls[1].data);
      setQuestionData(calls[0].data[0]);
      setTaskData(calls[1].data);
      setLoading(false);
    } else {
      setLoading(false);
      Toast('Something Wrong...Please try again');
    }
  };

  return (
    <View
      style={{
        backgroundColor: Colors.White,
        flex: 1,
      }}>
      <Header label="Track Book" onBack={() => navigation.goBack()} />

      <View style={{flex: 1, margin: Sizes.Radius}}>
        {Loading ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={'large'} color={Colors.Primary} />
          </View>
        ) : TaskData.length === 0 ? (
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
          <View style={{flex: 1, marginVertical: Sizes.Padding}}>
            <View>
              <FlatList
                data={questionData}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({
                  item,
                  index,
                }: {
                  item: TASK_DATA;
                  index: number;
                }) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        paddingBottom: Sizes.Radius,
                        marginLeft: Sizes.Base,
                      }}>
                      <Text
                        style={{
                          ...Fonts.Medium1,
                          color: Colors.PrimaryText1,
                        }}>
                        {item.VALUE}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            <View style={{flex: 1}}>
              <FlatList
                data={TaskData}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => (
                  <View style={{height: Sizes.Radius}} />
                )}
                renderItem={({
                  item,
                  index,
                }: {
                  item: TASK_DATA;
                  index: number;
                }) => {
                  const isSelected = selectedTrackData.some(
                    it => it.PARENT_ID === item.PARENT_ID && it.ID === item.ID,
                  );
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        item.IS_LAST == 0
                          ? navigation.push('Questionnaires', {Item: item})
                          : dispatch(Reducers.setSelectedTrackData(item));
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: isSelected
                          ? Colors.Secondary
                          : Colors.Background,
                        elevation: 6,
                        shadowColor: Colors.Primary,
                        padding: Sizes.Padding,
                        borderRadius: Sizes.Base,
                        margin: 3,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          flex: 1,
                          ...Fonts.Regular2,
                          color: Colors.PrimaryText1,
                          // backgroundColor: 'red',
                        }}>
                        {item.VALUE}
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                          height: 18,
                          width: 18,
                          borderRadius: 9,
                          backgroundColor: Colors.Primary,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Icon
                          name="right"
                          type="AntDesign"
                          color={Colors.White}
                          size={10}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Questionnaires;
