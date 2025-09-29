import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  ScrollView,
  Alert,
  FlatList,
  ImageBackground,
  Share,
  Linking,
  ToastAndroid,
} from 'react-native';
import RNFS from 'react-native-fs';

import {
  BASE_URL,
  Reducers,
  apiPost,
  apiPut,
  apiUpload,
  useDispatch,
  useSelector,
} from '../Modules';
import { Icon, Modal, TextButton, TextInput, Toast } from '../Components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FacebookLogo,
  InstagramLogo,
  fancyRadius,
  noProfile,
  rocket,
  youTubeLogo,
} from '../../assets';
import { StackProps } from '../routes';
import { onLogout } from '../Modules/Reducers/member';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import { isSubscriptionActive } from '../Functions';
import AddNewRoleModal from './DrawerScreens/AddNewRoleModal';
import { MEMBER_INTERFACE } from '../Modules/interface';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';

type Props = StackProps<'Drawer'>;
const Drawer = ({ navigation }: Props): JSX.Element => {
  const { Colors, Sizes, Fonts } = useSelector(state => state.app);
  const drawerAnimation = useRef(new Animated.Value(0)).current;
  const [switchUserModal, setSwitchUserModal] = useState(false);
  const [openAddUserModal, setAddUserModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const { member, appUserData } = useSelector(state => state.member);
  const [modal, setModal] = useState({
    logoutModal: false,
  });
  const [BugModal, setBugModal] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [date, setDate] = useState<{
    myDate: any;
    mode: any;
    show: boolean;
  }>({
    myDate: new Date(new Date().setFullYear(2000)),
    mode: 'date',
    show: false,
  });
  const changeSelectedDate = (event: any, selectedDate: any) => {
    if (selectedDate) {
      setDate({ ...date, myDate: selectedDate, show: false });
    } else {
      setDate({ ...date, show: false });
    }
  };
  const [schoolStatus, setSchoolStatus] = useState({
    data: { SCHOOL_STATUS: '' },
  });
  const [periodTracking, setPeriodTracking] = useState({
    started: 0,
    notDone: 0,
  });
  useEffect(() => {
    openDrawer();
  }, []);
  const openDrawer = () => {
    Animated.timing(drawerAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const drawerTranslateX = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });
  const onLogoutPress = async () => {
    try {
      dispatch(Reducers.setSelectedDimensionOptionData([]));
      dispatch(Reducers.setSelectedDimensionNoOptions([]));
      dispatch(Reducers.setSelectedTrackData([]));
      dispatch(Reducers.setAniVideoButtonStatus(false));
      await AsyncStorage.removeItem('MOBILE_NUMBER').catch(() => {
        AsyncStorage.setItem('MOBILE_NUMBER', '');
      });
      await AsyncStorage.removeItem('ACTIVE_USER_ID').catch(() => {
        AsyncStorage.setItem('ACTIVE_USER_ID', '');
      });
      await AsyncStorage.clear();
      await AsyncStorage.removeItem('USER_ID').catch(() => {
        AsyncStorage.setItem('USER_ID', '');
      });
      await AsyncStorage.removeItem('token').catch(() => {
        AsyncStorage.setItem('token', '');
      });
      await AsyncStorage.removeItem('OPTIONS').catch(() => {
        AsyncStorage.setItem('OPTIONS', '');
      });
      await AsyncStorage.removeItem('DIMENSION_OPTIONS').catch(() => {
        AsyncStorage.setItem('DIMENSION_OPTIONS', '');
      });
      await AsyncStorage.removeItem('STAGE_NAME').catch(() => {
        AsyncStorage.setItem('STAGE_NAME', '');
      });
      await AsyncStorage.removeItem('ANIMATION_VIDEO_TIME').catch(() => {
        AsyncStorage.setItem('ANIMATION_VIDEO_TIME', '');
      });
      dispatch(onLogout({}));
      setModal({ ...modal, logoutModal: false });
      dispatch(Reducers.setShowSplash(true));
      Toast('Successfully logout');
    } catch (error) { }
  };

  const PACKAGE_NAME = 'com.uvtechsoft.dimensions';

  const CheckVersion = async () => {
    try {
      const res = await apiPost('globalSettings/getVersion', {});

      if (res && res.code === 200) {
        const latestVersion = res?.data?.[0]?.CUR_VERSION;
        const currentVersion = DeviceInfo.getVersion();

        console.log('Current:', currentVersion, 'Latest:', latestVersion);

        if (currentVersion < latestVersion) {
          const playStoreUrl = `market://details?id=${PACKAGE_NAME}`;
          const fallbackUrl = `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`;

          Linking.openURL(playStoreUrl).catch(() => {
            Linking.openURL(fallbackUrl);
          });

          return true;
        } else {
          ToastAndroid.show('App is up to date', ToastAndroid.SHORT);
          return false;
        }
      } else {
        ToastAndroid.show('Failed to check version', ToastAndroid.SHORT);
        return false;
      }
    } catch (error) {
      console.warn(error);
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      return false;
    }
  };

  const SentBugReport = async () => {
    const path = `${RNFS.ExternalDirectoryPath}/logcat_output.txt`;
    const logExists = await RNFS.exists(path);

    if (logExists) {
      try {
        const logContent = await RNFS.readFile(path, 'utf8');
        const res = await apiUpload('upload/appLogsFiles', {
          uri: `file://${path}`,
          type: 'text/plain',
          name: 'logFilesw.txt',
        });
        if (res.code === 200) {
          const body = {
            USER_ID: member?.ID,
            ADDED_DATETIME: moment().format('YYYY-MM-DD HH:mm:ss'),
            FILE_NAME: 'logFilew.txt',
          };
          const res1 = await apiPost('api/userAppLogs/create', body);
          if (res1.code === 200) {
            try {
              await RNFS.unlink(path);
            } catch (unlinkError) {
              console.error('Error deleting the log file:', unlinkError);
            }
          }
        }
      } catch (error) {
        console.error('Error during the bug report process:', error);
        setBugModal(false);
      } finally {
        setBugModal(false);
      }
    } else {
      console.log('.....Report Not Available');
      setBugModal(false);
    }
  };

  interface drawerProps {
    icon: string;
    label: string;
    onPress: () => void;
    iconType:
    | 'AntDesign'
    | 'Entypo'
    | 'EvilIcons'
    | 'Feather'
    | 'FontAwesome'
    | 'FontAwesome5'
    | 'FontAwesome5Pro'
    | 'Fontisto'
    | 'Foundation'
    | 'Ionicons'
    | 'MaterialCommunityIcons'
    | 'MaterialIcons'
    | 'Octicons'
    | 'SimpleLineIcons'
    | 'Zocial';
    iconSize?: number;
  }
  const DrawerItem = ({
    icon,
    label,
    iconType,
    onPress,
    iconSize,
  }: drawerProps) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            backgroundColor: Colors.White,
            borderRadius: Sizes.Radius * 3,
            elevation: 5,
            padding: Sizes.Base,
            marginLeft: Sizes.Radius,
            marginVertical: 5,
            shadowColor: Colors.Primary2,
          }}>
          <Icon
            type={iconType}
            size={iconSize ? iconSize : 13}
            name={icon}
            style={{ alignSelf: 'center' }}
          />
        </View>
        <Text
          style={{
            color: Colors.PrimaryText1,
            ...Fonts.Medium4,
            marginLeft: Sizes.Radius,
          }}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      getSchoolInfo();
      getPeriodTrackingData();
    }, [navigation]),
  );
  const handleRateApp = () => {
    const url = 'market://details?id=com.uvtechsoft.dimensions';
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        title: 'App link',
        message:
          'Please install this app and stay safe , AppLink :https://play.google.com/store/apps/details?id=com.uvtechsoft.dimensions&pcampaignid=web_share',
        url: 'https://play.google.com/store/apps/details?id=com.uvtechsoft.dimensions&pcampaignid=web_share',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) { }
  };
  const followUrl = async (URL: string) => {
    const url = URL;
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };
  const subscriptionfun = isSubscriptionActive();

  const getSchoolInfo = async () => {
    console.log("getSchoolInfo called", member?.SCHOOL_ID);

    try {
      const res = await apiPost('api/school/get', {
        filter: `AND ID = ${member?.SCHOOL_ID} `,
      });
      if (res && res.code == 200) {
        setSchoolStatus({ ...schoolStatus, data: res.data ? res.data[0] : {} });
      }
    } catch (error) {
      console.log('error..', error);
    }
  };
  const getPeriodTrackingData = async () => {

    console.log("getPeriodTrackingData called", member?.ID);

    try {
      const res = await apiPost('api/periodTracking/get', {
        filter: ` AND USER_ID = ${member?.ID} `,
      });
      if (res && res.code == 200) {
        if (res.data.length > 0) {
          // console.log(res)
          if (
            res.data[0].IS_DONE == 0 &&
            moment(new Date()).format('YYYY-MM-DD') >=
            moment(res.data[0].DAY_REMINDER_DATE).format('YYYY-MM-DD')
          ) {
            setPeriodTracking({ ...periodTracking, started: 1, notDone: 1 });
          } else {
            setPeriodTracking({ ...periodTracking, started: 1, notDone: 0 });
          }
        }
      } else {
      }
    } catch (error) {
      console.log('error..', error);
    }
  };
  return (
    <Animated.View
      style={{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#00000050',
        transform: [{ translateX: drawerTranslateX }],
      }}>
      <View
        style={{ width: '85%', height: '100%', backgroundColor: Colors.White }}>
        <ImageBackground
          style={{ height: 200, width: '100%' }}
          source={require('./../../assets/images/background.jpg')}>
          <Image
            source={
              member?.PROFILE_PHOTO
                ? {
                  uri:
                    BASE_URL +
                    'static/appUserProfile/' +
                    member?.PROFILE_PHOTO,
                }
                : noProfile
            }
            resizeMode={'cover'}
            style={{
              height: 90,
              width: 90,
              borderRadius: 45,
              marginHorizontal: Sizes.ScreenPadding,
              marginTop: Sizes.ScreenPadding,
            }}
          />

          <Text
            style={{
              color: Colors.PrimaryText1,
              ...Fonts.Bold2,
              marginTop: Sizes.Radius,
              marginHorizontal: Sizes.ScreenPadding + Sizes.Base,
            }}>
            {member?.NAME}
          </Text>

          <View
            style={{
              marginHorizontal: Sizes.Base + Sizes.ScreenPadding,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              {member?.EMAIL_ID && (
                <Text style={{ color: Colors.PrimaryText1, ...Fonts.Medium3 }}>
                  {member?.EMAIL_ID}
                </Text>
              )}
              <Text style={{ color: Colors.PrimaryText, ...Fonts.Medium3 }}>
                {member?.MOBILE_NUMBER}
              </Text>
            </View>
            {/*Profile switch icon*/}
            {appUserData.length > 1 && (
              <Icon
                color={Colors.White}
                name="keyboard-arrow-down"
                type="MaterialIcons"
                size={35}
                onPress={() => setSwitchUserModal(true)}
              />
            )}
          </View>
        </ImageBackground>

        {/*Menus*/}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginHorizontal: Sizes.Padding, marginTop: Sizes.Base }}>
          <DrawerItem
            onPress={() => navigation.navigate('Profile')}
            label={'Update Profile'}
            icon={'user-edit'}
            iconType={'FontAwesome5'}
          />
          {appUserData.length < 2 && (
            <DrawerItem
              onPress={() => setAddUserModal(true)}
              label={'Add new user'}
              icon={'user-plus'}
              iconType={'FontAwesome5'}
            />
          )}
          <TouchableOpacity
            onPress={() => {
              // if (subscriptionfun) {
              //   Toast('you Already have Subscription plan');
              // } else {
              //   navigation.navigate('PremiumHome');
              // }
              navigation.navigate('PremiumHome', { type: "D" });


            }}
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: Colors.White,
                borderRadius: Sizes.Radius * 3,
                elevation: 5,
                padding: Sizes.Base,
                marginLeft: Sizes.Radius,
                marginVertical: Sizes.Base,
                shadowColor: Colors.Primary2,
              }}>
              <Icon
                size={15}
                name="chess-queen"
                type="FontAwesome5"
                style={{}}
              />
            </View>
            <View>
              <Text
                style={{
                  color: Colors.PrimaryText1,
                  ...Fonts.Medium4,
                  marginLeft: Sizes.Radius,
                }}>
                {'Subscription plan'}
              </Text>
              {subscriptionfun && (
                <Text
                  style={{
                    color: Colors.Primary,
                    ...Fonts.Medium3,
                    marginLeft: Sizes.Radius,
                  }}>
                  {'expiring on ' + member?.SUBSCRIPTION_EXPIRE_DATE}
                </Text>
              )}
            </View>
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: Colors.Primary,
              height: 1,
              marginVertical: 4,
            }}
          />
          <DrawerItem
            onPress={() => navigation.navigate('PrivacyPolicy')}
            label={'Privacy Policy'}
            icon={'privacy-tip'}
            iconSize={16}
            iconType={'MaterialIcons'}
          />
          <DrawerItem
            onPress={() => navigation.navigate('TermsAndCondition')}
            label={'Terms & Conditions'}
            icon={'file-document-edit-outline'}
            iconSize={16}
            iconType={'MaterialCommunityIcons'}
          />
          <DrawerItem
            onPress={() => handleRateApp()}
            label={'Rate us'}
            icon={'star'}
            iconSize={16}
            iconType={'Ionicons'}
          />
          <DrawerItem
            onPress={() => onShare()}
            label={'Share App'}
            icon={'share-social-sharp'}
            iconSize={16}
            iconType={'Ionicons'}
          />
          <DrawerItem
            onPress={() => {
              navigation.navigate('AppInfo');
            }}
            label={'App Info'}
            icon={'infocirlce'}
            iconSize={16}
            iconType={'AntDesign'}
          />
          <DrawerItem
            onPress={() => navigation.navigate('Feedback')}
            label={'Feedback'}
            icon={'feedback'}
            iconSize={16}
            iconType={'MaterialIcons'}
          />
          {/* <DrawerItem
            onPress={() => navigation.navigate('Settings')}
            label={'Settings'}
            icon={'setting'}
            iconSize={16}
            iconType={'AntDesign'}
          /> */}
          <DrawerItem
            onPress={() => setOpenUpdateModal(true)}
            label={'Check Updates'}
            icon={'system-update'}
            iconSize={18}
            iconType={'MaterialIcons'}
          />
          {/* <DrawerItem
            onPress={() => {
              navigation.navigate('HelpAndSupport');
            }}
            label={'Help and Support'}
            icon={'customerservice'}
            iconSize={18}
            iconType={'AntDesign'}
          /> */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <DrawerItem
              onPress={() => { }}
              label={'Follow Us'}
              icon={'thumbs-up'}
              iconSize={17}
              iconType={'Entypo'}
            />
            <View
              style={{
                marginLeft: Sizes.ScreenPadding,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ marginRight: Sizes.Padding }}
                onPress={() => {
                  followUrl(
                    'https://www.instagram.com/12dimensions.app/?igsh=MTV0bTRrMmd1ZzUweA%3D%3D#',
                  );
                }}>
                <Image source={InstagramLogo} style={{ width: 21, height: 21 }} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ marginRight: Sizes.Base }}
                onPress={() => {
                  followUrl(
                    'https://www.facebook.com/people/12dimensionsapp/61574077452878/?rdid=GLpG7kaJ3FO8s5YH&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BHKxxw2q3%2F',
                  );
                }}>
                <Image source={FacebookLogo} style={{ width: 22, height: 22 }} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ marginRight: Sizes.Base }}
                onPress={() => {
                  followUrl('https://m.youtube.com/@12dimensionsapp');
                }}>
                <Image source={youTubeLogo} style={{ width: 35, height: 35 }} />
              </TouchableOpacity>
            </View>
          </View>
          <DrawerItem
            onPress={() => {
              navigation.navigate('Disclaimer');
            }}
            label={'Disclaimer'}
            icon={'alert-triangle'}
            iconSize={17}
            iconType={'Feather'}
          />
          {/* <DrawerItem
            onPress={async () => {
              const path = `${RNFS.ExternalDirectoryPath}/logcat_output.txt`;
              const logExists = await RNFS.exists(path);
              if (logExists) {
                setBugModal(true);
              } else {
                Toast('No Bug Found');
              }
            }}
            label={'Report Bug'}
            icon={'bug-sharp'}
            iconSize={17}
            iconType={'Ionicons'}
          /> */}
          <View
            style={{
              backgroundColor: Colors.Primary,
              height: 1,
              marginVertical: 6,
            }}
          />
          <DrawerItem
            onPress={() => {
              navigation.navigate('BMI_CALCULATOR');
            }}
            label={'BMI Calculator'}
            icon={'calculator'}
            iconSize={17}
            iconType={'Ionicons'}
          />
          {member?.GENDER == 'F' && (
            <View
              style={{
                backgroundColor: Colors.Primary,
                height: 1,
                marginVertical: 6,
              }}
            />
          )}
          {member?.GENDER == 'F' && (
            <DrawerItem
              onPress={async () => {
                periodTracking.started == 0
                  ? navigation.navigate('TimePeriodQuestionary', {
                    type: 'C',
                    item: {},
                  })
                  : navigation.navigate('CircleCalender', {
                    openPopUp: periodTracking.notDone == 1 ? true : false,
                  });
              }}
              label={'Period Tracker'}
              icon={'calendar-clock-outline'}
              iconSize={17}
              iconType={'MaterialCommunityIcons'}
            />
          )}
          <View
            style={{
              backgroundColor: Colors.Primary,
              height: 1,
              marginVertical: 4,
              marginTop: Sizes.Base,
            }}
          />
          <TouchableOpacity
            onPress={() => {
              if (!schoolStatus.data) {
                navigation.navigate('SchoolRegistration', {
                  schoolInfo: schoolStatus.data,
                });
              } else {
                navigation.navigate('RegistrationScreen', {
                  schoolInfo: schoolStatus.data,
                  email: '',
                });
              }
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: Sizes.Base,
            }}>
            <View
              style={{
                backgroundColor: Colors.White,
                borderRadius: Sizes.Radius * 3,
                elevation: 5,
                padding: Sizes.Base,
                marginLeft: Sizes.Radius,
                shadowColor: Colors.Primary2,
              }}>
              <Icon type="FontAwesome5" size={14} name="school" />
            </View>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Bold4,
                marginLeft: Sizes.Radius,
              }}>
              {!schoolStatus.data?.SCHOOL_STATUS
                ? 'Click here for School ERP'
                : 'View School ERP status'}
            </Text>
          </TouchableOpacity>

          {/* {member?.ROLE == 'S' &&
            <TouchableOpacity
              onPress={() => {

                navigation.navigate('FeeStructure');

              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: Sizes.Base,
              }}>
              <View
                style={{
                  backgroundColor: Colors.White,
                  borderRadius: Sizes.Radius * 3,
                  elevation: 5,
                  padding: Sizes.Base,
                  marginLeft: Sizes.Radius,
                  shadowColor: Colors.Primary2,
                }}>
                <Icon type="FontAwesome5" size={14} name="school" />
              </View>
              <Text
                style={{
                  color: Colors.PrimaryText1,
                  ...Fonts.Bold4,
                  marginLeft: Sizes.Radius,
                }}>
                {'Fee Structure'}
              </Text>
            </TouchableOpacity>
          } */}
          {/* {member?.ROLE != 'T' && <View style={{height: Sizes.Base}} />} */}

          {/* {member?.ROLE == 'T' && (
            <TouchableOpacity
              onPress={() => {}}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: Colors.White,
                  borderRadius: Sizes.Radius * 3,
                  elevation: 5,
                  padding: Sizes.Base,
                  marginHorizontal: Sizes.Radius,
                  marginVertical: Sizes.Base,
                  shadowColor: Colors.Primary2,
                }}>
                <Icon
                  type="MaterialCommunityIcons"
                  size={19}
                  name="file-question-outline"
                />
              </View>
              <Text
                style={{
                  color: Colors.PrimaryText1,
                  ...Fonts.Bold4,
                  flex: 1,
                }}>
                Click here for paper generation
              </Text>
            </TouchableOpacity>
          )} */}
        </ScrollView>

        <View
          style={{
            backgroundColor: Colors.Primary,
            height: 1,
            marginVertical: 4,
          }}
        />

        <TouchableOpacity
          onPress={() => {
            // onLogoutPress();
            setModal({ ...modal, logoutModal: true });
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: Sizes.Padding,
            marginBottom: Sizes.Radius,
          }}>
          <View
            style={{
              backgroundColor: Colors.White,
              borderRadius: Sizes.Radius * 3,
              elevation: 5,
              padding: Sizes.Base,
              marginHorizontal: Sizes.Radius,
              marginVertical: Sizes.Base,
              shadowColor: Colors.Primary2,
            }}>
            <Icon type="AntDesign" size={16} name="logout" />
          </View>
          <Text style={{ color: Colors.PrimaryText1, ...Fonts.Medium2 }}>
            {t('Drawer.Logout')}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={{ flex: 1 }} onPress={() => navigation.goBack()} />

      {switchUserModal && (
        <Modal
          containerStyle={{ justifyContent: 'flex-end' }}
          style={{
            margin: 0,
            borderTopLeftRadius: Sizes.ScreenPadding,
            borderTopRightRadius: Sizes.ScreenPadding,
          }}
          onClose={() => setSwitchUserModal(false)}
          isVisible={switchUserModal}
          title="">
          <View style={{}}>
            <FlatList
              data={appUserData}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => {
                return (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: Colors.Primary,
                      marginTop: Sizes.Radius,
                    }}
                  />
                );
              }}
              renderItem={({
                item,
                index,
              }: {
                item: MEMBER_INTERFACE;
                index: number;
              }) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      // item.APPROVAL_STATUS == 'B'
                      //   ? Toast(
                      //       'You cannot switch to this role as it is currently blocked..',
                      //     )
                      //   :
                      AsyncStorage.setItem('ACTIVE_USER_ID', '' + item.ID),
                        dispatch(Reducers.setShowSplash(true));
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: Sizes.Radius,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={
                          item.PROFILE_PHOTO
                            ? {
                              uri:
                                BASE_URL +
                                'static/appUserProfile/' +
                                item.PROFILE_PHOTO,
                            }
                            : noProfile
                        }
                        resizeMode={'cover'}
                        style={{ height: 42, width: 42, borderRadius: 23 }}
                      />
                      <Text
                        style={{
                          color: Colors.PrimaryText1,
                          ...Fonts.Medium1,
                          marginLeft: Sizes.Radius,
                        }}>
                        {item.NAME}
                      </Text>
                      {item.APPROVAL_STATUS == 'A' ? (
                        <Icon
                          name="checkcircleo"
                          type="AntDesign"
                          style={{ marginLeft: Sizes.Base, marginBottom: 3 }}
                          size={17}
                          color={'green'}
                        />
                      ) : item.APPROVAL_STATUS == 'P' ? (
                        <Icon
                          name="timer-sand"
                          type="MaterialCommunityIcons"
                          style={{ marginLeft: Sizes.Base }}
                          size={22}
                        />
                      ) : item.APPROVAL_STATUS == 'B' ? (
                        <Icon
                          name="alpha-b-circle-outline"
                          type="MaterialCommunityIcons"
                          style={{ marginLeft: Sizes.Base, marginBottom: 3 }}
                          size={20}
                          color={'#f54e4e'}
                        />
                      ) : (
                        <Icon
                          name="checkcircleo"
                          type="AntDesign"
                          style={{ marginLeft: Sizes.Base, marginBottom: 3 }}
                          size={17}
                          color={'green'}
                        />
                      )}
                    </View>
                    {member?.ID == item.ID && (
                      <Icon
                        type="AntDesign"
                        name="check"
                        size={23}
                        style={{}}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          {/* {appUserData.length < 2 && ( */}
          {/* <View> */}
          <View
            style={{
              height: 1,
              width: '100%',
              backgroundColor: Colors.Primary,
              marginTop: Sizes.Padding,
              alignItems: 'center'
            }}
          />
          <TouchableOpacity
            onPress={() => setAddUserModal(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
              marginTop: Sizes.Base,
            }}>
            <View
              style={{
                backgroundColor: Colors.Primary,
                width: 40,
                borderRadius: 22,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: Colors.White, fontSize: 25, textAlign: 'center' }}>+</Text>
            </View>
            <Text
              style={{
                color: Colors.Primary,
                ...Fonts.Medium1,
                marginLeft: 10,
              }}>
              Add New User
            </Text>
          </TouchableOpacity>
          {/* </View> */}
          {/* )} */}
        </Modal>
      )}

      {openAddUserModal && (
        <AddNewRoleModal
          visible={openAddUserModal}
          onClose={() => {
            setAddUserModal(false);
          }}
          onSuccess={() => {
            setAddUserModal(false);
            setSwitchUserModal(false);
            navigation.goBack();
          }}
        />
      )}

      {openUpdateModal && (
        <Modal
          isVisible={openUpdateModal}
          onClose={() => {
            setOpenUpdateModal(false);
          }}>
          <View style={{}}>
            <View
              style={{
                marginHorizontal: -Sizes.Padding,
                marginTop: -Sizes.Padding,
              }}>
              <Image
                source={fancyRadius}
                style={{
                  width: '100%',
                  height: 60,
                  borderTopLeftRadius: Sizes.Base,
                  borderTopRightRadius: Sizes.Base,
                  marginBottom: Sizes.ScreenPadding,
                }}
              />
            </View>
            <Image
              source={rocket}
              style={{
                alignItems: 'center',
                position: 'absolute',
                alignSelf: 'center',
                height: 80,
                width: 30,
                top: -40,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{ color: Colors.PrimaryText1, ...Fonts.Bold2 }}>
                ABOUT UPDATE
              </Text>
              <Text style={{ color: Colors.Primary, ...Fonts.Medium2 }}>
                {DeviceInfo.getVersion()}
              </Text>
            </View>

            <View
              style={{ flexDirection: 'row', marginTop: Sizes.ScreenPadding }}>
              <TextButton
                isBorder
                style={{
                  flex: 1,
                  alignSelf: 'center',
                  marginTop: Sizes.Padding,
                }}
                label="Skip"
                loading={false}
                onPress={() => {
                  setOpenUpdateModal(false);
                }}
              />

              <View style={{ width: 10 }} />
              <TextButton
                style={{
                  flex: 1,
                  alignSelf: 'center',
                  marginTop: Sizes.Padding,
                }}
                label="Update"
                loading={false}
                onPress={async () => {
                  const result = await CheckVersion();
                  if (!result) {
                    setOpenUpdateModal(false);
                  }
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      {date.show && (
        <DateTimePicker
          value={date.myDate}
          mode={date.mode}
          is24Hour={true}
          display="default"
          onChange={changeSelectedDate}
        />
      )}

      <Modal
        isVisible={BugModal}
        onClose={() => {
          setBugModal(false);
        }}>
        <View style={{}}>
          <Text
            style={{
              color: Colors.PrimaryText1,
              ...Fonts.Bold2,
              fontSize: 14,
              textAlign: 'center',
            }}>
            Report Bug
          </Text>
          <Text style={{ color: Colors.PrimaryText1, ...Fonts.Medium2 }}>
            You Want to Sent Bug Report
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: Sizes.ScreenPadding,
            }}>
            <TextButton
              isBorder
              textStyle={{ fontSize: 12 }}
              style={{ flex: 1, borderColor: Colors.Secondary }}
              // label="Update One"
              label="Cancel"
              loading={false}
              onPress={() => {
                setBugModal(false);
              }}
            />
            <View style={{ width: 16 }} />
            <TextButton
              textStyle={{ fontSize: 12 }}
              style={{ flex: 1 }}
              label="Submit"
              loading={false}
              onPress={async () => {
                const path = `${RNFS.ExternalDirectoryPath}/logcat_output.txt`;
                const logExists = await RNFS.exists(path);
                if (logExists) {
                  SentBugReport();
                } else {
                  Toast('No Bug Found');
                }
              }}
            />
          </View>
        </View>
      </Modal>

      {modal.logoutModal && (
        <Modal
          onClose={() => {
            setModal({ ...modal, logoutModal: false });
          }}
          isVisible={modal.logoutModal}>
          <View style={{ paddingVertical: Sizes.Base }}>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Bold2,
                fontSize: 14,
                textAlign: 'center',
              }}>
              Logout
            </Text>
            <Text style={{ color: Colors.PrimaryText1, ...Fonts.Medium2 }}>
              Are you sure?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: Sizes.ScreenPadding,
              }}>
              <TextButton
                isBorder
                textStyle={{ fontSize: 12 }}
                style={{ flex: 1, borderColor: Colors.Secondary }}
                // label="Update One"
                label="No"
                loading={false}
                onPress={() => {
                  setModal({ ...modal, logoutModal: false });
                }}
              />
              <View style={{ width: 16 }} />
              <TextButton
                textStyle={{ fontSize: 12 }}
                style={{ flex: 1 }}
                label="Yes"
                loading={false}
                onPress={() => {
                  onLogoutPress();
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </Animated.View>
  );
};

export default Drawer;
