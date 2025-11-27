import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment, { duration } from 'moment';
import { RadioButton } from 'react-native-paper';
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
import { FemaleUser, noProfile } from '../../assets';
import DropdownSimple from '../Components/DropdownSimple';
import { emailValidation, height } from '../Functions';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import Dropdown from '../Components/Dropdown';
import {
  PERMISSIONS,
  RESULTS,
  request,
  requestMultiple,
} from 'react-native-permissions';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const Profile = ({ navigation }: any) => {
  const opacity = useSharedValue(0);
  const headerAnimation = useSharedValue(0);
  const imageanimation = useSharedValue(-200);

  // Add refs for scrolling and keyboard handling
  const scrollViewRef = useRef<ScrollView>(null);
  const cityDropdownRef = useRef<any>(null);
  const districtDropdownRef = useRef<any>(null);
  const stateDropdownRef = useRef<any>(null);
  const countryDropdownRef = useRef<any>(null);

  useEffect(() => {
    headerAnimation.value = withTiming(160, { duration: 1000 });
    imageanimation.value = withTiming(0, { duration: 1000 });
    opacity.value = withTiming(1, { duration: 1500 });

    if (member?.COUNTRY_NAME) {
      getCountryList();
    }
    getCountryList();
    getCityList();
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const animationstyle = useAnimatedStyle(() => {
    return {
      height: headerAnimation.value,
    };
  });

  const Imageanimationstyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: imageanimation.value }],
    };
  });

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const { member } = useSelector(state => state.member);
  const [studentStatus, setStudentStatus] = useState({
    status: '',
    remark: '',
  });
  const [teacherStatus, setTeacherStatus] = useState({
    status: '',
    remark: '',
  });
  const [openGenderModal, setGenderModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    name: member?.NAME,
    dateOfBirth: member?.DOB,
    gender: member?.GENDER,
    mobileNumber: member?.MOBILE_NUMBER,
    email: member?.EMAIL_ID,
    address: member?.ADDRESS ? member?.ADDRESS : '',
    country: {
      NAME: member?.COUNTRY_NAME ? member?.COUNTRY_NAME : '',
      ID: member?.COUNTRY_ID ? member?.COUNTRY_ID : '',
    },
    state: {
      NAME: member?.STATE_NAME ? member?.STATE_NAME : '',
      ID: member?.STATE_ID ? member?.STATE_ID : '',
    },
    district: {
      NAME: member?.DISTRICT_NAME ? member?.DISTRICT_NAME : '',
      ID: member?.DISTRICT_ID ? member?.DISTRICT_ID : '',
    },
    city: {
      NAME: member?.CITY_NAME ? member?.CITY_NAME : '',
      ID: member?.CITY_ID ? member?.CITY_ID : '',
    },
    PROFILE_PHOTO: {
      URL: '',
      NAME: member?.PROFILE_PHOTO,
      FILE_TYPE: '',
    },
  });

  const [data, setData] = useState({
    state: [],
    city: [],
  });
  const [date, setDate] = useState<{
    myDate: any;
    mode: any;
    show: boolean;
  }>({
    myDate: new Date(member?.DOB),
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

  const [countryList, setCountryList] = useState<any[]>([]);
  const [stateList, setStateList] = useState<any[]>([]);
  const [districtList, setDistrictList] = useState<any[]>([]);
  const [cityList, setCityList] = useState<any[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);

  // Function to scroll to specific position
  const scrollToPosition = (y: number) => {
    scrollViewRef.current?.scrollTo({ y, animated: true });
  };

  // Function to handle dropdown focus for scrolling
  const handleDropdownFocus = (dropdownName: string) => {
    let scrollPosition = 0;

    switch (dropdownName) {
      case 'country':
        scrollPosition = 400;
        break;
      case 'state':
        scrollPosition = 500;
        break;
      case 'district':
        scrollPosition = 600;
        break;
      case 'city':
        scrollPosition = 700;
        break;
      default:
        scrollPosition = 0;
    }

    setTimeout(() => {
      scrollToPosition(scrollPosition);
    }, 300);
  };

  const takePhotoFromCamera = () => {
    requestMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ]).then(result => {
      if (RESULTS.GRANTED) {
        try {
          ImageCropPicker.openCamera({
            compressImageQuality: 0.7,
            cropping: true,
            multiple: false,
            mediaType: 'photo',
            height: 400,
            width: 400,
            compressImageMaxWidth: 480,
          }).then(async image => {
            const name =
              Date.now() +
              '.' +
              image.path.substring(image.path.lastIndexOf('.') + 1);

            const res = await apiUpload('upload/appUserProfile', {
              uri: image.path,
              type: image.mime,
              name: name,
            });
            if (res && res.code == 200) {
              setInput({
                ...input,
                PROFILE_PHOTO: {
                  URL: image.path,
                  FILE_TYPE: image.mime,
                  NAME: name,
                },
              });
            } else {
              Toast('Image not uploaded');
            }
          });
        } catch (error) {
          console.log('err...', error);
        }
      } else {
        Toast('Camera permission not granted');
      }
    });
  };

  const selectPhotoFromGallery = () => {
    requestMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
    ]).then(result => {
      if (RESULTS.GRANTED) {
        try {
          ImagePicker.openPicker({
            compressImageQuality: 0.7,
            cropping: true,
            multiple: false,
            mediaType: 'photo',
            height: 400,
            width: 400,
          }).then(async image => {
            const name =
              Date.now() +
              '.' +
              image.path.substring(image.path.lastIndexOf('.') + 1);
            const res = await apiUpload('upload/appUserProfile', {
              uri: image.path,
              type: image.mime,
              name: name,
            });
            if (res && res.code == 200) {
              setInput({
                ...input,
                PROFILE_PHOTO: {
                  URL: image.path,
                  FILE_TYPE: image.mime,
                  NAME: name,
                },
              });
            } else {
              Toast('Image not uploaded');
            }
          });
        } catch (error) {
          console.log('error...', error);
        }
      } else {
        Toast('Image permission not granted');
      }
    });
  };

  const checkValidation = () => {
    if (input.name?.trim() == '') {
      Toast(t('Profile.PleaseEnterName'));
      return true;
    } else if (!date.myDate) {
      Toast(t('Profile.Pleaseselectdateofbirth'));
      return true;
    } else if (input.gender?.trim() == '') {
      Toast(t('Profile.PleaseSelectGender'));
      return true;
    } else if (input.email && input.email.trim() == '') {
      Toast(t('Profile.Pleaseenteremailaddress'));
      return true;
    } else if (input.email && !emailValidation.test(input.email)) {
      Toast(t('Profile.PleaseenterValidEmailAddress'));
      return true;
    } else {
      return false;
    }
  };

  const updateProfile = async () => {
    if (checkValidation()) {
      return;
    }
    setLoading(true);
    try {
      let body = {
        NAME: input.name,
        ADDRESS: input.address ? input.address : null,

        COUNTRY_ID: input.country?.ID,
        COUNTRY_NAME: input.country?.NAME,

        STATE_ID: input.state?.ID,
        STATE_NAME: input.state?.NAME,

        DISTRICT_ID: input.district?.ID,
        DISTRICT_NAME: input.district?.NAME,

        CITY_ID: input.city?.ID,
        CITY_NAME: input.city?.NAME,
        DOB: moment(date.myDate).format('YYYY-MM-DD HH:mm:ss'),
        GENDER: input.gender,
        MOBILE_NUMBER: input.mobileNumber,
        EMAIL_ID: input.email ? input.email : '',
        PROFILE_PHOTO: input.PROFILE_PHOTO.NAME,
        ID: member?.ID,
        CLIENT_ID: 1,
      };
      const res = await apiPut('api/appUser/update', body);
      if (res && res.code == 200) {
        setLoading(false);
        UserGet();
        Toast('Profile Updated Successfully');
        navigation.goBack();
      } else {
        setLoading(false);
        Toast('Something Wrong Please Try Again..');
      }
    } catch (error) {
      setLoading(false);
      console.log('error...', error);
    }
  };

  const UserGet = async () => {
    try {
      const res = await apiPost('api/appUser/get', {
        filter: ` AND ID = ${member?.ID} `,
      });

      console.log("USERGET", res.data);

      if (res && res.code == 200) {
        setLoading(false);
        dispatch(
          Reducers.setMember({
            user: res.data[0],
            location: '',
            profile: FemaleUser,
          }),
        );
      } else {
        setLoading(false);
        Toast('Something Wrong Please Try Again..');
      }
    } catch (error) {
      setLoading(false);
      console.log('error...', error);
    }
  };

  const getCountryList = async () => {
    const res = await apiPost('api/country/get', { filter: ` AND STATUS = 1 ` });

    if (res?.code === 200) {
      setCountryList(res.data);

      // Preselect saved country
      const country = res.data.find(
        (item: any) => item.NAME === member?.COUNTRY_NAME
      );
      if (country) {
        setSelectedCountry(country);
        setInput(prev => ({ ...prev, country }));
        getStateList(country);
      }
    }
  };

  const getStateList = async (country: any) => {
    const res = await apiPost('api/state/get', {
      filter: ` AND COUNTRY_ID = ${country.ID} AND STATUS = 1 `,
    });

    if (res?.code === 200) {
      setStateList(res.data);

      const state = res.data.find(
        (item: any) => item.NAME === member?.STATE_NAME
      );
      if (state) {
        setSelectedState(state);
        setInput(prev => ({ ...prev, state }));
        getDistrictList(state);
      }
    }
  };

  const getDistrictList = async (state: any) => {
    const res = await apiPost('api/district/get', {
      filter: ` AND STATE_ID = ${state.ID} AND STATUS = 1 `,
    });

    if (res?.code === 200) {
      setDistrictList(res.data);

      const district = res.data.find(
        (item: any) => item.NAME === member?.DISTRICT_NAME
      );
      if (district) {
        setSelectedDistrict(district);
        setInput(prev => ({ ...prev, district }));
      }
    }
  };

  const getCityList = async (state: any) => {
    const res = await apiPost('api/district/get', {
      filter: ` AND STATUS = 1 `,
    });

    if (res?.code === 200) {
      setCityList(res.data);

      const city = res.data.find(
        (item: any) => item.NAME === member?.CITY_NAME
      );
      if (city) {
        setSelectedCity(city);
        setInput(prev => ({ ...prev, city }));
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.White }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>

      <Animated.ScrollView
        ref={scrollViewRef}
        style={[{ marginBottom: Sizes.ScreenPadding }, animatedStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          // paddingBottom: 100, 
        }}
        keyboardDismissMode="on-drag"
      >

        <View style={{ flex: 1, backgroundColor: Colors.White }}>
          <View style={{ flex: 1 }}>
            <View
              style={[
                {
                  height: 160 + 80,
                  backgroundColor: Colors.White,
                },
              ]}>
              <Animated.View style={[animationstyle]}>
                <LinearGradient
                  colors={[Colors.Primary2, Colors.Primary]}
                  angle={110}
                  style={styles.gradient}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginHorizontal: Sizes.ScreenPadding,
                      marginTop: Sizes.Radius,
                    }}>
                    <Icon
                      name="chevron-back"
                      type="Ionicons"
                      size={22}
                      color={Colors.White}
                      onPress={() => navigation.goBack()}
                    />
                    <Text
                      style={{
                        ...Fonts.Bold1,
                        fontSize: 14,
                        color: Colors.White,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        alignContent: 'center',
                        paddingHorizontal: Sizes.Radius,
                      }}>
                      Update Profile
                    </Text>
                  </View>
                </LinearGradient>
              </Animated.View>

              <Animated.View
                style={[
                  {
                    alignSelf: 'center',
                    position: 'absolute',
                    backgroundColor: Colors.White,
                    alignItems: 'center',
                    top: 50,
                    height: 160,
                    width: 160,
                    borderRadius: 80,
                    padding: Sizes.Base,
                    elevation: 8,
                    margin: Sizes.Base,
                  },
                  Imageanimationstyle,
                ]}>
                <Image
                  source={
                    input.PROFILE_PHOTO.NAME
                      ? {
                        uri:
                          BASE_URL +
                          'static/appUserProfile/' +
                          input.PROFILE_PHOTO.NAME,
                      }
                      : noProfile
                  }
                  resizeMode={'cover'}
                  style={{ height: '100%', width: '100%', borderRadius: 80 }}
                  loadingIndicatorSource={noProfile}></Image>
                <TouchableOpacity
                  style={{
                    borderRadius: 20,
                    height: 40,
                    width: 40,
                    top: -50,
                    left: 65,
                    backgroundColor: Colors.White,
                    elevation: 8,
                    margin: Sizes.Base,
                  }}>
                  <Icon
                    name="camera"
                    type="Entypo"
                    size={20}
                    color={Colors.PrimaryText}
                    style={{
                      alignSelf: 'center',
                      flex: 1,
                      marginTop: 10,
                    }}
                    onPress={() => {
                      Alert.alert(
                        t('Profile.ProfilePhoto'),
                        t('Profile.SelectImage'),
                        [
                          {
                            text: t('Profile.SelectfromGallery'),
                            onPress: () => selectPhotoFromGallery(),
                          },
                          {
                            text: t('Profile.Capture'),
                            onPress: () => takePhotoFromCamera(),
                          },
                        ],
                        { cancelable: true },
                      );
                    }}
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>

            <Animated.View
              style={[{ marginBottom: Sizes.ScreenPadding }, animatedStyle]}
            >
              <View style={{ marginHorizontal: Sizes.ScreenPadding }}>
                <Animated.View
                  entering={FadeInDown.delay(100).duration(1000).springify()}>
                  <TextInput
                    autoFocus={false}
                    label="Name"
                    style={{
                      width: '100%',
                      borderWidth: 0,
                      elevation: 6,
                      backgroundColor: Colors.White,
                      shadowColor: Colors.Primary,
                    }}
                    onChangeText={(txt: string) => {
                      setInput({ ...input, name: txt });
                    }}
                    value={'' + input.name}
                    placeholder={'Enter Name'}
                  />
                </Animated.View>
                <View style={{ height: Sizes.Base }}></View>

                <Animated.View
                  entering={FadeInDown.delay(300).duration(1000).springify()}
                  style={{ flex: 1 }}>
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
                      borderRadius: Sizes.Radius,
                      backgroundColor: Colors.White,
                    }}
                    labelText={moment(date.myDate).format('DD/MMM/YYYY')}
                    onPress={() => setDate({ ...date, show: true })}
                    imp={false}
                  />
                </Animated.View>

                <Animated.View
                  entering={FadeInDown.delay(500).duration(1000).springify()}
                  style={{ flex: 1 }}>
                  <RadioButton.Group
                    onValueChange={value => {
                      setInput({ ...input, gender: value });
                    }}
                    value={'' + input.gender}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: Sizes.Base,
                      }}>
                      <Text
                        style={{
                          color: Colors.PrimaryText1,
                          ...Fonts.Medium3,
                        }}>
                        Gender:
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: Sizes.ScreenPadding,
                        }}>
                        <RadioButton value={'M'} color={Colors.Primary2} />
                        <Text
                          style={{
                            color: Colors.PrimaryText1,
                            ...Fonts.Regular3,
                          }}>
                          {t('Profile.Male')}
                        </Text>
                      </View>
                      <View style={{ width: Sizes.ScreenPadding }} />
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
                          {t('Profile.Female')}
                        </Text>
                      </View>
                    </View>
                  </RadioButton.Group>
                </Animated.View>

                <Animated.View
                  entering={FadeInDown.delay(700).duration(1000).springify()}>
                  <TextInput
                    maxLength={10}
                    disable
                    label="Phone Number"
                    onChangeText={(txt: string) => {
                      setInput({ ...input, mobileNumber: txt });
                    }}
                    value={'' + input.mobileNumber}
                    placeholder={'Enter Mobile Number'}
                  />
                </Animated.View>

                <View style={{ height: Sizes.ScreenPadding }}></View>

                <Animated.View
                  entering={FadeInDown.delay(900).duration(1000).springify()}>
                  <TextInput
                    autoFocus={false}
                    label="Email Address"
                    style={{
                      width: '100%',
                      borderWidth: 0,
                      elevation: 6,
                      backgroundColor: Colors.White,
                      shadowColor: Colors.Primary,
                      marginBottom: 10
                    }}
                    onChangeText={(txt: string) => {
                      setInput({ ...input, email: txt });
                    }}
                    value={input.email}
                    placeholder={'Enter Email Address'}
                  />
                </Animated.View>

                <Animated.View
                  entering={FadeInDown.delay(200).duration(800).springify()}>
                  <Dropdown
                    ref={countryDropdownRef}
                    label="Country"
                    data={countryList}
                    value={selectedCountry}
                    labelField="NAME"
                    valueField="ID"
                    placeholder="Select Country"
                    onChange={(val: any) => {
                      setSelectedCountry(val);
                      getStateList(val);
                      setInput({ ...input, country: val, state: null, district: null, city: null });
                    }}
                    onFocus={() => handleDropdownFocus('country')}
                    imp
                    search
                  />
                </Animated.View>

                <View style={{ height: Sizes.ScreenPadding }}></View>

                <Animated.View
                  entering={FadeInDown.delay(400).duration(800).springify()}>
                  <Dropdown
                    ref={stateDropdownRef}
                    label="State"
                    data={stateList}
                    value={selectedState}
                    labelField="NAME"
                    valueField="ID"
                    placeholder="Select State"
                    onChange={(val: any) => {
                      setSelectedState(val);
                      setInput({ ...input, state: val, district: null, city: null });
                      getDistrictList(val);
                      getCityList(val);
                    }}
                    onFocus={() => handleDropdownFocus('state')}
                    imp
                    search
                  />
                </Animated.View>

                <View style={{ height: Sizes.ScreenPadding }}></View>

                <Animated.View
                  entering={FadeInDown.delay(600).duration(800).springify()}>
                  <Dropdown
                    ref={districtDropdownRef}
                    label="District"
                    data={districtList}
                    value={selectedDistrict}
                    labelField="NAME"
                    valueField="ID"
                    placeholder="Select District"
                    onChange={(val: any) => {
                      setSelectedDistrict(val);
                      setInput({ ...input, district: val });
                    }}
                    onFocus={() => handleDropdownFocus('district')}
                    imp
                    search
                  />
                </Animated.View>

                <View style={{ height: Sizes.ScreenPadding }}></View>

                <Animated.View
                  entering={FadeInDown.delay(800).duration(800).springify()}
                  style={{ marginBottom: 20 }}>
                  <Dropdown
                    ref={cityDropdownRef}
                    label="City"
                    data={cityList}
                    value={selectedCity}
                    labelField="NAME"
                    valueField="ID"
                    placeholder="Select City"
                    onChange={(val: any) => {
                      setSelectedCity(val);
                      setInput({ ...input, city: val });
                    }}
                    onFocus={() => handleDropdownFocus('city')}
                    imp
                    search
                  />
                </Animated.View>

                <View style={{ height: Sizes.ScreenPadding }}></View>
              </View>
            </Animated.View>

            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: Sizes.ScreenPadding,
                marginBottom: Sizes.ScreenPadding,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TextButton
                style={{ flex: 1 }}
                label={t('Profile.UpdateProfile')}
                loading={loading}
                onPress={() => {
                  updateProfile();
                }}
              />
            </View>
          </View>

          {date.show && (
            <DateTimePicker
              value={date.myDate}
              mode={date.mode}
              is24Hour={true}
              display="default"
              onChange={changeSelectedDate}
            />
          )}
        </View>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 5,
  },
});