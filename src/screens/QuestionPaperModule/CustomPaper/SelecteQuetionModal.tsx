import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import {Header, Icon, Modal, TextButton} from '../../../Components';
import {Reducers, apiPost, useDispatch, useSelector} from '../../../Modules';
import {QUESTION_SERIES, QUESTION_TYPE} from '../../../Modules/interface';
import CheckImage from '../../../Components/CheckImage';
import CheckedQuestionModal from './checkedQuestionModal';
import {noData} from '../../../../assets';
import CheckboxComponent from '../../../Components/CheckboxComponent';

interface SelectedQuestionModalProps {
  modalVisible: boolean;
  QUESTION_TYPEs: number | any;
  QuestionTypeName: string;
  IsQuestionSelected: number[];
  ChapterId: number | any;
  ChapterItem: any;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setAllData: React.Dispatch<React.SetStateAction<QUESTION_TYPE[]>>;
}
const SelectedQuestionModal: React.FC<SelectedQuestionModalProps> = ({
  modalVisible,
  setModalVisible,
  QUESTION_TYPEs,
  QuestionTypeName,
  ChapterId,
  ChapterItem,
  setAllData,
  IsQuestionSelected,
}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [checked, setChecked] = useState<number[]>([]);
  const [loading, setloading] = useState(true);
  const [data, setData] = useState<QUESTION_SERIES[]>([]);
  const [SelectedQuestionModal, setSelectedQuestionModal] = useState(false);
  const [questionTypeId, setQuestionTypeId] = useState(QUESTION_TYPEs);
  const {QUESTION_TYPE, QUESTION_SERIES, QUESTIONS_SELECTED}: any = useSelector(
    state => state.QuestionPaperType,
  );
  const dispatch = useDispatch();
  const toggleShowAnswer = (index: number) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[index].SHOW_ANSWER = !newData[index].SHOW_ANSWER;
      return newData;
    });
  };

  useEffect(() => {
    if (IsQuestionSelected && IsQuestionSelected.length > 0) {
      setChecked(IsQuestionSelected);
    }
    GetQuestions();
  }, []);
  const toggleChecked = (seqNo: number) => {
    if (checked.includes(seqNo)) {
      setChecked(checked.filter(item => item !== seqNo));
    } else {
      setChecked([...checked, seqNo]);
    }
  };

  function updateIsQuestionSelected(
    array: QUESTION_TYPE[],
    chapterId: number,
    questionType: string | number,
    newIsQuestionSelected: number[],
  ): QUESTION_TYPE[] {
    return array.map(item => {
      if (item.CHAPTER_ID === chapterId && item.QUESTIONS) {
        const updatedQuestions = item.QUESTIONS.map(question => {
          if (question.QUESTION_TYPE === questionType.toString()) {
            return {
              IS_QUESTION_SELECTED: newIsQuestionSelected,
              QUESTION_TYPE: question.QUESTION_TYPE,
              QUESTION_TYPE_NAME: question.QUESTION_TYPE_NAME,
              MARK_OF_QUESTION: question.MARK_OF_QUESTION,
              SELECTED_QUESTIONS: data.filter(item =>
                checked.includes(item.ID),
              ),
            };
          } else {
            return question;
          }
        });
        return updatedQuestions.length > 0
          ? {...item, QUESTIONS: updatedQuestions}
          : item;
      }
      return item;
    });
  }

  const GetQuestions = async () => {
    try {
      const res = await apiPost('api/question/get', {
        sortKey: 'SEQ_NO',
        sortValue: 'ASC',
        filter: `AND QUESTION_TYPE = ${questionTypeId} AND CHAPTER_ID =${ChapterId}`,
      });
      if (QUESTION_TYPEs == 1) {
        if (res && res.code === 200 && res.data && res.data.length > 0) {
          let combinedData = [];
          for (let i = 0; i < res.count; i++) {
            try {
              const ress = await apiPost('api/questionOptionsMapping/get', {
                sortKey: 'SEQ_NO',
                sortValue: 'ASC',
                filter: `AND QUESTION_ID = ${res.data[i].ID} `,
              });
              if (
                ress &&
                ress.code === 200 &&
                ress.data &&
                ress.data.length > 0
              ) {
                combinedData.push({
                  ...res.data[i],
                  QuestionOption: ress.data,
                  SHOW_ANSWER: false,
                });
              } else {
              }
            } catch (error) {
              console.warn(error);
            }
          }
          setloading(false);
          setData(combinedData);
        } else {
        }
      } else {
        setloading(false);
        let combinedData = [];

        for (let i = 0; i < res.count; i++) {
          combinedData.push({...res.data[i], SHOW_ANSWER: false});
        }
        setData(combinedData);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <Modal
      style={{flex: 1, margin: 0, borderRadius: 0, padding: 0}}
      onClose={() => {
        setModalVisible(false);
      }}
      isVisible={modalVisible}>
      <View style={{flex: 1, backgroundColor: Colors.QuestionPaperBackground}}>
        <Header
          onBack={() => {
            setModalVisible(false);
          }}
          label={ChapterItem.CHAPTER_NAME}
        />
        <View style={{margin: Sizes.Padding, flex: 1}}>
          <View style={{marginVertical: Sizes.Radius}}>
            <FlatList
              data={ChapterItem.QUESTIONS}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={{
                flexDirection: 'row',
                width: '100%',
              }}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedQuestionModal(true);
                    }}
                    style={{
                      padding: Sizes.Base,
                      borderRadius: Sizes.Radius,
                      backgroundColor: Colors.White,
                      flexDirection: 'row',
                      alignContent: 'center',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: Sizes.Width / 2 - Sizes.Base,
                    }}>
                    <Text
                      style={{
                        ...Fonts.Bold1,
                        fontSize: 14,
                        color: Colors.Black,
                      }}>{`${QUESTION_TYPEs} ${QuestionTypeName} `}</Text>

                    <Text
                      style={{
                        ...Fonts.Medium1,
                        fontSize: 14,
                        color: Colors.Black,
                        marginEnd: Sizes.Base,
                      }}>{`${
                      checked.length < 10
                        ? '0' + checked.length
                        : checked.length
                    } `}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          {/* <TouchableOpacity
            onPress={() => {
              setSelectedQuestionModal(true);
            }}
            style={{
              padding: Sizes.Base,
              borderRadius: Sizes.Radius,
              backgroundColor: Colors.White,
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                ...Fonts.Bold1,
                fontSize: 14,
                color: Colors.Black,
              }}>{`${QUESTION_TYPEs} ${QuestionTypeName} `}</Text>

            <Text
              style={{
                ...Fonts.Medium1,
                fontSize: 14,
                color: Colors.Black,
                marginEnd: Sizes.Base,
              }}>{`${
              checked.length < 10 ? '0' + checked.length : checked.length
            } `}</Text>
          </TouchableOpacity> */}

          <CheckedQuestionModal
            data={data.filter(item => checked.includes(item.ID))}
            setModalVisible={setSelectedQuestionModal}
            modalVisible={SelectedQuestionModal}
          />

          {loading ? (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size={'large'} color={Colors.Primary} />
            </View>
          ) : data.length == 0 ? (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image
                resizeMode={'contain'}
                style={{
                  width: 170,
                  height: 170,
                }}
                source={noData}
                tintColor={Colors.Primary}
              />
            </View>
          ) : (
            <View style={{flex: 1}}>
              <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      toggleChecked(item.ID);
                    }}
                    style={{
                      borderColor: Colors.Primary,
                      paddingVertical: Sizes.Base,
                      marginVertical: Sizes.Base,
                      borderRadius: Sizes.Radius,
                      backgroundColor: checked.includes(item.ID)
                        ? '#E0FFDF'
                        : Colors.White,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          ...Fonts.Medium1,
                          fontSize: 14,
                          color: Colors.Black,
                          textAlign: 'justify',
                          marginStart: Sizes.Padding,
                        }}>{`Q.${item.ID}  `}</Text>

                      <Text
                        style={{
                          ...Fonts.Medium1,
                          fontSize: 14,
                          color: Colors.Black,
                          flex: 1,
                        }}>{`${item.QUESTION} `}</Text>

                      {item.SHOW_ANSWER ? (
                        <Icon
                          style={{marginEnd: Sizes.Base}}
                          name="eye-off-outline"
                          type="Ionicons"
                          onPress={() => {
                            toggleShowAnswer(index);
                          }}
                        />
                      ) : (
                        <Icon
                          style={{marginEnd: Sizes.Base}}
                          name="eyeo"
                          type="AntDesign"
                          onPress={() => {
                            toggleShowAnswer(index);
                          }}
                        />
                      )}
                    </View>
                    {item.QUESTION_IMAGE ? (
                      <CheckImage
                        url={'questionImage/' + item.QUESTION_IMAGE}
                        style={{
                          height: 50,
                          width: 100,
                          borderRadius: Sizes.Radius,
                          resizeMode: 'contain',
                          marginStart: Sizes.ScreenPadding * 2,
                        }}
                      />
                    ) : null}
                    {item.SHOW_ANSWER ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                        }}>
                        <Text
                          style={{
                            ...Fonts.Medium1,
                            fontSize: 14,
                            color: Colors.Black,
                            marginStart: Sizes.Padding,
                          }}>{`Ans: `}</Text>
                        <Text
                          style={{
                            ...Fonts.Regular1,
                            fontSize: 14,
                            color: Colors.Black,
                            flex: 1,
                            marginStart: Sizes.Base,
                          }}>{`${item.ANSWER} `}</Text>
                        <View style={{width: Sizes.Padding}} />
                      </View>
                    ) : null}
                    {item.QuestionOption
                      ? item.QuestionOption.map((option, index) => (
                          <View
                            style={{
                              marginStart: Sizes.ScreenPadding,
                              flexDirection: 'row',
                              padding: Sizes.Base,
                              alignItems: 'center',
                            }}>
                            <CheckboxComponent
                              isChecked={
                                option.IS_CORRECT == 1 && item.SHOW_ANSWER
                                  ? true
                                  : false
                              }
                              style={{
                                marginEnd: Sizes.Base,
                                width: 13,
                                height: 13,
                              }}
                            />
                            <Text
                              style={{
                                ...Fonts.Regular1,
                                fontSize: 14,
                                color: Colors.Black,
                                textAlign: 'justify',
                              }}>
                              {`${option.OPTION_TEXT} .`}
                            </Text>
                            {option.OPTION_IMAGE_URL ? (
                              <CheckImage
                                url={'optionImage/' + option.OPTION_IMAGE_URL}
                                style={{
                                  height: 50,
                                  width: 100,
                                  borderRadius: Sizes.Radius,
                                  resizeMode: 'contain',
                                  marginStart: Sizes.ScreenPadding * 2,
                                }}
                              />
                            ) : null}
                          </View>
                        ))
                      : null}
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
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
              justifyContent: 'flex-end',
              flex: 1,
            }}>
            <View style={{width: Sizes.ScreenPadding}} />
            <TextButton
              style={{flex: 0.5}}
              label={'Add Questions'}
              onPress={() => {
                const newArray = updateIsQuestionSelected(
                  QUESTION_TYPE,
                  ChapterId,
                  QUESTION_TYPEs,
                  checked,
                );
                setAllData(newArray);
                // console.log('\n\n..newArray...', newArray[0].QUESTIONS[0].SELECTED_QUESTIONS);
                dispatch(Reducers.setQUESTION_TYPE(newArray));
                const filteredData = data.filter(item =>
                  checked.includes(item.ID),
                );
                setModalVisible(false);
              }}
              textStyle={{...Fonts.Bold2}}
              loading={false}
            />
          </View>
          <View style={{width: Sizes.Base}} />
        </View>
      </View>
    </Modal>
  );
};

export default SelectedQuestionModal;
