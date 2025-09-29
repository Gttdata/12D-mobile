import { View, Text, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Header, Modal, TextButton, TextInput, Toast } from '../../Components';
import { apiPost, useSelector } from '../../Modules';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { emailValidation } from '../../Functions';
import { useTranslation } from 'react-i18next';
import { StackProps } from '../../routes';
import { erp } from '../../../assets';

type Props = StackProps<'SchoolRegistration'>;
const SchoolRegistration = ({ navigation, route }: Props) => {
  const { Colors, Sizes, Fonts } = useSelector(state => state.app);
  const [data, setData] = useState({
    email: '',
    otp: '',
    loading: false,
  });
  const { t } = useTranslation();
  const { schoolInfo } = route.params;
  const [openModal, setOpenModal] = useState(false);
  const [showOTPView, setShowOtpView] = useState(false);
  const [timer, setTimer] = useState(30);

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
    if (data.email.trim() == '') {
      Toast(t('Profile.Pleaseenteremailaddress'));
      return true;
    } else if (data.email && !emailValidation.test(data.email)) {
      Toast(t('Profile.PleaseenterValidEmailAddress'));
      return true;
    } else {
      return false;
    }
  };
  const OTPValidation = () => {
    if (data.otp.trim() == '') {
      Toast(t('SchoolRegistration.PleaseEnterOTP'));
      return false;
    } else {
      return true;
    }
  };
  const getOtp = async () => {
    if (checkValidation()) {
      setData({ ...data, loading: false });
      return;
    }
    try {
      setData({ ...data, loading: true });
      const res = await apiPost('school/sendRegistrationOTP', {
        EMAIL_ID: data.email,
      });
      if (res && res.code == 200) {
        setData({ ...data, loading: false });
        setShowOtpView(true);
      } else {
        setData({ ...data, loading: false });
        Toast(res.message);
      }
    } catch (error) {
      setData({ ...data, loading: false });
      console.log('error..', error);
    }
  };
  const verifyOtp = async (value: any) => {
    if (!(await OTPValidation())) {
      setData({ ...data, loading: false });
      return;
    }
    try {
      setData({ ...data, loading: true });
      const res = await apiPost('school/verifyRegistrationOTP', {
        EMAIL_ID: data.email,
        OTP: value,
      });
      if (res && res.code == 200) {
        setData({ ...data, loading: false, email: '', otp: '' });
        setOpenModal(false);
        setShowOtpView(false);
        navigation.navigate('RegistrationScreen', {
          schoolInfo,
          email: data.email,
        });
      } else {
        setData({ ...data, loading: false });
        Toast(res.message);
      }
    } catch (error) {
      setData({ ...data, loading: false });
      console.log('error..', error);
    }
  };
  const onReSendOtp = async () => {
    try {
      const res = await apiPost('school/sendRegistrationOTP', {
        EMAIL_ID: data.email,
      });
      if (res && res.code == 200) {
        console.log(res);
      } else {
        Toast(`Something wrong...${res.message}`);
      }
    } catch (e) { }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.White,
      }}>
      <Header
        label="School ERP"
        onBack={() => {
          navigation.goBack();
        }}
      />
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
        }}>
        <Image
          source={erp}
          style={{ width: '80%', height: 230 }}
          resizeMode="contain"
        />
        <View style={{ flex: 1, marginHorizontal: Sizes.Padding }}>
          <Text
            style={{ ...Fonts.Medium2, color: Colors.PrimaryText1 }}
            textBreakStrategy="simple">
            A school ERP system is a comprehensive software solution designed to
            streamline and automate various administrative, academic, and
            operational tasks within an educational institution. It manages
            student information, attendance, staff records and financial
            accounting.
          </Text>
          <Text
            style={{
              ...Fonts.Medium2,
              color: Colors.PrimaryText1,
              marginTop: Sizes.Radius,
            }}
            textBreakStrategy="simple">
            By centralizing data and automating processes, a school ERP improves
            efficiency, enhances communication, supports better decision-making,
            and ensures compliance with educational regulations.
          </Text>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              marginVertical: Sizes.Padding,
            }}>
            <TextButton
              label="Continue"
              loading={false}
              onPress={() => {
                setOpenModal(true);
              }}
            />
          </View>
        </View>
      </View>

      {openModal && (
        <Modal
          onClose={() => {
            setOpenModal(false);
            setData({ email: '', loading: false, otp: '' });
            setShowOtpView(false);
          }}
          isVisible={openModal}
          title={
            showOTPView ? 'Verify OTP' : t('SchoolRegistration.EnterEmail')
          }
          containerStyle={{ justifyContent: 'center' }}>
          {!showOTPView ? (
            <View style={{ marginTop: Sizes.ScreenPadding }}>
              <Text
                style={{
                  ...Fonts.Medium4,
                  color: Colors.PrimaryText1,
                  marginBottom: 4,
                }}>
                Enter school registered Email id
              </Text>
              <TextInput
                keyboardType="email-address"
                onChangeText={txt => {
                  setData({ ...data, email: txt });
                }}
                value={data.email}
                placeholder={t('SchoolRegistration.EnterEmail')}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: Sizes.Base,
                }}>
                <TextButton
                  isBorder
                  label={t('common.Cancel')}
                  loading={false}
                  onPress={() => {
                    navigation.goBack();
                  }}
                  style={{ flex: 1, marginTop: Sizes.ScreenPadding }}
                />
                <View style={{ width: 10 }} />
                <TextButton
                  label={t('common.getOtp')}
                  loading={data.loading}
                  onPress={() => {
                    getOtp();
                  }}
                  style={{ flex: 1, marginTop: Sizes.ScreenPadding }}
                />
              </View>
            </View>
          ) : (
            <View>
              <View style={{ marginVertical: Sizes.ScreenPadding }}>
                <OTPInputView
                  keyboardType="number-pad"
                  style={{ height: 43 }}
                  pinCount={6}
                  codeInputFieldStyle={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    borderWidth: 0.5,
                    borderColor: Colors.Primary2,
                    backgroundColor: '#FFF',
                    shadowColor: Colors.Primary,
                    elevation: 4,
                    shadowRadius: 5,
                    color: Colors.Primary,
                    ...Fonts.Medium3,
                  }}
                  onCodeChanged={value => {
                    setData({ ...data, otp: value });
                  }}
                  onCodeFilled={async value => {
                    setData({ ...data, otp: value, loading: true });
                    verifyOtp(value);
                  }}
                />
              </View>
              <TextButton
                onPress={() => {
                  verifyOtp(data.otp);
                }}
                loading={data.loading}
                label={t('common.Verify')}
                style={{
                  marginBottom: Sizes.ScreenPadding,
                  marginTop: Sizes.Base,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: Sizes.Base,
                }}>
                <Text
                  style={{
                    ...Fonts.Medium3,
                    color: Colors.Primary,
                  }}
                  onPress={() => setShowOtpView(false)}>
                  {'Change email address'}
                </Text>
                <Text
                  disabled={timer > 0}
                  style={{
                    ...Fonts.Medium3,
                    color: Colors.Primary,
                  }}
                  onPress={() => {
                    setTimer(30);
                    onReSendOtp();
                  }}>
                  {timer > 0
                    ? `${t('common.ResendOtp')}(${timer})`
                    : t('common.ResendOtp')}
                </Text>
              </View>
            </View>
          )}
        </Modal>
      )}
    </View>
  );
};

export default SchoolRegistration;
