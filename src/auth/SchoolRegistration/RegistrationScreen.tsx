import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TextInput} from 'react-native-paper';
import {apiPost, apiPut, useSelector} from '../../Modules';
import {Icon, Modal, TextButton, Toast} from '../../Components';
import {emailValidation} from '../../Functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalPicker from '../../Components/ModalPicker';
import {StackProps} from '../../routes';
import {useTranslation} from 'react-i18next';

type Props = StackProps<'RegistrationScreen'>;
const RegistrationScreen = ({navigation, route}: Props) => {
  const {t} = useTranslation();
  const {schoolInfo} = route.params;
  const {email} = route.params;
  const {member} = useSelector(state => state.member);
  const {Colors, Sizes, Fonts} = useSelector(state => state.app);
  const [registrationData, setRegistrationData] = useState({
    name: schoolInfo?.SCHOOL_NAME ? schoolInfo?.SCHOOL_NAME : '',
    principleName: '',
    phoneNumber: member?.MOBILE_NUMBER,
    email: schoolInfo?.EMAIL_ID ? schoolInfo?.EMAIL_ID : email,
    password: schoolInfo?.PASSWORD ? schoolInfo?.PASSWORD : '',
    country: {
      NAME: schoolInfo?.COUNTRY_NAME ? schoolInfo?.COUNTRY_NAME : '',
      ID: schoolInfo?.COUNTRY_ID ? schoolInfo?.COUNTRY_ID : '',
    },
    state: {
      NAME: schoolInfo?.STATE_NAME ? schoolInfo?.STATE_NAME : '',
      ID: schoolInfo?.STATE_ID ? schoolInfo?.STATE_ID : '',
    },
    district: {
      NAME: schoolInfo?.DISTRICT_NAME ? schoolInfo?.DISTRICT_NAME : '',
      ID: schoolInfo?.DISTRICT_ID ? schoolInfo?.DISTRICT_ID : '',
    },
    board: {
      NAME: schoolInfo?.BOARD_NAME ? schoolInfo?.BOARD_NAME : '',
      ID: schoolInfo?.BOARD_ID ? schoolInfo?.BOARD_ID : '',
    },
    year: {
      YEAR: schoolInfo?.YEAR ? schoolInfo?.YEAR : '',
      ID: schoolInfo?.YEAR_ID ? schoolInfo?.YEAR_ID : '',
    },
    city: {NAME: '', ID: ''},
    address: schoolInfo?.ADDRESS ? schoolInfo?.ADDRESS : '',
    pin: schoolInfo?.PINCODE ? schoolInfo?.PINCODE : '',
    description: schoolInfo?.DESCRIPTION ? schoolInfo?.DESCRIPTION : '',
  });
  const [data, setData] = useState({
    country: [],
    state: [],
    district: [],
    board: [],
    year: [],
    city: [],
  });
  const [loading, setLoading] = useState(false);
  const [statusModal, setStatusModal] = useState(true);
  const [openModal, setOpenModal] = useState({
    country: false,
    state: false,
    district: false,
    board: false,
    year: false,
    city: false,
  });
  useEffect(() => {
    getModalData();
  }, []);

  const getModalData = async () => {
    let calls = await Promise.all([
      apiPost('api/country/get', {
        filter: ` AND STATUS = 1 `,
      }),
      apiPost('api/board/get', {filter: ` AND STATUS = 1 `}),
      apiPost('api/year/get', {filter: ` AND STATUS = 1 `}),
      apiPost('api/city/get', {filter: ` AND STATUS = 1 `}),
    ]);
    if (
      calls[0].code == 200 &&
      calls[1].code == 200 &&
      calls[2].code == 200 &&
      calls[3].code == 200
    ) {
      setData(prevData => ({
        ...prevData,
        country: calls[0].data,
        board: calls[1].data,
        year: calls[2].data,
      }));
    } else {
      Toast('Something Wrong...Please try again');
    }
  };

  const getState = async (item: any) => {
    try {
      const res = await apiPost('api/state/get', {
        filter: ` AND COUNTRY_ID = ${item.ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        setData(prevData => ({
          ...prevData,
          state: res.data,
        }));
        setRegistrationData({...registrationData, country: item});
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
        setData(prevData => ({
          ...prevData,
          district: res.data,
        }));
        setRegistrationData({...registrationData, state: item});
      }
    } catch (error) {
      console.log('error..', error);
    }
  };
  const checkValidation = () => {
    if (registrationData.name.trim() == '') {
      Toast(t('SchoolRegistration.SchoolNameValidation'));
      return true;
    } else if (registrationData.principleName.trim() == '') {
      Toast(t('SchoolRegistration.PrincipleNameValidation'));
      return true;
    } else if (!registrationData.phoneNumber) {
      Toast(t('SchoolRegistration.MobileNumberValidation'));
      return true;
    } else if (registrationData.email.trim() == '') {
      Toast(t('SchoolRegistration.EmailValidation'));
      return true;
    } else if (
      registrationData.email &&
      !emailValidation.test(registrationData.email)
    ) {
      Toast(t('SchoolRegistration.EmailValidation'));
      return true;
    } else if (registrationData.password.trim() == '') {
      Toast(t('SchoolRegistration.PasswordValidation'));
      return true;
    } else if (registrationData.password.trim().length < 8) {
      Toast(t('SchoolRegistration.PasswordLength'));
      return true;
    } else if (!registrationData.board.NAME) {
      Toast(t('SchoolRegistration.BoardValidation'));
      return true;
    } else if (!registrationData.year.ID) {
      Toast(t('SchoolRegistration.YearValidation'));
      return true;
    } else if (registrationData.address.trim() == '') {
      Toast(t('SchoolRegistration.Addressvalidation'));
      return true;
    } else if (registrationData.pin.trim() == '') {
      Toast(t('SchoolRegistration.PinValidation'));
      return true;
    } else if (!registrationData.country.NAME) {
      Toast(t('SchoolRegistration.CountryValidation'));
      return true;
    } else if (!registrationData.state.NAME) {
      Toast(t('SchoolRegistration.StateValidation'));
      return true;
    } else if (!registrationData.district.NAME) {
      Toast(t('SchoolRegistration.DistrictValidation'));
      return true;
    } else if (registrationData.description.trim() == '') {
      Toast('Add school information');
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
        COUNTRY_ID: registrationData.country.ID,
        STATE_ID: registrationData.state.ID,
        DISTRICT_ID: registrationData.district.ID,
        SCHOOL_NAME: registrationData.name,
        ADDRESS: registrationData.address,
        PINCODE: registrationData.pin,
        EMAIL_ID: registrationData.email,
        PASSWORD: registrationData.password,
        PHONE_NUMBER: registrationData.phoneNumber,
        PRINCIPLE_NAME: registrationData.principleName,
        STATUS: true,
        SCHOOL_STATUS: 'P',
        CLIENT_ID: 1,
        BOARD_ID: registrationData.board.ID,
        YEAR_ID: registrationData.year.ID,
        DESCRIPTION: registrationData.description,
      };
      const res = await apiPost('api/school/create', body);
      if (res && res.code == 200) {
        setLoading(false);
        Toast('Registration Success');
        await AsyncStorage.setItem('SCHOOL_ID', res.SCHOOL_ID.toString());
        navigation.navigate('Drawer');
        // navigation.navigate('StatusList');
        // dispatch(Reducers.setShowSplash(true));
      } else {
        setLoading(false);
        Toast('Something Wrong Please Try Again..');
      }
    } catch (error) {
      setLoading(false);
      console.log('error...', error);
    }
  };
  const UpdateRegistration = async () => {
    if (checkValidation()) {
      return;
    }
    setLoading(true);
    try {
      let body = {
        ID: schoolInfo.ID,
        COUNTRY_ID: registrationData.country.ID,
        STATE_ID: registrationData.state.ID,
        DISTRICT_ID: registrationData.district.ID,
        SCHOOL_NAME: registrationData.name,
        ADDRESS: registrationData.address,
        PINCODE: registrationData.pin,
        EMAIL_ID: registrationData.email,
        PASSWORD: registrationData.password,
        PHONE_NUMBER: registrationData.phoneNumber,
        PRINCIPLE_NAME: registrationData.principleName,
        STATUS: true,
        SCHOOL_STATUS: 'P',
        CLIENT_ID: 1,
        BOARD_ID: registrationData.board.ID,
        YEAR_ID: registrationData.year.ID,
      };
      const res = await apiPut('api/school/update', body);
      if (res && res.code == 200) {
        setLoading(false);
        navigation.navigate('Drawer');
      } else {
        setLoading(false);
        Toast('Something Wrong Please Try Again..');
      }
    } catch (error) {
      setLoading(false);
      console.log('error...', error);
    }
  };
  return (
    <View
      style={{
        backgroundColor: Colors.White,
        flex: 1,
        padding: Sizes.ScreenPadding,
      }}>
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row'}}>
          <Icon
            onPress={() => navigation.goBack()}
            name="arrow-back"
            type="Ionicons"
            size={20}
            color={Colors.White}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: Colors.Primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <Text
            style={{
              color: Colors.Primary,
              ...Fonts.Bold1,
              alignSelf: 'center',
              textAlign: 'center',
              flex: 1,
            }}>
            {t('SchoolRegistration.Welcome')}
          </Text>
        </View>
        <Text
          style={{
            color: Colors.PrimaryText,
            ...Fonts.Regular3,
            alignSelf: 'center',
          }}>
          {t('SchoolRegistration.GiveUsfewdetailsaboutSchool')}
        </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Personal details */}
          <View
            style={{
              borderColor: Colors.Primary2,
              borderWidth: 1,
              borderRadius: Sizes.Radius,
              paddingHorizontal: Sizes.Radius,
              marginTop: Sizes.ScreenPadding,
              paddingVertical: Sizes.Radius,
            }}>
            <View
              style={{
                backgroundColor: Colors.White,
                position: 'absolute',
                top: -10,
                left: 16,
                paddingHorizontal: 5,
              }}>
              <Text style={{color: Colors.Black, ...Fonts.Medium2}}>
                {t('SchoolRegistration.PersonalDetails')}
              </Text>
            </View>

            <TextInput
              style={{
                backgroundColor: Colors.White,
                marginVertical: Sizes.Base,
              }}
              underlineColor={Colors.Primary2}
              activeUnderlineColor={Colors.Primary}
              label={t('SchoolRegistration.SchoolName')}
              value={registrationData.name}
              onChangeText={newText =>
                setRegistrationData({
                  ...registrationData,
                  name: newText,
                })
              }
            />
            <TextInput
              style={{
                backgroundColor: Colors.White,
                marginVertical: Sizes.Base,
              }}
              underlineColor={Colors.Primary2}
              activeUnderlineColor={Colors.Primary}
              label={t('SchoolRegistration.PrincipleName')}
              value={registrationData.principleName}
              onChangeText={newText =>
                setRegistrationData({
                  ...registrationData,
                  principleName: newText,
                })
              }
            />
            <TextInput
              inputMode="numeric"
              keyboardType="number-pad"
              style={{
                backgroundColor: Colors.White,
                marginVertical: Sizes.Base,
              }}
              disabled={true}
              underlineColor={Colors.Primary2}
              activeUnderlineColor={Colors.Primary}
              label={t('SchoolRegistration.MobileNumber')}
              value={registrationData.phoneNumber}
              onChangeText={newText =>
                setRegistrationData({
                  ...registrationData,
                  phoneNumber: newText,
                })
              }
            />

            <TextInput
              style={{
                backgroundColor: Colors.White,
                marginVertical: Sizes.Base,
              }}
              disabled={true}
              underlineColor={Colors.Primary2}
              activeUnderlineColor={Colors.Primary}
              label={t('SchoolRegistration.Email')}
              value={registrationData.email}
              onChangeText={newText =>
                setRegistrationData({
                  ...registrationData,
                  email: newText,
                })
              }
            />
            <TextInput
              style={{
                backgroundColor: Colors.White,
                marginVertical: Sizes.Base,
              }}
              underlineColor={Colors.Primary2}
              activeUnderlineColor={Colors.Primary}
              label={t('SchoolRegistration.Password')}
              secureTextEntry
              value={registrationData.password}
              onChangeText={newText =>
                setRegistrationData({
                  ...registrationData,
                  password: newText,
                })
              }
            />
            <View
              style={{
                marginTop: Sizes.ScreenPadding,
              }}>
              <Text
                style={{
                  ...Fonts.Medium2,
                  color: Colors.PrimaryText1,
                  textAlign: 'left',
                }}>
                {t('SchoolRegistration.Board')}
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
                  setOpenModal({...openModal, board: true});
                }}>
                <Text style={{...Fonts.Medium2, color: Colors.PrimaryText}}>
                  {registrationData.board.NAME
                    ? registrationData.board.NAME
                    : t('SchoolRegistration.SelectBoard')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{marginTop: Sizes.Padding, marginBottom: Sizes.Base}}>
              <Text
                style={{
                  ...Fonts.Medium2,
                  color: Colors.PrimaryText1,
                  textAlign: 'left',
                }}>
                {t('SchoolRegistration.Year')}
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
                  setOpenModal({...openModal, year: true});
                }}>
                <Text style={{...Fonts.Medium2, color: Colors.PrimaryText}}>
                  {registrationData.year.YEAR
                    ? registrationData.year.YEAR
                    : t('SchoolRegistration.SelectYear')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Address details */}
          <View
            style={{
              borderColor: Colors.Primary2,
              borderWidth: 1,
              borderRadius: Sizes.Radius,
              paddingHorizontal: Sizes.Radius,
              paddingVertical: Sizes.Radius,
              marginTop: Sizes.ScreenPadding + Sizes.Padding,
            }}>
            <View
              style={{
                backgroundColor: Colors.White,
                position: 'absolute',
                top: -10,
                left: 16,
                paddingHorizontal: 5,
              }}>
              <Text style={{color: Colors.Black, ...Fonts.Medium2}}>
                {t('SchoolRegistration.AddressDetails')}
              </Text>
            </View>

            <View style={{paddingBottom: Sizes.Padding}}>
              <View>
                <TextInput
                  multiline
                  activeUnderlineColor={Colors.Primary}
                  underlineColor={Colors.Primary2}
                  style={{
                    ...Fonts.Medium2,
                    backgroundColor: Colors.White,
                    marginBottom: Sizes.Base,
                    paddingTop: 2,
                  }}
                  label={t('SchoolRegistration.Address')}
                  value={registrationData.address}
                  onChangeText={newText =>
                    setRegistrationData({
                      ...registrationData,
                      address: newText,
                    })
                  }
                />
                <TextInput
                  maxLength={6}
                  keyboardType="numeric"
                  activeUnderlineColor={Colors.Primary}
                  underlineColor={Colors.Primary2}
                  style={{
                    ...Fonts.Medium2,
                    backgroundColor: Colors.White,
                    marginBottom: Sizes.Base,
                  }}
                  label={t('SchoolRegistration.Pin')}
                  value={registrationData.pin}
                  onChangeText={newText =>
                    setRegistrationData({
                      ...registrationData,
                      pin: newText,
                    })
                  }
                />
              </View>

              <View style={{marginTop: Sizes.Padding}}>
                <Text
                  style={{
                    ...Fonts.Medium2,
                    color: Colors.PrimaryText1,
                    textAlign: 'left',
                  }}>
                  {t('SchoolRegistration.Country')}
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
                    {registrationData.country.NAME
                      ? registrationData.country.NAME
                      : t('SchoolRegistration.SelectCountry')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{marginTop: Sizes.Padding}}>
                <Text
                  style={{
                    ...Fonts.Medium2,
                    color: Colors.PrimaryText1,
                    textAlign: 'left',
                  }}>
                  {t('SchoolRegistration.State')}
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
                    registrationData.country.ID
                      ? setOpenModal({...openModal, state: true})
                      : Toast('Please select country');
                  }}>
                  <Text style={{...Fonts.Medium2, color: Colors.PrimaryText}}>
                    {registrationData.state.NAME
                      ? registrationData.state.NAME
                      : t('SchoolRegistration.SelectState')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{marginTop: Sizes.Padding}}>
                <Text
                  style={{
                    ...Fonts.Medium2,
                    color: Colors.PrimaryText1,
                    textAlign: 'left',
                  }}>
                  {t('SchoolRegistration.District')}
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
                    registrationData.state.ID
                      ? setOpenModal({...openModal, district: true})
                      : Toast('Please select state');
                  }}>
                  <Text style={{...Fonts.Medium2, color: Colors.PrimaryText}}>
                    {registrationData.district.NAME
                      ? registrationData.district.NAME
                      : t('SchoolRegistration.SelectDistrict')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TextInput
            style={{
              backgroundColor: Colors.White,
              marginVertical: Sizes.Base,
              marginBottom: Sizes.Padding,
            }}
            underlineColor={Colors.Primary2}
            multiline
            activeUnderlineColor={Colors.Primary}
            label={t('SchoolRegistration.schoolInformation')}
            placeholder={'Give us few details about school'}
            value={registrationData.description}
            onChangeText={newText =>
              setRegistrationData({
                ...registrationData,
                description: newText,
              })
            }
          />
        </ScrollView>

        {!schoolInfo?.SCHOOL_STATUS ? (
          <TextButton
            loading={loading}
            onPress={() => {
              registration();
            }}
            label={t('SchoolRegistration.Register')}
            style={{marginTop: Sizes.Base}}
          />
        ) : (
          <TextButton
            loading={loading}
            onPress={() => {
              UpdateRegistration();
            }}
            label={t('SchoolRegistration.ApplyAgain')}
            style={{marginTop: Sizes.Base}}
          />
        )}
      </View>

      {openModal.board && (
        <ModalPicker
          title="Select Board"
          visible={openModal.board}
          onClose={() => {
            setOpenModal({...openModal, board: false});
          }}
          data={data.board}
          labelField={'NAME'}
          onChange={item => {
            setRegistrationData({...registrationData, board: item});

            // getBoard();
          }}
          value={registrationData.board}
        />
      )}
      {openModal.year && (
        <ModalPicker
          title="Select Year"
          visible={openModal.year}
          onClose={() => {
            setOpenModal({...openModal, year: false});
          }}
          data={data.year}
          labelField={'YEAR'}
          onChange={item => {
            // console.log(item);
            setRegistrationData({...registrationData, year: item});

            // getBoard();
          }}
          value={registrationData.board}
        />
      )}
      {openModal.country && (
        <ModalPicker
          title="Select Country"
          visible={openModal.country}
          onClose={() => {
            setOpenModal({...openModal, country: false});
          }}
          data={data.country}
          labelField={'NAME'}
          onChange={item => {
            getState(item);
          }}
          value={registrationData.country}
        />
      )}
      {openModal.state && (
        <ModalPicker
          title="Select State"
          visible={openModal.state}
          onClose={() => {
            setOpenModal({...openModal, state: false});
          }}
          data={data.state}
          labelField={'NAME'}
          onChange={item => {
            getDistrict(item);
          }}
          value={registrationData.state}
        />
      )}
      {openModal.district && (
        <ModalPicker
          title="Select District"
          visible={openModal.district}
          onClose={() => {
            setOpenModal({...openModal, district: false});
          }}
          data={data.district}
          labelField={'NAME'}
          onChange={item => {
            setRegistrationData({...registrationData, district: item});
          }}
          value={registrationData.district}
        />
      )}
      {schoolInfo?.SCHOOL_STATUS && (
        <Modal
          isVisible={statusModal}
          title=" "
          onClose={() => navigation.navigate('Drawer')}
          containerStyle={{justifyContent: 'flex-start'}}>
          {schoolInfo?.SCHOOL_STATUS == 'P' ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: Sizes.ScreenPadding,
              }}>
              <Text style={{color: Colors.Primary, ...Fonts.Bold1}}>
                {t('SchoolRegistration.ApplicationPending')}
              </Text>
              <Text style={{color: Colors.PrimaryText, ...Fonts.Medium2}}>
                {t('SchoolRegistration.PendingDescription')}
              </Text>
            </View>
          ) : schoolInfo?.SCHOOL_STATUS == 'R' ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: Sizes.ScreenPadding,
              }}>
              <Text style={{color: Colors.Primary, ...Fonts.Bold1}}>
                Application Rejected
              </Text>
              <Text style={{color: Colors.PrimaryText, ...Fonts.Medium2}}>
                {schoolInfo?.REJECT_BLOCKED_REMARK
                  ? schoolInfo?.REJECT_BLOCKED_REMARK
                  : ''}
              </Text>
              <TextButton
                label="Apply Again"
                loading={false}
                onPress={() => setStatusModal(false)}
              />
            </View>
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: Sizes.ScreenPadding,
              }}>
              <Text style={{color: Colors.Primary, ...Fonts.Bold1}}>
                Application Approved
              </Text>
            </View>
          )}
        </Modal>
      )}
    </View>
  );
};

export default RegistrationScreen;
