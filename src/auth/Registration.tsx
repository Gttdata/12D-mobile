import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  BASE_URL,
  Reducers,
  apiPost,
  apiPut,
  apiUpload,
  useDispatch,
  useSelector,
} from '../Modules';
import {Header, Icon, TextButton, TextInput, Toast} from '../Components';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import ModalPicker from '../Components/ModalPicker';
import {RadioButton} from 'react-native-paper';
import {emailValidation} from '../Functions';
import {noProfile} from '../../assets';
import {StackAuthProps} from './AuthRoutes';
import ImagePicker from 'react-native-image-crop-picker';

type Props = StackAuthProps<'Registration'>;
interface inputProps {
  name: string;
  emailId: string;
  identityNumber: string;
  mobileNumber: string;
  gender: string;
  password: string;
  address: string;
  country: {NAME: string | null; ID: number | null};
  state: {NAME: string | null; ID: number | null};
  district: {NAME: string | null; ID: number | null};
  NEW_PROFILE_PHOTO: {
    URL: string | null;
    NAME: string | null;
    FILE_TYPE: string | null;
  };
}
const Registration = ({navigation, route}: Props): JSX.Element => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {item} = route.params;
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState<inputProps>({
    name: item.NAME,
    emailId: item.EMAIL_ID ? item.EMAIL_ID : '',
    identityNumber: item.IDENTITY_NUMBER ? item.IDENTITY_NUMBER : '',
    mobileNumber: item.MOBILE_NUMBER,
    gender: item.GENDER ? item.GENDER : 'M',
    password: item.PASSWORD ? item.PASSWORD : '',
    address: item.ADDRESS ? item.ADDRESS : '',
    country: {NAME: item.COUNTRY_NAME, ID: item.COUNTRY_ID},
    state: {NAME: item.STATE_NAME, ID: item.STATE_ID},
    district: {NAME: item.DISTRICT_MASTER, ID: item.DISTRICT_ID},
    NEW_PROFILE_PHOTO: {
      URL: null,
      NAME: item.PROFILE_PHOTO,
      FILE_TYPE: null,
    },
  });
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<{
    myDate: any;
    mode: any;
    show: boolean;
  }>({
    myDate: new Date(new Date().setFullYear(2000)),
    mode: 'date',
    show: false,
  });
  const [data, setData] = useState({
    country: [],
    state: [],
    district: [],
  });
  const [openModal, setOpenModal] = useState({
    country: false,
    state: false,
    district: false,
  });
  const changeSelectedDate = (event: any, selectedDate: any) => {
    if (selectedDate) {
      setDate({...date, myDate: selectedDate, show: false});
    } else {
      setDate({...date, show: false});
    }
  };
  useEffect(() => {
    getCountry();
  }, []);
  const getCountry = async () => {
    try {
      const res = await apiPost('api/country/get', {
        filter: ` AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        setData({...data, country: res.data});
      }
    } catch (error) {
      console.log('error..', error);
    }
  };
  const getState = async (item: any) => {
    try {
      const res = await apiPost('api/state/get', {
        filter: ` AND COUNTRY_ID = ${item.ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        setData({...data, state: res.data});
        setInputs({...inputs, country: item});
      }
    } catch (error) {
      console.log('error..', error);
    }
  };
  const getDistrict = async (item: any) => {
    try {
      const res = await apiPost('api/district/get', {
        filter: ` AND STATE_ID = ${item.ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        setData({...data, district: res.data});
        setInputs({...inputs, state: item});
      }
    } catch (error) {
      console.log('error..', error);
    }
  };
  const takePhotoFromCamera = () => {
    try {
      ImagePicker.openCamera({
        compressImageQuality: 0.7,
        cropping: true,
        multiple: false,
        mediaType: 'photo',
        height: 400,
        width: 400,
        compressImageMaxWidth: 480,
      }).then(async image => {
        // console.log('\n\nimage...', image);
        const name =
          Date.now() +
          '.' +
          image.path.substring(image.path.lastIndexOf('.') + 1);

        const res = await apiUpload('upload/studentProfile', {
          uri: image.path,
          type: image.mime,
          name: name,
        });
        // console.log('\n\n\nres', res);
        if (res && res.code == 200) {
          setInputs({
            ...inputs,
            NEW_PROFILE_PHOTO: {
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
  };
  const selectPhotoFromGallery = () => {
    try {
      ImagePicker.openPicker({
        compressImageQuality: 0.7,
        cropping: true,
        multiple: false,
        mediaType: 'photo',
        height: 400,
        width: 400,
      }).then(async image => {
        // console.log('\n\nimage...', image);
        const name =
          Date.now() +
          '.' +
          image.path.substring(image.path.lastIndexOf('.') + 1);
        const res = await apiUpload('upload/studentProfile', {
          uri: image.path,
          type: image.mime,
          name: name,
        });
        if (res && res.code == 200) {
          setInputs({
            ...inputs,
            NEW_PROFILE_PHOTO: {
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
  };
  const checkValidation = () => {
    if (!inputs.NEW_PROFILE_PHOTO.NAME) {
      Toast('Please upload profile photo');
      return true;
    } else if (inputs.name.trim() == '') {
      Toast('Please enter name');
      return true;
    } else if (inputs.emailId.trim() == '') {
      Toast('Please enter email address');
      return true;
    } else if (inputs.emailId && !emailValidation.test(inputs.emailId)) {
      Toast('Please enter valid email address');
      return true;
    } else if (inputs.identityNumber.trim() == '') {
      Toast('Please enter identity number');
      return true;
    } else if (inputs.password.trim() == '') {
      Toast('Please enter password');
      return true;
    } else if (inputs.address.trim() == '') {
      Toast('Please enter address');
      return true;
    } else if (!inputs.country.NAME) {
      Toast('Please select any country');
      return true;
    } else if (!inputs.state.NAME) {
      Toast('Please select any state');
      return true;
    } else if (!inputs.district.NAME) {
      Toast('Please select any district');
      return true;
    } else {
      return false;
    }
  };
  const registration = async () => {
    if (checkValidation()) {
      return;
    }
    setLoading(true);
    try {
      let body = {
        NAME: inputs.name,
        COUNTRY_ID: inputs.country.ID,
        STATE_ID: inputs.state.ID,
        DISTRICT_ID: inputs.district.ID,
        ADDRESS: inputs.address,
        DOB: moment(date.myDate).format('YYYY-MM-DD HH:mm:ss'),
        GENDER: inputs.gender,
        IDENTITY_NUMBER: inputs.identityNumber,
        MOBILE_NUMBER: inputs.mobileNumber,
        EMAIL_ID: inputs.emailId,
        PASSWORD: inputs.password,
        SEQ_NO: item.SEQ_NO,
        PROFILE_PHOTO: inputs.NEW_PROFILE_PHOTO.NAME,
        IS_VERIFIED: 1,
        STATUS: item.STATUS,
        CLIENT_ID: 1,
        ID: item.ID,
      };
      const res = await apiPut('api/student/update', body);
      if (res && res.code == 200) {
        setLoading(false);
        dispatch(Reducers.setShowSplash(true));
      } else {
        setLoading(false);
        Toast('Something Wrong Please Try Again..');
      }
    } catch (error) {
      setLoading(false);
      console.log('error...', error);
    }
  };
  // console.log('\n\n\nitem,wert,,', item.SEQ_NO);
  return (
    <View style={{flex: 1, backgroundColor: Colors.Background}}>
      <Header label="Registration" onBack={() => {}} />
      {/* Profile Photo */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          alignSelf: 'center',
          marginTop: Sizes.ScreenPadding,
        }}
        onPress={() => {
          Alert.alert(
            'Profile Photo',
            'Select image',
            [
              {
                text: 'select from gallery',
                onPress: () => selectPhotoFromGallery(),
              },
              {
                text: 'click on camera',
                onPress: () => takePhotoFromCamera(),
              },
            ],
            {cancelable: true},
          );
        }}>
        <Image
          source={
            inputs.NEW_PROFILE_PHOTO.NAME
              ? {
                  uri:
                    BASE_URL +
                    'static/studentProfile/' +
                    inputs.NEW_PROFILE_PHOTO.NAME,
                }
              : noProfile
          }
          resizeMode={'cover'}
          style={{width: 100, height: 100, borderRadius: 50}}
          loadingIndicatorSource={noProfile}
        />
        <Text
          style={{
            backgroundColor: '#FFFFFF99',
            position: 'absolute',
            width: '100%',
            paddingVertical: 5,
            bottom: 0,
            textAlign: 'center',
            textAlignVertical: 'center',
            color: '#FFFFFF',
          }}>
          {'Change'}
        </Text>
        <Icon
          name="camera"
          type="Entypo"
          size={27}
          color={Colors.PrimaryText}
          style={{
            position: 'absolute',
            bottom: Sizes.Base,
            right: 4,
          }}
          onPress={() => {
            Alert.alert(
              'Profile Photo',
              'Select image',
              [
                {
                  text: 'select from gallery',
                  onPress: () => selectPhotoFromGallery(),
                },
                {
                  text: 'click on camera',
                  onPress: () => takePhotoFromCamera(),
                },
              ],
              {cancelable: true},
            );
          }}
        />
      </TouchableOpacity>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1, margin: Sizes.ScreenPadding}}>
        {/* Name */}
        <View
          style={{
            justifyContent: 'center',
          }}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: Colors.PrimaryText1,
              textAlign: 'left',
            }}>
            {'Name :'}
          </Text>
          <TextInput
            onChangeText={txt => {
              setInputs({...inputs, name: txt});
            }}
            value={inputs.name}
            placeholder={'Enter full name'}
          />
        </View>
        {/* Email id*/}
        <View
          style={{
            justifyContent: 'center',
            marginTop: Sizes.Radius,
          }}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: Colors.PrimaryText1,
              textAlign: 'left',
            }}>
            {'Email Id :'}
          </Text>
          <TextInput
            onChangeText={txt => {
              setInputs({...inputs, emailId: txt});
            }}
            value={inputs.emailId}
            placeholder="Enter Email Id"
          />
        </View>
        {/* Identity Number */}
        <View
          style={{
            justifyContent: 'center',
            marginTop: Sizes.Radius,
          }}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: Colors.PrimaryText1,
              textAlign: 'left',
            }}>
            {'Identity Number :'}
          </Text>
          <TextInput
            onChangeText={txt => {
              setInputs({...inputs, identityNumber: txt});
            }}
            value={inputs.identityNumber}
            placeholder="Enter Identity Number"
            keyboardType="number-pad"
          />
        </View>
        {/* Mobile Number */}
        <View
          style={{
            justifyContent: 'center',
            marginTop: Sizes.Radius,
          }}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: Colors.PrimaryText1,
              textAlign: 'left',
            }}>
            {'Mobile Number :'}
          </Text>
          <TextInput
            onChangeText={txt => {
              setInputs({...inputs, mobileNumber: txt});
            }}
            value={inputs.mobileNumber}
            placeholder="Enter Phone Number"
            disable={true}
          />
        </View>
        {/* Date Of Birth */}
        <View
          style={{
            justifyContent: 'center',
            marginTop: Sizes.Radius,
          }}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: Colors.PrimaryText1,
              textAlign: 'left',
            }}>
            {'Date Of Birth :'}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flex: 1,
              padding: Sizes.Radius,
              paddingVertical: Sizes.Base,
              paddingHorizontal: Sizes.Radius,
              borderRadius: Sizes.Radius,
              borderColor: Colors.Primary,
              borderWidth: 1,
            }}
            onPress={() => {
              setDate({...date, show: true});
            }}>
            <Text style={{...Fonts.Medium2, color: Colors.PrimaryText}}>
              {moment(date.myDate).format('DD/MMM/YYYY')}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Gender */}
        <View
          style={{
            justifyContent: 'center',
            marginTop: Sizes.Radius,
          }}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: Colors.PrimaryText1,
              textAlign: 'left',
            }}>
            {'Gender :'}
          </Text>
          <RadioButton.Group
            onValueChange={value => {
              setInputs({...inputs, gender: value});
            }}
            value={inputs.gender}>
            <View style={{}}>
              <View style={{flexDirection: 'row', flex: 1}}>
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
                    Male
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
                    Female
                  </Text>
                </View>
                <View style={{width: Sizes.ScreenPadding}} />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <RadioButton value={'O'} color={Colors.Primary2} />
                  <Text
                    style={{
                      color: Colors.PrimaryText1,
                      ...Fonts.Regular3,
                    }}>
                    Other
                  </Text>
                </View>
              </View>
            </View>
          </RadioButton.Group>
        </View>
        {/* Password */}
        <View
          style={{
            justifyContent: 'center',
            marginTop: Sizes.Radius,
          }}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: Colors.PrimaryText1,
              textAlign: 'left',
            }}>
            {'Password :'}
          </Text>
          <TextInput
            onChangeText={txt => {
              setInputs({...inputs, password: txt});
            }}
            value={inputs.password}
            placeholder="Enter Password"
          />
        </View>
        {/* Address */}
        <View
          style={{
            justifyContent: 'center',
            marginTop: Sizes.Radius,
          }}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: Colors.PrimaryText1,
              textAlign: 'left',
            }}>
            {'Address :'}
          </Text>
          <TextInput
            onChangeText={txt => {
              setInputs({...inputs, address: txt});
            }}
            value={inputs.address}
            placeholder="Enter Address"
            multiline
          />
        </View>
        {/* Country */}
        <View style={{marginTop: Sizes.Padding}}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: Colors.PrimaryText1,
              textAlign: 'left',
            }}>
            {'Country :'}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flex: 1,
              padding: Sizes.Radius,
              paddingVertical: Sizes.Base,
              paddingHorizontal: Sizes.Radius,
              borderRadius: Sizes.Radius,
              borderColor: Colors.Primary,
              borderWidth: 1,
            }}
            onPress={() => {
              setOpenModal({...openModal, country: true});
            }}>
            <Text style={{...Fonts.Medium2, color: Colors.PrimaryText}}>
              {inputs.country.NAME ? inputs.country.NAME : 'Select Country'}
            </Text>
          </TouchableOpacity>
        </View>
        {/* State */}
        <View style={{marginTop: Sizes.Padding}}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: Colors.PrimaryText1,
              textAlign: 'left',
            }}>
            {'State :'}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flex: 1,
              padding: Sizes.Radius,
              paddingVertical: Sizes.Base,
              paddingHorizontal: Sizes.Radius,
              borderRadius: Sizes.Radius,
              borderColor: Colors.Primary,
              borderWidth: 1,
            }}
            onPress={() => {
              setOpenModal({...openModal, state: true});
            }}>
            <Text style={{...Fonts.Medium2, color: Colors.PrimaryText}}>
              {inputs.state.NAME ? inputs.state.NAME : 'Select Country'}
            </Text>
          </TouchableOpacity>
        </View>
        {/* District */}
        <View style={{marginTop: Sizes.Padding}}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: Colors.PrimaryText1,
              textAlign: 'left',
            }}>
            {'District :'}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flex: 1,
              padding: Sizes.Radius,
              paddingVertical: Sizes.Base,
              paddingHorizontal: Sizes.Radius,
              borderRadius: Sizes.Radius,
              borderColor: Colors.Primary,
              borderWidth: 1,
            }}
            onPress={() => {
              setOpenModal({...openModal, district: true});
            }}>
            <Text style={{...Fonts.Medium2, color: Colors.PrimaryText}}>
              {inputs.district.NAME ? inputs.district.NAME : 'Select Country'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View
        style={{
          marginHorizontal: Sizes.ScreenPadding,
          marginBottom: Sizes.ScreenPadding,
        }}>
        <TextButton
          label="Register"
          loading={loading}
          onPress={() => {
            registration();
          }}
        />
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
      {openModal.country && (
        <ModalPicker
          title=" "
          visible={openModal.country}
          onClose={() => {
            setOpenModal({...openModal, country: false});
          }}
          data={data.country}
          labelField={'NAME'}
          onChange={item => {
            getState(item);
          }}
          value={inputs.country}
        />
      )}
      {openModal.state && (
        <ModalPicker
          title=" "
          visible={openModal.state}
          onClose={() => {
            setOpenModal({...openModal, state: false});
          }}
          data={data.state}
          labelField={'NAME'}
          onChange={item => {
            getDistrict(item);
          }}
          value={inputs.state}
        />
      )}
      {openModal.district && (
        <ModalPicker
          title=" "
          visible={openModal.district}
          onClose={() => {
            setOpenModal({...openModal, district: false});
          }}
          data={data.district}
          labelField={'NAME'}
          onChange={item => {
            setInputs({...inputs, district: item});
          }}
          value={inputs.district}
        />
      )}
    </View>
  );
};

export default Registration;
