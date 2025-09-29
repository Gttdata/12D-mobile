import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import {apiPost, Reducers, useDispatch, useSelector} from '../../Modules';
import {Header, Icon, Modal, TextButton} from '../../Components';
import {QUESTION_SERIES, QUESTION_TYPE} from '../../Modules/interface';
import {noData} from '../../../assets';
import CheckImage from '../../Components/CheckImage';
import CheckboxComponent from '../../Components/CheckboxComponent';

interface SelectedQuestionModalProps {
  visible: boolean;
  onClose: () => void;
  selectedChapterItem: any;
  setAllData: any;
}
const SelectChapterQueModal: React.FC<SelectedQuestionModalProps> = ({
  visible,
  onClose,
  selectedChapterItem,
  setAllData,
}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [checkedMcq, setCheckedMcq] = useState<number[]>([]);
  const [checkedDescriptive, setCheckedDescriptive] = useState<number[]>([]);
  const dispatch = useDispatch();
  const [questionType, setQuestionType] = useState({
    id: selectedChapterItem.QUESTIONS[0].QUESTION_TYPE,
    name: selectedChapterItem.QUESTIONS[0].QUESTION_TYPE_NAME,
  });
  const [questionData, setQuestionData] = useState<QUESTION_SERIES[]>([]);
  const [allQuestionData, setAllQuestionData] = useState<QUESTION_SERIES[]>([]);
  const [loading, setLoading] = useState(true);
  const {QUESTION_TYPE}: any = useSelector(state => state.QuestionPaperType);
  useEffect(() => {
    if (selectedChapterItem && selectedChapterItem.QUESTIONS) {
      selectedChapterItem.QUESTIONS.map((question: any) => {
        if (
          question.QUESTION_TYPE_NAME === 'MCQ' &&
          question.IS_QUESTION_SELECTED &&
          question.IS_QUESTION_SELECTED.length > 0
        ) {
          setCheckedMcq(question.IS_QUESTION_SELECTED);
        }
        if (
          question.QUESTION_TYPE_NAME === 'DESCRIPITIVE' &&
          question.IS_QUESTION_SELECTED &&
          question.IS_QUESTION_SELECTED.length > 0
        ) {
          setCheckedDescriptive(question.IS_QUESTION_SELECTED);
        }
      });
      getAllQuestions();
      getQuestionsAnswers(questionType.id);
    }
  }, [selectedChapterItem]);

  const getAllQuestions = async () => {
    try {
      const res = await apiPost('api/question/get', {
        sortKey: 'SEQ_NO',
        sortValue: 'ASC',
        filter: ` AND CHAPTER_ID = ${selectedChapterItem.CHAPTER_ID} `,
      });
      if (res && res.code === 200 && res.data && res.data.length > 0) {
        let combinedData = [];
        const mcqQuestion = res.data.filter(
          (item: any) => item.QUESTION_TYPE == 1,
        );
        const descQuestion = res.data.filter(
          (item: any) => item.QUESTION_TYPE == 2,
        );
        if (mcqQuestion.length > 0) {
          for (let i = 0; i < mcqQuestion.length; i++) {
            try {
              const res1 = await apiPost('api/questionOptionsMapping/get', {
                sortKey: 'SEQ_NO',
                sortValue: 'ASC',
                filter: `AND QUESTION_ID = ${mcqQuestion[i].ID} `,
              });
              if (
                res1 &&
                res1.code === 200 &&
                res1.data &&
                res1.data.length > 0
              ) {
                combinedData.push({
                  ...mcqQuestion[i],
                  QuestionOption: res1.data,
                  SHOW_ANSWER: false,
                });
              }
            } catch (error) {
              console.warn(error);
            }
          }
        }
        if (descQuestion.length > 0) {
          for (let i = 0; i < descQuestion.length; i++) {
            combinedData.push({...descQuestion[i], SHOW_ANSWER: false});
          }
        }
        setAllQuestionData(combinedData);
      }
    } catch (error) {
      console.warn(error);
    }
  };
  const getQuestionsAnswers = async (queId: number) => {
    setLoading(true);
    try {
      const res = await apiPost('api/question/get', {
        sortKey: 'SEQ_NO',
        sortValue: 'ASC',
        filter: `AND QUESTION_TYPE = ${queId} AND CHAPTER_ID =${selectedChapterItem.CHAPTER_ID}`,
      });
      if (queId == 1) {
        if (res && res.code === 200 && res.data && res.data.length > 0) {
          // console.log('\n\n..res...', res);
          let combinedData = [];
          for (let i = 0; i < res.count; i++) {
            try {
              const res1 = await apiPost('api/questionOptionsMapping/get', {
                sortKey: 'SEQ_NO',
                sortValue: 'ASC',
                filter: `AND QUESTION_ID = ${res.data[i].ID} `,
              });
              if (
                res1 &&
                res1.code === 200 &&
                res1.data &&
                res1.data.length > 0
              ) {
                combinedData.push({
                  ...res.data[i],
                  QuestionOption: res1.data,
                  SHOW_ANSWER: false,
                });
              } else {
              }
            } catch (error) {
              console.warn(error);
            }
          }
          setQuestionData(combinedData);
          setLoading(false);
        } else {
        }
      } else {
        let combinedData = [];
        for (let i = 0; i < res.count; i++) {
          combinedData.push({...res.data[i], SHOW_ANSWER: false});
        }
        setQuestionData(combinedData);
        setLoading(false);
      }
    } catch (error) {
      console.warn(error);
    }
  };
  const toggleShowAnswer = (index: number) => {
    setQuestionData(prevData => {
      const newData = [...prevData];
      newData[index].SHOW_ANSWER = !newData[index].SHOW_ANSWER;
      return newData;
    });
  };
  const toggleChecked = (seqNo: number) => {
    if (checkedMcq.includes(seqNo)) {
      setCheckedMcq(checkedMcq.filter(item => item !== seqNo));
    } else {
      setCheckedMcq([...checkedMcq, seqNo]);
    }
  };
  const toggleDescChecked = (seqNo: number) => {
    if (checkedDescriptive.includes(seqNo)) {
      setCheckedDescriptive(checkedDescriptive.filter(item => item !== seqNo));
    } else {
      setCheckedDescriptive([...checkedDescriptive, seqNo]);
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
              SELECTED_QUESTIONS: allQuestionData.filter(item =>
                newIsQuestionSelected.includes(item.ID),
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

  return (
    <Modal
      style={{flex: 1, margin: 0, borderRadius: 0, padding: 0}}
      onClose={onClose}
      isVisible={visible}>
      <View style={{flex: 1, backgroundColor: Colors.QuestionPaperBackground}}>
        <Header
          onBack={() => {
            onClose();
          }}
          label={selectedChapterItem.CHAPTER_NAME}
        />
        <View style={{margin: Sizes.Padding, flex: 1}}>
          <View
            style={{
              marginBottom: Sizes.Radius,
              marginHorizontal: -4,
              marginTop: Sizes.Base,
            }}>
            <FlatList
              data={selectedChapterItem.QUESTIONS}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={{
                flexDirection: 'row',
                width: '100%',
              }}
              renderItem={({item, index}) => {
                const itemWidth =
                  selectedChapterItem.QUESTIONS.length > 1
                    ? (Sizes.Width - Sizes.ScreenPadding * 2) / 2
                    : Sizes.Width - Sizes.ScreenPadding * 2;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setQuestionType({
                        ...questionType,
                        id: parseInt(item.QUESTION_TYPE),
                        name: item.QUESTION_TYPE_NAME,
                      });
                      getQuestionsAnswers(parseInt(item.QUESTION_TYPE));
                    }}
                    style={{
                      padding: Sizes.Base,
                      borderRadius: Sizes.Radius,
                      backgroundColor:
                        questionType.id == item.QUESTION_TYPE
                          ? Colors.Secondary
                          : Colors.White,
                      flexDirection: 'row',
                      alignContent: 'center',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: itemWidth,
                      marginHorizontal: Sizes.Base / 2,
                    }}>
                    <Text
                      style={{
                        ...Fonts.Bold1,
                        fontSize: 14,
                        color: Colors.Black,
                      }}>{` ${item.QUESTION_TYPE_NAME} `}</Text>

                    <Text
                      style={{
                        ...Fonts.Medium1,
                        fontSize: 14,
                        color: Colors.Black,
                        marginEnd: Sizes.Base,
                        textAlign: 'right',
                      }}>
                      {item.QUESTION_TYPE_NAME == 'MCQ'
                        ? `${
                            checkedMcq.length < 10
                              ? '0' + checkedMcq.length
                              : checkedMcq.length
                          } `
                        : `${
                            checkedDescriptive.length < 10
                              ? '0' + checkedDescriptive.length
                              : checkedDescriptive.length
                          } `}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {loading ? (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size={'large'} color={Colors.Primary} />
            </View>
          ) : questionData.length == 0 ? (
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
                data={questionData}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        questionType.name == 'MCQ'
                          ? toggleChecked(item.ID)
                          : toggleDescChecked(item.ID);
                      }}
                      style={{
                        borderColor: Colors.Primary,
                        paddingVertical: Sizes.Base,
                        marginVertical: Sizes.Base,
                        borderRadius: Sizes.Radius,
                        backgroundColor:
                          questionType.name == 'MCQ'
                            ? checkedMcq.includes(item.ID)
                              ? '#E0FFDF'
                              : Colors.White
                            : checkedDescriptive.includes(item.ID)
                            ? '#E0FFDF'
                            : Colors.White,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        {/* <Text
                          style={{
                            ...Fonts.Medium1,
                            fontSize: 14,
                            color: Colors.Black,
                            textAlign: 'justify',
                            marginStart: Sizes.Padding,
                          }}>{`Q.${item.ID}  `}</Text> */}

                        <Text
                          style={{
                            ...Fonts.Medium1,
                            fontSize: 14,
                            color: Colors.Black,
                            flex: 1,
                            marginStart: Sizes.Padding,
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
                      {item.SHOW_ANSWER && item.QuestionOption
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
                  );
                }}
              />
            </View>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <View style={{width: Sizes.ScreenPadding}} />
            <TextButton
              style={{flex: 0.5}}
              label={'Add Questions'}
              onPress={() => {
                if (selectedChapterItem && selectedChapterItem.QUESTIONS) {
                  let newArray = QUESTION_TYPE;
                  // console.log(
                  //   '\n\n...checkedMcq..',
                  //   QUESTION_TYPE[0].QUESTIONS,
                  // );

                  selectedChapterItem.QUESTIONS.forEach((question: any) => {
                    if (question.QUESTION_TYPE_NAME === 'MCQ') {
                      newArray = updateIsQuestionSelected(
                        newArray,
                        selectedChapterItem.CHAPTER_ID,
                        question.QUESTION_TYPE,
                        checkedMcq,
                      );
                      setAllData(newArray);
                      dispatch(Reducers.setQUESTION_TYPE(newArray));
                    }

                    if (question.QUESTION_TYPE_NAME === 'DESCRIPITIVE') {
                      newArray = updateIsQuestionSelected(
                        newArray,
                        selectedChapterItem.CHAPTER_ID,
                        question.QUESTION_TYPE,
                        checkedDescriptive,
                      );
                      setAllData(newArray);
                      dispatch(Reducers.setQUESTION_TYPE(newArray));
                    }
                  });
                  // console.log(
                  //   '\n\n...newArray..111...',
                  //   newArray[0].QUESTIONS[0].SELECTED_QUESTIONS,
                  // );
                  const filteredData = questionData.filter(item =>
                    checkedMcq.includes(item.ID),
                  );
                }
                onClose();
              }}
              textStyle={{...Fonts.Bold2}}
              loading={false}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SelectChapterQueModal;
