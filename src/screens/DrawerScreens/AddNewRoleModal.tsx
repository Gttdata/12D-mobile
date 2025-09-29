import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Icon, Modal, TextButton, TextInput, Toast } from '../../Components';
import { Reducers, apiPost, useDispatch, useSelector } from '../../Modules';
import { RadioButton } from 'react-native-paper';
import DropdownSimple from '../../Components/DropdownSimple';
import moment from 'moment';
import Dropdown from '../../Components/Dropdown';
import { emailValidation, getCountryCode } from '../../Functions';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import messaging from '@react-native-firebase/messaging';

interface modalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  onSuccess: () => void;
}
const AddNewRoleModal = ({ visible, onClose, title, onSuccess }: modalProps) => {
  const { member } = useSelector(state => state.member);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const [inputs, setInputs] = useState({
    name: '',
    gender: 'M',
    countryCode: { label: '+91', value: '91' },
    mobileNumber: '',
    email: '',
    rollNo: '',
    school: { SCHOOL_NAME: '', ID: '', YEAR_ID: '' },
    className: { NAME: '', ID: '' },
    division: { NAME: '', ID: '' },
    medium: {},
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
      setDate({ ...date, myDate: selectedDate, show: false });
    } else {
      setDate({ ...date, show: false });
    }
  };
  const countryCodes = getCountryCode();
  const [tabIndex, setTabIndex] = useState(1);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    school: [],
    className: [],
    division: [],
    medium: [],
  });
  useEffect(() => {
    getSchool();
  }, []);

  const getSchool = async () => {
    try {
      const res = await apiPost('api/school/get', {
        filter: ` AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        // console.log('res..', res);
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
      const res = await apiPost('api/createClass/get', {
        filter: `AND SCHOOL_ID = ${item.ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        setData(prevData => ({
          ...prevData,
          className: res.data,
        }));
        setInputs({
          ...inputs,
          school: item,
          className: { ID: '', NAME: '' },
          division: { ID: '', NAME: '' },
        });
      }
    } catch (error) {
      console.log('err..', error);
    }
  };

  const getDivision = async (item: any) => {
    try {
      const res = await apiPost('api/createDivision/get', {
        filter: `AND SCHOOL_ID = ${item.SCHOOL_ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        setData(prevData => ({
          ...prevData,
          division: res.data,
        }));
        setInputs({
          ...inputs,
          className: item,
          division: { NAME: '', ID: '' },
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
    } else if ((tabIndex == 2 || tabIndex == 3) && !inputs.school.ID) {
      Toast('Please select school');
      return true;
    } else if (tabIndex == 2 && !inputs.className.ID) {
      Toast('Please select class');
      return true;
    } else if (tabIndex == 2 && !inputs.division.ID) {
      Toast('Please select division');
      return true;
    } else if (tabIndex == 2 && inputs.rollNo?.trim() == '') {
      Toast('Please enter roll number');
      return true;
    } else {
      return false;
    }
  };

  // const teacherRegistration = async () => {
  //   const CLOUD_ID = await messaging().getToken();
  //   if (checkValidation()) {
  //     return;
  //   }
  //   try {
  //     let body = {
  //       NAME: inputs.name,
  //       EMAIL_ID: inputs.email,
  //       GENDER: inputs.gender,
  //       DOB: moment(date.myDate).format('YYYY-MM-DD HH:mm:ss'),
  //       MOBILE_NUMBER: member?.MOBILE_NUMBER,
  //       CLIENT_ID: 1,
  //       STATUS: 1,
  //       APPROVAL_STATUS: 'P',
  //       SCHOOL_ID: inputs.school.ID,
  //       YEAR_ID: inputs.school.YEAR_ID,
  //       ROLE: 'T',
  //       CLOUD_ID,
  //     };
  //     const res = await apiPost('appUser/register', body);
  //     if (res && res.code == 200) {
  //       sendRegistartionMessage();
  //       console.log('\n\n..res..', res);
  //       // const user = res.data[1].UserData[0];
  //       // const token: string = res.data[1].token;
  //       // await AsyncStorage.setItem('MOBILE_NUMBER', '' + user.MOBILE_NUMBER);
  //       // await AsyncStorage.setItem('USER_ID', '' + user.ID);
  //       // await AsyncStorage.setItem('token', '' + token);
  //       setLoading(false);
  //       Toast('Registration Success');
  //       dispatch(Reducers.setShowSplash(true));
  //     } else {
  //       setLoading(false);
  //       Toast('Something Wrong Please Try Again..');
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     console.log('error...??', error);
  //   }
  // };

  const UserRegistration = async () => {
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
        MOBILE_NUMBER: member?.MOBILE_NUMBER,
        CLIENT_ID: 1,
        STATUS: 1,
        ROLE: 'U',
        CLOUD_ID,
      };
      const res = await apiPost('appUser/register', body);
      if (res && res.code == 200) {
        sendRegistartionMessage();
        console.log('\n\n..res..', res);
        // const user = res.data[1].UserData[0];
        // const token: string = res.data[1].token;
        // await AsyncStorage.setItem('MOBILE_NUMBER', '' + user.MOBILE_NUMBER);
        // await AsyncStorage.setItem('USER_ID', '' + user.ID);
        // await AsyncStorage.setItem('token', '' + token);
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


  const sendRegistartionMessage = async () => {
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
        MOBILE_NUMBER: member?.MOBILE_NUMBER,
        EMAIL_ID: inputs.email,
        SCHOOL_ID: inputs.school.ID,
        TEMP_CLASS_ID: inputs.className.ID,
        TEMP_DIVISION_ID: inputs.division.ID,
        TEMP_ROLL_NO: inputs.rollNo,
        APPROVAL_STATUS: 'P',
        CLIENT_ID: 1,
        STATUS: 1,
        ROLE: 'S',
        CLOUD_ID,
      };
      const res = await apiPost('appUser/register', body);
      if (res && res.code == 200) {
        sendRegistartionMessage();
        // console.log('\n\n..res..', res);
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
    <Modal
      containerStyle={{ flex: 1 }}
      style={{ margin: 0, flex: 1, marginTop: 60 }}
      onClose={() => onClose()}
      isVisible={visible}
      title="">
      <View style={{ flex: 1 }}>
        <View
          style={{
            width: 70,
            height: 4,
            borderRadius: 2,
            backgroundColor: Colors.Primary2,
            marginTop: -5,
            alignSelf: 'center',
          }}
        />
        <Text
          style={{
            color: Colors.PrimaryText1,
            ...Fonts.Bold2,
            textAlign: 'center',
            marginTop: Sizes.Radius,
          }}>
          Add New User
        </Text>

        {/**TABS**/}
        {/* <View
          style={{
            height: 43,
            borderRadius: Sizes.Padding * 2,
            elevation: 6,
            shadowColor: Colors.Primary2,
            marginTop: Sizes.Base,
            flexDirection: 'row',
            backgroundColor: Colors.Background,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setTabIndex(1);
            }}
            style={{
              width: '33%',
              height: '100%',
              borderTopLeftRadius: Sizes.Padding * 2,
              borderBottomLeftRadius: Sizes.Padding * 2,
              backgroundColor: tabIndex == 1 ? Colors.Primary2 : Colors.White,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...Fonts.Medium2,
                color: tabIndex == 1 ? Colors.White : Colors.Primary2,
              }}>
              User
            </Text>
          </TouchableOpacity>
          {tabIndex == 3 && (
            <View
              style={{
                height: 17,
                width: 1,
                backgroundColor: Colors.Primary,
                alignSelf: 'center',
              }}
            />
          )}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setTabIndex(2);
            }}
            style={{
              width: '33%',
              height: '100%',
              backgroundColor: tabIndex == 2 ? Colors.Primary2 : Colors.White,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...Fonts.Medium2,
                color: tabIndex == 2 ? Colors.White : Colors.Primary2,
              }}>
              Student
            </Text>
          </TouchableOpacity>
          {tabIndex == 1 && (
            <View
              style={{
                height: 17,
                width: 1,
                backgroundColor: Colors.Primary,
                alignSelf: 'center',
              }}
            />
          )}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setTabIndex(3);
            }}
            style={{
              width: '34%',
              height: '100%',
              borderTopRightRadius: Sizes.Padding * 2,
              borderBottomRightRadius: Sizes.Padding * 2,
              backgroundColor: tabIndex == 3 ? Colors.Primary2 : Colors.White,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...Fonts.Medium2,
                color: tabIndex == 3 ? Colors.White : Colors.Primary2,
              }}>
              Teacher
            </Text>
          </TouchableOpacity>
        </View> */}

        {/*APP USER REGISTRATION VIEW*/}
        {tabIndex == 1 && (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <View style={{ marginTop: Sizes.ScreenPadding }}>
                <TextInput
                  placeholder="Name"
                  onChangeText={txt => {
                    setInputs({ ...inputs, name: txt });
                  }}
                  value={inputs.name}
                />
                {/* gender */}
                <View
                  style={{
                    alignItems: 'center',
                    marginTop: Sizes.ScreenPadding,
                    marginHorizontal: 2,
                    flexDirection: 'row',
                  }}>
                  <Text style={{ color: Colors.PrimaryText1, ...Fonts.Medium2 }}>
                    {`Gender : `}
                  </Text>
                  <RadioButton.Group
                    onValueChange={value => {
                      setInputs({ ...inputs, gender: value });
                    }}
                    value={inputs.gender}>
                    <View style={{ flexDirection: 'row' }}>
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
                          Female
                        </Text>
                      </View>
                      <View style={{ width: Sizes.ScreenPadding }} />
                    </View>
                  </RadioButton.Group>
                </View>

                {/* dob */}
                <View style={{ width: '100%' }}>
                  <DropdownSimple
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
                    onPress={() => setDate({ ...date, show: true })}
                    imp={false}
                  />
                </View>

                {/* Mobile number */}
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: Sizes.ScreenPadding,
                    marginBottom: Sizes.Padding,
                    width: '100%',
                  }}>
                  <View style={{ marginRight: 3, width: '24%' }}>
                    <Dropdown
                      data={countryCodes}
                      value={inputs.countryCode}
                      disable={true}
                      search={true}
                      onChange={item => {
                        setInputs({ ...inputs, countryCode: item });
                      }}
                      labelField="label"
                      valueField="value"
                    />
                  </View>
                  <View style={{ width: '3%' }} />
                  <TextInput
                    style={{
                      width: '72%',
                    }}
                    disable={true}
                    keyboardType={'number-pad'}
                    maxLength={10}
                    onChangeText={(txt: string) => {
                      setInputs({ ...inputs, mobileNumber: txt });
                    }}
                    value={'' + member?.MOBILE_NUMBER}
                    placeholder={'Mobile Number'}
                  />
                </View>

                {/* Email */}
                <TextInput
                  onChangeText={(txt: string) => {
                    setInputs({ ...inputs, email: txt });
                  }}
                  value={inputs.email}
                  placeholder={'Enter Email address'}
                />
              </View>
            </View>
            <TextButton
              label="Add User"
              loading={false}
              onPress={() => {
                UserRegistration();
              }}
              style={{ justifyContent: 'flex-end' }}
            />
          </View>
        )}

        {/*STUDENT REGISTRATION VIEW*/}
        {tabIndex == 2 && (
          <View style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  marginVertical: Sizes.ScreenPadding,
                  marginHorizontal: Sizes.Base,
                }}>
                <Text
                  style={{
                    ...Fonts.Medium3,
                    color: Colors.PrimaryText,
                    marginBottom: Sizes.Padding,
                  }}>
                  Hello,
                  <Text
                    style={{
                      ...Fonts.Medium3,
                      color: Colors.Primary,
                      marginBottom: Sizes.Padding,
                    }}>
                    {` ${member?.NAME} `}
                  </Text>
                  if your school is registered with 12 Dimensions, please fill
                  in the following school-related information for verification.
                </Text>
                <TextInput
                  placeholder="Name"
                  onChangeText={txt => {
                    setInputs({ ...inputs, name: txt });
                  }}
                  value={inputs.name}
                />
                {/* gender */}
                <View
                  style={{
                    alignItems: 'center',
                    marginTop: Sizes.ScreenPadding,
                    marginHorizontal: 2,
                    flexDirection: 'row',
                  }}>
                  <Text style={{ color: Colors.PrimaryText1, ...Fonts.Medium2 }}>
                    {`Gender : `}
                  </Text>
                  <RadioButton.Group
                    onValueChange={value => {
                      setInputs({ ...inputs, gender: value });
                    }}
                    value={inputs.gender}>
                    <View style={{ flexDirection: 'row' }}>
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
                          Female
                        </Text>
                      </View>
                      <View style={{ width: Sizes.ScreenPadding }} />
                    </View>
                  </RadioButton.Group>
                </View>

                {/* dob */}
                <View style={{ width: '100%' }}>
                  <DropdownSimple
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
                    onPress={() => setDate({ ...date, show: true })}
                    imp={false}
                  />
                </View>

                {/* Mobile number */}
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: Sizes.ScreenPadding,
                    marginBottom: Sizes.Padding,
                    width: '100%',
                  }}>
                  <View style={{ marginRight: 3, width: '24%' }}>
                    <Dropdown
                      data={countryCodes}
                      value={inputs.countryCode}
                      disable={true}
                      search={true}
                      onChange={item => {
                        setInputs({ ...inputs, countryCode: item });
                      }}
                      labelField="label"
                      valueField="value"
                    />
                  </View>
                  <View style={{ width: '3%' }} />
                  <TextInput
                    style={{
                      width: '72%',
                    }}
                    disable={true}
                    keyboardType={'number-pad'}
                    maxLength={10}
                    onChangeText={(txt: string) => {
                      setInputs({ ...inputs, mobileNumber: txt });
                    }}
                    value={'' + member?.MOBILE_NUMBER}
                    placeholder={'Mobile Number'}
                  />
                </View>

                {/* Email */}
                <TextInput
                  onChangeText={(txt: string) => {
                    setInputs({ ...inputs, email: txt });
                  }}
                  value={inputs.email}
                  placeholder={'Enter Email address'}
                />

                {/* School */}
                <View style={{ marginTop: Sizes.ScreenPadding }}>
                  <Dropdown
                    data={data.school}
                    value={inputs.school}
                    onChange={item => {
                      getClass(item);
                    }}
                    placeholder={'Select School'}
                    labelField="SCHOOL_NAME"
                    valueField="ID"
                  />
                </View>

                {/* class */}
                <View style={{ marginTop: Sizes.ScreenPadding }}>
                  <Dropdown
                    data={data.className}
                    value={inputs.className}
                    onChange={item => {
                      getDivision(item);
                    }}
                    placeholder={'Select Class'}
                    labelField="NAME"
                    valueField="ID"
                  />
                </View>

                {/* div */}
                <View style={{ marginTop: Sizes.ScreenPadding }}>
                  <Dropdown
                    data={data.division}
                    value={inputs.division}
                    onChange={item => {
                      setInputs({ ...inputs, division: item });
                    }}
                    placeholder={'Select Div'}
                    labelField="NAME"
                    valueField="ID"
                  />
                </View>
                {/* roll no */}
                <View style={{ marginTop: Sizes.Radius }}>
                  <TextInput
                    onChangeText={(txt: string) => {
                      setInputs({ ...inputs, rollNo: txt });
                    }}
                    value={inputs.rollNo}
                    placeholder={'Enter Roll No'}
                  />
                </View>
              </View>
            </ScrollView>
            <TextButton
              label="Add User"
              loading={loading}
              onPress={() => {
                studentRegistration();
              }}
              style={{ justifyContent: 'flex-end' }}
            />
          </View>
        )}

        {/*TEACHER REGISTRATION VIEW*/}
        {tabIndex == 3 && (
          <View style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  marginVertical: Sizes.ScreenPadding,
                  marginHorizontal: Sizes.Base,
                }}>
                <View style={{}}>
                  <Text
                    style={{
                      ...Fonts.Medium3,
                      color: Colors.PrimaryText,
                      marginBottom: Sizes.Padding,
                    }}>
                    Hello,
                    <Text
                      style={{
                        ...Fonts.Medium3,
                        color: Colors.Primary,
                        marginBottom: Sizes.Padding,
                      }}>
                      {` ${member?.NAME} `}
                    </Text>
                    if your school is registered with 12 Dimensions, please fill
                    in the following school-related information for
                    verification.
                  </Text>
                  <TextInput
                    placeholder="Name"
                    onChangeText={txt => {
                      setInputs({ ...inputs, name: txt });
                    }}
                    value={inputs.name}
                  />
                  {/* gender */}
                  <View
                    style={{
                      alignItems: 'center',
                      marginTop: Sizes.ScreenPadding,
                      marginHorizontal: 2,
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{ color: Colors.PrimaryText1, ...Fonts.Medium2 }}>
                      {`Gender : `}
                    </Text>
                    <RadioButton.Group
                      onValueChange={value => {
                        setInputs({ ...inputs, gender: value });
                      }}
                      value={inputs.gender}>
                      <View style={{ flexDirection: 'row' }}>
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
                            Female
                          </Text>
                        </View>
                        <View style={{ width: Sizes.ScreenPadding }} />
                      </View>
                    </RadioButton.Group>
                  </View>

                  {/* dob */}
                  <View style={{ width: '100%' }}>
                    <DropdownSimple
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
                      onPress={() => setDate({ ...date, show: true })}
                      imp={false}
                    />
                  </View>

                  {/* Mobile number */}
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: Sizes.ScreenPadding,
                      marginBottom: Sizes.Padding,
                      width: '100%',
                    }}>
                    <View style={{ marginRight: 3, width: '24%' }}>
                      <Dropdown
                        data={countryCodes}
                        value={inputs.countryCode}
                        disable={true}
                        search={true}
                        onChange={item => {
                          setInputs({ ...inputs, countryCode: item });
                        }}
                        labelField="label"
                        valueField="value"
                      />
                    </View>
                    <View style={{ width: '3%' }} />
                    <TextInput
                      style={{
                        width: '72%',
                      }}
                      disable={true}
                      keyboardType={'number-pad'}
                      maxLength={10}
                      onChangeText={(txt: string) => {
                        setInputs({ ...inputs, mobileNumber: txt });
                      }}
                      value={'' + member?.MOBILE_NUMBER}
                      placeholder={'Mobile Number'}
                    />
                  </View>

                  {/* Email */}
                  <TextInput
                    onChangeText={(txt: string) => {
                      setInputs({ ...inputs, email: txt });
                    }}
                    value={inputs.email}
                    placeholder={'Enter Email address'}
                  />

                  {/* School */}
                  <View style={{ marginTop: Sizes.ScreenPadding }}>
                    <Dropdown
                      data={data.school}
                      value={inputs.school}
                      onChange={item => {
                        setInputs({
                          ...inputs,
                          school: item,
                          className: { ID: '', NAME: '' },
                          division: { ID: '', NAME: '' },
                        });
                      }}
                      placeholder={'Select School'}
                      labelField="SCHOOL_NAME"
                      valueField="ID"
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
            <TextButton
              label="Add User"
              loading={loading}
              onPress={() => {
                teacherRegistration();
              }}
              style={{ justifyContent: 'flex-end' }}
            />
          </View>
        )}
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
    </Modal>
  );
};

export default AddNewRoleModal;
