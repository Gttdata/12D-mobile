import { View, Text, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from '../Components/Icon';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { Reducers, apiPost, apiPut, useDispatch, useSelector } from '../Modules';
import { Modal, TextButton, Toast } from '../Components';
import { StackAuthProps } from './AuthRoutes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import { erp, logo, trackk_logo } from '../../assets';
import messaging from '@react-native-firebase/messaging';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import AppInfoScreens from '../screens/AppInfoScreens';

const IMAGE_WIDTH = 180;

type Props = StackAuthProps<'OtpScreen'>;
const OtpScreen = ({ navigation, route }: Props): JSX.Element => {
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const { t } = useTranslation();
  const { mobile } = route.params;
  const dispatch = useDispatch();
  const [otp, setOtp] = useState({
    otp: '',
    loading: false,
  });
  const [timer, setTimer] = useState(30);
  const [showAppInfoData, setShowAppInfoData] = useState(false);
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const checkValidation = () => {
    if (otp.otp.trim() == '') {
      Toast(t('otpScreen.otpToast'));
      return false;
    } else {
      return true;
    }
  };
  const verifyOtp = async (value: any) => {
    setOtp(prev => ({ ...prev, loading: true }));

    const CLOUD_ID = await messaging().getToken();


    if (!checkValidation(value)) {
      setOtp(prev => ({ ...prev, loading: false }));
      return;
    }
    try {
      setOtp(prev => ({ ...prev, loading: true }));
      const res = await apiPost('appUser/verifyLoginOTP', {
        MOBILE_NO: mobile,
        OTP: value,
        CLOUD_ID,
      });
      if (res && res.code == 200) {
        setOtp({ ...otp, loading: false });
        console.log('...........0000 res.....', res.data);
        if (res.data[0].IS_NEW_USER == 0) {
          const user = res.data[1].UserData;
          const token: string = res.data[1].token;
          await AsyncStorage.setItem('USER_ID', '' + user.ID);
          await AsyncStorage.setItem('token', '' + token);
          await AsyncStorage.setItem('MOBILE_NUMBER', '' + mobile);
          setOtp({ ...otp, loading: false });
          // dispatch(Reducers.setShowSplash(true));
          setShowAppInfoData(true);
        }

        if (res.data[0].IS_NEW_USER == 1 && res.data[1].UserData.length > 0) {
          const token: string = res.data[1].token;
          const item = res.data[1].UserData[0];
          await AsyncStorage.setItem('token', '' + token);
          setOtp({ ...otp, loading: false });

          navigation.navigate('AppRegistrationScreen', {
            item,
            mobile,
            IS_NEW_USER: 1,
          });
        } else if (
          res.data[0].IS_NEW_USER == 1 &&
          !res.data[1].UserData.length
        ) {
          navigation.navigate('AppRegistrationScreen', {
            item: res.data[0],
            mobile,
            IS_NEW_USER: 0,
          });
        }
      } else if (res && res.code == 300) {
        setOtp({ ...otp, loading: false });
        Toast(res.message);
      }
    } catch (error) {
      setOtp({ ...otp, loading: false });
      console.log('error..', error);
    }
  };

  const onReSendOtp = async () => {
    try {
      const res = await apiPost('appUser/sendLoginOTP', {
        MOBILE_NO: mobile,
      });
      if (res && res.code == 200) {
      } else {
      }
    } catch (e) { }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.Background,
      }}>
      {/**Image part*/}
      <LinearGradient
        colors={[Colors.Secondary, Colors.Primary2, Colors.Primary]}
        style={{
          width: '100%',
          height: 350,
          borderBottomRightRadius: 40,
          borderBottomLeftRadius: 40,
        }}
        angle={110}>
        <View style={{}}>
          <View
            style={{
              height: IMAGE_WIDTH,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: Sizes.ScreenPadding * 3,
            }}>
            <Animated.Image
              entering={FadeInUp.delay(600).duration(1000).springify()}
              resizeMode={'contain'}
              style={{
                width: IMAGE_WIDTH,
                height: IMAGE_WIDTH,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              source={logo}
            />
            <Text style={{ color: Colors.White, ...Fonts.Bold2 }}>
              12 Dimensions : Productivity App
            </Text>
            <Text
              style={{
                color: Colors.White,
                ...Fonts.Regular2,
                textAlign: 'center',
                fontSize: 12,
                marginHorizontal: Sizes.Padding,
              }}>
              Productivity, Health & Fitness, Workout routines, Habit tracking
              {/* Awake Aware Alert..! */}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/*login part*/}

      <View
        style={{
          marginTop: -60,
          marginHorizontal: Sizes.ScreenPadding,
          elevation: 10,
          backgroundColor: Colors.White,
          padding: Sizes.ScreenPadding,
          borderRadius: Sizes.ScreenPadding,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: Colors.PrimaryText, ...Fonts.Bold2 }}>
            {mobile}
          </Text>
          <Icon
            name="edit"
            type="AntDesign"
            size={16}
            style={{ marginLeft: Sizes.Radius }}
            onPress={() => navigation.navigate('Login')}
          />
        </View>
        <OTPInputView
          editable={!otp.loading}
          keyboardType="number-pad"
          style={{ height: 50 }}
          pinCount={6}
          autofillFromClipboard={true}
          autoFocusOnLoad
          codeInputFieldStyle={{
            width: 40,
            height: 50,
            borderWidth: 0,
            borderColor: Colors.Secondary,
            color: Colors.PrimaryText,
            ...Fonts.Medium2,
            borderBottomWidth: 1,
          }}
          codeInputHighlightStyle={{ borderColor: Colors.Primary }}
          onCodeFilled={value => {
            // setOtp({...otp, otp: value, loading: true});
            // verifyOtp(value);

            setOtp(prev => ({ ...prev, otp: value }));
            verifyOtp(value);
          }}
          onCodeChanged={value => {
            setOtp({ ...otp, otp: value });
          }}
        />
        <View>
          <TextButton
            onPress={() => {
              verifyOtp(otp.otp);
            }}
            loading={otp.loading}
            label={t('otpScreen.Verify')}
            style={{ marginTop: Sizes.ScreenPadding }}
          />
        </View>

        <Text
          disabled={timer > 0}
          style={{
            ...Fonts.Regular3,
            fontSize: 10,
            marginTop: Sizes.Radius,
            color: Colors.Primary,
            textAlign: 'right',
            justifyContent: 'flex-end',
          }}
          onPress={() => {
            setOtp({ ...otp, otp: '' });
            setTimer(30);
            onReSendOtp();
          }}>
          {timer > 0
            ? `${t('otpScreen.ResendOTP')}(${timer})`
            : t('otpScreen.ResendOTP')}
        </Text>
      </View>
      {showAppInfoData ? (
        <AppInfoScreens onClose={() => setShowAppInfoData(false)} />
      ) : null}
    </View>
  );
};

export default OtpScreen;
