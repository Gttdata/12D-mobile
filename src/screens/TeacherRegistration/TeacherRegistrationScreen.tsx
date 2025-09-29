import {View, Text, TouchableOpacity, Animated, FlatList} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import DropdownSimple from '../../Components/DropdownSimple';
import {apiPost, apiPut, useSelector} from '../../Modules';
import ModalPicker from '../../Components/ModalPicker';
import {Header, Modal, TextButton, TextInput, Toast} from '../../Components';
import {StackProps} from '../../routes';
import {Edit} from '../../../assets';
import {useTranslation} from 'react-i18next';

type Props = StackProps<'TeacherRegistrationScreen'>;
interface TEMP_CLASS_ID {
  CLASS_ID: string;
  CLASS_NAME: string;
  YEAR_ID: string;
  DIVISION_ID: string;
  DIVISION_NAME: string;
}
interface TEMP_SUBJECT_ID {
  CLASS_ID: string;
  CLASS_NAME: string;
  YEAR_ID: string;
  DIVISION_ID: string;
  DIVISION_NAME: string;
  SUBJECT_ID: string;
  SUBJECT_NAME: string;
}
interface ALL_DATA {
  SCHOOL_NAME: string;
  CLASS_ID: string;
  CLASS_NAME: string;
  YEAR_ID: string;
  DIVISION_ID: string;
  DIVISION_NAME: string;
  SUBJECT_ID: string;
  SUBJECT_NAME: string;
  TEACHER_TYPE: string;
}
interface selectData {
  TEMP_CLASS_ID: Array<TEMP_CLASS_ID>;
  TEMP_SUBJECT_ID: Array<TEMP_SUBJECT_ID>;
}
const TeacherRegistrationScreen = ({navigation}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {t} = useTranslation();
  const [status, setStatus] = useState({
    status: '',
    remark: '',
    id: '',
  });
  const [loading, setLoading] = useState(false);
  const {member} = useSelector(state => state.member);

  const [input, setInput] = useState({
    name: '',
    school: {SCHOOL_NAME: '', ID: '', YEAR_ID: ''},
    className: {NAME: '', ID: '', YEAR_ID: ''},
    division: {NAME: '', ID: ''},
    subject: {NAME: '', ID: ''},
  });
  const [openModal, setOpenModal] = useState({
    buttons: false,
    teacher: false,
    school: false,
    className: false,
    division: false,
    subjectName: false,
  });
  const [data, setData] = useState({
    school: [],
    className: [],
    division: [],
    subject: [],
  });
  const [teacher, setTeacher] = useState(0);
  const [selectedData, setSelectedData] = useState<selectData>({
    TEMP_CLASS_ID: [],
    TEMP_SUBJECT_ID: [],
  });
  const [recreate, setRecreate] = useState(false);
  const [isEditMode, setIsEditMode] = useState({
    classTeacher: false,
    subjectTeacher: false,
    index: 0,
  });
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const toggleButtons = () => {
    setOpenModal({...openModal, buttons: !openModal.buttons});
    if (!openModal.buttons) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };
  useEffect(() => {
    getSchool();
  }, []);
  useEffect(() => {
    registrationGet();
  }, []);
  const getSchool = async () => {
    try {
      const res = await apiPost('api/school/get', {filter: ` AND STATUS = 1 `});
      if (res && res.code == 200) {
        // console.log('res..', res);
        await setData(prevData => ({
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
        setInput({...input, school: item});
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
        setInput({
          ...input,
          className: item,
          division: {NAME: '', ID: ''},
          subject: {NAME: '', ID: ''},
        });
      }
    } catch (error) {
      console.log('err..', error);
    }
  };
  const getSubject = async (item: any) => {
    try {
      const res = await apiPost('api/subject/get', {
        filter: `AND SCHOOL_ID = ${item.SCHOOL_ID} AND CLASS_ID = ${input.className.ID} AND DIVISION_ID = ${item.ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        setData(prevData => ({
          ...prevData,
          subject: res.data,
        }));
        setInput({...input, division: item, subject: {NAME: '', ID: ''}});
      }
    } catch (error) {
      console.log('error///..', error);
    }
  };
  const checkValidation = () => {
    if (!input.school.SCHOOL_NAME) {
      Toast(t('teacherRegistration.schoolToast'));
      return true;
    } else if (teacher != 1 && teacher != 2) {
      Toast(t('teacherRegistration.teacherTypeToast'));
      return true;
    } else if (
      selectedData.TEMP_CLASS_ID.length == 0 &&
      selectedData.TEMP_SUBJECT_ID.length == 0
    ) {
      Toast(t('teacherRegistration.toast'));
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
        NAME: member?.NAME,
        EMAIL_ID: member?.EMAIL_ID,
        GENDER: member?.GENDER,
        DOB: member?.DOB,
        PASSWORD: member?.PASSWORD,
        PROFILE_PHOTO: member?.PROFILE_PHOTO,
        MOBILE_NUMBER: member?.MOBILE_NUMBER,
        CLIENT_ID: 1,
        STATUS: 1,
        TEACHER_STATUS: 'P',
        APP_USER_ID: member?.ID,
        TEMP_CLASS_ID: JSON.stringify(selectedData.TEMP_CLASS_ID),
        TEMP_SUBJECT_ID: JSON.stringify(selectedData.TEMP_SUBJECT_ID),
        SCHOOL_ID: input.school.ID,
        SEQ_NO: member?.SEQ_NO,
        YEAR_ID: input.school.YEAR_ID,
      };
      const res = await apiPost('api/teacher/register', body);
      if (res && res.code == 200) {
        setLoading(false);
        Toast('Registration Success');
        navigation.goBack();
      } else {
        setLoading(false);
        Toast('Something Wrong Please Try Again..');
      }
    } catch (error) {
      setLoading(false);
      console.log('error...??', error);
    }
  };
  const updateRegistration = async () => {
    if (checkValidation()) {
      return;
    }
    setLoading(true);
    try {
      let body = {
        NAME: member?.NAME,
        EMAIL_ID: member?.EMAIL_ID,
        GENDER: member?.GENDER,
        DOB: member?.DOB,
        PASSWORD: member?.PASSWORD,
        PROFILE_PHOTO: member?.PROFILE_PHOTO,
        MOBILE_NUMBER: member?.MOBILE_NUMBER,
        CLIENT_ID: 1,
        STATUS: 1,
        TEACHER_STATUS: 'P',
        APP_USER_ID: member?.ID,
        TEMP_CLASS_ID: JSON.stringify(selectedData.TEMP_CLASS_ID),
        TEMP_SUBJECT_ID: JSON.stringify(selectedData.TEMP_SUBJECT_ID),
        SCHOOL_ID: input.school.ID,
        SEQ_NO: member?.SEQ_NO,
        YEAR_ID: input.school.YEAR_ID,
        ID: status.id,
      };
      const res = await apiPut('api/teacher/update', body);
      if (res && res.code == 200) {
        setLoading(false);
        Toast('Registration Success');
        navigation.goBack();
      } else {
        setLoading(false);
        Toast('Something Wrong Please Try Again..');
      }
    } catch (error) {
      setLoading(false);
      console.log('error...??', error);
    }
  };
  const registrationGet = async () => {
    try {
      const res = await apiPost('api/teacher/get', {
        filter: `AND APP_USER_ID = ${
          member?.APP_USER_ID ? member?.APP_USER_ID : member?.ID
        } `,
      });
      if (res && res.code == 200) {
        // console.log('Teacher registration******', res.data[0].ID);
        setStatus({
          ...status,
          status: res.data[0].TEACHER_STATUS,
          remark: res.data[0].REJECT_BLOCKED_REMARK,
          id: res.data[0].ID,
        });
        setInput({
          ...input,
          school: {
            SCHOOL_NAME: res.data[0].SCHOOL_NAME,
            ID: res.data[0].SCHOOL_ID,
            YEAR_ID: res.data[0].YEAR_ID,
          },
        });
        setSelectedData({
          ...selectedData,
          TEMP_CLASS_ID: JSON.parse(res.data[0].TEMP_CLASS_ID),
          TEMP_SUBJECT_ID: JSON.parse(res.data[0].TEMP_SUBJECT_ID),
        });
        // dispatch(Reducers.setShowSplash(true));
      } else {
        setLoading(false);
        Toast('Something Wrong Please Try Again..');
      }
    } catch (error) {
      setLoading(false);
      console.log('error...34567', error);
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Header
        label={t('teacherRegistration.header')}
        onBack={() => {
          navigation.goBack();
        }}
      />

      {status.status == 'p' || status.status == 'P' ? (
        <View style={{flex: 1}}>
          <View style={{}}>
            <DropdownSimple
              labelText={
                input.school.SCHOOL_NAME
                  ? input.school.SCHOOL_NAME
                  : t('teacherRegistration.school')
              }
              selectText={t('teacherRegistration.school')}
              onPress={() => setOpenModal({...openModal, school: true})}
              disabled={status.status == 'P' ? true : false}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                borderRadius: Sizes.Radius,
                backgroundColor: Colors.Disable,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'flex-end',
                margin: Sizes.ScreenPadding,
                padding: Sizes.Radius,
              }}>
              <Text
                style={{
                  ...Fonts.Medium3,
                  alignSelf: 'center',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  color: Colors.White,
                }}>
                {t('teacherRegistration.teacherType')}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: Sizes.ScreenPadding,
            }}>
            <Text style={{color: Colors.Primary, ...Fonts.Bold1}}>
              {t('teacherRegistration.pendingMsg')}
            </Text>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Medium2,
                textAlign: 'center',
              }}>
              {t('teacherRegistration.pendingDescription')}
            </Text>
          </View>
        </View>
      ) : status.status == 'R' || status.status == 'r' ? (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <DropdownSimple
              labelText={
                input.school.SCHOOL_NAME
                  ? input.school.SCHOOL_NAME
                  : t('teacherRegistration.school')
              }
              selectText={t('teacherRegistration.school')}
              onPress={() => setOpenModal({...openModal, school: true})}
              disabled={recreate ? false : true}
            />
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => (recreate ? toggleButtons() : null)}
                style={{
                  borderRadius: Sizes.Radius,
                  backgroundColor: recreate ? Colors.Primary2 : Colors.Disable,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'flex-end',
                  margin: Sizes.ScreenPadding,
                  padding: Sizes.Radius,
                }}>
                <Text
                  onPress={() => (recreate ? toggleButtons() : null)}
                  style={{
                    ...Fonts.Medium3,
                    alignSelf: 'center',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    color: Colors.White,
                  }}>
                  {t('teacherRegistration.teacherType')}
                </Text>
              </TouchableOpacity>
              {openModal.buttons && (
                <Animated.View
                  style={{
                    position: 'absolute',
                    bottom: 60,
                    right: 60,
                    margin: Sizes.Base,
                    transform: [{scale: scaleAnim}],
                    opacity: fadeAnim,
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.Background,
                      elevation: 10,
                      borderRadius: Sizes.Radius,
                      padding: Sizes.Padding,
                    }}
                    onPress={() => {
                      input.school.ID
                        ? setOpenModal({
                            ...openModal,
                            teacher: true,
                            buttons: false,
                          })
                        : Toast('Please select school first');
                      input.school.ID && setTeacher(1);
                    }}>
                    <Text style={{...Fonts.Bold2, color: Colors.PrimaryText1}}>
                      {t('teacherRegistration.classTeacher')}
                    </Text>
                  </TouchableOpacity>
                  <View style={{height: Sizes.Base}} />
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.Background,
                      elevation: 10,
                      borderRadius: Sizes.Radius,
                      padding: Sizes.Padding,
                    }}
                    onPress={() => {
                      input.school.ID
                        ? setOpenModal({
                            ...openModal,
                            teacher: true,
                            buttons: false,
                          })
                        : Toast(t('teacherRegistration.schoolToast'));
                      input.school.ID && setTeacher(2);
                    }}>
                    <Text style={{...Fonts.Bold2, color: Colors.PrimaryText1}}>
                      {t('teacherRegistration.subjectTeacher')}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
              <View
                style={{
                  marginHorizontal: Sizes.ScreenPadding,
                  marginTop: Sizes.ScreenPadding,
                }}>
                <FlatList
                  data={selectedData.TEMP_CLASS_ID}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item, index}) => {
                    return (
                      <View
                        style={{
                          paddingHorizontal: Sizes.Padding,
                          paddingVertical: Sizes.Radius,
                          borderRadius: Sizes.Radius,
                          backgroundColor: recreate
                            ? Colors.Background
                            : Colors.Disable,
                          borderWidth: 1,
                          borderColor: Colors.PrimaryText,
                          margin: Sizes.Base,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              ...Fonts.Medium3,
                              color: Colors.PrimaryText1,
                            }}>
                            {`${t('teacherRegistration.subjectTeacher')} : ${
                              item.CLASS_NAME
                            }`}
                          </Text>
                          {recreate && (
                            <Edit
                              height={15}
                              width={15}
                              onPress={() => {
                                setInput({
                                  ...input,
                                  className: {
                                    NAME: item.CLASS_NAME,
                                    ID: item.CLASS_ID,
                                    YEAR_ID: item.YEAR_ID,
                                  },
                                  division: {
                                    NAME: item.DIVISION_NAME,
                                    ID: item.DIVISION_NAME,
                                  },
                                });
                                setTeacher(1);
                                setIsEditMode({
                                  ...isEditMode,
                                  classTeacher: true,
                                  index: index,
                                });
                                setOpenModal({
                                  ...openModal,
                                  teacher: true,
                                  buttons: false,
                                });
                              }}
                            />
                          )}
                        </View>
                        <Text
                          style={{...Fonts.Medium3, color: Colors.PrimaryText}}>
                          {`${t('teacherRegistration.divisionName')} : ${
                            item.DIVISION_NAME
                          }`}
                        </Text>
                      </View>
                    );
                  }}
                />
                <FlatList
                  data={selectedData.TEMP_SUBJECT_ID}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item, index}) => {
                    return (
                      <View
                        style={{
                          paddingHorizontal: Sizes.Padding,
                          paddingVertical: Sizes.Radius,
                          borderRadius: Sizes.Radius,
                          backgroundColor: recreate
                            ? Colors.Background
                            : Colors.Disable,
                          borderWidth: 1,
                          borderColor: Colors.PrimaryText,
                          margin: Sizes.Base,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              ...Fonts.Medium3,
                              color: Colors.PrimaryText1,
                            }}>
                            {`${t('teacherRegistration.className')} : ${
                              item.CLASS_NAME
                            }`}
                          </Text>
                          {recreate && (
                            <Edit
                              height={15}
                              width={15}
                              onPress={() => {
                                setInput({
                                  ...input,
                                  className: {
                                    NAME: item.CLASS_NAME,
                                    ID: item.CLASS_ID,
                                    YEAR_ID: item.YEAR_ID,
                                  },
                                  division: {
                                    NAME: item.DIVISION_NAME,
                                    ID: item.DIVISION_NAME,
                                  },
                                  subject: {
                                    ID: item.SUBJECT_ID,
                                    NAME: item.SUBJECT_NAME,
                                  },
                                });
                                setTeacher(2);
                                setIsEditMode({
                                  ...isEditMode,
                                  subjectTeacher: true,
                                  index: index,
                                });
                                setOpenModal({
                                  ...openModal,
                                  teacher: true,
                                  buttons: false,
                                });
                              }}
                            />
                          )}
                        </View>
                        <Text
                          style={{...Fonts.Medium3, color: Colors.PrimaryText}}>
                          {`${t('teacherRegistration.divisionName')} : ${
                            item.DIVISION_NAME
                          }`}
                        </Text>
                        <Text
                          style={{
                            ...Fonts.Medium3,
                            color: Colors.PrimaryText,
                          }}>
                          {`${t('teacherRegistration.subjectName')} : ${
                            item.SUBJECT_NAME
                          }`}
                        </Text>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
          </View>
          {!recreate && (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: Sizes.ScreenPadding,
              }}>
              <Text style={{color: Colors.Primary, ...Fonts.Bold1}}>
                Application Rejected
              </Text>
              <Text style={{color: Colors.PrimaryText1, ...Fonts.Medium2}}>
                {status.remark}
              </Text>
            </View>
          )}
          <View style={{margin: Sizes.ScreenPadding}}>
            <TextButton
              label={
                recreate
                  ? t('teacherRegistration.enrollForSchool')
                  : t('teacherRegistration.reCreate')
              }
              loading={loading}
              onPress={() => {
                recreate
                  ? updateRegistration()
                  : (setRecreate(true), getClass(input.school));
              }}
            />
          </View>
        </View>
      ) : status.status == 'A' || status.status == 'a' ? (
        <View style={{flex: 1}}>
          <View style={{}}>
            <DropdownSimple
              labelText={
                input.school.SCHOOL_NAME
                  ? input.school.SCHOOL_NAME
                  : t('teacherRegistration.school')
              }
              selectText={t('teacherRegistration.school')}
              onPress={() => setOpenModal({...openModal, school: true})}
              disabled={
                status.status == 'A' || status.status == 'a' ? true : false
              }
            />
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                borderRadius: Sizes.Radius,
                backgroundColor: Colors.Disable,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'flex-end',
                margin: Sizes.ScreenPadding,
                padding: Sizes.Radius,
              }}>
              <Text
                style={{
                  ...Fonts.Medium3,
                  alignSelf: 'center',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  color: Colors.White,
                }}>
                {t('teacherRegistration.teacherType')}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: Sizes.ScreenPadding,
            }}>
            <Text style={{color: Colors.Primary, ...Fonts.Bold1}}>
              {t('teacherRegistration.approveMsg')}
            </Text>
          </View>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <DropdownSimple
              labelText={
                input.school.SCHOOL_NAME
                  ? input.school.SCHOOL_NAME
                  : t('teacherRegistration.school')
              }
              selectText={t('teacherRegistration.school')}
              onPress={() => setOpenModal({...openModal, school: true})}
              disabled={status.status == 'p' ? true : false}
            />
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={toggleButtons}
                style={{
                  borderRadius: Sizes.Radius,
                  backgroundColor: Colors.Primary2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'flex-end',
                  margin: Sizes.ScreenPadding,
                  padding: Sizes.Radius,
                }}>
                <Text
                  onPress={toggleButtons}
                  style={{
                    ...Fonts.Medium3,
                    alignSelf: 'center',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    color: Colors.White,
                  }}>
                  {t('teacherRegistration.teacherType')}
                </Text>
              </TouchableOpacity>
              {openModal.buttons && (
                <Animated.View
                  style={{
                    position: 'absolute',
                    bottom: 60,
                    right: 60,
                    margin: Sizes.Base,
                    transform: [{scale: scaleAnim}],
                    opacity: fadeAnim,
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.Background,
                      elevation: 10,
                      borderRadius: Sizes.Radius,
                      padding: Sizes.Padding,
                    }}
                    onPress={() => {
                      input.school.ID
                        ? setOpenModal({
                            ...openModal,
                            teacher: true,
                            buttons: false,
                          })
                        : Toast('Please select school first');
                      input.school.ID && setTeacher(1);
                    }}>
                    <Text style={{...Fonts.Bold2, color: Colors.PrimaryText1}}>
                      {t('teacherRegistration.classTeacher')}
                    </Text>
                  </TouchableOpacity>
                  <View style={{height: Sizes.Base}} />
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.Background,
                      elevation: 10,
                      borderRadius: Sizes.Radius,
                      padding: Sizes.Padding,
                    }}
                    onPress={() => {
                      input.school.ID
                        ? setOpenModal({
                            ...openModal,
                            teacher: true,
                            buttons: false,
                          })
                        : Toast('Please select school first');
                      input.school.ID && setTeacher(2);
                    }}>
                    <Text style={{...Fonts.Bold2, color: Colors.PrimaryText1}}>
                      {t('teacherRegistration.subjectTeacher')}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>

            <View
              style={{
                marginHorizontal: Sizes.ScreenPadding,
                marginTop: Sizes.ScreenPadding,
              }}>
              <FlatList
                data={selectedData.TEMP_CLASS_ID}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                  return (
                    <View
                      style={{
                        paddingHorizontal: Sizes.Padding,
                        paddingVertical: Sizes.Radius,
                        borderRadius: Sizes.Radius,
                        backgroundColor: Colors.Background,
                        borderWidth: 1,
                        borderColor: Colors.PrimaryText,
                        margin: Sizes.Base,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            ...Fonts.Medium3,
                            color: Colors.PrimaryText1,
                          }}>
                          {`${t('teacherRegistration.className')} : ${
                            item.CLASS_NAME
                          }`}
                        </Text>
                        <Edit
                          height={15}
                          width={15}
                          onPress={() => {
                            setInput({
                              ...input,
                              className: {
                                NAME: item.CLASS_NAME,
                                ID: item.CLASS_ID,
                                YEAR_ID: item.YEAR_ID,
                              },
                              division: {
                                NAME: item.DIVISION_NAME,
                                ID: item.DIVISION_NAME,
                              },
                            });
                            setTeacher(1);
                            setIsEditMode({
                              ...isEditMode,
                              classTeacher: true,
                              index: index,
                            });
                            setOpenModal({
                              ...openModal,
                              teacher: true,
                              buttons: false,
                            });
                          }}
                        />
                      </View>
                      <Text
                        style={{...Fonts.Medium3, color: Colors.PrimaryText}}>
                        {`${t('teacherRegistration.divisionName')} : ${
                          item.DIVISION_NAME
                        }`}
                      </Text>
                    </View>
                  );
                }}
              />
              <FlatList
                data={selectedData.TEMP_SUBJECT_ID}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                  return (
                    <View
                      style={{
                        paddingHorizontal: Sizes.Padding,
                        paddingVertical: Sizes.Radius,
                        borderRadius: Sizes.Radius,
                        backgroundColor: Colors.Background,
                        borderWidth: 1,
                        borderColor: Colors.PrimaryText,
                        margin: Sizes.Base,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            ...Fonts.Medium3,
                            color: Colors.PrimaryText1,
                          }}>
                          {`${t('teacherRegistration.className')} : ${
                            item.CLASS_NAME
                          }`}
                        </Text>
                        <Edit
                          height={15}
                          width={15}
                          onPress={() => {
                            setInput({
                              ...input,
                              className: {
                                NAME: item.CLASS_NAME,
                                ID: item.CLASS_ID,
                                YEAR_ID: item.YEAR_ID,
                              },
                              division: {
                                NAME: item.DIVISION_NAME,
                                ID: item.DIVISION_NAME,
                              },
                              subject: {
                                ID: item.SUBJECT_ID,
                                NAME: item.SUBJECT_NAME,
                              },
                            });
                            setTeacher(2);
                            setIsEditMode({
                              ...isEditMode,
                              subjectTeacher: true,
                              index: index,
                            });
                            setOpenModal({
                              ...openModal,
                              teacher: true,
                              buttons: false,
                            });
                          }}
                        />
                      </View>
                      <Text
                        style={{...Fonts.Medium3, color: Colors.PrimaryText}}>
                        {`${t('teacherRegistration.divisionName')} : ${
                          item.DIVISION_NAME
                        }`}
                      </Text>
                      {item.SUBJECT_NAME && (
                        <Text
                          style={{...Fonts.Medium3, color: Colors.PrimaryText}}>
                          {`${t('teacherRegistration.subjectName')} : ${
                            item.SUBJECT_NAME
                          }`}
                        </Text>
                      )}
                    </View>
                  );
                }}
              />
            </View>
          </View>

          <View style={{margin: Sizes.ScreenPadding}}>
            <TextButton
              label={t('teacherRegistration.enrollForSchool')}
              loading={loading}
              onPress={() => {
                registration();
              }}
            />
          </View>
        </View>
      )}

      {openModal.teacher && (
        <Modal
          title=" "
          isVisible={openModal.teacher}
          onClose={() => {
            setOpenModal({...openModal, teacher: false});
            setInput({
              ...input,
              className: {NAME: '', ID: '', YEAR_ID: ''},
              division: {NAME: '', ID: ''},
              subject: {NAME: '', ID: ''},
            });
          }}
          style={{
            margin: 0,
            marginLeft: Sizes.ScreenPadding,
            borderRadius: Sizes.Radius,
            width: '90%',
          }}>
          <View style={{}}>
            <DropdownSimple
              disabled={input.school.SCHOOL_NAME ? false : true}
              labelText={
                input.className.NAME
                  ? input.className.NAME
                  : t('teacherRegistration.selectClass')
              }
              selectText={t('teacherRegistration.selectClass')}
              onPress={() => setOpenModal({...openModal, className: true})}
            />
            <View style={{height: Sizes.Base}} />
            <DropdownSimple
              disabled={input.className.NAME ? false : true}
              labelText={
                input.division.NAME
                  ? input.division.NAME
                  : t('teacherRegistration.selectDivision')
              }
              selectText={t('teacherRegistration.selectDivision')}
              onPress={() => setOpenModal({...openModal, division: true})}
            />
            <View style={{height: Sizes.Base}} />
            {teacher == 2 && (
              <DropdownSimple
                disabled={input.division.NAME ? false : true}
                labelText={
                  input.subject.NAME
                    ? input.subject.NAME
                    : t('teacherRegistration.selectSubject')
                }
                selectText={t('teacherRegistration.selectSubject')}
                onPress={() => setOpenModal({...openModal, subjectName: true})}
              />
            )}
            <TextButton
              label={t('common.add')}
              loading={false}
              onPress={() => {
                if (!input.className.ID) {
                  Toast(t('teacherRegistration.classToast'));
                } else if (!input.division.ID) {
                  Toast(t('teacherRegistration.divisionToast'));
                } else if (teacher == 2 && !input.subject.ID) {
                  Toast(t('teacherRegistration.subjectToast'));
                } else {
                  const newClassData = {
                    CLASS_ID: input.className.ID,
                    CLASS_NAME: input.className.NAME,
                    YEAR_ID: input.school.YEAR_ID,
                    DIVISION_ID: input.division.ID,
                    DIVISION_NAME: input.division.NAME,
                  };
                  const newSubjectData = {
                    CLASS_ID: input.className.ID,
                    CLASS_NAME: input.className.NAME,
                    YEAR_ID: input.school.YEAR_ID,
                    DIVISION_ID: input.division.ID,
                    DIVISION_NAME: input.division.NAME,
                    SUBJECT_ID: input.subject.ID,
                    SUBJECT_NAME: input.subject.NAME,
                  };
                  // const updatedClassData = [
                  //   ...selectedData.TEMP_CLASS_ID,
                  //   newClassData,
                  // ];
                  const updatedClassData =
                    teacher == 1 && isEditMode.classTeacher
                      ? selectedData.TEMP_CLASS_ID.map((item, index) => {
                          if (index == isEditMode.index) {
                            return {
                              ...item,
                              CLASS_ID: input.className.ID,
                              CLASS_NAME: input.className.NAME,
                              YEAR_ID: input.school.YEAR_ID,
                              DIVISION_ID: input.division.ID,
                              DIVISION_NAME: input.division.NAME,
                            };
                          } else {
                            item;
                          }
                        })
                      : [...selectedData.TEMP_CLASS_ID, newClassData];

                  const updatedSubjectData =
                    teacher == 2 && isEditMode.subjectTeacher
                      ? selectedData.TEMP_SUBJECT_ID.map((item, index) => {
                          if (index == isEditMode.index) {
                            return {
                              ...item,
                              CLASS_ID: input.className.ID,
                              CLASS_NAME: input.className.NAME,
                              YEAR_ID: input.school.YEAR_ID,
                              DIVISION_ID: input.division.ID,
                              DIVISION_NAME: input.division.NAME,
                              SUBJECT_ID: input.subject.ID,
                              SUBJECT_NAME: input.subject.NAME,
                            };
                          } else {
                            item;
                          }
                        })
                      : [...selectedData.TEMP_SUBJECT_ID, newSubjectData];

                  // const updatedSubjectData = [
                  //   ...selectedData.TEMP_SUBJECT_ID,
                  //   newSubjectData,
                  // ];

                  setSelectedData({
                    TEMP_CLASS_ID:
                      teacher == 1
                        ? updatedClassData
                        : selectedData.TEMP_CLASS_ID,
                    TEMP_SUBJECT_ID:
                      teacher == 2
                        ? updatedSubjectData
                        : selectedData.TEMP_SUBJECT_ID,
                  });

                  setOpenModal({...openModal, teacher: false});
                  setInput({
                    ...input,
                    className: {NAME: '', ID: '', YEAR_ID: ''},
                    division: {NAME: '', ID: ''},
                    subject: {NAME: '', ID: ''},
                  });
                }
              }}
              style={{marginTop: Sizes.ScreenPadding}}
            />
          </View>
        </Modal>
      )}
      {openModal.school && (
        <ModalPicker
          title={t('teacherRegistration.school')}
          visible={openModal.school}
          onClose={() => {
            setOpenModal({...openModal, school: false});
          }}
          data={data.school}
          labelField={'SCHOOL_NAME'}
          onChange={item => {
            getClass(item);
          }}
          value={input.school}
        />
      )}
      {openModal.className && (
        <ModalPicker
          title={t('teacherRegistration.selectClass')}
          visible={openModal.className}
          onClose={() => {
            setOpenModal({...openModal, className: false});
          }}
          data={data.className}
          labelField={'NAME'}
          onChange={item => {
            getDivision(item);
          }}
          value={input.className}
          containerStyle={{justifyContent: 'flex-end'}}
          style={{margin: 0}}
        />
      )}
      {openModal.division && (
        <ModalPicker
          title={t('teacherRegistration.selectDivision')}
          visible={openModal.division}
          onClose={() => {
            setOpenModal({...openModal, division: false});
          }}
          data={data.division}
          labelField={'NAME'}
          onChange={item => {
            getSubject(item);
          }}
          value={input.division}
          containerStyle={{justifyContent: 'flex-end'}}
          style={{margin: 0}}
        />
      )}
      {openModal.subjectName && (
        <ModalPicker
          title={t('teacherRegistration.selectSubject')}
          visible={openModal.subjectName}
          onClose={() => {
            setOpenModal({...openModal, subjectName: false});
          }}
          data={data.subject}
          labelField={'NAME'}
          onChange={item => {
            setInput({...input, subject: item});
          }}
          value={input.subject}
          containerStyle={{justifyContent: 'flex-end'}}
          style={{margin: 0}}
        />
      )}
    </View>
  );
};

export default TeacherRegistrationScreen;
