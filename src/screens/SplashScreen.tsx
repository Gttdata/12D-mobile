import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {View, Image, Alert, BackHandler, Text, Linking} from 'react-native';
import {checkInternet, classFilter, displayYear, hp, wp} from '../Functions';
import {FemaleUser, logo} from '../../assets';
import {Reducers, apiPost, apiPut, useDispatch, useSelector} from '../Modules';
import moment from 'moment';
import {MEMBER_INTERFACE} from '../Modules/interface';
import DeviceInfo from 'react-native-device-info';
import { PACKAGE_NAME } from '../Modules/service';
const SplashScreen = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    Promise.allSettled([checkInternet(), checkUser()]).then(() => {
      setTimeout(() => {
        dispatch(Reducers.setShowSplash(false));
      }, 3000);
    });
  }, []);

  const checkUser = async () => {
    try {
      const MOBILE_NUMBER = await AsyncStorage.getItem('MOBILE_NUMBER');
      if (MOBILE_NUMBER) {
        const res = await apiPost('api/appUser/get', {
          filter: `AND MOBILE_NUMBER = ${MOBILE_NUMBER} AND STATUS = 1 `,
        });
        if (res && res.code == 200) {
          if (res.data?.length > 0) {
            const activeUserId = await AsyncStorage.getItem('ACTIVE_USER_ID');
            if (activeUserId) {
              const memberData = res.data.filter(
                (item: any) => item.ID == activeUserId,
              )[0];
              console.log('memberData', res.data);
              if (memberData) {
                dispatch(
                  Reducers.setMember({
                    user: memberData,
                    location: '',
                    profile: FemaleUser,
                  }),
                );
                const currentDate = moment(new Date()).format('YYYY-MM-DD');
                if (memberData.SUBSCRIPTION_EXPIRE_DATE) {
                 
                   console.log('currentDate', memberData.SUBSCRIPTION_EXPIRE_DATE < currentDate);
                   console.log('currentDate', memberData.SUBSCRIPTION_EXPIRE_DATE );
                   console.log('currentDate',  currentDate);
                  if (memberData.SUBSCRIPTION_EXPIRE_DATE < currentDate) {
                    AsyncStorage.setItem('SUBSCRIPTION_DETAILS', '');
                  }
                }
                updateUser(memberData);
                getSubscriptionDetails(memberData);
                getMemberAllRoleData();
              } else {
                await AsyncStorage.setItem('ACTIVE_USER_ID', '');
                checkUser();
              }
            } else {
              dispatch(
                Reducers.setMember({
                  user: res.data[0],
                  location: '',
                  profile: FemaleUser,
                }),
              );
              AsyncStorage.setItem('ACTIVE_USER_ID', '' + res.data[0].ID);
              const currentDate = moment(new Date()).format('YYYY-MM-DD');
              if (res.data[0].SUBSCRIPTION_EXPIRE_DATE) {
                if (res.data[0].SUBSCRIPTION_EXPIRE_DATE < currentDate) {
                  AsyncStorage.setItem('SUBSCRIPTION_DETAILS', '');
                }
              }
              updateUser(res.data[0]);
              getSubscriptionDetails(res.data[0]);
              getMemberAllRoleData();
            }
          } else {
          }
        } else {
        }
      } else {
      }
    } catch (error) {
      console.warn(error);
      Alert.alert(
        'Something went wrong',
        'Please try again later',
        [{text: 'OK', onPress: () => BackHandler.exitApp()}],
        {cancelable: false},
      );
    }
  };
 
const CheckVersion = async () => {
  try {
    // 1. Get version info from server
    const res = await apiPost('globalSettings/getVersion', {});

    if (res && res.code === 200) {
      const latestVersion = res?.data?.[0]?.CUR_VERSION;

      // 2. Get installed version
      const currentVersion = DeviceInfo.getVersion(); // e.g., "1.0.0"

      console.log('Current:', currentVersion, 'Latest:', latestVersion);

      // 3. Compare versions
      if (currentVersion < latestVersion) {
        Alert.alert(
          'Update Required',
          'A new version of the app is available. Please update to continue.',
          [
            {
              text: 'Update Now',
              onPress: () => {
                const playStoreUrl = `market://details?id=${PACKAGE_NAME}`;
                const fallbackUrl = `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`;

                Linking.openURL(playStoreUrl).catch(() => {
                  Linking.openURL(fallbackUrl);
                });

                // Optional: Exit app after redirection
                BackHandler.exitApp();
              },
            },
          ],
          { cancelable: false }
        );
      }
    }
  } catch (error) {
    console.warn(error);
    Alert.alert(
      'Something went wrong',
      'Please try again later',
      [{ text: 'OK', onPress: () => BackHandler.exitApp() }],
      { cancelable: false }
    );
  }
};

  const getSubscriptionDetails = async (member: MEMBER_INTERFACE) => {
    try {
      const res = await apiPost('api/userSubscription/get', {
        filter: ` AND USER_ID = ${member?.ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        AsyncStorage.setItem(
          'SUBSCRIPTION_PAID_AMOUNT',
          '' + res.data[0].PAID_AMOUNT,
        );
      }
    } catch (error) {}
  };
  const updateUser = async (item: MEMBER_INTERFACE) => {
    try {
      const deviceName = await DeviceInfo.getDeviceName();
      const androidVersion = await DeviceInfo.getSystemVersion();
      const appVersion = await DeviceInfo.getVersion();
      const lastVisitDatetime = moment().format('YYYY-MM-DD HH:mm:ss');
      const body = {
        ID: item.ID,
        DEVICE_NAME: deviceName,
        ANDROID_VERSION: androidVersion,
        APP_VERSION: appVersion,
        LAST_VISIT_DATETIME: lastVisitDatetime,
        IDENTITY_NUMBER: item.IDENTITY_NUMBER,
        PROFILE_PHOTO: item.PROFILE_PHOTO,
        STATUS:1
      };
      const res = await apiPut('api/appUser/update', body);
      if (res && res.code == 200) {
      }
    } catch (error) {}
  };
  const getMemberAllRoleData = async () => {
    const MOBILE_NUMBER = await AsyncStorage.getItem('MOBILE_NUMBER');
    try {
      const res = await apiPost('api/appUser/get', {
        filter: `AND MOBILE_NUMBER = ${MOBILE_NUMBER} `,
      });
      if (res && res.code == 200) {
        // console.log('\n\n..bbbb...', res);
        if (res.data?.length > 0) {
          dispatch(Reducers.setAppUserData(res.data));
        } else {
        }
      }
    } catch (error) {}
  };
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,
      }}>
      <Image
        source={logo}
        style={[
          {
            width: wp(100),
            height: hp(41),
          },
        ]}
        resizeMode="contain"
      />
      <Text
        style={{
          color: Colors.PrimaryText1,
          ...Fonts.Bold1,
          fontSize: 17,
          marginTop: Sizes.Base,
        }}>
        {/* 12 Dimensions : Productivity App */}
        12 Dimensions
      </Text>
      <Text
        style={{
          color: Colors.Black,
          ...Fonts.Regular2,
          textAlign: 'center',
          fontSize: 13,
        }}>
        Awake Aware Alert..!
        {/* Productivity, Health & Fitness, Workout routines, Habit tracking */}
      </Text>
    </View>
  );
};
export default SplashScreen;
