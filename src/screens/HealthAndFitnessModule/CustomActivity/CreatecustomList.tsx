import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  RefreshControl,
  ActivityIndicator,
  Image,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Reducers, useDispatch, useSelector} from '../../../Modules';
import {
  Header,
  Icon,
  Modal,
  TextButton,
  TextInput,
  Toast,
} from '../../../Components';
import LinearGradient from 'react-native-linear-gradient';
import {IMAGE_URL, apiPost} from '../../../Modules/service';
import {CUSTOM_HEAD_CATEGORY} from '../../../Modules/interface';
import {noData} from '../../../../assets';
import {useFocusEffect} from '@react-navigation/native';
import {StackProps} from '../../../routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isSubscriptionActive} from '../../../Functions';
import PurchaseSubscriptionModal from '../../../Components/PurchaseSubscriptionModal';
import Animated, {withTiming} from 'react-native-reanimated';
import {FlashList} from '@shopify/flash-list';

type Props = StackProps<'CreatecustomList'>;
const CreatecustomList = ({navigation, route}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {data, type, HEAD_ID} = route.params;
  const [loading, setLoading] = useState(true);
  const [openNameModal, setNameModal] = useState(false);
  const [headName, setHeadName] = useState('');
  const [restTime, setRestTime] = useState('');
  const [categories, setcategories] = useState<CUSTOM_HEAD_CATEGORY[]>([]);
  const {selectedActivities} = useSelector(state => state.customActivity);
  const dispatch = useDispatch();
  const {member} = useSelector(state => state.member);
  const [createLoading, setCreateLoading] = useState(false);
  const purchase = !isSubscriptionActive() ? true : false;

  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [activationModal, setActivationModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    setLoading(true);
    try {
      const res = await apiPost('api/activityCategory/get', {
        sortKey: 'SEQ_NO',
        sortValue: 'ASC',
        filter: ` AND STATUS = 1`,
      });
      if (res && res.code == 200) {
        setcategories(res.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const addAllActivities = async () => {
    setCreateLoading(true);
    const expandedActivities = selectedActivities.flatMap((activity: any) =>
      Array(activity.SET_COUNT).fill({...activity}),
    );
    const cleanedActivities = expandedActivities.map(
      ({SET_COUNT, ...rest}) => rest,
    );
    // console.log('cleanedActivities', cleanedActivities);
    try {
      const res = await apiPost('api/activityHead/addUserHead', {
        HEAD_NAME: headName,
        HEAD_IMAGE: '',
        SEQ_NO: 1,
        STATUS: 1,
        USER_ID: member?.ID,
        CLIENT_ID: 1,
        REST_TIME: parseInt(restTime),
        activityId: cleanedActivities,
      });
      if (res && res.code == 200) {
        setCreateLoading(false);
        Toast('Activities Added Successfully');
        dispatch(Reducers.setSelectedActivities([]));
        navigation.goBack();
      } else if (res.code == 300) {
      }
    } catch (error) {
      setCreateLoading(false);
      console.log('error..', error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        dispatch(Reducers.setSelectedActivities([]));
        navigation.goBack();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, [navigation]),
  );

  const onUpdateCustomList = async () => {
    setCreateLoading(true);
    const expandedActivities = selectedActivities.flatMap((activity: any) =>
      Array(activity.SET_COUNT).fill({...activity}),
    );
    const cleanedActivities = expandedActivities.map(
      ({SET_COUNT, ...rest}) => ({
        ...rest,
        HEAD_ID,
        selected: true,
        IS_DELETE: false,
      }),
    );
    const updatedData = data.map((item: any) => ({
      ...item,
      selected: true,
      IS_DELETE: false,
    }));
    let body = {
      activityId: [...updatedData, ...cleanedActivities],
    };
    try {
      const res = await apiPost('api/activityHead/updateUserHead', body);
      if (res && res.code === 200) {
        setCreateLoading(true);
        Toast('Updated successfully');
        dispatch(Reducers.setSelectedActivities([]));
        navigation.goBack();
      }
    } catch (error) {
      setLoading(false);
      console.warn(error);
    }
  };

  const enteringAnimation = () => {
    'worklet';
    return {
      initialValues: {
        transform: [{translateX: 100}, {translateY: -100}, {scale: 0}],
      },
      animations: {
        transform: [
          {translateX: withTiming(0, {duration: 700})},
          {translateY: withTiming(0, {duration: 700})},
          {scale: withTiming(1, {duration: 700})},
        ],
      },
    };
  };

  const exitingAnimation = () => {
    'worklet';
    return {
      animations: {
        transform: [
          {translateX: withTiming(140, {duration: 500})},
          {translateY: withTiming(-150, {duration: 500})},
          {scale: withTiming(0, {duration: 500})},
        ],
      },
      initialValues: {
        transform: [{translateX: 0}, {translateY: 0}, {scale: 1}],
      },
    };
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.Background}}>
      <Header
        label="Create Custom List"
        onBack={() => {
          dispatch(Reducers.setSelectedActivities([]));
          navigation.goBack();
        }}
      />
      {loading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={'large'} color={Colors.Primary} />
        </View>
      ) : categories.length > 0 ? (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <FlashList
              contentContainerStyle={{
                paddingBottom: Sizes.ScreenPadding,
                paddingTop: Sizes.ScreenPadding - 8,
              }}
              estimatedItemSize={200}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  colors={[Colors.Primary, Colors.Primary]}
                  onRefresh={() => {
                    getCategories();
                  }}
                />
              }
              data={categories}
              ItemSeparatorComponent={() => (
                <View style={{height: Sizes.Base}} />
              )}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={async () => {
                      const data = await AsyncStorage.getItem(
                        'SUBSCRIPTION_DETAILS',
                      );
                      if (purchase) {
                        setOpenPurchaseModal(purchase);
                      } else if (!purchase && !data) {
                        setActivationModal(true);
                        Toast('Please activate Plan');
                      } else {
                        navigation.navigate('SelectActivities', {Item: item});
                      }
                    }}
                    style={{
                      height: 150,
                      marginHorizontal: Sizes.ScreenPadding,
                      marginTop: 8,
                    }}>
                    <ImageBackground
                      resizeMethod="scale"
                      imageStyle={{
                        borderRadius: Sizes.Radius,
                        resizeMode: 'cover',
                        width: '100%',
                        height: '100%',
                      }}
                      source={{
                        uri:
                          IMAGE_URL +
                          'activityCategoryImage/' +
                          item.CATEGORY_IMAGE,
                      }}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      resizeMode="cover">
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.5)']}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: Sizes.Radius,
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            ...Fonts.Bold1,
                            position: 'absolute',
                            bottom: Sizes.ScreenPadding,
                            left: Sizes.ScreenPadding,
                          }}>
                          {item.CATEGORY_NAME}
                        </Text>
                      </LinearGradient>
                    </ImageBackground>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          <View style={{margin: Sizes.Padding}}>
            <TextButton
              label={`Add ${
                selectedActivities.length > 0 ? selectedActivities.length : ''
              } Activities`}
              loading={false}
              onPress={() => {
                if (selectedActivities.length == 0) {
                  Toast('Please Select Activities');
                  return false;
                } else {
                  type == 'C' ? setNameModal(true) : onUpdateCustomList();
                }
              }}
            />
          </View>
        </View>
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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
      )}

      {/*HEAD NAME MODAL*/}
      {openNameModal && (
        <Modal
          isVisible={openNameModal}
          onClose={() => setNameModal(false)}
          title="Enter customized list details">
          <View style={{marginVertical: Sizes.ScreenPadding}}>
            <TextInput
              autoFocus={true}
              label="Head Name"
              placeholder="Enter Head Name"
              onChangeText={text => {
                setHeadName(text);
              }}
              value={headName}
            />
            <TextInput
              rightChild={
                <Icon
                  onPress={() => setInfoModal(!infoModal)}
                  style={{marginRight: Sizes.Base}}
                  name="info-with-circle"
                  type="Entypo"
                />
              }
              keyboardType="numeric"
              label="Rest time"
              labelStyle={{marginTop: Sizes.Radius}}
              placeholder="Enter rest time in Seconds"
              onChangeText={text => {
                setRestTime(text);
              }}
              value={'' + restTime}
              autoFocus={false}
            />
            {infoModal && (
              <Animated.Text
                entering={enteringAnimation}
                exiting={exitingAnimation}
                style={{
                  elevation: 6,
                  backgroundColor: Colors.Secondary,
                  padding: Sizes.Padding,
                  borderBottomRightRadius: Sizes.ScreenPadding,
                  borderBottomLeftRadius: Sizes.ScreenPadding,
                  borderTopLeftRadius: Sizes.ScreenPadding,
                  marginTop: Sizes.Padding,
                  marginHorizontal: Sizes.Padding,
                  color: Colors.PrimaryText1,
                  ...Fonts.Regular3,
                  // fontSize: 10,
                }}>
                Rest time is the period you take between exercises or sets
                during a workout. It allows your muscles to recover and prepare
                for the next exercise. Proper rest time can help improve your
                performance and reduce the risk of injury.
              </Animated.Text>
            )}
            <TextButton
              style={{marginTop: Sizes.ScreenPadding}}
              label={createLoading ? 'Creating...' : 'Create Custom Head'}
              loading={createLoading}
              onPress={() => {
                if (headName.trim().length == 0) {
                  Toast('Please Enter Head Name');
                  return false;
                } else if (!restTime) {
                  Toast('Please Enter Rest Time');
                  return false;
                } else if (parseInt(restTime) <= 0) {
                  Toast('Rest Time should be atleat 1 Minute');
                  return false;
                } else {
                  addAllActivities();
                }
              }}
            />
          </View>
        </Modal>
      )}

      {openPurchaseModal && (
        <PurchaseSubscriptionModal
          navigation={navigation}
          setOpenPurchaseModal={setOpenPurchaseModal}
          isVisible={openPurchaseModal}
          onClose={() => {}}
        />
      )}

      <Modal
        isVisible={activationModal}
        onClose={() => {
          setActivationModal(false);
        }}
        title="Please Activate plan to use customized module">
        <View style={{flexDirection: 'row'}}>
          <TextButton
            isBorder
            style={{flex: 1, marginTop: Sizes.ScreenPadding}}
            label="Not Now"
            loading={false}
            onPress={() => setActivationModal(false)}
          />
          <View style={{width: 10}}></View>
          <TextButton
            style={{flex: 1, marginTop: Sizes.ScreenPadding}}
            label="Activate"
            loading={false}
            onPress={() => navigation.navigate('Dashboard')}
          />
        </View>
      </Modal>
    </View>
  );
};

export default CreatecustomList;
