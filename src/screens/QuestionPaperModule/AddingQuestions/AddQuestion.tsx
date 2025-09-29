import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {apiPost, apiUpload, useSelector} from '../../../Modules';
import {Header, Icon, TextButton, TextInput, Toast} from '../../../Components';
import TitleComponent from '../../../Components/TitleComponent';
import Dropdown from '../../../Components/Dropdown';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {Checkbox} from 'react-native-paper';
import DocumentScanner from 'react-native-document-scanner-plugin';
import ImageView from 'react-native-image-viewing';

const imageSize = [
  {LABEL: 'Small', VALUE: 'S'},
  {LABEL: 'Medium', VALUE: 'M'},
  {LABEL: 'Large', VALUE: 'L'},
];
const questionTypeData = [
  {QUESTION_TYPE: '1', QUESTION_TYPE_NAME: 'MCQ'},
  {QUESTION_TYPE: '2', QUESTION_TYPE_NAME: 'DESCRIPITIVE'},
];

const AddQuestion = ({navigation}: any) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {member} = useSelector(state => state.member);
  const {SUBJECT_SELECTED, QUESTION_TYPE}: any = useSelector(
    state => state.QuestionPaperType,
  );
  const [option, setOption] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [optionImage, setOptionImage] = useState<any>({});
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [questionImageSize, setQuestionImageSize] = useState({
    LABEL: 'Medium',
    VALUE: 'M',
  });
  const [viewUploadImages, setViewUploadImages] = useState({
    questionImage: false,
    answerImage: false,
  });
  const [options, setOptions] = useState<any>([]);
  const [input, setInput] = useState<any>({
    chapter: {},
    questionType: {},
    question: '',
    questionImage: {},
    description: '',
    answer: '',
    answerImage: {},
    marks: '',
    options: [],
  });
  const [data, setData] = useState({
    questionType: [],
  });
  const checkValidation = () => {
    if (Object.entries(input.chapter).length == 0) {
      Toast('Please Select Chapter');
      return true;
    } else if (Object.entries(input.questionType).length == 0) {
      Toast('Please Select Question Type');
      return true;
    } else if (input.question === '') {
      Toast('Please enter question');
      return true;
    } else if (input.marks.trim() === '') {
      Toast("Marks can't be empty");
      return true;
    } else if (
      input.questionType.QUESTION_TYPE_NAME != 'MCQ' &&
      input.answer.trim() === ''
    ) {
      Toast('Please Enter Answer');
      return true;
    } else if (
      input.questionType.QUESTION_TYPE_NAME == 'MCQ' &&
      options.length < 2
    ) {
      Toast('Please Add at least 2 options');
      return true;
    } else if (
      input.questionType.QUESTION_TYPE_NAME == 'MCQ' &&
      selectedOption == null
    ) {
      Toast('Please set answer from options');
      return true;
    } else {
      return false;
    }
  };
  const addQuestion = async () => {
    if (checkValidation()) {
      return;
    }
    setLoading(true);
    try {
      const res = await apiPost('api/question/addBulk', {
        QUESTION_DATA: [
          {
            QUESTION_TYPE: input.questionType.QUESTION_TYPE,
            STATUS: true,
            OPTIONS:
              input.questionType.QUESTION_TYPE_NAME == 'MCQ' ? options : [],
            CLASS_ID: 1,
            ANSWER_IMAGE: input.answerImage.NAME,
            QUESTION_IMAGE: input.questionImage.NAME,
            SCHOOL_ID: member?.SCHOOL_ID,
            SUBJECT_ID: SUBJECT_SELECTED.ID,
            CHAPTER_ID: input.chapter.CHAPTER_ID,
            QUESTION: input.question,
            DESCRIPTION: input.description,
            ANSWER: input.answer,
            MARKS: input.marks,
            CLIENT_ID: 1,
            QUESTION_IMAGE_SIZE: questionImageSize.VALUE,
          },
        ],
      });

      if (res && res.code === 200) {
        setLoading(false);
        Toast('Question Added Successfully');
        navigation.goBack();
      } else {
        setLoading(false);
        Toast('Something went wrong');
      }
    } catch (error) {
      setLoading(false);
      console.warn(error);
    }
  };
  const takePhotoFromCamera = (type: any) => {
    try {
      ImageCropPicker.openCamera({
        compressImageQuality: 0.7,
        cropping: true,
        multiple: false,
        mediaType: 'photo',
        freeStyleCropEnabled: true,
      }).then(async image => {
        const name =
          Date.now() +
          '.' +
          image.path.substring(image.path.lastIndexOf('.') + 1);
        let uri = type == 'A' ? 'upload/answerImage' : 'upload/questionImage';
        const res = await apiUpload(uri, {
          uri: image.path,
          type: image.mime,
          name: name,
        });
        if (res && res.code == 200) {
          if (type == 'A') {
            setInput({
              ...input,
              answerImage: {
                URL: image.path,
                FILE_TYPE: image.mime,
                NAME: name,
              },
            });
          } else if (type == 'Q') {
            setInput({
              ...input,
              questionImage: {
                URL: image.path,
                FILE_TYPE: image.mime,
                NAME: name,
              },
            });
          } else if (type == 'O') {
            setOptionImage({
              URL: image.path,
              FILE_TYPE: image.mime,
              NAME: name,
            });
          } else {
            Toast('Image not uploaded');
          }
        }
      });
    } catch (error) {
      console.log('err...', error);
    }
  };
  const selectPhotoFromGallery = (type: string) => {
    try {
      ImagePicker.openPicker({
        compressImageQuality: 0.7,
        cropping: true,
        multiple: false,
        mediaType: 'photo',
        freeStyleCropEnabled: true,
        // height: 400,
        // width: 400,
      }).then(async image => {
        const name =
          Date.now() +
          '.' +
          image.path.substring(image.path.lastIndexOf('.') + 1);
        // let uri = type == 'A' ? 'upload/answerImage' : 'upload/questionImage';
        let uri =
          type == 'A'
            ? 'upload/answerImage'
            : type == 'O'
            ? 'upload/optionImage'
            : 'upload/questionImage';
        const res = await apiUpload(uri, {
          uri: image.path,
          type: image.mime,
          name: name,
        });
        if (res && res.code == 200) {
          if (type == 'A') {
            setInput({
              ...input,
              answerImage: {
                URL: image.path,
                FILE_TYPE: image.mime,
                NAME: name,
              },
            });
          } else if (type == 'Q') {
            setInput({
              ...input,
              questionImage: {
                URL: image.path,
                FILE_TYPE: image.mime,
                NAME: name,
              },
            });
          } else if (type == 'O') {
            setOptionImage({
              URL: image.path,
              FILE_TYPE: image.mime,
              NAME: name,
            });
          }
        } else {
          Toast('Image not uploaded');
        }
      });
    } catch (error) {
      console.log('error...', error);
    }
  };
  const addOptions = () => {
    const data = {
      OPTION_TEXT: option,
      OPTION_IMAGE_URL: optionImage.NAME,
      IS_CORRECT: isCorrect,
      STATUS: true,
      SEQ_NO: options.length + 1,
    };
    setOptions([...options, data]);
    setOption('');
    setOptionImage({});
  };
  const selectedOptionToggle = (item: any, index: number) => {
    const dataIndex = options.findIndex((it: any) => it.SEQ_NO == item.SEQ_NO);

    if (dataIndex !== -1) {
      const updatedOptions = options.map((option: any, i: any) => {
        option.IS_CORRECT = i === dataIndex;
        return option;
      });
      setOptions(updatedOptions);
    }
    setSelectedOption(item);
  };
  const scanDocument = async (type: any) => {
    try {
      const {scannedImages} = await DocumentScanner.scanDocument({
        maxNumDocuments: 1,
      });

      if (scannedImages && scannedImages.length > 0) {
        const name =
          Date.now() +
          '.' +
          scannedImages[0].substring(scannedImages[0].lastIndexOf('.') + 1);
        const fileType =
          'image/' +
          scannedImages[0].substring(scannedImages[0].lastIndexOf('.') + 1);
        let uri = type == 'A' ? 'upload/answerImage' : 'upload/questionImage';
        const res = await apiUpload(uri, {
          uri: scannedImages[0],
          type: fileType,
          name: name,
        });
        if (res && res.code == 200) {
          if (type == 'A') {
            setInput({
              ...input,
              answerImage: {
                URL: scannedImages[0],
                FILE_TYPE: fileType,
                NAME: name,
              },
            });
          } else if (type == 'Q') {
            setInput({
              ...input,
              questionImage: {
                URL: scannedImages[0],
                FILE_TYPE: fileType,
                NAME: name,
              },
            });
          } else if (type == 'O') {
            setOptionImage({
              URL: scannedImages[0],
              FILE_TYPE: fileType,
              NAME: name,
            });
          } else {
            Toast('Image not uploaded');
          }
        }
      } else {
        console.log('No images scanned.');
      }
    } catch (error) {
      console.error('Error scanning document:', error);
    }
  };

  return (
    <View style={{backgroundColor: Colors.White, flex: 1}}>
      <Header label="Add Questions" onBack={() => navigation.goBack()} />
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: Sizes.Padding,
          paddingBottom: Sizes.Padding,
          paddingTop: Sizes.Padding,
        }}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
          }}>
          <TitleComponent
            label={SUBJECT_SELECTED.CLASS_NAME}
            style={{flex: 0.5}}
            onPress={() => {}}
            ViewStyle={{borderRadius: Sizes.Base}}
            isBorder={true}
            textStyle={{...Fonts.Medium2, color: Colors.PrimaryText1}}
            loading={false}
          />
          <View style={{width: Sizes.Base}} />

          <TitleComponent
            label={SUBJECT_SELECTED.NAME}
            style={{flex: 0.5}}
            onPress={() => {}}
            ViewStyle={{borderRadius: Sizes.Base}}
            isBorder={true}
            textStyle={{...Fonts.Medium2, color: Colors.PrimaryText1}}
            loading={false}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{paddingBottom: Sizes.ScreenPadding}}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginHorizontal: Sizes.ScreenPadding,
          }}>
          {/*COMMON VIEW*/}
          <View
            style={{
              padding: Sizes.Radius,
              borderColor: Colors.Primary,
              borderRadius: Sizes.Radius,
              borderWidth: 1,
            }}>
            <Dropdown
              label="Chapter"
              data={QUESTION_TYPE}
              value={input.chapter ? input.chapter : ''}
              onChange={item => {
                setData({...data, questionType: item.QUESTIONS});
                setInput({...input, chapter: item});
              }}
              placeholder={'Select Chapter'}
              labelField="CHAPTER_NAME"
              valueField="CHAPTER_ID"
            />
            <Dropdown
              labelStyle={{marginTop: Sizes.Radius}}
              label="Question Type"
              data={questionTypeData}
              // data={data.questionType}
              value={input.questionType}
              onChange={item => {
                // console.log(item);
                setInput({...input, questionType: item});
              }}
              placeholder={'Select Chapter'}
              labelField="QUESTION_TYPE_NAME"
              valueField="QUESTION_TYPE"
            />
            <TextInput
              labelStyle={{marginTop: Sizes.Radius}}
              onChangeText={value => {
                setInput({...input, question: value});
              }}
              label="Question"
              multiline
              value={input.question}
              placeholder="Enter question"
              autoFocus={true}
            />
            {/* question image */}
            <View
              style={{
                marginTop: Sizes.Padding,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  ...Fonts.Regular3,
                  color: Colors.PrimaryText1,
                  textAlign: 'left',
                }}>
                {`Question Image`}
              </Text>
              <View style={{flexDirection: 'row', width: '100%'}}>
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
                    width: input.questionImage.NAME ? '70%' : '100%',
                  }}
                  onPress={() => {
                    scanDocument('Q');
                  }}>
                  <Text style={{...Fonts.Regular3, color: Colors.PrimaryText}}>
                    {input.questionImage.NAME
                      ? input.questionImage.NAME
                      : 'Select Image'}
                  </Text>
                </TouchableOpacity>
                <View style={{width: '3%'}} />
                {input.questionImage.NAME && (
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
                      width: '27%',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      setViewUploadImages({
                        ...viewUploadImages,
                        questionImage: true,
                        answerImage: false,
                      });
                    }}>
                    <Icon name="eye" type="SimpleLineIcons" />
                    <Text
                      style={{
                        ...Fonts.Regular3,
                        color: Colors.PrimaryText,
                        marginLeft: Sizes.Base,
                      }}>
                      {'View'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={{height: Sizes.Base}} />
            {input.questionImage.NAME && (
              <Dropdown
                labelStyle={{marginTop: Sizes.Radius}}
                label="Image Size"
                data={imageSize}
                value={questionImageSize}
                onChange={item => {
                  setQuestionImageSize(item);
                }}
                placeholder={'Select question image size'}
                labelField="LABEL"
                valueField="LABEL"
              />
            )}
            {input.questionImage.NAME && <View style={{height: Sizes.Base}} />}
            <TextInput
              labelStyle={{marginTop: Sizes.Radius}}
              onChangeText={value => {
                setInput({...input, description: value});
              }}
              label="Description"
              multiline
              value={input.description}
              placeholder="Enter Description"
              autoFocus={false}
            />
            <TextInput
              labelStyle={{marginTop: Sizes.Radius}}
              onChangeText={value => {
                setInput({...input, marks: value});
              }}
              label="Marks"
              value={input.marks}
              placeholder="Enter Marks"
              autoFocus={false}
            />
          </View>

          {/*VIEW FOR DESCRIPTIVE QUESTIONS*/}
          {input.questionType.QUESTION_TYPE_NAME != 'MCQ' ? (
            <View
              style={{
                padding: Sizes.Radius,
                borderRadius: Sizes.Radius,
                borderColor: Colors.Primary,
                borderWidth: 1,
                marginVertical: Sizes.Padding,
              }}>
              <TextInput
                onChangeText={value => {
                  setInput({...input, answer: value});
                }}
                label="Answer"
                multiline
                value={input.answer}
                placeholder="Enter answer"
                autoFocus={false}
              />
              {/* answer image */}
              <View
                style={{
                  marginTop: Sizes.Padding,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    ...Fonts.Regular3,
                    color: Colors.PrimaryText1,
                    textAlign: 'left',
                  }}>
                  {`Answer Image`}
                </Text>
                <View style={{flexDirection: 'row', width: '100%'}}>
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
                      width: input.answerImage.NAME ? '70%' : '100%',
                    }}
                    onPress={() => {
                      scanDocument('A');
                    }}>
                    <Text
                      style={{...Fonts.Regular3, color: Colors.PrimaryText}}>
                      {input.answerImage.NAME
                        ? input.answerImage.NAME
                        : 'Select Image'}
                    </Text>
                  </TouchableOpacity>
                  <View style={{width: '3%'}} />
                  {input.answerImage.NAME && (
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
                        width: '27%',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        setViewUploadImages({
                          ...viewUploadImages,
                          questionImage: false,
                          answerImage: true,
                        });
                      }}>
                      <Icon name="eye" type="SimpleLineIcons" />
                      <Text
                        style={{
                          ...Fonts.Regular3,
                          color: Colors.PrimaryText,
                          marginLeft: Sizes.Base,
                        }}>
                        {'View'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ) : (
            <View
              style={{
                padding: Sizes.Radius,
                borderColor: Colors.Primary,
                borderWidth: 1,
                marginTop: Sizes.ScreenPadding,
                borderRadius: Sizes.Radius,
              }}>
              <TextInput
                placeholder="Enter Option"
                onChangeText={value => {
                  setOption(value);
                }}
                value={option}
                style={{flex: 1}}
                label="Options"
                autoFocus={false}
              />
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  marginTop: Sizes.Padding,
                }}>
                {/* option image */}
                <View style={{flex: 0.8, marginRight: Sizes.Base}}>
                  <View
                    style={{
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        ...Fonts.Regular3,
                        color: Colors.Primary,
                        textAlign: 'left',
                      }}>
                      {`Option Image`}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        justifyContent: 'center',
                        paddingHorizontal: Sizes.Radius,
                        borderRadius: Sizes.Radius,
                        elevation: 6,
                        shadowColor: Colors.Primary,
                        backgroundColor: Colors.White,
                        height: 40,
                      }}
                      onPress={() => {
                        scanDocument('O');
                      }}>
                      <Text
                        style={{...Fonts.Regular3, color: Colors.PrimaryText}}>
                        {optionImage.NAME ? optionImage.NAME : 'Select Image'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{flex: 0.2, marginTop: Sizes.ScreenPadding}}>
                  <TextButton
                    label="Add"
                    loading={false}
                    onPress={() => {
                      option == ''
                        ? optionImage.NAME == undefined
                          ? Toast('Please Enter Option or option image')
                          : addOptions()
                        : addOptions();
                    }}
                  />
                </View>
              </View>
            </View>
          )}

          {options.length != 0 && (
            <View
              style={{
                backgroundColor: Colors.White,
                padding: Sizes.Radius,
                borderRadius: Sizes.Radius,
                elevation: 6,
                margin: Sizes.Base,
                shadowColor: Colors.White,
              }}>
              <Text style={{color: Colors.Primary, ...Fonts.Medium2}}>
                Select answer from below Options
              </Text>
              <FlatList
                data={options}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        selectedOptionToggle(item, index);
                      }}
                      style={{
                        backgroundColor: selectedOption
                          ? item.SEQ_NO == selectedOption.SEQ_NO
                            ? Colors.Primary2
                            : Colors.Primary2 + 10
                          : Colors.Primary2 + 10,
                        padding: Sizes.Base,
                        borderRadius: Sizes.Radius,
                        marginTop: Sizes.Base,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text>
                        {item.OPTION_TEXT
                          ? item.OPTION_TEXT
                          : item.OPTION_IMAGE_URL}
                      </Text>
                      <Checkbox
                        status={
                          selectedOption
                            ? item.SEQ_NO == selectedOption.SEQ_NO
                              ? 'checked'
                              : 'unchecked'
                            : 'unchecked'
                        }
                        color={Colors.Primary}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={{margin: Sizes.ScreenPadding}}>
        <TextButton
          label="Save"
          loading={loading}
          onPress={() => {
            addQuestion();
          }}
        />
      </View>
      {viewUploadImages.questionImage && input.questionImage.URL && (
        <ImageView
          images={[{uri: input.questionImage.URL}]}
          imageIndex={0}
          visible={viewUploadImages.questionImage}
          presentationStyle="overFullScreen"
          backgroundColor="#000"
          onRequestClose={() => {
            setViewUploadImages({
              ...viewUploadImages,
              questionImage: false,
              answerImage: false,
            });
          }}
        />
      )}
      {viewUploadImages.answerImage && input.answerImage.URL && (
        <ImageView
          images={[{uri: input.answerImage.URL}]}
          imageIndex={0}
          visible={viewUploadImages.answerImage}
          presentationStyle="overFullScreen"
          backgroundColor="#000"
          onRequestClose={() => {
            setViewUploadImages({
              ...viewUploadImages,
              questionImage: false,
              answerImage: false,
            });
          }}
        />
      )}
    </View>
  );
};

export default AddQuestion;
