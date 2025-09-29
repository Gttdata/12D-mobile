import {View, Text, FlatList, Image, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {apiPost, useSelector} from '../../../Modules';
import {useRoute} from '@react-navigation/native';
import {StackProps} from '../../../routes';
import {Header, TextButton, Toast} from '../../../Components';
import ModalPicker from '../../../Components/ModalPicker';
import QuestionCreationRenderItem from './QuestionCreationRenderItem';
import DropdownTextInput from '../../../Components/DropdownTextInput';
import {QUESTION_TYPE_WISE_LIST} from '../../../Modules/interface2';
import {Item} from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import {noData} from '../../../../assets';
import {useTranslation} from 'react-i18next';
type Props = StackProps<'QuestionTypeList'>;

const QuestionTypeList = ({navigation, route}: Props) => {
  const {isSelected} = route.params;
  const {t} = useTranslation();
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [loading, setLoading] = useState(true);
  const [OutOFQuestionArray, setOutOFQuestionArray] = useState([]);
  const [AskedQuestionArray, setOAskedQuestionArray] = useState([]);
  const {SUBJECT_SELECTED}: any = useSelector(state => state.QuestionPaperType);
  const [data, setData] = useState<QUESTION_TYPE_WISE_LIST[]>([]);
  const [SelectOutOf, setSelectOutOf] = useState({
    OUT_OF_QUESTIONS: '',
    ID: 0,
    OPEN_MODAL: false,
    SELECTED_QUESTIONS: 0,
  });
  const [AskedQuestions, setAskedQuestions] = useState({
    ASKED_QUESTIONS: 0,
    ID: 0,
    OPEN_MODAL_ASKED: false,
    SELECTED_QUESTIONS: 0,
  });

  const shuffleArray = (array: any[]) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };
  const getRandomSubset = (array: any[], count: number) => {
    return shuffleArray(array).slice(0, count);
  };
  const randomizeQuestions = (dataArray: QUESTION_TYPE_WISE_LIST[]) => {
    return dataArray.map(item => {
      if (item.OUT_OF_QUESTIONS > 0) {
        const shuffledQuestions = getRandomSubset(
          item.questions,
          item.OUT_OF_QUESTIONS,
        );
        return {
          ...item,
          questions: shuffledQuestions,
        };
      } else {
        return item;
      }
    });
  };

  const handleSelectOutOfQuestions = (
    OUT_OF_QUESTIONS: number,
    ID: number,
    SELECTED_QUESTIONS: number,
    WANT_TO_ASK_QUESTIONS: number,
  ) => {
    const updatedArray = Array.from({length: OUT_OF_QUESTIONS}, (_, index) => ({
      id: index + 1,
      ID: ID,
      SELECTED_QUESTIONS: SELECTED_QUESTIONS,
      OUT_OF_QUESTIONS: OUT_OF_QUESTIONS,
      WANT_TO_ASK_QUESTIONS: WANT_TO_ASK_QUESTIONS,
    }));
    setOutOFQuestionArray(updatedArray);
    setSelectOutOf(prevState => ({
      ...prevState,
      OPEN_MODAL: true,
      SELECTED_QUESTIONS: SELECTED_QUESTIONS,
    }));
  };
  const handleSelectAskedQuestions = (
    OUT_OF_QUESTIONS: number,
    ID: number,
    SELECTED_QUESTIONS: number,
    WANT_TO_ASK_QUESTIONS: number,
  ) => {
    const updatedArray = Array.from(
      {length: SELECTED_QUESTIONS > 0 ? SELECTED_QUESTIONS : OUT_OF_QUESTIONS},
      (_, index) => ({
        id: index + 1,
        ID: ID,
        SELECTED_QUESTIONS: WANT_TO_ASK_QUESTIONS,
        OUT_OF_QUESTIONS: OUT_OF_QUESTIONS,
      }),
    );
    setOAskedQuestionArray(updatedArray);
    setAskedQuestions(prevState => ({
      ...prevState,
      OPEN_MODAL_ASKED: true,
      ASKED_QUESTIONS: WANT_TO_ASK_QUESTIONS,
    }));
  };

  let datas = [
    {
      QUESTION_TYPE_NAME_MAIN: 'MCQ',
      QUESTION_TYPE_ID: '1',
      MARKS: '1',
      OUT_OF_QUESTION: '50',
      ASKED_QUESTIONS: '0',
      QUESTIONS: [
        {QUESTION_TYPE: '1', QUESTION_TYPE_NAME: 'What is H2O'},
        {QUESTION_TYPE: '2', QUESTION_TYPE_NAME: 'What Is This'},
        {QUESTION_TYPE: '3', QUESTION_TYPE_NAME: 'What is H2O'},
        {QUESTION_TYPE: '4', QUESTION_TYPE_NAME: 'What Is This'},
        {QUESTION_TYPE: '5', QUESTION_TYPE_NAME: 'What is H2O'},
      ],
    },
    {
      QUESTION_TYPE_NAME_MAIN: 'Fill in the blanks',
      MARKS: '3',
      QUESTION_TYPE_ID: '2',
      OUT_OF_QUESTION: '5',
      ASKED_QUESTIONS: '2',
      QUESTIONS: [
        {QUESTION_TYPE: '1', QUESTION_TYPE_NAME: 'What is H2O'},
        {QUESTION_TYPE: '2', QUESTION_TYPE_NAME: 'What Is This'},
        {QUESTION_TYPE: '3', QUESTION_TYPE_NAME: 'What is H2O'},
        {QUESTION_TYPE: '4', QUESTION_TYPE_NAME: 'What Is This'},
        {QUESTION_TYPE: '5', QUESTION_TYPE_NAME: 'What is H2O'},
      ],
    },
    {
      QUESTIONtYPE: 'Answer the Following questions',
      MARKS: '6',
      OUT_OF_QUESTION: '2',
      ASKED_QUESTIONS: '4',
      QUESTIONS: [
        {QUESTION_TYPE: '1', QUESTION_TYPE_NAME: 'What is H2O'},
        {QUESTION_TYPE: '2', QUESTION_TYPE_NAME: 'What Is This'},
        {QUESTION_TYPE: '3', QUESTION_TYPE_NAME: 'What is H2O'},
        {QUESTION_TYPE: '4', QUESTION_TYPE_NAME: 'What Is This'},
        {QUESTION_TYPE: '5', QUESTION_TYPE_NAME: 'What is H2O'},
        {QUESTION_TYPE: '6', QUESTION_TYPE_NAME: 'What is H2O'},
      ],
    },
  ];

  useEffect(() => {
    GetQuestionType();
  }, []);

  const GetQuestionType = async () => {
    try {
      const res = await apiPost('api/questionType/get', {});
      if (res.code === 200) {
        const {data, count} = res;
        const newArray = [];
        for (let i = 0; i < count; i++) {
          const currentItem = data[i];
          const {ID, LABEL} = currentItem;
          const resQues = await apiPost('api/question/get', {
            filter: `AND QUESTION_TYPE = ${ID} AND CHAPTER_ID IN (${isSelected})`,
          });
          if (
            resQues.code === 200 &&
            resQues.count > 0 &&
            resQues.data.length > 0
          ) {
            newArray.push({
              ID,
              OUT_OF_QUESTIONS: 0,
              WANT_TO_ASK_QUESTIONS: 0,
              LABEL,
              questions: resQues.data,
            });
          }
        }
        setData(newArray);
        setLoading(false);
      }
    } catch (error) {
      console.warn(error);
      setLoading(false);
    }
  };

  const QuestionsOutOf = async (
    id: number,
    Selected: number,
    WANT_TO_ASK_QUESTIONS: number,
  ) => {
    try {
      const updatedArray = data.map(item => ({
        ...item,
        OUT_OF_QUESTIONS: item.ID === id ? Selected : item.OUT_OF_QUESTIONS,
        WANT_TO_ASK_QUESTIONS:
          item.ID === id
            ? item.WANT_TO_ASK_QUESTIONS == 0
              ? Selected
              : item.WANT_TO_ASK_QUESTIONS > Selected
              ? Selected
              : item.WANT_TO_ASK_QUESTIONS
            : item.WANT_TO_ASK_QUESTIONS,
      }));
      setData(updatedArray);
      setSelectOutOf(prevState => ({
        ...prevState,
        OPEN_MODAL: false,
        SELECTED_QUESTIONS: Selected,
      }));
    } catch (error) {
      console.warn(error);
    }
  };
  const SELECT_ASKED = async (id: number, Selected: number) => {
    try {
      const updatedArray = data.map(item => ({
        ...item,
        WANT_TO_ASK_QUESTIONS: item.ID === id ? Selected : 0,
      }));
      setData(updatedArray);
      setAskedQuestions(prevState => ({
        ...prevState,
        OPEN_MODAL_ASKED: false,
        SELECTED_QUESTIONS: Selected,
      }));
    } catch (error) {
      console.warn(error);
    }
  };
  return (
    <View style={{flex: 1}}>
      <Header
        onBack={() => {
          navigation.goBack();
        }}
        label={SUBJECT_SELECTED.NAME}
      />
      <View
        style={{
          paddingHorizontal: Sizes.Padding,
          marginTop: Sizes.Base,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            ...Fonts.Medium1,
            color: Colors.Black,
            fontSize: 16,
          }}>{`Class - ${SUBJECT_SELECTED.NAME}`}</Text>
      </View>

      {loading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={'large'} color={Colors.Primary} />
        </View>
      ) : data.length == 0 ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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
        <FlatList
          data={data}
          keyExtractor={item => item.ID.toString()}
          renderItem={({item}) => (
            <QuestionCreationRenderItem
              item={item}
              SelectOutOfQuestion={handleSelectOutOfQuestions}
              SelectAskedQuestion={handleSelectAskedQuestions}
            />
          )}
        />
      )}
      <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
        <View style={{width: 150, margin: Sizes.Padding}}>
          <TextButton
            label={t('QuestionPaperModule.export')}
            onPress={() => {
              const updatedData = randomizeQuestions(data);
              const filteredData: QUESTION_TYPE_WISE_LIST[] =
                updatedData.filter(item => item.OUT_OF_QUESTIONS > 0);
              if (filteredData.length > 0) {
                navigation.navigate('ExportPdf', {
                  Item: filteredData,
                  Type: 2,
                });
              } else {
                Toast(t('QuestionPaperModule.PleaseSelectAtLeastOneQuestion'));
              }
            }}
            textStyle={{...Fonts.Bold2}}
            loading={false}
          />
        </View>
      </View>

      {SelectOutOf.OPEN_MODAL ? (
        <DropdownTextInput
          visible={SelectOutOf.OPEN_MODAL}
          onClose={() => {
            setSelectOutOf(prevState => ({...prevState, OPEN_MODAL: false}));
          }}
          value={SelectOutOf.SELECTED_QUESTIONS}
          disable
          onChange={item => {
            QuestionsOutOf(item.ID, item.id, item.WANT_TO_ASK_QUESTIONS);
          }}
          labelField={'id'}
          label="id"
          data={OutOFQuestionArray}
        />
      ) : null}
      {AskedQuestions.OPEN_MODAL_ASKED ? (
        <DropdownTextInput
          visible={AskedQuestions.OPEN_MODAL_ASKED}
          onClose={() => {
            setAskedQuestions(prevState => ({
              ...prevState,
              OPEN_MODAL_ASKED: false,
            }));
          }}
          value={AskedQuestions.ASKED_QUESTIONS}
          disable
          onChange={item => {
            SELECT_ASKED(item.ID, item.id);
          }}
          labelField={'id'}
          label="id"
          data={AskedQuestionArray}
        />
      ) : null}
    </View>
  );
};

export default QuestionTypeList;
