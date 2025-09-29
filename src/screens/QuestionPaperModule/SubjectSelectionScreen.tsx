import {
  View,
  Text,
  NativeModules,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Approved, QuestionPapar, Subject, noData} from '../../../assets';
import {Reducers, apiPost, useDispatch, useSelector} from '../../Modules';
import {Header} from '../../Components';
import {StackProps} from '../../routes';
import {SUBJECT_TEACHER_MASTER} from '../../Modules/interface';
import Animated, {BounceIn, BounceOut} from 'react-native-reanimated';
import {TOUCHABLE_STATE} from 'react-native-gesture-handler/lib/typescript/components/touchables/GenericTouchable';
import {setSUBJECT_SELECTED} from '../../Modules/Reducers/QuestionPaperType';
import {useTranslation} from 'react-i18next';
import {
  BOARD_SUBJECT_INTERFACE,
  GET_BOARD_CLASS,
} from '../../Modules/interface2';
import Dropdown from '../../Components/Dropdown';
import {BannerAds} from '../../Modules/AdsUtils';

type flatListProps = {
  item: BOARD_SUBJECT_INTERFACE;
  index: number;
};
type Props = StackProps<'SubjectSelectionScreen'>;
const SubjectSelectionScreen: React.FC<Props> = ({navigation}) => {
  const {t} = useTranslation();
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const dispatch = useDispatch();
  const {member} = useSelector(state => state.member);
  const [subject, setsubject] = useState<{
    data: BOARD_SUBJECT_INTERFACE[];
    loading: boolean;
  }>({data: [], loading: false});
  const [Class, setClass] = useState<{
    data: GET_BOARD_CLASS[];
    loading: boolean;
  }>({
    data: [],
    loading: true,
  });
  const [SelectedClass, setSelectedClass] = useState<GET_BOARD_CLASS>();

  useEffect(() => {
    GetAllClass();
  }, []);

  const GetAllSubject = async (Item: GET_BOARD_CLASS) => {
    try {
      const res = await apiPost('api/questionSubject/get', {
        filter: ` AND CLASS_ID = ${Item.ID} `,
      });
      if (res && res.code === 200 && res.data) {
        setsubject({data: res.data, loading: false});
      } else {
      }
    } catch (error) {
      console.warn(error);
    }
  };
  const GetAllClass = async () => {
    try {
      const res = await apiPost('api/questionPaperClass/get', {
        filter: ` AND BOARD_ID = ${member?.BOARD_ID}  `,
      });
      if (res && res.code === 200 && res.data && res.data.length > 0) {
        setClass({...Class, data: res.data, loading: false});
      } else {
      }
    } catch (error) {
      console.warn(error);
    }
  };

  // console.log(subject.data);
  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Header
        label={t('QuestionPaperModule.SubjectSelection')}
        onBack={() => {
          navigation.goBack();
        }}
      />
      {member?.IS_ERP_MAPPED == 1 ? (
        <View style={{flex: 1, padding: Sizes.Padding}}>
          <Dropdown
            value={SelectedClass}
            data={Class.data}
            onChange={item => {
              setSelectedClass(item);
              GetAllSubject(item);
            }}
            valueField="NAME"
            labelField="NAME"
            labelStyle={{color: Colors.Black, ...Fonts.Bold3}}
            label={t('QuestionPaperModule.selectClass')}
            placeholder={t('QuestionPaperModule.selectClass')}
            textStyle={{color: Colors.Black, ...Fonts.Regular3}}
          />
          <View style={{height: Sizes.Padding}} />
          {subject.loading ? (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size={'large'} color={Colors.Primary} />
            </View>
          ) : subject.data.length == 0 ? (
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
            <FlatList
              data={subject.data}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              numColumns={4}
              renderItem={({item, index}: flatListProps) => {
                return (
                  <Animated.View
                    entering={BounceIn.delay(500).duration(1500)}
                    exiting={BounceOut}
                    style={{flex: 1}}>
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(Reducers.setSUBJECT_SELECTED(item));
                        navigation.navigate('SubjectScreen');
                      }}
                      style={{
                        margin: Sizes.Base,
                        width: '100%',
                      }}>
                      <View
                        style={{
                          borderRadius: 60,
                          backgroundColor: Colors.Background,
                          width: 60,
                          height: 60,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Subject width={35} height={35} />
                      </View>
                      <View style={{height: Sizes.Base}} />
                      <Text
                        style={{
                          ...Fonts.Medium2,
                          fontSize: 13,
                          color: Colors.PrimaryText,
                        }}>{`${item.NAME}`}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              }}
            />
          )}
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
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
      <BannerAds />
    </View>
  );
};

export default SubjectSelectionScreen;
