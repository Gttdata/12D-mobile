import {
  View,
  Text,
  ImageBackground,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Header, Icon, Modal, TextButton, Toast} from '../../Components';
import {apiPost, useSelector} from '../../Modules';
import {StackProps} from '../../routes';
import {HEATH_FATTENS_CATEGORY} from '../../Modules/interface';
import {apiPut, IMAGE_URL} from '../../Modules/service';
import {custom, NoDataWorkout} from '../../../assets';
import PurchaseSubscriptionModal from '../../Components/PurchaseSubscriptionModal';
import {isSubscriptionActive} from '../../Functions';
import Shimmer from 'react-native-shimmer';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BannerAds} from '../../Modules/AdsUtils';
import moment from 'moment';

type Props = StackProps<'HealthAndFitnessHome'>;
const HealthAndFitnessHome = ({navigation}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {member} = useSelector(state => state.member);
  const [categories, setcategories] = useState<HEATH_FATTENS_CATEGORY[]>([]);
  const [customizedCategories, setCustomizedCategories] = useState<
    HEATH_FATTENS_CATEGORY[]
  >([]);
  const [loading, setLoading] = useState(true);
  const purchase = !isSubscriptionActive() ? true : false;
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [activationModal, setActivationModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(1);
  const [isPremiumIconShow, setIsPremiumIconShow] = useState(false);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const gradientColors = [
    ['#AF7AC5', '#AF7AC5'],
    ['#64D76C', '#64D76C'],
    ['#F39c12', '#F39c12'],
    ['#FF675D', '#FF675D'],
    ['#5499C7', '#5499C7'],
  ];
  useFocusEffect(
    React.useCallback(() => {
      getCategories();
    }, [navigation]),
  );

  const getCategories = async () => {
    const data = await AsyncStorage.getItem('SUBSCRIPTION_DETAILS');
    if (!purchase && data) {
      setIsPremiumIconShow(true);
    }
    try {
      const res = await apiPost('api/activityHead/get', {
        sortKey: 'SEQ_NO',
        sortValue: 'ASC',
        filter: ` AND STATUS = 1 AND USER_ID IN (0,${member?.ID})`,
      });
      if (res && res.code == 200) {
        const custom = res.data.filter(
          (item: any) => item.USER_ID == member?.ID,
        );
        const recommended = res.data.filter((item: any) => item.USER_ID == 0);

        setcategories(recommended);
        setCustomizedCategories(custom);
        getSubCategories(recommended);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const onDelete = (item: HEATH_FATTENS_CATEGORY) => {
    try {
      Alert.alert(
        'Delete Group',
        'Are you sure you want to delete this group?',
        [
          {style: 'cancel', text: 'Cancel', onPress: () => {}},
          {
            style: 'default',
            text: 'Delete',
            onPress: async () => {
              const res = await apiPut('api/activityHead/update', {
                ...item,
                STATUS: 0,
              });
              if (res && res.code == 200) {
                getCategories();
              } else {
                Alert.alert('Error', res.message);
              }
            },
          },
        ],
        {cancelable: true},
      );
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Header
        label="Health & Fitness"
        onBack={() => {
          navigation.goBack();
        }}
        rightChild={
          // tabIndex == 1 ? (
          //   <Icon
          //     name="search"
          //     type="Feather"
          //     color={Colors.Background}
          //     onPress={() => {}}
          //   />
          // ) : (
          isPremiumIconShow &&
          tabIndex == 2 && (
            <Icon name="crown" type="FontAwesome5" color={'#F6C324'} />
          )
          // )
        }
      />
      {/**TABS**/}
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
          onPress={() => {
            setTabIndex(1);
          }}
          style={{
            width: '50%',
            height: '100%',
            borderTopLeftRadius: Sizes.Padding * 2,
            borderBottomLeftRadius: Sizes.Padding * 2,
            backgroundColor: tabIndex == 1 ? Colors.Primary2 : Colors.White,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: tabIndex == 1 ? Colors.White : Colors.Primary2,
            }}>
            Prearranged
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={async () => {
            setTabIndex(2);
          }}
          style={{
            width: '50%',
            height: '100%',
            borderTopRightRadius: Sizes.Padding * 2,
            borderBottomRightRadius: Sizes.Padding * 2,
            backgroundColor: tabIndex == 2 ? Colors.Primary2 : Colors.White,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: tabIndex == 2 ? Colors.White : Colors.Primary2,
            }}>
            Personalize
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
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
                  height: 150,
                  borderRadius: Sizes.Base,
                  marginVertical: Sizes.Radius,
                  shadowColor: Colors.Primary2,
                  width: '100%',
                  backgroundColor: Colors.Secondary,
                }}>
                <Text>{''}</Text>
              </View>
            </Shimmer>
          )}
        />
      ) : (categories.length == 0 && tabIndex == 1) ||
        (customizedCategories.length == 0 && tabIndex == 2) ? (
        <View
          style={{flex: 1, alignItems: 'center', margin: Sizes.ScreenPadding}}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image
              resizeMode={'contain'}
              style={{
                // flex: 1,
                width: 200,
                height: 200,
              }}
              source={NoDataWorkout}
            />
            <View style={{}}>
              <Text style={{...Fonts.Bold3, color: Colors.Primary}}>
                💪 Personalized Features
              </Text>
              <Text style={{...Fonts.Regular3}}>
                <Text style={{...Fonts.Bold3, color: Colors.Black}}>
                  1️⃣ Create Exercises Manually:
                </Text>
                📝✨ Design your own workout routine to match your goals.
              </Text>
              <Text style={{...Fonts.Regular3}}>
                <Text style={{...Fonts.Bold3, color: Colors.Black}}>
                  2️⃣ Select Exercises from All Types:
                </Text>
                🏋️‍♀️🤸‍♂️ From cardio to strength, flexibility to endurance—choose
                what suits you best!
              </Text>
              <Text style={{...Fonts.Regular3}}>
                <Text style={{...Fonts.Bold3, color: Colors.Black}}>
                  3️⃣ Comprehensive Exercise Library:
                </Text>
                📚💼 Explore every type of workout and training technique.
              </Text>
              <Text style={{...Fonts.Regular3}}>
                <Text style={{...Fonts.Bold3, color: Colors.Black}}>
                  4️⃣ Injury Management Support:
                </Text>
                🩹🧘‍♂️ Keep yourself safe with tailored guidance for recovery and
                injury prevention.
              </Text>
              <Text style={{...Fonts.Bold3, color: Colors.Black}}>
                🌟 Your Fitness, Your Way!
              </Text>
            </View>
          </View>
          {tabIndex == 2 && (
            <TextButton
              label="Create Personalize Workout"
              loading={false}
              colors={['#369EFF', '#369EFF']}
              onPress={async () => {
                navigation.navigate('CreatecustomList', {
                  data: [],
                  type: 'C',
                  HEAD_ID: null,
                });
              }}
            />
          )}
        </View>
      ) : (
        <View style={{flex: 1}}>
          <FlatList
            contentContainerStyle={{
              paddingBottom: Sizes.ScreenPadding,
              paddingTop: Sizes.ScreenPadding - 8,
            }}
            refreshControl={
              <RefreshControl
                refreshing={false}
                colors={[Colors.Primary, Colors.Primary]}
                onRefresh={() => {
                  getCategories();
                }}
              />
            }
            data={tabIndex == 1 ? categories : customizedCategories}
            ItemSeparatorComponent={() => <View style={{height: Sizes.Base}} />}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={async () => {
                    if (tabIndex == 1) {
                      navigation.navigate('WorkoutList', {Item: item, index});
                    } else {
                      const data = await AsyncStorage.getItem(
                        'SUBSCRIPTION_DETAILS',
                      );

                      if (purchase) {
                        setOpenPurchaseModal(purchase);
                      } else if (!purchase && !data) {
                        setActivationModal(true);
                        Toast('Please activate Plan');
                      } else {
                        navigation.navigate('CustomWorkoutList', {
                          Item: item,
                          index,
                        });
                      }
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
                    source={
                      item.HEAD_IMAGE
                        ? {
                            uri:
                              IMAGE_URL +
                              'activityHeadImage/' +
                              item.HEAD_IMAGE,
                          }
                        : custom(index)
                    }
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
                        justifyContent: 'flex-end',
                      }}>
                      <Text
                        textBreakStrategy="simple"
                        style={{
                          color: 'white',
                          ...Fonts.Bold1,
                          fontSize: 20,
                          // position: 'absolute',
                          // bottom: Sizes.ScreenPadding,
                          paddingHorizontal: Sizes.Base,
                          // left: Sizes.Base,
                          // flex: 1,
                        }}>
                        {item.HEAD_NAME}
                      </Text>
                      {tabIndex == 2 && (
                        <Text
                          textBreakStrategy="simple"
                          style={{
                            color: 'white',
                            ...Fonts.Bold1,
                            fontSize: 10,
                            bottom: 2,
                            paddingHorizontal: Sizes.Base,
                          }}>
                          {'Created On ' +
                            moment(item.CREATED_MODIFIED_DATE).format(
                              'DD/MMM/YYYY',
                            )}
                        </Text>
                      )}
                      {tabIndex == 2 && (
                        <Icon
                          onPress={() => {
                            onDelete(item);
                          }}
                          name={'delete'}
                          type={'AntDesign'}
                          color="#FFF"
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#FFFFFF40',
                          }}
                        />
                      )}
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              );
            }}
          />
          {tabIndex == 2 && (
            <View
              style={{
                margin: Sizes.ScreenPadding,
              }}>
              <TextButton
                label="Create Personalize Workout"
                loading={false}
                onPress={async () => {
                  navigation.navigate('CreatecustomList', {
                    data: [],
                    type: 'C',
                    HEAD_ID: null,
                  });
                }}
              />
            </View>
          )}
        </View>
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

      <BannerAds />
    </View>
  );
};

export default HealthAndFitnessHome;
