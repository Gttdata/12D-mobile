import {View, Text, Image, ScrollView, Linking} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackAuthProps} from '../AuthRoutes';
import {useTranslation} from 'react-i18next';
import {Reducers, apiPost, useDispatch, useSelector} from '../../Modules';
import {emailValidation, getCountryCode} from '../../Functions';
import LinearGradient from 'react-native-linear-gradient';
import {Icon, TextButton, TextInput, Toast} from '../../Components';
import {Checkbox, RadioButton} from 'react-native-paper';
import DropdownSimple from '../../Components/DropdownSimple';
import Dropdown from '../../Components/Dropdown';
import TermsConditionModal from '../../Components/TermsConditionModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = StackAuthProps<'TeacherStudentRegistration'>;
const IMAGE_WIDTH = 350;
const TeacherStudentRegistration = ({
  navigation,
  route,
}: Props): JSX.Element => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {mobile} = route.params;
  const {t} = useTranslation();
  const countryCodes = getCountryCode();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    createdFor: 'T',
    name: '',
    gender: 'M',
    countryCode: {label: '+91', value: '91'},
    mobileNumber: mobile,
    email: '',
    school: {SCHOOL_NAME: '', ID: '', YEAR_ID: ''},
    class: {NAME: '', ID: ''},
    div: {NAME: '', ID: ''},
    rollNumber: '',
    termsAndCondition: false,
    openTermsModal: false,
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    school: [],
    class: [],
    division: [],
  });
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
      setDate({...date, myDate: selectedDate, show: false});
    } else {
      setDate({...date, show: false});
    }
  };
  useEffect(() => {
    getSchool();
  }, []);

  const getSchool = async () => {
    try {
      const res = await apiPost('school/get', {
        filter: ` AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        //  console.log('res..', res);
        setData(prevData => ({
          ...prevData,
          school: res.data,
        }));
      }
    } catch (error) {
      console.log('erro..', error);
    }
  };
  const getClass = async (item: any) => {
    try {
      const res = await apiPost('createClass/get', {
        filter: `AND SCHOOL_ID = ${item.ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        setData(prevData => ({
          ...prevData,
          class: res.data,
        }));
        setInputs({
          ...inputs,
          school: item,
          class: {ID: '', NAME: ''},
          div: {ID: '', NAME: ''},
        });
      }
    } catch (error) {
      console.log('err..', error);
    }
  };
  const getDivision = async (item: any) => {
    try {
      const res = await apiPost('createDivision/get', {
        filter: `AND SCHOOL_ID = ${item.SCHOOL_ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        setData(prevData => ({
          ...prevData,
          division: res.data,
        }));
        setInputs({
          ...inputs,
          class: item,
          div: {NAME: '', ID: ''},
        });
      }
    } catch (error) {
      console.log('err..', error);
    }
  };

  const checkValidation = () => {
    if (!inputs.name || inputs.name?.trim() == '') {
      Toast('Please enter name');
      return true;
    } else if (!date.myDate) {
      Toast(t('appRegister.dobToast'));
      return true;
    } else if (inputs.email && !emailValidation.test(inputs.email)) {
      Toast(t('appRegister.emailToast'));
      return true;
    } else if (!inputs.school.ID) {
      Toast('Please select school');
      return true;
    } else if (inputs.createdFor == 'S' && !inputs.class.ID) {
      Toast('Please select class');
      return true;
    } else if (inputs.createdFor == 'S' && !inputs.div.ID) {
      Toast('Please select division');
      return true;
    } else if (inputs.createdFor == 'S' && inputs.rollNumber?.trim() == '') {
      Toast('Please enter roll number');
      return true;
    } else if (!inputs.termsAndCondition) {
      Toast('Please agree terms and condition');
      return true;
    } else {
      return false;
    }
  };

  const teacherRegistration = async () => {
    const CLOUD_ID = await messaging().getToken();
    if (checkValidation()) {
      return;
    }
    try {
      let body = {
        NAME: inputs.name,
        EMAIL_ID: inputs.email,
        GENDER: inputs.gender,
        DOB: moment(date.myDate).format('YYYY-MM-DD HH:mm:ss'),
        MOBILE_NUMBER: mobile,
        CLIENT_ID: 1,
        STATUS: 1,
        // TEACHER_STATUS: 'P',
        APPROVAL_STATUS: 'P',
        SCHOOL_ID: inputs.school.ID,
        YEAR_ID: inputs.school.YEAR_ID,
        ROLE: inputs.createdFor,
        CLOUD_ID,
      };
      const res = await apiPost('appUser/register', body);
      if (res && res.code == 200) {
        sendRegistartionMessage();
        const user = res.data[1].UserData[0];
        const token: string = res.data[1].token;
        await AsyncStorage.setItem('MOBILE_NUMBER', '' + user.MOBILE_NUMBER);
        await AsyncStorage.setItem('USER_ID', '' + user.ID);
        await AsyncStorage.setItem('token', '' + token);
        setLoading(false);
        Toast('Registration Success');
        dispatch(Reducers.setShowSplash(true));
      } else {
        setLoading(false);
        Toast('Something Wrong Please Try Again..');
      }
    } catch (error) {
      setLoading(false);
      console.log('error...??', error);
    }
  };
    const sendRegistartionMessage=async()=>{
       try {
            const res = await apiPost("api/appUser/sendRegistrationMessage", {
              MOBILE_NUMBER: inputs.mobileNumber,
              NAME: inputs.name,
            });
            if (res && res.code == 200) {
              console.log("Message sent");
            }
          } catch (error) {
            setLoading(false);
            console.log("error..", error);
          }
    }
  const studentRegistration = async () => {
    const CLOUD_ID = await messaging().getToken();
    if (checkValidation()) {
      return;
    }
    try {
      let body = {
        NAME: inputs.name,
        GENDER: inputs.gender,
        DOB: moment(date.myDate).format('YYYY-MM-DD HH:mm:ss'),
        MOBILE_NUMBER: mobile,
        EMAIL_ID: inputs.email,
        SCHOOL_ID: inputs.school.ID,
        TEMP_CLASS_ID: inputs.class.ID,
        TEMP_DIVISION_ID: inputs.div.ID,
        TEMP_ROLL_NO: inputs.rollNumber,
        APPROVAL_STATUS: 'P',
        // STUDENT_STATUS: 'P',
        CLIENT_ID: 1,
        STATUS: 1,
        ROLE: inputs.createdFor,
        CLOUD_ID,
      };
      const res = await apiPost('appUser/register', body);
      if (res && res.code == 200) {
        sendRegistartionMessage();
        const user = res.data[1].UserData[0];
        const token: string = res.data[1].token;
        await AsyncStorage.setItem('MOBILE_NUMBER', '' + user.MOBILE_NUMBER);
        await AsyncStorage.setItem('USER_ID', '' + user.ID);
        await AsyncStorage.setItem('token', '' + token);
        setLoading(false);
        Toast(t('common.RegistrationSuccess'));
        dispatch(Reducers.setShowSplash(true));
      } else {
        setLoading(false);
        Toast('Something Wrong Please Try Again..');
      }
    } catch (error) {
      setLoading(false);
      console.log('error...//', error);
    }
  };
  return (
    <View style={{flex: 1}}>
      {inputs.createdFor == 'T' ? (
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
            <View style={{height: IMAGE_WIDTH}}></View>
          </LinearGradient>

          {/*Register part*/}

          <View
            style={{
              width: '90%',
              marginTop: -320,
              elevation: 10,
              backgroundColor: Colors.White,
              paddingHorizontal: Sizes.Radius,
              paddingTop: Sizes.Padding,
              borderRadius: Sizes.ScreenPadding,
              // maxHeight: 630,
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{width: '100%'}}>
              <View
                style={{marginTop: Sizes.Base, marginHorizontal: Sizes.Base}}>
                <View
                  style={{
                    alignItems: 'center',
                    marginBottom: Sizes.Radius,
                    marginHorizontal: 2,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: Colors.PrimaryText1,
                      ...Fonts.Medium2,
                    }}>
                    {`Created For : `}
                  </Text>
                  <RadioButton.Group
                    onValueChange={value => {
                      setInputs({...inputs, createdFor: value});
                    }}
                    value={inputs.createdFor}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <RadioButton value={'T'} color={Colors.Primary2} />
                        <Text
                          style={{
                            color: Colors.PrimaryText1,
                            ...Fonts.Regular3,
                          }}>
                          {'Teacher'}
                        </Text>
                      </View>
                      <View style={{width: Sizes.ScreenPadding}} />
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <RadioButton value={'S'} color={Colors.Primary2} />
                        <Text
                          style={{
                            color: Colors.PrimaryText1,
                            ...Fonts.Regular3,
                          }}>
                          {'Student'}
                        </Text>
                      </View>
                      <View style={{width: Sizes.ScreenPadding}} />
                    </View>
                  </RadioButton.Group>
                </View>
                {/* name */}
                <TextInput
                  label="Name"
                  onChangeText={txt => {
                    setInputs({...inputs, name: txt});
                  }}
                  value={inputs.name}
                  placeholder={'Enter Name'}
                />
                {/* gender */}
                <View
                  style={{
                    alignItems: 'center',
                    marginTop: Sizes.Radius,
                    marginHorizontal: 2,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      ...Fonts.Medium3,
                      color: Colors.PrimaryText1,
                    }}>
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

                {/* dob */}
                <View style={{width: '100%'}}>
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

                {/* Mobile number */}
                <Text
                  style={{
                    ...Fonts.Medium3,
                    color: Colors.PrimaryText1,
                    marginTop: Sizes.Base,
                  }}>
                  Mobile
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    // marginTop: Sizes.ScreenPadding,
                    width: '100%',
                  }}>
                  <View style={{marginRight: 3, width: '24%'}}>
                    <Dropdown
                      data={countryCodes}
                      value={inputs.countryCode}
                      disable={true}
                      search={true}
                      onChange={item => {
                        setInputs({...inputs, countryCode: item});
                      }}
                      // placeholder={'Select'}
                      style={{
                        borderWidth: 0,
                        elevation: 6,
                        shadowColor: Colors.Primary,
                      }}
                      labelField="label"
                      valueField="value"
                      dropdownStyle={{
                        paddingRight: 5,
                        paddingLeft: 15,
                        alignSelf: 'center',
                      }}
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
                  <View style={{width: '3%'}} />
                  <TextInput
                    style={{
                      width: '72%',
                    }}
                    disable={true}
                    keyboardType={'number-pad'}
                    maxLength={10}
                    onChangeText={(txt: string) => {
                      setInputs({...inputs, mobileNumber: txt});
                    }}
                    value={inputs.mobileNumber}
                    placeholder={'Mobile Number'}
                  />
                </View>

                {/* Email */}
                <TextInput
                  label="Email"
                  labelStyle={{marginTop: Sizes.Radius}}
                  onChangeText={(txt: string) => {
                    const newTxt = txt.replace(/\s/g, '');
                    setInputs({...inputs, email: newTxt});
                  }}
                  value={inputs.email}
                  placeholder={'Enter Email address'}
                />

                {/* School */}
                <View style={{marginTop: Sizes.ScreenPadding}}>
                  <Dropdown
                    label="School"
                    data={data.school}
                    value={inputs.school}
                    onChange={item => {
                      setInputs({...inputs, school: item});
                    }}
                    placeholder={'Select School'}
                    style={{
                      borderWidth: 0,
                      elevation: 6,
                      shadowColor: Colors.Primary,
                      height: 45,
                    }}
                    labelField="SCHOOL_NAME"
                    valueField="ID"
                    dropdownStyle={{
                      paddingRight: 5,
                      paddingLeft: 15,
                      alignSelf: 'center',
                    }}
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

                {/* terms and condition */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: Sizes.ScreenPadding,
                  }}>
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
                      ...Fonts.Medium3,
                      // fontSize: 13,
                      color: Colors.PrimaryText,
                    }}>
                    {'I agree to the Terms and Conditions'}
                  </Text>
                  <Text
                    onPress={() => {
                        Linking.openURL('https://www.12dimensionsapp.in/terms.html');
                      // setInputs({...inputs, openTermsModal: true});
                    }}
                    style={{
                      ...Fonts.Bold2,
                      fontSize: 13,
                      color: Colors.PrimaryText,
                      marginLeft: Sizes.Radius,
                    }}>
                    Read
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View
              style={{
                marginBottom: Sizes.ScreenPadding,
                width: '100%',
                alignSelf: 'center',
                marginTop: Sizes.Radius,
              }}>
              <TextButton
                label={'Register'}
                loading={false}
                onPress={() => {
                  // registration();
                  teacherRegistration();
                }}
              />
            </View>
          </View>

          {/* Bottom Part */}
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
                navigation.goBack();
              }}
              style={{
                ...Fonts.Medium2,
                color: Colors.Primary,
                marginHorizontal: Sizes.Base,
              }}>
              Login For 12Dimensions
            </Text>
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
      ) : (
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
            <View style={{height: IMAGE_WIDTH}} />
          </LinearGradient>

          {/*Register part*/}

          <View
            style={{
              width: '90%',
              marginTop: -320,
              elevation: 10,
              backgroundColor: Colors.White,
              paddingHorizontal: Sizes.Radius,
              paddingTop: Sizes.Padding,
              borderRadius: Sizes.ScreenPadding,
              maxHeight: 620,
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{width: '100%'}}>
              <View
                style={{marginTop: Sizes.Base, marginHorizontal: Sizes.Base}}>
                <View
                  style={{
                    alignItems: 'center',
                    marginBottom: Sizes.Radius,
                    marginHorizontal: 2,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: Colors.PrimaryText1,
                      ...Fonts.Medium2,
                    }}>
                    {`Created For : `}
                  </Text>
                  <RadioButton.Group
                    onValueChange={value => {
                      setInputs({...inputs, createdFor: value});
                    }}
                    value={inputs.createdFor}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <RadioButton value={'T'} color={Colors.Primary2} />
                        <Text
                          style={{
                            color: Colors.PrimaryText1,
                            ...Fonts.Regular3,
                          }}>
                          {'Teacher'}
                        </Text>
                      </View>
                      <View style={{width: Sizes.ScreenPadding}} />
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <RadioButton value={'S'} color={Colors.Primary2} />
                        <Text
                          style={{
                            color: Colors.PrimaryText1,
                            ...Fonts.Regular3,
                          }}>
                          {'Student'}
                        </Text>
                      </View>
                      <View style={{width: Sizes.ScreenPadding}} />
                    </View>
                  </RadioButton.Group>
                </View>
                {/* name */}
                <TextInput
                  onChangeText={txt => {
                    setInputs({...inputs, name: txt});
                  }}
                  value={inputs.name}
                  placeholder={'Enter Name'}
                />
                {/* gender */}
                <View
                  style={{
                    alignItems: 'center',
                    marginTop: Sizes.Radius,
                    marginHorizontal: 2,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: Colors.PrimaryText1,
                      ...Fonts.Medium3,
                    }}>
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

                {/* dob */}
                <View style={{width: '100%'}}>
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

                {/* Mobile number */}
                <Text
                  style={{
                    color: Colors.PrimaryText1,
                    ...Fonts.Medium3,
                    marginTop: Sizes.Base,
                  }}>
                  Mobile
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    // marginTop: Sizes.ScreenPadding,
                    width: '100%',
                  }}>
                  <View style={{marginRight: 3, width: '24%'}}>
                    <Dropdown
                      data={countryCodes}
                      value={inputs.countryCode}
                      disable={true}
                      search={true}
                      onChange={item => {
                        setInputs({...inputs, countryCode: item});
                      }}
                      // placeholder={'Select'}
                      style={{
                        borderWidth: 0,
                        elevation: 6,
                        shadowColor: Colors.Primary,
                      }}
                      labelField="label"
                      valueField="value"
                      dropdownStyle={{
                        paddingRight: 5,
                        paddingLeft: 15,
                        alignSelf: 'center',
                      }}
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
                  <View style={{width: '3%'}} />
                  <TextInput
                    style={{
                      width: '72%',
                    }}
                    disable={true}
                    keyboardType={'number-pad'}
                    maxLength={10}
                    onChangeText={(txt: string) => {
                      setInputs({...inputs, mobileNumber: txt});
                    }}
                    value={inputs.mobileNumber}
                    placeholder={'Mobile Number'}
                  />
                </View>

                {/* Email */}
                <TextInput
                  label="Email"
                  labelStyle={{
                    marginTop: Sizes.Radius,
                  }}
                  onChangeText={(txt: string) => {
                    const newTxt = txt.replace(/\s/g, '');
                    setInputs({...inputs, email: newTxt});
                  }}
                  value={inputs.email}
                  placeholder={'Enter Email address'}
                />

                {/* School */}
                <View style={{marginTop: Sizes.Radius}}>
                  <Dropdown
                    label="School"
                    data={data.school}
                    value={inputs.school}
                    onChange={item => {
                      // setInputs({...inputs, school: item});
                      getClass(item);
                    }}
                    placeholder={'Select School'}
                    style={{
                      borderWidth: 0,
                      elevation: 6,
                      shadowColor: Colors.Primary,
                      height: 45,
                    }}
                    labelField="SCHOOL_NAME"
                    valueField="ID"
                    dropdownStyle={{
                      paddingRight: 5,
                      paddingLeft: 15,
                      alignSelf: 'center',
                    }}
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

                {/* class */}
                <View style={{marginTop: Sizes.Radius}}>
                  <Dropdown
                    label="Class"
                    data={data.class}
                    value={inputs.class}
                    onChange={item => {
                      getDivision(item);
                    }}
                    placeholder={'Select Class'}
                    style={{
                      borderWidth: 0,
                      elevation: 6,
                      shadowColor: Colors.Primary,
                      height: 45,
                    }}
                    labelField="NAME"
                    valueField="ID"
                    dropdownStyle={{
                      paddingRight: 5,
                      paddingLeft: 15,
                      alignSelf: 'center',
                    }}
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

                {/* div */}
                <View style={{marginTop: Sizes.Radius}}>
                  <Dropdown
                    label="Division"
                    data={data.division}
                    value={inputs.div}
                    onChange={item => {
                      setInputs({...inputs, div: item});
                    }}
                    placeholder={'Select Div'}
                    style={{
                      borderWidth: 0,
                      elevation: 6,
                      shadowColor: Colors.Primary,
                      height: 45,
                    }}
                    labelField="NAME"
                    valueField="ID"
                    dropdownStyle={{
                      paddingRight: 5,
                      paddingLeft: 15,
                      alignSelf: 'center',
                    }}
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

                {/* roll number */}
                <TextInput
                  label="Roll Number"
                  labelStyle={{
                    marginTop: Sizes.Radius,
                  }}
                  maxLength={10}
                  onChangeText={txt => {
                    setInputs({...inputs, rollNumber: txt});
                  }}
                  value={inputs.rollNumber}
                  placeholder={'Enter roll number'}
                  keyboardType="number-pad"
                />

                {/* terms and condition */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: Sizes.ScreenPadding,
                  }}>
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
                      ...Fonts.Medium3,
                      // fontSize: 13,
                      color: Colors.PrimaryText,
                    }}>
                    {'I agree to the Terms and Conditions'}
                  </Text>
                  <Text
                    onPress={() => {
                      setInputs({...inputs, openTermsModal: true});
                    }}
                    style={{
                      ...Fonts.Bold2,
                      fontSize: 13,
                      color: Colors.PrimaryText,
                      marginLeft: Sizes.Base,
                    }}>
                    Read
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View
              style={{
                marginBottom: Sizes.ScreenPadding,
                width: '100%',
                alignSelf: 'center',
                marginTop: Sizes.Radius,
              }}>
              <TextButton
                label={'Register'}
                loading={false}
                onPress={() => {
                  studentRegistration();
                }}
              />
            </View>
          </View>

          {/* Bottom Part */}
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
                navigation.goBack();
              }}
              style={{
                ...Fonts.Medium2,
                color: Colors.Primary,
                marginHorizontal: Sizes.Base,
              }}>
              Login For 12Dimensions
            </Text>
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
      )}
    </View>
  );
};

export default TeacherStudentRegistration;
