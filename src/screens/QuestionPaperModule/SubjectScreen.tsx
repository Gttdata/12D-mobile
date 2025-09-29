import {
  View,
  Text,
  NativeModules,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Approved, QuestionPapar} from '../../../assets';
import {Reducers, apiPost, useDispatch, useSelector} from '../../Modules';
import {Header, Modal, Toast} from '../../Components';
import {StackProps} from '../../routes';
import {useTranslation} from 'react-i18next';

type Props = StackProps<'Dashboard'>;
const SubjectScreen: React.FC<Props> = ({navigation}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const dispatch = useDispatch();
  const [loader, SetLoader] = useState<boolean>(false);
  const [IsData, SetIsData] = useState<boolean>(false);
  const {SUBJECT_SELECTED}: any = useSelector(state => state.QuestionPaperType);

  useEffect(() => {
    GetQuestionType();
  }, []);

  const GetQuestionType = async () => {
    try {
      const res = await apiPost('api/question/getChapterList', {
        sortKey: 'QUESTION_TYPE_SEQ_NO',
        sortValue: 'ASC',
        filter: `AND SUBJECT_ID = ${SUBJECT_SELECTED.ID}`,
      });
      if (res && res.code === 200 && res.data && res.data.length > 0) {
        const checkData = res.data.map((data: any) => {
          const questionsArray = JSON.parse(data.QUESTION_TYPES);
          const sortedQuestions = questionsArray.sort(
            (a: any, b: any) => a.QUESTION_TYPE_SEQ_NO - b.QUESTION_TYPE_SEQ_NO,
          );
          return {
            CHAPTER_ID: data.CHAPTER_ID,
            CHAPTER_NAME: data.CHAPTER_NAME,
            QUESTIONS: sortedQuestions.map((question: any) => ({
              QUESTION_TYPE: question.QUESTION_TYPE.toString(),
              QUESTION_TYPE_NAME: question.QUESTION_TYPE_NAME,
              IS_QUESTION_SELECTED: [],
              MARK_OF_QUESTION: '0',
              SELECTED_QUESTIONS: [],
            })),
          };
        });
        dispatch(Reducers.setQUESTION_TYPE(checkData));
        SetLoader(false);
        SetIsData(true);
      } else {
        dispatch(Reducers.setQUESTION_TYPE([]));
        SetIsData(false);
      }
    } catch (error) {
      console.warn(error);
    }
  };
  const {t} = useTranslation();

  return (
    <View style={{flex: 1, backgroundColor: Colors.QuestionPaperBackground}}>
      <Header
        label={SUBJECT_SELECTED.NAME}
        onBack={() => {
          navigation.goBack();
        }}
      />
      {loader ? <Loader /> : null}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CustomPaper');
        }}
        style={{
          flexDirection: 'row',
          margin: Sizes.Padding,
          padding: Sizes.Padding,
          justifyContent: 'space-around',
          borderRadius: Sizes.Radius,
          backgroundColor: Colors.White,
        }}>
        <View style={{flexDirection: 'column', flex: 1}}>
          <Text
            style={{
              ...Fonts.Bold2,
              fontSize: 16,
              color: Colors.Black,
            }}>
            {t('QuestionPaperModule.customPaper')}
          </Text>

          <Text
            style={{
              ...Fonts.Regular2,
              fontSize: 14,
              color: Colors.Black,
            }}>
            {t('QuestionPaperModule.CreatePapersAccordingToYourBluePrint')}
          </Text>
        </View>

        <View style={{justifyContent: 'center'}}>
          <QuestionPapar width={50} height={80} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SubjectScreen;

const Loader = () => {
  const {Colors, Sizes} = useSelector(state => state.app);
  return (
    <Modal
      isVisible={true}
      onClose={() => {}}
      style={{padding: Sizes.ScreenPadding * 2}}
      containerStyle={{alignItems: 'center'}}>
      <ActivityIndicator size={'large'} color={Colors.Primary} />
    </Modal>
  );
};
