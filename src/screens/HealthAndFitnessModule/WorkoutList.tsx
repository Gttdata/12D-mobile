import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { IMAGE_URL, apiPost } from '../../Modules/service';
import { useSelector } from '../../Modules';
import { StackProps } from '../../routes';
import LinearGradient from 'react-native-linear-gradient';
import { Icon, TextButton, Toast } from '../../Components';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import Shimmer from 'react-native-shimmer';
import { loadAd, showAd } from '../../Modules/AdsUtils';
import { isSubscriptionActive } from '../../Functions';
import { custom } from '../../../assets';
import FlatListItem from './FlatListItem';
import FastImage from 'react-native-fast-image';
type activityUser = {
  ACTIVITY_HEAD: number;
  ARCHIVE_FLAG: 'F';
  CATEGORY: null | 'B' | 'I' | 'E';
  CLIENT_ID: 1;
  COMPLETED_PERCENTAGE: number;
  CREATED_MODIFIED_DATE: Date;
  CURRENT_ACTIVITY_ID: null | number;
  DESCRIPTION: null | string;
  ELITE_PERCENTAGE: number;
  END_DATETIME: null | Date;
  ID: number;
  INTERMEDIATE_PERCENTAGE: number;
  READ_ONLY: 'N';
  START_DATETIME: Date;
  USER_ID: number;
};
type activityHead = {
  ACTIVITY_GIF: string;
  ACTIVITY_ID: number;
  ACTIVITY_NAME: string;
  ACTIVITY_TYPE: 'T' | 'S' | 'D' | 'W';
  ACTIVITY_VALUE: string | number;
  ARCHIVE_FLAG: 'F';
  CATEGORY: 'B' | 'I' | 'E';
  CLIENT_ID: 1;
  CREATED_MODIFIED_DATE: Date;
  DESCRIPTION: string;
  HEAD_ID: number;
  HEAD_NAME: string;
  ID: number;
  READ_ONLY: 'N';
  SEQ_NO: number;
  USER_ID: number | 0;
};
type activityUserDetails = {
  ACTIVITY_GIF: null | string;
  ACTIVITY_ID: null | number;
  ACTIVITY_MAPPING_ID: number;
  ACTIVITY_NAME: null | string;
  ACTIVITY_SETS: null;
  ACTIVITY_STATUS: 'I' | 'C';
  ACTIVITY_TIMING: null;
  ACTIVITY_TYPE: 'T' | 'S' | 'D' | 'W';
  ACTIVITY_VALUE: string | number;
  ARCHIVE_FLAG: 'F';
  CATEGORY: 'B' | 'I' | 'E';
  CLIENT_ID: 1;
  COMPLETED_DATETIME: null | Date;
  CREATED_MODIFIED_DATE: Date;
  DESCRIPTION: null | string;
  ID: number;
  MASTER_ID: number;
  READ_ONLY: 'N';
  SEQ_NO: number;
};
type WorkoutListProps = StackProps<'WorkoutList'>;
const WorkoutList: React.FC<WorkoutListProps> = ({ navigation, route }) => {
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const IsActive = isSubscriptionActive();
  const { member } = useSelector(state => state.member);
  const { Item, index } = route.params;
  const [loading, setLoading] = useState({
    loader: false,
    startActivity: false,
  });
  const [difficulty, setDifficulty] = useState<'B' | 'I' | 'E'>('B');
  const [activityUser, setActivityUser] = useState<activityUser | null>(null);
  const [data, setData] = useState<activityHead[] | activityUserDetails[]>([]);
  useFocusEffect(
    useCallback(() => {
      checkUserMaster();
    }, [navigation, difficulty]),
  );
  useEffect(() => {
    loadAd();
  }, []);
  const checkUserMaster = async () => {
    setLoading({ ...loading, loader: true });
    try {
      const res = await apiPost('api/activityUser/get', {
        filter: ` AND DATE(START_DATETIME) = ${moment(new Date()).format(
          "'YYYY-MM-DD'",
        )} AND ACTIVITY_HEAD = ${Item.ID} AND USER_ID = ${member?.ID
          } AND CATEGORY = '${difficulty}' `,
      });
      if (res && res.code == 200) {
        // console.log('\n\n..res....', res);
        if (res.data.length > 0) {
          setActivityUser(res.data[0]);
          getUserDetails(res.data[0].ID, 'initial');
        } else {
          getActivites();
        }
      } else {
        Toast('Unable to get the data. Please try again later');
        setLoading({ ...loading, loader: false });
      }
    } catch (error) {
      setLoading({ ...loading, loader: false });
    }
  };
  const getUserDetails = async (data: any, type: any) => {
    try {
      const res = await apiPost('api/activityUserMapping/get', {
        filter: ` AND MASTER_ID = ${data} AND CATEGORY = '${difficulty}'`,
        sortKey: 'ID',
        sortValue: 'ASC',
      });
      if (res && res.code == 200) {
        if (res.data.length > 0) {
          FastImage.preload(
            res.data.map((image: any) => ({
              uri:
                IMAGE_URL +
                'activityTumbnailGIF/' +
                image.ACTIVITY_THUMBNAIL_GIF,
              priority: FastImage.priority.high,
            })),
          );
          setData(res.data);
          setLoading({ ...loading, loader: false });
          if (type == 'start') {
            navigation.navigate('StartWorkout', {
              Item: res.data,
              prevWorkPerentage: 0,
              TotalActivity: res.data,
              masterId: data,
              tabName: difficulty,
              REST_TIME: res.data[0].REST_TIME,
              ACTIVITY_TYPE: "P",
            });
          }
        } else {
          getActivites();
        }
      } else {
        Toast('Unable to get the data. Please try again later');
        setLoading({ ...loading, loader: false });
      }
    } catch (error) {
      console.warn(error);
      setLoading({ ...loading, loader: false });
    }
  };
  const getActivites = async () => {
    try {
      const res = await apiPost('api/activityHeadMapping/get', {
        filter: ` AND HEAD_ID = ${Item.ID} AND CATEGORY = '${difficulty}' AND STATUS = 1`,
        sortKey: 'ID',
        sortValue: 'ASC',
      });
      if (res && res.code == 200) {
        FastImage.preload(
          res.data.map((image: any) => ({
            uri:
              IMAGE_URL + 'activityTumbnailGIF/' + image.ACTIVITY_THUMBNAIL_GIF,
            priority: FastImage.priority.high,
          })),
        );
        setData(res.data);
        setActivityUser(null);
        setLoading({ ...loading, loader: false });
      } else {
        Toast('Unable to get activities at that time, Please try again later');
        setLoading({ ...loading, loader: false });
      }
    } catch (error) {
      setLoading({ ...loading, loader: false });
    }
  };
  const onStartActivity = async () => {
    setLoading({ ...loading, startActivity: true });
    try {
      const res = await apiPost('api/activityUser/add', {
        USER_ID: member?.ID,
        START_DATETIME: moment(new Date()).format('YYYY-MM-DD HH:mm'),
        ACTIVITY_HEAD: Item.ID,
        activityId: data.map(item => item.ID).join(','),
        CLIENT_ID: 1,
      });
      if (res && res.code == 200) {
        await getUserDetails(res.MASTER_ID, 'start');
        setLoading({ ...loading, startActivity: false });
      } else {
        Toast('Unable To start the activities, Please try again later');
        setLoading({ ...loading, startActivity: false });
      }
    } catch (error) {
      setLoading({ ...loading, startActivity: false });
    }
  };
  const completePercentage = useMemo<number>(() => {
    let percent = 0;
    if (activityUser && activityUser.ID) {
      switch (difficulty) {
        case 'B':
          percent = Number(activityUser.COMPLETED_PERCENTAGE);
          break;
        case 'I':
          percent = Number(activityUser.INTERMEDIATE_PERCENTAGE);
          break;
        case 'E':
          percent = Number(activityUser.ELITE_PERCENTAGE);
          break;
        default:
          percent = 0;
          break;
      }
      return percent;
    }
    return 0;
  }, [difficulty, activityUser]);
  // console.log('\n\ndata....', data[0]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ height: '25%', width: '100%' }}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            borderBottomLeftRadius: Sizes.Radius,
            borderBottomRightRadius: Sizes.Radius,
            flex: 1,
            backgroundColor: 'blue',
          }}
          source={
            Item.HEAD_IMAGE
              ? {
                uri: IMAGE_URL + 'activityHeadImage/' + Item.HEAD_IMAGE,
              }
              : custom(index)
          }
          resizeMode="cover"
        />
        <Icon
          onPress={() => navigation.goBack()}
          name="arrow-back"
          type="Ionicons"
          size={20}
          color={Colors.White}
          style={{
            position: 'absolute',
            top: Sizes.ScreenPadding,
            left: Sizes.ScreenPadding,
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: 'rgba(255,255,255,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
          }}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: Sizes.Radius,
            position: 'absolute',
            right: 0,
            left: 0,
            flex: 1,
          }}>
          <Text
            style={{
              flex: 1,
              color: 'white',
              ...Fonts.Bold1,
              position: 'absolute',
              bottom: Sizes.ScreenPadding,
              left: Sizes.ScreenPadding,
              right: Sizes.ScreenPadding,
            }}>
            {Item.HEAD_NAME}
          </Text>
        </LinearGradient>
      </View>
      <View style={{ flex: 1 }}>
        <Switch current={difficulty} onSelect={value => setDifficulty(value)} />
        {loading.loader ? (
          <FlatList
            data={[1, 1, 1, 1]}
            renderItem={() => (
              <Shimmer
                duration={2000}
                pauseDuration={1000}
                animationOpacity={0.9}
                opacity={0.5}
                style={{
                  marginTop: Sizes.Padding,
                }}>
                <View
                  style={{
                    borderRadius: Sizes.Base,
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
                        height: 60,
                        width: 60,
                        backgroundColor: Colors.Primary2 + 90,
                        borderRadius: 30,
                      }}
                    />
                    <View
                      style={{
                        marginLeft: Sizes.ScreenPadding,
                      }}>
                      <View
                        style={{
                          height: 20,
                          width: 200,
                          marginBottom: Sizes.Base,
                          backgroundColor: Colors.Primary2 + 90,
                        }}
                      />
                      <View
                        style={{
                          height: 20,
                          width: 200,
                          backgroundColor: Colors.Primary2 + 90,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </Shimmer>
            )}
          />
        ) : data.length > 0 ? (
          <View style={{ flex: 1 }}>
            <Animated.FlatList
              contentContainerStyle={{ paddingVertical: Sizes.Base }}
              data={data}
              ItemSeparatorComponent={() => (
                <View style={{ height: Sizes.Padding }} />
              )}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true },
              )}
              renderItem={({ item, index }) => {
                return (
                  <FlatListItem
                    item={item}
                    index={index}
                    scrollY={scrollY}
                    data={data}
                    navigation={navigation}
                    initialNumToRender={5}
                  />
                );
              }}
            />
          </View>
        ) : (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: Colors.PrimaryText1, ...Fonts.Medium3 }}>
              No activities
            </Text>
          </View>
        )}

        <View style={{ margin: Sizes.Padding }}>
          {activityUser && activityUser.ID ? (
            completePercentage == 100 || completePercentage > 99 ? (
              <TextButton
                label={'Completed'}
                loading={loading.startActivity}
                onPress={() => {
                  Toast('You completed your daily limit.');
                }}
              />
            ) : (
              <TextButton
                label={'Continue ' + completePercentage + '%'}
                loading={loading.startActivity}
                onPress={() => {
                  const pendingActivities: any = data.filter(
                    (item: any) =>
                      item.ACTIVITY_STATUS == 'I' ||
                      item.ACTIVITY_STATUS == 'S',
                  );

                  if (IsActive) {
                    navigation.navigate('StartWorkout', {
                      Item: pendingActivities,
                      prevWorkPerentage: completePercentage,
                      TotalActivity: data,
                      masterId: activityUser.ID,
                      tabName: difficulty,
                      REST_TIME: data[0].REST_TIME,
                      ACTIVITY_TYPE: "P",
                    });
                  } else {
                    showAd(() => {
                      navigation.navigate('StartWorkout', {
                        Item: pendingActivities,
                        prevWorkPerentage: completePercentage,
                        TotalActivity: data,
                        masterId: activityUser.ID,
                        tabName: difficulty,
                        REST_TIME: data[0].REST_TIME,
                        ACTIVITY_TYPE: "P",
                      });
                    });
                  }
                }}
              />
            )
          ) : (
            <TextButton
              label={'Start'}
              loading={loading.startActivity}
              onPress={() => {
                if (data.length > 0) {
                  if (!IsActive) {
                    showAd(() => onStartActivity());
                  } else {
                    onStartActivity();
                  }
                } else {
                  Toast('No activities to start');
                }
              }}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
export default WorkoutList;

type SwitchProps = {
  current: 'B' | 'I' | 'E';
  onSelect: (value: 'B' | 'I' | 'E') => void;
};
const Switch: React.FC<SwitchProps> = ({ current, onSelect }) => {
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  return (
    <View
      style={{
        height: 43,
        margin: Sizes.Padding,
        borderRadius: Sizes.Padding * 2,
        elevation: 6,
        shadowColor: Colors.Primary2,
        flexDirection: 'row',
        backgroundColor: Colors.Background,
      }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onSelect('B')}
        style={{
          width: '33%',
          height: '100%',
          borderTopLeftRadius: Sizes.Padding * 2,
          borderBottomLeftRadius: Sizes.Padding * 2,
          backgroundColor: current == 'B' ? Colors.Primary2 : Colors.White,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            ...Fonts.Medium3,
            color: current == 'B' ? Colors.White : Colors.Primary2,
          }}>
          Beginner
        </Text>
      </TouchableOpacity>
      {current == 'E' && (
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
        onPress={() => onSelect('I')}
        style={{
          width: '36%',
          height: '100%',
          backgroundColor: current == 'I' ? Colors.Primary2 : Colors.White,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            ...Fonts.Medium3,
            width: '100%',
            textAlign: 'center',
            color: current == 'I' ? Colors.White : Colors.Primary2,
          }}>
          Intermediate
        </Text>
      </TouchableOpacity>
      {current == 'B' && (
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
          onSelect('E');
        }}
        style={{
          width: '32%',
          height: '100%',
          borderTopRightRadius: Sizes.Padding * 2,
          borderBottomRightRadius: Sizes.Padding * 2,
          backgroundColor: current == 'E' ? Colors.Primary2 : Colors.White,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            ...Fonts.Medium3,
            color: current == 'E' ? Colors.White : Colors.Primary2,
          }}>
          Elite
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({});
