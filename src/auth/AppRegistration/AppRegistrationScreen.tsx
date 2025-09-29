import {View, Text, Image, TouchableOpacity, ScrollView, Linking} from 'react-native';
import React, {useState} from 'react';
import {StackAuthProps} from '../AuthRoutes';
import {useTranslation} from 'react-i18next';
import {Reducers, apiPost, useDispatch, useSelector} from '../../Modules';
import {emailValidation, getCountryCode} from '../../Functions';
import LinearGradient from 'react-native-linear-gradient';
import {logo, noProfile, trackk_logo} from '../../../assets';
import {Icon, TextButton, TextInput, Toast} from '../../Components';
import {Checkbox, RadioButton} from 'react-native-paper';
import DropdownSimple from '../../Components/DropdownSimple';
import moment from 'moment';
import Dropdown from '../../Components/Dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import TermsConditionModal from '../../Components/TermsConditionModal';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated';
import AppInfoScreens from '../../screens/AppInfoScreens';

type Props = StackAuthProps<'AppRegistrationScreen'>;
const IMAGE_WIDTH = 350;
const AppRegistrationScreen = ({navigation, route}: Props) => {
  const {item, mobile, IS_NEW_USER} = route.params;
  console.log("item...", IS_NEW_USER);
  
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {t} = useTranslation();
  const countryCodes = getCountryCode();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    name: item?.NAME,
    gender: item?.GENDER ? item?.GENDER : 'M',
    countryCode: {label: '+91', value: '91'},
    mobileNumber: mobile,
    email: item?.EMAIL_ID,
    openTermsModal: false,
    termsAndCondition: false,
  });
  const [showAppInfoData, setShowAppInfoData] = useState(false);
  
  const [date, setDate] = useState<{
    myDate: any;
    mode: any;
    show: boolean;
  }>({
    myDate: item.DOB
      ? new Date(item.DOB)
      : new Date(new Date().setFullYear(2000)),
    mode: 'date',
    show: false,
  });
  const changeSelectedDate = (event: any, selectedDate: any) => {
    if (selectedDate) {
      setDate({...date, myDate: selectedDate, show: false});
    } else {
      setDate({...date, show: false});
    }
  };
  const checkValidation = () => {
    if (!inputs.name || inputs.name?.trim() == '') {
      Toast('Please enter name');
      return true;
    } else if (!date.myDate) {
      Toast(t('appRegister.dobToast'));
      return true;
    } else if (!inputs.termsAndCondition) {
      Toast('Please agree terms and condition');
      return true;
    } else {
      return false;
    }
  };
  const registration = async () => {
    const CLOUD_ID = await messaging().getToken();
    if (checkValidation()) {
      return;
    }
    setLoading(true);
    try {
      let body = {
        NAME: inputs.name,
        EMAIL_ID: '',
        DOB: moment(date.myDate).format('YYYY-MM-DD HH:mm:ss'),
        GENDER: inputs.gender,
        MOBILE_NUMBER: mobile,
        CLIENT_ID: 1,
        STATUS: 1,
        CLOUD_ID,
        IS_NEW_USER,
        ROLE: 'U',
      };
      const res = await apiPost('appUser/register', body);
      if (res && res.code == 200) {
        setLoading(false);
        
        if (IS_NEW_USER == 0) {
          const user = res.data[1].UserData[0];
          const token: string = res.data[1].token;
          await AsyncStorage.setItem('MOBILE_NUMBER', '' + user.MOBILE_NUMBER);
          await AsyncStorage.setItem('USER_ID', '' + user.ID);
          await AsyncStorage.setItem('token', '' + token);
          // dispatch(Reducers.setShowSplash(true));
          setShowAppInfoData(true);
          // sendRegistartionMessage();
        } else {
          await AsyncStorage.setItem('MOBILE_NUMBER', '' + item.MOBILE_NUMBER);
          await AsyncStorage.setItem('USER_ID', '' + item.ID);
          // dispatch(Reducers.setShowSplash(true));
          setShowAppInfoData(true);
          sendRegistartionMessage();
        }
      } else {
        Toast('Something Wrong Please Try Again..');
      }
    } catch (error) {
      setLoading(false);
      console.log('error...', error);
    }
  };
  const sendRegistartionMessage=async()=>{
     try {
          const res = await apiPost("api/appUser/sendRegistrationMessage", {
            MOBILE_NUMBER: inputs.mobileNumber,
            NAME: inputs.name,
          });
          console.log("res..", res);
          if (res && res.code == 200) {
            console.log("Message sent");
          }
        } catch (error) {
          setLoading(false);
          console.log("error..", error);
        }
  }
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{flex: 1, backgroundColor: Colors.Background}}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: Colors.Background,
        }}>
        <LinearGradient
          colors={[Colors.Primary2, Colors.Primary]}
          style={{
            width: '100%',
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
          }}
          angle={110}>
          <View style={{height: IMAGE_WIDTH}}>
            <View
              style={{
                height: '100%',
                alignItems: 'center',
                marginTop: Sizes.ScreenPadding,
                marginBottom: Sizes.ScreenPadding,
              }}>
              <Animated.Image
                entering={FadeInUp.delay(600).duration(1000).springify()}
                resizeMode={'contain'}
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: Sizes.ScreenPadding,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                source={logo}
              />
              <Text
                style={{
                  ...Fonts.Bold2,
                  color: Colors.White,
                }}>{`12 Dimensions`}</Text>

              <Text style={{color: Colors.White, ...Fonts.Regular2}}>
                Awake Aware Alert..!
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/*Register part*/}
        <View
          style={{
            marginTop: -90,
            margin: Sizes.ScreenPadding,
            padding: Sizes.ScreenPadding,
            elevation: 10,
            backgroundColor: Colors.White,
            paddingHorizontal: Sizes.Padding,
            borderRadius: Sizes.ScreenPadding,
          }}>
          {/* name */}
          <TextInput
            label="Name"
            onChangeText={txt => {
              setInputs({...inputs, name: txt});
            }}
            value={inputs.name}
            placeholder={'Enter Name'}
          />

          {/* dob */}
          <View style={{marginTop: Sizes.Base}}>
            <DropdownSimple
              selectText="Date of Birth"
              icon={<Icon name="calendar" type="EvilIcons" size={30} />}
              containerStyle={{
                marginRight: 0,
                borderBottomWidth: 0,
              }}
              style={{
                elevation: 6,
                padding: Sizes.Base,
                borderRadius: Sizes.Base,
                backgroundColor: Colors.White,
              }}
              labelText={moment(date.myDate).format('DD/MMM/YYYY')}
              onPress={() => setDate({...date, show: true})}
              imp={false}
            />
          </View>

          {/* gender */}
          <View
            style={{
              alignItems: 'center',
              marginTop: Sizes.Base,
              // marginHorizontal: 2,
              flexDirection: 'row',
            }}>
            <Text style={{...Fonts.Medium3, color: Colors.PrimaryText1}}>
              {`Gender : `}
            </Text>
            <RadioButton.Group
              onValueChange={value => {
                setInputs({...inputs, gender: value});
              }}
              value={inputs.gender}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <RadioButton value={'M'} color={Colors.Primary2} />
                  <Text
                    style={{
                      color: Colors.PrimaryText1,
                      ...Fonts.Regular3,
                    }}>
                    {t('appRegister.male')}
                  </Text>
                </View>
                <View style={{width: Sizes.ScreenPadding}} />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <RadioButton value={'F'} color={Colors.Primary2} />
                  <Text
                    style={{
                      color: Colors.PrimaryText1,
                      ...Fonts.Regular3,
                    }}>
                    {t('appRegister.female')}
                  </Text>
                </View>
                <View style={{width: Sizes.ScreenPadding}} />
              </View>
            </RadioButton.Group>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Checkbox
              color={Colors.Primary}
              status={inputs.termsAndCondition ? 'checked' : 'unchecked'}
              onPress={() => {
                setInputs({
                  ...inputs,
                  termsAndCondition: !inputs.termsAndCondition,
                });
              }}
            />
            <Text
              onPress={() => {
                setInputs({
                  ...inputs,
                  termsAndCondition: !inputs.termsAndCondition,
                });
              }}
              style={{
                textAlign: 'center',
                ...Fonts.Medium3,
                color: Colors.PrimaryText,
                flex: 1,
              }}>
              {'I agree to all '}
              <Text
                onPress={() => {
                    Linking.openURL('https://www.12dimensionsapp.in/terms.html');
                  // setInputs({...inputs, openTermsModal: true});
                }}
                style={{
                  ...Fonts.Bold3,
                  color: Colors.PrimaryText1,
                }}>
                Terms and Conditions, Disclaimer and Privacy policy
              </Text>
              {' of APP'}
            </Text>
          </View>

          <View
            style={{
              marginTop: Sizes.Radius,
            }}>
            <TextButton
              label={'Register'}
              loading={loading}
              onPress={() => {
                // setShowAppInfoData(true);
                registration();
              }}
            />
          </View>
        </View>

        {/* Bottom Part */}
      </View>
      <View
        style={{
          backgroundColor: Colors.Background,
          paddingBottom: Sizes.ScreenPadding,
        }}>
        {IS_NEW_USER == 0 && (
          <View
            style={{marginVertical: Sizes.ScreenPadding, alignItems: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  height: 1.5,
                  backgroundColor: Colors.Black,
                  width: 120,
                  alignSelf: 'center',
                }}
              />
              <Text
                style={{
                  ...Fonts.Medium2,
                  color: Colors.Black,
                  marginHorizontal: Sizes.Base,
                }}>
                OR
              </Text>
              <View
                style={{
                  height: 1.5,
                  backgroundColor: Colors.Black,
                  width: 120,
                  alignSelf: 'center',
                }}
              />
            </View>
            <Text
              onPress={() => {
                navigation.navigate('TeacherStudentRegistration', {mobile});
              }}
              style={{
                ...Fonts.Medium2,
                color: Colors.Primary,
                marginHorizontal: Sizes.Base,
              }}>
              Login as educational institution
            </Text>
          </View>
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
        {inputs.openTermsModal && (
          <TermsConditionModal
            visible={inputs.openTermsModal}
            onClose={() => {
              setInputs({...inputs, openTermsModal: false});
            }}
            title="Terms & Conditions"
          />
        )}
      </View>
      {showAppInfoData ? (
        <AppInfoScreens onClose={() => setShowAppInfoData(false)} />
      ) : null}
    </ScrollView>
  );
};

export default AppRegistrationScreen;
