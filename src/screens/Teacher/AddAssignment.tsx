import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import React, { useState } from 'react';
import { Icon, Modal, TextButton, TextInput, Toast } from '../../Components';
import { apiPost, apiPut, apiUpload, useSelector } from '../../Modules';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalPicker from '../../Components/ModalPicker';
import {
  SUBJECT_TEACHER_MASTER,
  TEACHER_CLASS_TASK,
} from '../../Modules/interface';
import DocumentPicker, { types } from 'react-native-document-picker';
import { ScrollView } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import { useTranslation } from 'react-i18next';

interface modalProps {
  visible: boolean;
  onClose: () => void;
  date: string | Date;
  item: TEACHER_CLASS_TASK;
  onSuccess: () => void;
  data: SUBJECT_TEACHER_MASTER;
  mainData: Array<SUBJECT_TEACHER_MASTER>;
  classTeacher: boolean;
}
interface selectData {
  className: SUBJECT_TEACHER_MASTER;
  division: SUBJECT_TEACHER_MASTER;
  year: SUBJECT_TEACHER_MASTER;
  subject: SUBJECT_TEACHER_MASTER;
  description: string;
}
interface documentType {
  uri: string;
  type: string | any;
  name: string | any;
  size: number | any;
}
const AddAssignment = ({
  visible,
  onClose,
  date,
  item,
  data,
  mainData,
  onSuccess,
  classTeacher,
}: modalProps) => {
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const { teacherClassMapping } = useSelector(state => state.teacher);
  const { member } = useSelector(state => state.member);
  const { t } = useTranslation();

  let currentDate = new Date();
  let tomorrowDate = new Date(currentDate);
  tomorrowDate.setDate(currentDate.getDate() + 1);

  const [selectDate, setSelectDate] = useState<{
    myDate: any;
    mode: any;
    show: boolean;
    submissionDate: any;
    submissionDateShow: boolean;
    type: 'T' | 'D';
  }>({
    myDate: date,
    mode: 'date',
    show: false,
    submissionDate: item.SUBMISSION_DATE
      ? new Date(item.SUBMISSION_DATE)
      : new Date(new Date().setDate(new Date().getDate() + 1)),
    submissionDateShow: false,
    type: 'D',
  });

  const changeSelectedDate = (event: any, selectedDate: any) => {
    if (selectedDate) {
      setSelectDate({
        ...selectDate,
        myDate: selectedDate,
        submissionDate: new Date(
          new Date().setDate(selectedDate.getDate() + 1),
        ),
        show: false,
      });
    } else {
      setSelectDate({ ...selectDate, show: false });
    }
  };
  const changeSubmissionDate = (event: any, selectedDate: any) => {
    if (selectedDate) {
      setSelectDate({
        ...selectDate,
        submissionDate: selectedDate,
        submissionDateShow: false,
      });
    } else {
      setSelectDate({ ...selectDate, submissionDateShow: false });
    }
  };
  const [questions, setQuestions] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>(
    item.TYPE == 'AS'
      ? 'Assignment'
      : item.TYPE == 'HW'
        ? 'HomeWork'
        : 'ClassWork',
  );
  const [openModal, setOpenModal] = useState({
    classModal: false,
    divisionModal: false,
    subjectModal: false,
    addModal: false,
  });
  const [selectedData, setSelectedData] = useState<selectData>({
    className: data,
    division: data,
    year: data,
    subject: {
      SUBJECT_NAME: item.SUBJECT_NAME ? item.SUBJECT_NAME : data.SUBJECT_NAME,
      SUBJECT_ID: item.SUBJECT_ID ? item.SUBJECT_ID : data.SUBJECT_ID,
    },
    description: item.DESCRIPTION,
  });
  const [document, setDocument] = useState({
    uri: '',
    type: '',
    name: item.ATTACMENT,
    size: 0,
  });
  const pickDocumentFromGallery = async () => {
    const result: any = await DocumentPicker.pick({
      type: [types.images],
    });
    const name =
      Date.now() +
      '.' +
      result[0].name.substring(result[0].name.lastIndexOf('.') + 1);
    const res = await apiUpload('upload/taskAttachment', {
      name: name,
      type: result[0].type,
      uri: result[0].uri,
    });
    if (res && res.code == 200) {
      const file: documentType = {
        uri: result[0].uri,
        type: result[0].type,
        name: name,
        size: result[0].size,
      };
      setDocument(file);
    } else {
      Toast('Image not uploaded please try again');
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
        const name =
          Date.now() +
          '.' +
          image.path.substring(image.path.lastIndexOf('.') + 1);

        const res = await apiUpload('upload/taskAttachment', {
          uri: image.path,
          type: image.mime,
          name: name,
        });
        console.log('\n\n\nres', res);
        if (res && res.code == 200) {
          const file: documentType = {
            uri: image.path,
            type: image.mime,
            name: name,
            size: image.size,
          };
          setDocument(file);
        } else {
          Toast('Image not uploaded please try again');
        }
      });
    } catch (error) {
      console.log('err...', error);
    }
  };
  const checkValidation = () => {
    if (!selectedData.className.CLASS_ID) {
      Toast('Please select any class');
      return true;
    } else if (!selectedData.division.DIVISION_ID) {
      Toast('Please select any division');
      return true;
    } else if (!classTeacher && !selectedData.subject.SUBJECT_ID) {
      Toast('Please select any subject name');
      return true;
    } else if (
      selectedData.description == undefined ||
      selectedData.description?.trim() == ''
    ) {
      Toast('Please enter description');
      return true;
    } else if (selectDate.myDate > selectDate.submissionDate) {
      Toast('Submission Date must be equal or grater than date');
      return true;
    } else {
      return false;
    }
  };

  const createClassWiseTask = async () => {
    if (checkValidation()) {
      return;
    }
    try {
      let body = {
        DESCRIPTION: selectedData.description,
        DATE: moment(selectDate.myDate).format('YYYY-MM-DD'),
        CLASS_ID: selectedData.className.CLASS_ID,
        ATTACMENT: document.name ? document.name : null,
        APPLIED_TIME: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        TEACHER_ID: member?.ID,
        STATUS: 'D',
        CLIENT_ID: 1,
        SUBMISSION_DATE: moment(selectDate.submissionDate).format(
          'YYYY-MM-DD HH:mm:ss',
        ),
        TYPE:
          selectedType == 'HomeWork'
            ? 'HW'
            : selectedType == 'ClassWork'
              ? 'CW'
              : 'AS',
        SUBJECT_ID: classTeacher ? null : selectedData.subject.SUBJECT_ID,
        SUBJECT_NAME: classTeacher ? null : selectedData.subject.SUBJECT_NAME,
        YEAR_ID: selectedData.className.YEAR_ID,
        DIVISION_ID: selectedData.division.DIVISION_ID,
      };
      console.log('body,,,', body);
      const res = await apiPost('api/classWiseTask/create', body);
      if (res && res.code == 200) {
        onSuccess();
      }
    } catch (error) {
      console.log('err,,,', error);
    }
  };
  const updateClassWiseTask = async () => {
    if (checkValidation()) {
      return;
    }
    try {
      let body = {
        DESCRIPTION: selectedData.description,
        DATE: moment(selectDate.myDate).format('YYYY-MM-DD'),
        CLASS_ID: selectedData.className.CLASS_ID,
        ATTACMENT: document.name ? document.name : null,
        APPLIED_TIME: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        TEACHER_ID: member?.ID,
        STATUS: 'D',
        CLIENT_ID: 1,
        SUBMISSION_DATE: moment(selectDate.submissionDate).format(
          'YYYY-MM-DD HH:mm:ss',
        ),
        TYPE:
          selectedType == 'HomeWork'
            ? 'HW'
            : selectedType == 'ClassWork'
              ? 'CW'
              : 'AS',
        SUBJECT_ID: classTeacher ? null : selectedData.subject.SUBJECT_ID,
        SUBJECT_NAME: classTeacher ? null : selectedData.subject.SUBJECT_NAME,
        YEAR_ID: selectedData.year.YEAR_ID,
        DIVISION_ID: selectedData.division.DIVISION_ID,
        ID: item.ID,
      };
      const res = await apiPut('api/classWiseTask/update', body);
      if (res && res.code == 200) {
        onSuccess();
      }
    } catch (error) {
      console.log('err,,,', error);
    }
  };
  const uniqueSubjects = mainData.reduce((uniqueItems: any, currentItem) => {
    // console.log('\n\n\nuniqueItems...', uniqueItems);
    const isDuplicate = uniqueItems.some(
      (item: any) => item.SUBJECT_ID === currentItem.SUBJECT_ID,
    );
    if (!isDuplicate) {
      uniqueItems.push(currentItem);
    }
    return uniqueItems;
  }, []);
  const uniqueDivisions = mainData.reduce((uniqueItems: any, currentItem) => {
    const isDuplicate = uniqueItems.some(
      (item: any) => item.DIVISION_ID === currentItem.DIVISION_ID,
    );
    if (!isDuplicate) {
      uniqueItems.push(currentItem);
    }
    return uniqueItems;
  }, []);
  const uniqueClass = mainData.reduce((uniqueItems: any, currentItem) => {
    const isDuplicate = uniqueItems.some(
      (item: any) => item.CLASS_ID === currentItem.CLASS_ID,
    );
    if (!isDuplicate) {
      uniqueItems.push(currentItem);
    }
    return uniqueItems;
  }, []);
  const selectedClassId = selectedData.className.CLASS_ID;
  const divisionsForSelectedClass = mainData
    .filter(item => item.CLASS_ID === selectedClassId)
    .map(item => item);

  const selectedDivisionName = selectedData.division.DIVISION_ID;
  const subjectsForSelectedClassAndDivision = mainData
    .filter(
      item =>
        item.CLASS_ID === selectedClassId &&
        item.DIVISION_ID === selectedDivisionName,
    )
    .map(item => item);

  return (
    <Modal
      isVisible={visible}
      onClose={onClose}
      title=" "
      style={{
        margin: 0,
        borderRadius: 0,
        width: '100%',
        height: '100%',
      }}>
      <ScrollView
        style={{
          width: '100%',
        }}>
        {/* Class Year */}
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: Sizes.Base,
              paddingHorizontal: Sizes.Radius,
              borderRadius: Sizes.Radius,
              elevation: 6,
              shadowColor: Colors.Primary,
              backgroundColor: Colors.White,
              marginHorizontal: 3,
              alignSelf: 'flex-end',
              marginBottom: Sizes.ScreenPadding,
              marginTop: Sizes.Base,
            }}
            onPress={() => {
              setOpenModal({ ...openModal, classModal: true });
            }}>
            <Text style={{ ...Fonts.Medium2, color: Colors.PrimaryText }}>
              {selectedData.className.CLASS_NAME
                ? selectedData.className.CLASS_NAME
                : 'Class'}
            </Text>
          </TouchableOpacity>
          <View style={{ width: Sizes.Base }} />
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: Sizes.Base,
              paddingHorizontal: Sizes.Radius,
              borderRadius: Sizes.Radius,
              elevation: 6,
              shadowColor: Colors.Primary,
              backgroundColor: Colors.White,
              marginHorizontal: 3,
              alignSelf: 'flex-end',
              marginBottom: Sizes.ScreenPadding,
              marginTop: Sizes.Base,
            }}
            onPress={() => {
              setOpenModal({ ...openModal, divisionModal: true });
            }}>
            <Text style={{ ...Fonts.Medium2, color: Colors.PrimaryText }}>
              {selectedData.division.DIVISION_NAME
                ? selectedData.division.DIVISION_NAME
                : 'Division'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View
          style={{
            height: 50,
            marginHorizontal: 3,
            borderRadius: Sizes.Padding * 2,
            elevation: 6,
            shadowColor: Colors.Primary2,
            marginTop: Sizes.Base,
            flexDirection: 'row',
            backgroundColor: 'white',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setSelectedType('ClassWork');
            }}
            style={{
              width: '32%',
              height: '100%',
              borderRadius: Sizes.Padding * 2,
              backgroundColor:
                selectedType === 'ClassWork' ? Colors.Primary2 : Colors.White,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...Fonts.Medium3,
                color:
                  selectedType === 'ClassWork' ? Colors.White : Colors.Primary2,
              }}>
              Class Work
            </Text>
          </TouchableOpacity>
          {selectedType === 'Assignment' && (
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
              setSelectedType('HomeWork');
            }}
            style={{
              width: '32%',
              height: '100%',
              borderRadius: Sizes.Padding * 2,
              backgroundColor:
                selectedType === 'HomeWork' ? Colors.Primary2 : Colors.White,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...Fonts.Medium3,
                color:
                  selectedType === 'HomeWork' ? Colors.White : Colors.Primary2,
              }}>
              Home Work
            </Text>
          </TouchableOpacity>

          {selectedType === 'ClassWork' && (
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
              setSelectedType('Assignment');
            }}
            style={{
              width: '36%',
              height: '100%',
              borderRadius: Sizes.Padding * 2,
              backgroundColor:
                selectedType === 'Assignment' ? Colors.Primary2 : Colors.White,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...Fonts.Medium3,
                color:
                  selectedType === 'Assignment'
                    ? Colors.White
                    : Colors.Primary2,
                textAlign: 'center',
              }}>
              Notice
            </Text>
          </TouchableOpacity>
        </View>

        {/* <Text
          style={{
            ...Fonts.Medium4,
            color: Colors.PrimaryText,
            marginHorizontal: Sizes.Base,
            marginTop: Sizes.Padding,
          }}>
          {selectedType === 'ClassWork'
            ? 'Get information on the daily syllabus taught in school by date and subject'
            : selectedType === 'HomeWork'
            ? 'Get information on the daily homework assigned in school by date and subject'
            : 'Get information on other assigned tasks such as exercise & fitness, drawing, art, craft, etc'}
        </Text> */}

        {/* Date */}
        <View
          style={{
            marginTop: Sizes.Padding,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: Colors.PrimaryText1,
              textAlign: 'left',
            }}>
            {`${t('teacherAddAssignment.date')} : `}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              justifyContent: 'center',
              paddingVertical: Sizes.Base,
              marginHorizontal: 3,
              paddingHorizontal: Sizes.Radius,
              borderRadius: Sizes.Radius,
              backgroundColor: Colors.White,
              elevation: 6,
              shadowColor: Colors.Primary,
            }}
            onPress={() => {
              setSelectDate({ ...selectDate, show: true, type: 'D' });
            }}>
            <Text style={{ ...Fonts.Medium2, color: Colors.PrimaryText }}>
              {moment(selectDate.myDate).format('DD/MMM/YYYY')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Subject */}
        {!classTeacher && selectedType != 'Assignment' && (
          <View
            style={{
              marginTop: Sizes.Padding,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...Fonts.Medium2,
                color: Colors.PrimaryText1,
                textAlign: 'left',
              }}>
              {`${t('teacherAddAssignment.subject')} : `}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                justifyContent: 'center',
                paddingVertical: Sizes.Base,
                paddingHorizontal: Sizes.Radius,
                borderRadius: Sizes.Radius,
                elevation: 6,
                shadowColor: Colors.Primary,
                backgroundColor: Colors.White,
                marginHorizontal: 3,
              }}
              onPress={() => {
                setOpenModal({ ...openModal, subjectModal: true });
              }}>
              <Text style={{ ...Fonts.Medium2, color: Colors.PrimaryText }}>
                {selectedData.subject.SUBJECT_NAME
                  ? selectedData.subject.SUBJECT_NAME
                  : t('teacherAddAssignment.subjectPlaceholder')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Description */}
        <View
          style={{
            marginTop: Sizes.Padding,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: Colors.PrimaryText1,
              textAlign: 'left',
            }}>
            {`${t('teacherAddAssignment.description')} : `}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={{ flex: 1, marginHorizontal: 1 }}>
              <TextInput
                onChangeText={txt => {
                  setSelectedData({ ...selectedData, description: txt });
                }}
                value={selectedData.description}
                placeholder={t('teacherAddAssignment.descriptionPlaceholder')}
                multiline={true}
              />
            </View>
            {/* <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (selectedData.description.trim() !== '') {
                  setQuestions([...questions, selectedData.description]);
                  setSelectedData({...selectedData, description: ''});
                }
              }}
              style={{
                height: 42,
                width: 42,
                borderRadius: 21,
                backgroundColor: Colors.Primary2,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: Sizes.Base,
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

        {/* Attachment */}
        <View
          style={{
            marginTop: Sizes.Padding,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: Colors.PrimaryText1,
              textAlign: 'left',
            }}>
            {`${t('teacherAddAssignment.attachment')} : `}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              justifyContent: 'center',
              paddingVertical: Sizes.Base,
              paddingHorizontal: Sizes.Radius,
              borderRadius: Sizes.Radius,
              elevation: 6,
              shadowColor: Colors.Primary,
              backgroundColor: Colors.White,
              marginHorizontal: 3,
              marginBottom: selectedType != 'ClassWork' ? 0 : 20,
            }}
            onPress={() => {
              Alert.alert(
                'Attachment',
                'Select Option',
                [
                  {
                    text: 'Gallery',
                    onPress: () => {
                      pickDocumentFromGallery();
                    },
                  },
                  {
                    text: 'Capture',
                    onPress: () => {
                      takePhotoFromCamera();
                    },
                  },
                ],
                { cancelable: true },
              );
            }}>
            <Text style={{ ...Fonts.Medium2, color: Colors.PrimaryText }}>
              {document.name
                ? document.name
                : t('teacherAddAssignment.attachmentPlaceholder')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Questions */}
        {/* <View style={{marginVertical: Sizes.Padding}}>
          <FlatList
            data={questions}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: Sizes.Base,
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      ...Fonts.Regular2,
                      color: Colors.PrimaryText1,
                      flex: 0.9,
                    }}>
                    {`Q.${index + 1}  ${item}`}
                  </Text>
                  <Icon
                    name="delete-outline"
                    type="MaterialCommunityIcons"
                    size={23}
                    onPress={() => {
                      const updatedQuestions = [...questions];
                      updatedQuestions.splice(index, 1);
                      setQuestions(updatedQuestions);
                    }}
                    style={{flex: 0.1}}
                  />
                </View>
              );
            }}
          />
        </View> */}

        {/* Submission Date */}
        {selectedType != 'ClassWork' && selectedType != 'Assignment' ? (
          <View
            style={{
              marginTop: Sizes.Padding,
              marginBottom: Sizes.ScreenPadding * 2,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...Fonts.Medium2,
                color: Colors.PrimaryText1,
                textAlign: 'left',
              }}>
              {`${t('teacherAddAssignment.submissionDate')} : `}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  padding: Sizes.Radius,
                  flex: 1,
                  alignSelf: 'baseline',
                  justifyContent: 'center',
                  paddingVertical: Sizes.Base,
                  paddingHorizontal: Sizes.Radius,
                  borderRadius: Sizes.Radius,
                  elevation: 6,
                  shadowColor: Colors.Primary,
                  backgroundColor: Colors.White,
                  marginHorizontal: 3,
                  flexDirection: 'row',
                }}
                onPress={() => {
                  setSelectDate({
                    ...selectDate,
                    submissionDateShow: true,
                    type: 'D',
                  });
                }}>
                <Text
                  style={{
                    ...Fonts.Medium2,
                    color: Colors.PrimaryText,
                    flex: 1,
                  }}>
                  {moment(selectDate.submissionDate).format('DD/MMM/YYYY')}
                </Text>
                <Icon name="calendar" type="AntDesign" />
              </TouchableOpacity>
              <View style={{ width: Sizes.Base }} />
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  padding: Sizes.Radius,
                  flex: 1,
                  alignSelf: 'baseline',
                  justifyContent: 'center',
                  paddingVertical: Sizes.Base,
                  paddingHorizontal: Sizes.Radius,
                  borderRadius: Sizes.Radius,
                  elevation: 6,
                  shadowColor: Colors.Primary,
                  backgroundColor: Colors.White,
                  marginHorizontal: 3,
                  flexDirection: 'row',
                }}
                onPress={() => {
                  setSelectDate({
                    ...selectDate,
                    submissionDateShow: true,
                    type: 'T',
                  });
                }}>
                <Text
                  style={{
                    ...Fonts.Medium2,
                    color: Colors.PrimaryText,
                    flex: 1,
                  }}>
                  {moment(selectDate.submissionDate).format('hh:mm A')}
                </Text>
                <Icon name="clockcircleo" type="AntDesign" />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Buttons */}
      <View
        style={{
          flexDirection: 'row',
          marginTop: Sizes.ScreenPadding,
          alignSelf: 'flex-end',
        }}>
        <TextButton
          label={t('common.Cancel')}
          loading={false}
          onPress={() => {
            onClose();
          }}
          isBorder={true}
          style={{ flex: 1 }}
        />
        <View style={{ width: Sizes.Radius }} />
        <TextButton
          label={t('common.Save')}
          loading={false}
          onPress={() => {
            item.CLASS_ID ? updateClassWiseTask() : createClassWiseTask();
          }}
          style={{ flex: 1 }}
        />
      </View>

      {selectDate.show && (
        <DateTimePicker
          value={selectDate.myDate}
          mode={selectDate.mode}
          is24Hour={true}
          display="default"
          onChange={changeSelectedDate}
          minimumDate={new Date()}
        />
      )}
      {selectDate.submissionDateShow && (
        <DateTimePicker
          value={selectDate.submissionDate}
          mode={
            selectDate.type == 'D'
              ? 'date'
              : selectDate.type == 'T'
                ? 'time'
                : 'datetime'
          }
          // is24Hour={true}
          display="default"
          onChange={changeSubmissionDate}
          minimumDate={new Date()}
        />
      )}
      {openModal.classModal && (
        <ModalPicker
          title={t('teacherAddAssignment.selectClass')}
          visible={openModal.classModal}
          onClose={() => {
            setOpenModal({ ...openModal, classModal: false });
          }}
          data={uniqueClass}
          labelField={'CLASS_NAME'}
          onChange={item => {
            // console.log('item', item.CLASS_NAME);
            setSelectedData({
              ...selectedData,
              className: item,
              division: {},
              subject: {},
            });
          }}
          value={selectedData.className}
        />
      )}
      {openModal.divisionModal && (
        <ModalPicker
          title={t('teacherAddAssignment.selectDivision')}
          visible={openModal.divisionModal}
          onClose={() => {
            setOpenModal({ ...openModal, divisionModal: false });
          }}
          data={divisionsForSelectedClass}
          labelField={'DIVISION_NAME'}
          onChange={item => {
            setSelectedData({ ...selectedData, division: item, subject: {} });
          }}
          value={selectedData.division}
        />
      )}
      {openModal.subjectModal && (
        <ModalPicker
          title={t('teacherAddAssignment.selectSubject')}
          visible={openModal.subjectModal}
          onClose={() => {
            setOpenModal({ ...openModal, subjectModal: false });
          }}
          data={subjectsForSelectedClassAndDivision}
          labelField={'SUBJECT_NAME'}
          onChange={item => {
            setSelectedData({ ...selectedData, subject: item });
          }}
          value={selectedData.subject}
        />
      )}
    </Modal>
  );
};

export default AddAssignment;
