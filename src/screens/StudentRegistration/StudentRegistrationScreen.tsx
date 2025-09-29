import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Colors, Sizes, Fonts} from '../../Modules/Modules';
import {Header, Icon, TextButton, Toast} from '../../Components';
import {BASE_URL, apiPost, apiPut, apiUpload, useSelector} from '../../Modules';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {noProfile} from '../../../assets';
import TextInputSimple from '../../Components/TextInputSimple';
import DropdownSimple from '../../Components/DropdownSimple';
import ModalPicker from '../../Components/ModalPicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {emailValidation} from '../../Functions';
import {RadioButton} from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const StudentRegistrationScreen = ({navigation}: any) => {
  const {t} = useTranslation();

  const {member} = useSelector(state => state.member);
  const [studentStatus, setStudentStatus] = useState({
    status: '',
    remark: '',
    ID:'',
  });
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);
  const [input, setInput] = useState({
    rollNo: '',
    school: {SCHOOL_NAME: '', ID: ''},
    className: {NAME: '', ID: ''},
    division: {NAME: '', ID: ''},
    medium: {},
  });
  const [openModal, setOpenModal] = useState({
    school: false,
    className: false,
    dividion: false,
    medium: false,
  });
  const [data, setData] = useState({
    school: [],
    className: [],
    division: [],
    medium: [],
  });
  const [tempId, setTempId] = useState({
    tempClassID: '',
    tempDivId: '',
    tempMediumId: '',
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
    //getMedium();
  }, []);

  const getSchool = async () => {
    try {
      const res = await apiPost('api/school/get', {});
      if (res && res.code == 200) {
        // console.log('getSchool...asdfghj', res);
        // setData({...data,board:res.data})
        await setData(prevData => ({
          ...prevData,
          school: res.data,
        }));
      }
    } catch (error) {
      console.log('error..', error);
    }
  };
  const getClass = async (item: any) => {
    try {
      const res = await apiPost('api/createClass/get', {
        filter: `AND SCHOOL_ID = ${item.ID} `,
      });
      if (res && res.code == 200) {
        // console.log('getClass...', res);
        setData(prevData => ({
          ...prevData,
          className: res.data,
        }));
      }
    } catch (error) {
      console.log('error..', error);
    }
  };


  const getDivision = async (item: any) => {
    try {
      const res = await apiPost('api/createDivision/get', {
        filter: `AND SCHOOL_ID = ${item.SCHOOL_ID} `,
      });
      if (res && res.code == 200) {
        // console.log('getDivision...', res);
        setData(prevData => ({
          ...prevData,
          division: res.data,
        }));
      }
    } catch (error) {
      console.log('error..', error);
    }
  };

  const getMedium = async (item: any) => {
    try {
      const res = await apiPost('api/medium/get', {
        filter: `AND SCHOOL_ID = ${item.SCHOOL_ID} `,
      });
      if (res && res.code == 200) {
        // console.log('getMedium...', res);
        setData(prevData => ({
          ...prevData,
          medium: res.data,
        }));
      }
    } catch (error) {
      console.log('error..', error);
    }
  };
  
  const getAllData = async (classId, divId, medID,school,rollNo,schoolID) => {
    let calls = await Promise.all([
      apiPost('api/createClass/get', {filter: ` AND ID = ${classId} `}),
      apiPost('api/createDivision/get', {
        filter: ` AND ID = ${divId} `,
      }),
      apiPost('api/medium/get', {
        filter: ` AND ID = ${medID} `,
      }),
    ]);
    if (calls[0].code == 200 && calls[1].code == 200 && calls[2].code == 200) {
      setInput({
        ...input,
        className: {NAME: calls[0].data[0].NAME, ID: calls[0].data[0].ID},
        division: {NAME: calls[1].data[0].NAME, ID: calls[1].data[0].ID},
        medium: {NAME: calls[2].data[0].NAME, ID: calls[2].data[0].ID},
        school:{SCHOOL_NAME:school,ID:schoolID},
        rollNo:rollNo
      });
    }
  };
  const checkValidation = () => {
    if (!input.school.SCHOOL_NAME) {
      Toast( t('StudentRegistration.SchoolValidation') );
      return true;
    } else if (!input.className.NAME) {
      Toast(t('StudentRegistration.classValidation'));
      return true;
    } else if (!input.division.NAME) {
      Toast(t('StudentRegistration.divValidation'));
      return true;
    } else if (!input.medium.NAME) {
      Toast(t('StudentRegistration.mediumValidation'));
      return true;
    }  else {
      return false;
    }
  };
  useEffect(() => {
    getStudentInfo();
  }, []);
// console.log("my info",studentStatus)
  const getStudentInfo = async () => {
    try {
      const res = await apiPost('api/student/get', {
        filter: `AND APP_USER_ID = ${member?.ID} `,
      });
      if (res && res.code == 200) {
        setStudentStatus({
          ...studentStatus,
          status: res.data[0]?.STUDENT_STATUS
            ? res.data[0]?.STUDENT_STATUS
            : '',
          remark: res.data[0]?.REJECT_BLOCKED_REMARK
            ? res.data[0]?.REJECT_BLOCKED_REMARK
            : '',
            ID:res.data[0]?.ID?res.data[0]?.ID:''

        });
        getAllData(
          res.data[0].TEMP_CLASS_ID,
          res.data[0].TEMP_DIVISION_ID,
          res.data[0].TEMP_MEDIUM_ID,
          res.data[0].SCHOOL_NAME,
          res.data[0].TEMP_ROLL_NO,
          res.data[0].SCHOOL_ID
        );
      }
    } catch (error) {
      console.log('error..', error);
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
        DOB: member?.DOB,
        GENDER: member?.GENDER,
        MOBILE_NUMBER: member?.MOBILE_NUMBER,
        EMAIL_ID: member?.EMAIL_ID,
        STUDENT_STATUS: 'P',
        TEMP_ROLL_NO: input.rollNo,
        SCHOOL_ID: input.school.ID,
        TEMP_DIVISION_ID: input.division.ID,
        APP_USER_ID: member?.ID,
        TEMP_CLASS_ID: input.className.ID,
        TEMP_MEDIUM_ID: input.medium.ID,
        CLIENT_ID: 1,
        STATUS: 1,
      };
      const res = await apiPost('api/student/register', body);

      if (res && res.code == 200) {

        setLoading(false);
        Toast(t('common.RegistrationSuccess') );
        setStudentStatus({
          ...studentStatus,
          status: 'P',
          remark:
          t('SchoolRegistration.PendingDescription') ,
        });
        // dispatch(Reducers.setShowSplash(true));
      }else if(res && res.code==300) 
      {
        setLoading(false);
        Toast('Something Wrong Please Try Again..');

      }else {
        setLoading(false);
        Toast('Something Wrong Please Try Again..');
      }

    } catch (error) {
      setLoading(false);
      console.log('error...', error);
    }
  };
  const UpdateStudentRegistration = async () => {
    if (checkValidation()) {
      return;
    }
    setLoading(true);
    try {
      let body = {
        ID:studentStatus.ID,
        NAME: member?.NAME,
        DOB: member?.DOB,
        GENDER: member?.GENDER,
        MOBILE_NUMBER: member?.MOBILE_NUMBER,
        EMAIL_ID: member?.EMAIL_ID,
        STUDENT_STATUS: 'P',
        TEMP_ROLL_NO: input.rollNo,
        SCHOOL_ID: input.school.ID,
        TEMP_DIVISION_ID: input.division.ID,
        APP_USER_ID: member?.ID,
        TEMP_CLASS_ID: input.className.ID,
        TEMP_MEDIUM_ID: input.medium.ID,
        CLIENT_ID: 1,
        STATUS: 1,
      };
      // console.log("eeeeee",body)
      const res = await apiPut('api/student/update', body);

      if (res && res.code == 200) {
        // console.log('update........', res);

        setLoading(false);
        Toast(t('common.RegistrationSuccess'));
        setStudentStatus({
          ...studentStatus,
          status: 'P',
          remark:
          t('SchoolRegistration.PendingDescription') ,
        });
        // dispatch(Reducers.setShowSplash(true));
      }else if(res && res.code==300) 
      {
        setLoading(false);
        Toast(t('common.ErrorMsg'));

      }else {
        setLoading(false);
        Toast(t('common.ErrorMsg'));
      }

    } catch (error) {
      setLoading(false);
      console.log('error...', error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <View style={{flex: 1}}>
        <Header
          label={member?.NAME}
          onBack={() => navigation.goBack()}></Header>

        <ScrollView style={{marginBottom: Sizes.ScreenPadding}}>
          {studentStatus.status=='' || studentStatus.status=='R'?
          <View>
          <DropdownSimple
         
            labelText={
              input.school.SCHOOL_NAME
                ? input.school.SCHOOL_NAME
                : t('StudentRegistration.SelectSchool')
            }
            selectText={ t('StudentRegistration.SelectSchool')}
            onPress={() => setOpenModal({...openModal, school: true})}
          />
          <DropdownSimple
            disabled={input.school.SCHOOL_NAME ? false : true}
            labelText={
              input.className.NAME ? input.className.NAME :  t('StudentRegistration.SelectClass')
            }
            selectText={t('StudentRegistration.SelectClass')}
            onPress={() => setOpenModal({...openModal, className: true})}
          />
          <DropdownSimple
            disabled={input.className.NAME ? false : true}
            labelText={
              input.division.NAME ? input.division.NAME : t('StudentRegistration.SelectDivision')
            }
            selectText={ t('StudentRegistration.SelectDivision')}
            onPress={() => setOpenModal({...openModal, dividion: true})}
          />
          <DropdownSimple
            labelText={input.medium.NAME ? input.medium.NAME :  t('StudentRegistration.SelectMedium')}
            selectText={t('StudentRegistration.SelectMedium')}
            onPress={() => {
              setOpenModal({...openModal, medium: true});
            }}
          />
          <View style={{marginHorizontal: Sizes.ScreenPadding}}>
            <TextInputSimple
             keyboardType='numeric'
              value={input.rollNo}
              label={t('StudentRegistration.RollNo')}
              placeholder={t('StudentRegistration.RollNo')}
              onChangeText={text => {
                setInput({...input, rollNo: text});
              }}
            />
          </View>
          </View>: <View>
          <DropdownSimple
          disabled={true}
            labelText={
              input.school.SCHOOL_NAME
                ? input.school.SCHOOL_NAME
                : t('StudentRegistration.SelectSchool')
            }
            selectText={t('StudentRegistration.SelectSchool')}
            onPress={() => setOpenModal({...openModal, school: true})}
          />
          <DropdownSimple
            disabled={true}
            labelText={
              input.className.NAME ? input.className.NAME : t('StudentRegistration.SelectClass')
            }
            selectText={t('StudentRegistration.SelectClass')}
            onPress={() => setOpenModal({...openModal, className: true})}
          />
          <DropdownSimple
            disabled={true}
            labelText={
              input.division.NAME ? input.division.NAME : t('StudentRegistration.SelectDivision')
            }
            selectText={t('StudentRegistration.SelectDivision')}
            onPress={() => setOpenModal({...openModal, dividion: true})}
          />
          <DropdownSimple
          disabled={true}
            labelText={input.medium.NAME ? input.medium.NAME : t('StudentRegistration.SelectMedium')}
            selectText={t('StudentRegistration.SelectMedium')}
            onPress={() => {
              setOpenModal({...openModal, medium: true});
            }}
          />
          <View style={{marginHorizontal: Sizes.ScreenPadding}}>
            <TextInputSimple
             keyboardType='numeric'
            editable={false}
              value={input.rollNo}
              label={t('StudentRegistration.RollNo')}
              placeholder={t('StudentRegistration.RollNo')}
              onChangeText={text => {
                setInput({...input, rollNo: text});
              }}
            />
          </View>
          </View>}


          {/* Status View*/}

          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              margin: Sizes.ScreenPadding,
            }}>
            {studentStatus.status == 'P' ? (
              <View style={{alignSelf: 'center'}}>
                <Text
                  style={{
                    color: Colors.Primary,
                    ...Fonts.B1,
                    textAlign: 'center',
                  }}>
                  {t('SchoolRegistration.ApplicationPending')}
                </Text>
                <Text style={{color: Colors.text, ...Fonts.M2}}>
                {t('SchoolRegistration.PendingDescription')}
                </Text>
              </View>
            ) : studentStatus.status == 'R' ? (
              <View>
                <Text style={{color: Colors.Primary, ...Fonts.B1}}>
                {t('SchoolRegistration.ApplicationRejected')}
                </Text>
                <Text style={{color: Colors.text, ...Fonts.M2,textAlign:'center'}}>
                  {studentStatus.remark}
                </Text>
              </View>
            ) : studentStatus.status == 'A' ? (
              <View>
                <Text style={{color: Colors.Primary, ...Fonts.B1}}>
                {t('SchoolRegistration.ApplicationApproved')}
                </Text>
                <Text style={{color: Colors.text, ...Fonts.M2}}>
                  {studentStatus.remark}
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>

        {studentStatus.status == '' ? (
          <View style={{margin: Sizes.ScreenPadding}}>
            <TextButton
              label={t('Profile.enrollAsStudent')}
              loading={loading}
              onPress={() => {
                registration();
              }}
            />
          </View>
        ) : studentStatus.status == 'R' ? (
          <View style={{margin: Sizes.ScreenPadding}}>
          <TextButton
            label={t('SchoolRegistration.ApplyAgain')}
            loading={loading}
            onPress={() => {
              UpdateStudentRegistration();
            }}
          />
          </View>
        ) : null}

        <View>
          {/* <TouchableOpacity
              activeOpacity={0.8}
              onPress={toggleButtons}
              style={{
                height: 45,
                width: 45,
                borderRadius: 23,
                backgroundColor: Colors.Primary2,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'flex-end',
                margin: Sizes.ScreenPadding,
              }}>
              <Text
                style={{
                  fontSize: 31,
                  alignSelf: 'center',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  color: Colors.White,
                }}>
                +
              </Text>
            </TouchableOpacity> */}
        </View>
      </View>

      {openModal.school && (
        <ModalPicker
          title=" "
          visible={openModal.school}
          onClose={() => {
            setOpenModal({...openModal, school: false});
          }}
          data={data.school}
          labelField={'SCHOOL_NAME'}
          onChange={item => {
            getClass(item);
            setInput({...input, school: item});
          }}
          value={input.school}
        />
      )}
      {openModal.className && (
        <ModalPicker
          title=" "
          visible={openModal.className}
          onClose={() => {
            setOpenModal({...openModal, className: false});
          }}
          data={data.className}
          labelField={'NAME'}
          onChange={item => {
            // console.log('asdfghj', item);
            getDivision(item);
            setInput({...input, className: item});
          }}
          value={input.className}
        />
      )}
      {openModal.dividion && (
        <ModalPicker
          title=" "
          visible={openModal.dividion}
          onClose={() => {
            setOpenModal({...openModal, dividion: false});
          }}
          data={data.division}
          labelField={'NAME'}
          onChange={item => {
            getMedium(item);
            setInput({...input, division: item});
          }}
          value={input.division}
        />
      )}
      {openModal.medium && (
        <ModalPicker
          title=" "
          visible={openModal.medium}
          onClose={() => {
            setOpenModal({...openModal, medium: false});
          }}
          data={data.medium}
          labelField={'NAME'}
          onChange={item => {
            setInput({...input, medium: item});
          }}
          value={input.medium}
        />
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
    </View>
  );
};

export default StudentRegistrationScreen;
