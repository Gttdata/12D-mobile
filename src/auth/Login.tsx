import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput as TI,
  Keyboard,
  NativeModules,
} from 'react-native';
import { FemaleUser, erp, logo, trackk_logo } from '../../assets';
import { apiPost, useSelector } from '../Modules';
import { getCountryCode, mobileValidation } from '../Functions';
import { TextButton, TextInput, Toast } from '../Components';
import Dropdown from '../Components/Dropdown';
import { StackAuthProps } from './AuthRoutes';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import TextInputSimple from '../Components/TextInputSimple';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
const IMAGE_WIDTH = 180;
const { batteryRestrictionsModule, CheckUsedApp } = NativeModules;

type Props = StackAuthProps<'Login'>;
const Login = ({ navigation }: Props): JSX.Element => {
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const [selectedCountry, setSelectedCountry] = useState({
    value: '91',
    label: '+91',
  });
  const { t } = useTranslation();
  const countryCodes = getCountryCode();
  const inputFocus = useRef<TI>();
  const [label, setLabel] = useState({
    text: t('login.signIn'),
    button: t('login.getOtp'),
    description: t('login.description'),
  });
  const [code, setCode] = useState({
    value: '',
    loading: false,
    error: false,
    isNew: false,
    showOtp: false,
  });
  const onSendOtp = async () => {
    if (!inputFocus.current?.isFocused()) {
      inputFocus.current?.focus();
    }
    setCode({ ...code, loading: true });
    try {
      if (!(await checkValidation())) {
        setCode({ ...code, loading: false });
        return;
      }
      const res = await apiPost('appUser/sendLoginOTP', {
        MOBILE_NO: code.value,
      });
      if (res && res.code == 200) {
        Keyboard.dismiss();
        setCode({
          ...code,
          showOtp: true,
          error: false,
          loading: false,
          isNew: res.type == 0,
        });
        navigation.navigate('OtpScreen', { mobile: code.value });
      } else {
        setCode({ ...code, loading: false, error: true });
        setLabel({ ...label, text: res?.message });
      }
    } catch (e) {
      console.warn(e);
      setCode({ ...code, loading: false, error: true });
      setLabel({ ...label, text: 'error occupied ' + e });
    }
  };
  const checkValidation: () => Promise<boolean> = async () => {
    if (code.value.trim() == '') {
      Toast(t('login.numberToast1'));
      return false;
    } else if (code.value && !mobileValidation.test(code.value)) {
      Toast('Please enter valid mobile number');
      return false;
    } else if (code.value.length < 10) {
      Toast(t('login.numberToast2'));
      return false;
    } else {
      return true;
    }
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
              entering={FadeInUp.duration(1000).springify()}
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

      <Animated.View
        entering={FadeInDown.delay(400).duration(1000).springify()}
        style={{
          marginTop: -60,
          marginHorizontal: 50,
          elevation: 10,
          backgroundColor: Colors.White,
          padding: Sizes.ScreenPadding,
          borderRadius: Sizes.ScreenPadding,
        }}>
        <View
          style={{
            // marginVertical: Sizes.ScreenPadding,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ ...Fonts.Bold1, color: Colors.PrimaryText }}>
            Welcome to 12 Dimensions
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View style={{ marginRight: 3, width: '25%' }}>
            <Dropdown
              data={countryCodes}
              value={selectedCountry}
              search={true}
              onChange={item => {
                setSelectedCountry({
                  ...selectedCountry,
                  label: item.label,
                  value: item.value,
                });
              }}
              placeholder={'Select'}
              // label="Country Code"
              labelField="label"
              valueField="value"
              dropdownStyle={{
                paddingRight: 5,
                paddingLeft: 15,
                alignSelf: 'center',
              }}
              style={{ borderWidth: 0, elevation: 6 }}
              textStyle={{
                ...Fonts.Regular3,
                alignItems: 'center',
                textAlignVertical: 'center',
                justifyContent: 'center',
                color: Colors.PrimaryText,
                alignSelf: 'center',
              }}
            />
          </View>
          <TextInput
            style={{ width: '75%' }}
            keyboardType={'number-pad'}
            maxLength={10}
            error={code.error}
            onChangeText={(value: string) => {
              const newValue = value.replace(/\s/g, '');
              setCode({ ...code, value: newValue, error: false });
            }}
            value={code.value}
            placeholder={t('login.number')}
          />
        </View>

        <View
          style={{
            marginTop: 25,
            marginBottom: Sizes.Padding,
          }}>
          <TextButton
            style={{ backgroundColor: 'red' }}
            label={t('login.getOtp')}
            loading={code.loading}
            onPress={() => {
              onSendOtp();
              // navigation.navigate('OtpScreen', {mobile: code.value});
            }}
          />
        </View>
      </Animated.View>

      <Animated.Text
        entering={FadeInDown.delay(600).duration(1000).springify()}
        style={{
          ...Fonts.Regular3,
          color: Colors.PrimaryText,
          textAlign: 'center',
          padding: Sizes.ScreenPadding,
          marginTop: Sizes.ScreenPadding,
        }}>
        {label.description}
      </Animated.Text>
    </View>
  );
};
export default Login;
