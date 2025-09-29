import {
  View,
  Text,
  FlatList,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackProps} from '../../../routes';
import CustomPaperRenderItem from './CustomPaperRenderItem';
import {Header, Modal, TextButton, Toast} from '../../../Components';
import {apiPost, useSelector} from '../../../Modules';
import {
  QUESTIONS,
  QUESTION_SERIES,
  QUESTION_TYPE,
  QuestionOption,
} from '../../../Modules/interface';
import SelectedQuestionModal from './SelecteQuetionModal';
import {noData} from '../../../../assets';
import {useTranslation} from 'react-i18next';
import TitleComponent from '../../../Components/TitleComponent';

interface QuestionDetails {
  ANSWER: string;
  ANSWER_IMAGE: string | null;
  ARCHIVE_FLAG: string;
  CHAPTER_ID: number;
  CHAPTER_NAME: string;
  CLASS_ID: number;
  CLIENT_ID: number;
  CREATED_MODIFIED_DATE: string;
  DESCRIPTION: string | null;
  ID: number;
  MARKS: number;
  QUESTION: string;
  QUESTION_IMAGE: string | null;
  QUESTION_TYPE: number;
  QUESTION_TYPE_NAME: string;
  QUESTION_TYPE_SEQ_NO: number;
  READ_ONLY: string;
  SEQ_NO: number;
  STATUS: number;
  QuestionOption: QuestionOption[];
}
type Props = StackProps<'CustomPaper'>;
const CustomPaper: React.FC<Props> = ({navigation, route}) => {
  const {t} = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [pdfPath, setPdfPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [ButtonLoader, setButtonLoader] = useState(false);
  const [QuestionType, setQuestionType] = useState<number>();
  const [QuestionTypeName, setQuestionTypeName] = useState<string>('');
  const [IsQuestionSelected, setIsQuestionSelected] = useState<number[]>([]);
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [data, setData] = useState<QUESTION_TYPE[]>([]);
  const [isSelected, setIsSelected] = useState<number | null>(null);
  const [selectedChapterItem, setSelectedChapterItem] = useState({});
  const {
    QUESTION_TYPE,
    QUESTION_SERIES,
    QUESTIONS_SELECTED,
    SUBJECT_SELECTED,
  }: any = useSelector(state => state.QuestionPaperType);
  const GetSelectedType = async (Items: any[]) => {
    let questionTypeMap: any = {};
    Items.forEach(chapter => {
      chapter.SELECTED_QUESTIONS.forEach(
        (question: {QUESTION_TYPE_NAME: any; QUESTION_TYPE: any}) => {
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
      questions.forEach(({questionTypeName, type, ...rest}) => {
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
    setButtonLoader(false);
    navigation.navigate('ExportPdf', {Item: organizedQuestions, Type: 1});
  };
  useEffect(() => {
    GetQuestionType();
  }, []);
  useEffect(() => {
    if (!modalVisible) {
      setIsQuestionSelected([]);
    }
  }, []);

  const GetQuestionType = async () => {
    setData(QUESTION_TYPE);
  };
  return (
    <View style={{flex: 1}}>
      <Header
        onBack={() => {
          navigation.goBack();
        }}
        label={SUBJECT_SELECTED.NAME}
      />
      <View style={{flex: 1, margin: Sizes.Padding}}>
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
              keyExtractor={item => item.CHAPTER_ID.toString()}
              renderItem={({item}) => (
                <CustomPaperRenderItem
                  setModalVisible={setModalVisible}
                  setQuestionType={setQuestionType}
                  setQuestionTypeName={setQuestionTypeName}
                  setIsQuestionSelected={setIsQuestionSelected}
                  SelectChap={selectedId => {
                    if (selectedId == isSelected) {
                      setIsSelected(0);
                    } else {
                      setIsSelected(selectedId);
                    }
                  }}
                  SelectChapItem={(item: any) => {
                    setQuestionType(parseInt(item.QUESTIONS[0].QUESTION_TYPE));
                    setQuestionTypeName(item.QUESTIONS[0].QUESTION_TYPE_NAME);
                    setSelectedChapterItem(item);
                  }}
                  isSelected={isSelected}
                  item={item}
                />
              )}
            />
          </View>
        )}
        {modalVisible ? (
          <SelectedQuestionModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            QUESTION_TYPEs={QuestionType}
            QuestionTypeName={QuestionTypeName}
            ChapterId={isSelected}
            ChapterItem={selectedChapterItem}
            setAllData={setData}
            IsQuestionSelected={IsQuestionSelected}
          />
        ) : null}
      </View>
      <View style={{flexDirection: 'row', padding: Sizes.Padding}}>
        <View
          style={{
            flex: 1,
          }}>
          <TextButton
            label="Add Questions"
            loading={false}
            onPress={() => {
              navigation.navigate('AddQuestion');
            }}
          />
        </View>
        <View style={{width: Sizes.Padding}} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            flex: 1,
          }}>
          <TextButton
            style={{}}
            label={t('QuestionPaperModule.export')}
            onPress={() => {
              const newData = data.flatMap(chapter => {
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
              if (newData.length == 0) {
                Toast('Please Select The Questions');
                return true;
              }
              setButtonLoader(true);
              GetSelectedType(newData);
            }}
            textStyle={{...Fonts.Bold2}}
            loading={ButtonLoader}
          />
        </View>
      </View>
    </View>
  );
};

export default CustomPaper;
