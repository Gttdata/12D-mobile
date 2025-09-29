import {View, Text, FlatList, ActivityIndicator, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {apiPost, useSelector} from '../../../Modules';
import {Header, TextButton, Toast} from '../../../Components';
import CreatePaperRenderItem from '../CustomPaper/CustomPaperRenderItem';
import {CHAPTER_LIST} from '../../../Modules/interface';
import CreateQuestionsRenderItem from './CustomPaperRenderItem';
import {StackProps} from '../../../routes';
import {useTranslation} from 'react-i18next';
import {noData} from '../../../../assets';
type Props = StackProps<'CreateQuestionPapers'>;

const CreateQuestionPapers: React.FC<Props> = ({navigation, route}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<CHAPTER_LIST[]>([]);
  const [isSelected, setIsSelected] = useState<number[]>([]);
  const {SUBJECT_SELECTED}: any = useSelector(state => state.QuestionPaperType);

  useEffect(() => {
    GetQuestionType();
  }, []);

  const GetQuestionType = async () => {
    try {
      const res = await apiPost('api/question/getChapterList', {
        sortKey: 'CHAPTER_ID',
        sortValue: 'ASC',
        filter: `AND SUBJECT_ID = ${SUBJECT_SELECTED.ID}`,
      });
      if (res && res.code === 200 && res.data && res.data.length > 0) {
        setLoading(false);
        setData(res.data);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.warn(error);
    }
  };
  const handleSelectChapter = (chapterId: number) => {
    if (isSelected.includes(chapterId)) {
      setIsSelected(isSelected.filter(id => id !== chapterId));
    } else {
      setIsSelected([...isSelected, chapterId]);
    }
  };
  const {t} = useTranslation();

  return (
    <View style={{flex: 1}}>
      <Header
        onBack={() => {
          navigation.goBack();
        }}
        label={t('QuestionPaperModule.RandomQustionPaper')}
      />

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
          keyExtractor={item => item.CHAPTER_ID.toString()}
          renderItem={({item}) => (
            <CreateQuestionsRenderItem
              SelectChap={handleSelectChapter}
              isSelected={isSelected}
              item={item}
            />
          )}
        />
      )}
      <View style={{flex: 1}} />
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
            label={t('QuestionPaperModule.Next')}
            onPress={() => {
              if (isSelected.length > 0) {
                navigation.navigate('QuestionTypeList', {
                  isSelected: isSelected,
                });
              } else {
                Toast('Please Select Topics');
              }
            }}
            textStyle={{...Fonts.Bold2}}
            loading={false}
          />
        </View>
        <View style={{width: Sizes.Base}} />
      </View>
    </View>
  );
};

export default CreateQuestionPapers;
