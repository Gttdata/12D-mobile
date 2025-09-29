import { View, Text, ActivityIndicator, FlatList, Image, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { apiPost, Reducers, useDispatch, useSelector } from '../../Modules';
import { Header, TextButton, Toast } from '../../Components';
import { StackProps } from '../../routes';
import { GET_BOARD_CLASS } from '../../Modules/interface2';
import Dropdown from '../../Components/Dropdown';
import Animated, { BounceIn, BounceOut } from 'react-native-reanimated';
import { noData, Subject } from '../../../assets';
import { QUESTION_TYPE } from '../../Modules/interface';
import SelectChapterQueModal from './SelectChapterQueModal';

type Props = StackProps<'ClassSelectionScreen'>;
const ClassSelectionScreen = ({ navigation }: Props) => {
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const dispatch = useDispatch();
  const { member } = useSelector(state => state.member);
  const { QUESTION_TYPE }: any = useSelector(state => state.QuestionPaperType);
  useEffect(() => {
    getAllClass();
  }, []);
  const [data, setData] = useState({
    class: [],
    subject: [],
    loading: false,
  });
  const [chapterData, setChapterData] = useState<QUESTION_TYPE[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>({
    class: {},
    subject: {},
  });
  const [selectedChapterData, setSelectedChapterData] = useState({});
  const [openModal, setOpenModal] = useState({
    chapterQuestion: false,
    exportButtonLoader: false,
  });
  const getAllClass = async () => {
    try {
      const res = await apiPost('api/questionPaperClass/get', {
        filter: ` AND BOARD_ID = ${member?.BOARD_ID}  `,
      });
      if (res && res.code === 200 && res.data && res.data.length > 0) {
        setData({ ...data, class: res.data, loading: false });
      } else {
      }
    } catch (error) {
      console.warn(error);
    }
  };
  const getAllSubject = async (item: GET_BOARD_CLASS) => {
    try {
      const res = await apiPost('api/questionSubject/get', {
        filter: ` AND CLASS_ID = ${item.ID} `,
      });
      if (res && res.code === 200 && res.data) {
        setChapterData([]);
        setSelectedItem({ ...selectedItem, class: item, subject: {} });
        setData({ ...data, subject: res.data, loading: false });
      } else {
      }
    } catch (error) {
      console.warn(error);
    }
  };
  const getAllChapterList = async (item: any) => {
    setData({ ...data, loading: true });
    let combinedData = [];
    try {
      const res = await apiPost('api/chapter/get', {
        filter: `AND SUBJECT_ID = ${item.ID}`,
      });
      if (res && res.code === 200 && res.data && res.data.length > 0) {
        for (let i = 0; i < res.count; i++) {
          try {
            const res1 = await apiPost('api/question/getChapterList', {
              filter: `AND SUBJECT_ID = ${item.ID} AND CHAPTER_ID =  ${res.data[i].ID} `,
            });
            if (res1 && res1.code === 200) {
              if (res1.data && res1.data.length > 0) {
                const questionsArray = JSON.parse(res1.data[0]?.QUESTION_TYPES);
                const sortedQuestions = questionsArray.sort(
                  (a: any, b: any) =>
                    a.QUESTION_TYPE_SEQ_NO - b.QUESTION_TYPE_SEQ_NO,
                );
                const checkData = {
                  CHAPTER_ID: res1.data[0].CHAPTER_ID,
                  CHAPTER_NAME: res1.data[0].CHAPTER_NAME,
                  QUESTION_COUNT: res1.data[0].QUESTION_COUNT,
                  QUESTIONS: sortedQuestions?.map((question: any) => ({
                    QUESTION_TYPE: question.QUESTION_TYPE.toString(),
                    QUESTION_TYPE_NAME: question.QUESTION_TYPE_NAME,
                    IS_QUESTION_SELECTED: [],
                    MARK_OF_QUESTION: '0',
                    SELECTED_QUESTIONS: [],
                  })),
                };
                combinedData.push(checkData);
              } else {
                const checkData = {
                  CHAPTER_ID: res.data[i].ID,
                  CHAPTER_NAME: res.data[i].NAME,
                  QUESTION_COUNT: 0,
                  QUESTIONS: [],
                };
                combinedData.push(checkData);
              }
            }
          } catch (error) {
            console.warn(error);
          }
        }
        dispatch(Reducers.setQUESTION_TYPE(combinedData));
        setChapterData(combinedData);
        setData({ ...data, loading: false });
      } else {
        dispatch(Reducers.setQUESTION_TYPE([]));
        setChapterData([]);
        setData({ ...data, loading: false });
      }
    } catch (error) {
      console.warn(error);
    }
  };
  const getChapterList = async (item: any) => {
    setData({ ...data, loading: true });
    try {
      const res = await apiPost('api/question/getChapterList', {
        sortKey: 'QUESTION_TYPE_SEQ_NO',
        sortValue: 'ASC',
        filter: `AND SUBJECT_ID = ${item.ID} AND CHAPTER_ID = 24 `,
      });
      if (res && res.code === 200 && res.data && res.data.length > 0) {
        const checkData = res.data.map((data: any) => {
          const questionsArray = JSON.parse(data?.QUESTION_TYPES);
          const sortedQuestions = questionsArray.sort(
            (a: any, b: any) => a.QUESTION_TYPE_SEQ_NO - b.QUESTION_TYPE_SEQ_NO,
          );
          return {
            CHAPTER_ID: data.CHAPTER_ID,
            CHAPTER_NAME: data.CHAPTER_NAME,
            QUESTION_COUNT: data.QUESTION_COUNT,
            QUESTIONS: sortedQuestions?.map((question: any) => ({
              QUESTION_TYPE: question.QUESTION_TYPE.toString(),
              QUESTION_TYPE_NAME: question.QUESTION_TYPE_NAME,
              IS_QUESTION_SELECTED: [],
              MARK_OF_QUESTION: '0',
              SELECTED_QUESTIONS: [],
            })),
          };
        });
        dispatch(Reducers.setQUESTION_TYPE(checkData));
        setChapterData(checkData);
        setData({ ...data, loading: false });
      } else {
        dispatch(Reducers.setQUESTION_TYPE([]));
        setChapterData([]);
        setData({ ...data, loading: false });
      }
    } catch (error) {
      console.warn(error);
    }
  };
  const GetSelectedType = async (Items: any[]) => {
    let questionTypeMap: any = {};
    Items.forEach(chapter => {
      chapter.SELECTED_QUESTIONS.forEach(
        (question: { QUESTION_TYPE_NAME: any; QUESTION_TYPE: any }) => {
          const questionTypeName = question.QUESTION_TYPE_NAME;
          const type = question.QUESTION_TYPE;
          if (!questionTypeMap.hasOwnProperty(questionTypeName)) {
            questionTypeMap[questionTypeName] = [];
          }
          questionTypeMap[questionTypeName].push({
            question,
            questionTypeName,
            type,
          });
        },
      );
    });
    const organizedQuestions: any = {};
    Object.entries(questionTypeMap).forEach(([typeName, questions]) => {
      questions.forEach(({ questionTypeName, type, ...rest }) => {
        if (!organizedQuestions[questionTypeName]) {
          organizedQuestions[questionTypeName] = [];
        }
        organizedQuestions[questionTypeName].push({
          ...rest,
          type,
          questionTypeName,
        });
      });
    });
    setOpenModal({ ...openModal, exportButtonLoader: false });
    navigation.navigate('ExportPdf', { Item: organizedQuestions, Type: 1 });
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.White }}>
      <Header
        label={'Class Subject Selection'}
        onBack={() => {
          navigation.goBack();
        }}
      />
      {member?.IS_ERP_MAPPED == 1 ? (
        <View
          style={{
            flex: 1,
            marginVertical: Sizes.Padding,
            marginHorizontal: Sizes.Radius,
          }}>
          <View
            style={{
              flex: 1,
              marginHorizontal: Sizes.Base,
              marginTop: Sizes.Base,
            }}>
            <Dropdown
              data={data.class}
              value={selectedItem.class}
              onChange={item => {
                getAllSubject(item);
              }}
              valueField="NAME"
              labelField="NAME"
              labelStyle={{ color: Colors.Black, ...Fonts.Bold3 }}
              label={'Select Class'}
              placeholder={'Select Class'}
              textStyle={{ color: Colors.Black, ...Fonts.Regular3 }}
            />
            <View style={{ height: Sizes.Padding }} />
            <Dropdown
              data={data.subject}
              value={selectedItem.subject}
              onChange={item => {
                setSelectedItem({ ...selectedItem, subject: item });
                dispatch(Reducers.setSUBJECT_SELECTED(item));
                getAllChapterList(item);
              }}
              valueField="NAME"
              labelField="NAME"
              labelStyle={{ color: Colors.Black, ...Fonts.Bold3 }}
              label={'Select Subject'}
              placeholder={'Select Subject'}
              textStyle={{ color: Colors.Black, ...Fonts.Regular3 }}
            />
            {data.loading ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: Sizes.Header * 2,
                }}>
                <ActivityIndicator size={'small'} color={Colors.Primary} />
              </View>
            ) : chapterData.length == 0 ? (
              <View style={{ alignItems: 'center', marginTop: Sizes.Header * 2 }}>
                <Image
                  source={noData}
                  style={{ height: 150, width: 170, tintColor: Colors.Primary }}
                />
              </View>
            ) : (
              <View
                style={{
                  marginHorizontal: -Sizes.Base,
                  marginVertical: Sizes.Padding,
                  marginBottom: 145,
                }}>
                <FlatList
                  data={chapterData}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={2}
                  renderItem={({
                    item,
                    index,
                  }: {
                    item: QUESTION_TYPE;
                    index: number;
                  }) => {
                    return (
                      <Animated.View
                        entering={BounceIn.delay(500).duration(800)}>
                        <View
                          style={{
                            padding: Sizes.Radius,
                            borderRadius: Sizes.Radius,
                            borderWidth: 1,
                            borderColor: Colors.Primary,
                            margin: Sizes.Base,
                          }}>
                          <View style={{ alignItems: 'center' }}>
                            <Subject width={55} height={50} />
                          </View>
                          <Text
                            style={{
                              ...Fonts.Medium4,
                              color: Colors.Black,
                              textAlign: 'center',
                              marginTop: 5,
                            }}>{`${item.CHAPTER_NAME}`}</Text>
                          <Text
                            style={{
                              ...Fonts.Medium4,
                              fontSize: 12,
                              color: Colors.PrimaryText1,
                              textAlign: 'left',
                              marginTop: Sizes.Base,
                            }}>
                            {`Total Questions - ${item.QUESTION_COUNT ? item.QUESTION_COUNT : 0
                              }`}
                          </Text>
                          <Text
                            style={{
                              ...Fonts.Medium4,
                              fontSize: 12,
                              color: Colors.PrimaryText1,
                              textAlign: 'left',
                              marginTop: 3,
                            }}>
                            {`Selected Ques. - ${(item.QUESTIONS[0]?.IS_QUESTION_SELECTED
                              ?.length || 0) +
                              (item.QUESTIONS[1]?.IS_QUESTION_SELECTED
                                ?.length || 0)
                              }`}
                          </Text>
                          <Text
                            onPress={() => {
                              item.QUESTION_COUNT == 0
                                ? Toast(
                                  'No questions available for this chapter. Please add questions before selecting.',
                                )
                                : (setSelectedChapterData(item),
                                  setOpenModal({
                                    ...openModal,
                                    chapterQuestion: true,
                                  }));
                            }}
                            style={{
                              ...Fonts.Medium2,
                              color: Colors.Primary,
                              textAlign: 'center',
                              marginTop: Sizes.Radius,
                            }}>
                            {`Select`}
                          </Text>
                        </View>
                      </Animated.View>
                    );
                  }}
                />
              </View>
            )}
          </View>

          <View
            style={{ flexDirection: 'row', paddingHorizontal: Sizes.Padding }}>
            <View
              style={{
                flex: 1,
              }}>
              <TextButton
                label="Add Questions"
                loading={false}
                onPress={() => {
                  if (!selectedItem.class.ID) {
                    Toast('Please select any class');
                  } else if (!selectedItem.subject.ID) {
                    Toast('Please select any subject');
                  } else {
                    navigation.navigate('AddQuestion');
                  }
                }}
              />
            </View>
            <View style={{ width: Sizes.Padding }} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                flex: 1,
              }}>
              <TextButton
                style={{}}
                label={'Export'}
                onPress={() => {
                  const newData = chapterData.flatMap(chapter => {
                    if (chapter.QUESTIONS) {
                      const filteredQuestions = chapter.QUESTIONS.filter(
                        question => question.IS_QUESTION_SELECTED.length > 0,
                      );
                      if (filteredQuestions.length > 0) {
                        const selectedQuestions = filteredQuestions.flatMap(
                          question => question.SELECTED_QUESTIONS,
                        );
                        return [
                          {
                            SELECTED_QUESTIONS: selectedQuestions,
                          },
                        ];
                      }
                    }
                    return [];
                  });
                  // console.log('n\n..chapterData...', chapterData[0].QUESTIONS);
                  if (newData.length == 0) {
                    Toast('Please select the questions from chapters');
                    return true;
                  } else {
                    setOpenModal({ ...openModal, exportButtonLoader: true });
                    GetSelectedType(newData);
                  }
                }}
                textStyle={{ ...Fonts.Bold2 }}
                loading={openModal.exportButtonLoader}
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text
            style={{
              textAlign: 'center',
              color: Colors.Primary,
              ...Fonts.Bold2,
            }}>
            Sorry, you are not eligible to access this functionality.
          </Text>
        </View>
      )}

      {openModal.chapterQuestion && (
        <SelectChapterQueModal
          visible={openModal.chapterQuestion}
          onClose={() => {
            setOpenModal({ ...openModal, chapterQuestion: false });
          }}
          selectedChapterItem={selectedChapterData}
          setAllData={setChapterData}
        />
      )}
    </SafeAreaView>
  );
};

export default ClassSelectionScreen;
