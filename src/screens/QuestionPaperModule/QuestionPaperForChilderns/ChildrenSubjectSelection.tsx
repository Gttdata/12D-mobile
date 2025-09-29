import {
  View,
  Text,
  ActivityIndicator,
  Image,
  FlatList,
  TouchableOpacity,
  FlatListProps,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Reducers, apiPost, useDispatch, useSelector} from '../../../Modules';
import {
  BOARD_SUBJECT_INTERFACE,
  GET_BOARD_CLASS,
} from '../../../Modules/interface2';
import {Header} from '../../../Components';
import {StackProps} from '../../../routes';
import Dropdown from '../../../Components/Dropdown';
import {Subject, noData} from '../../../../assets';
import Animated, {BounceIn, BounceOut} from 'react-native-reanimated';
type Props = StackProps<'ChildrenSubjectSelection'>;
type flatListProp = {
  item: BOARD_SUBJECT_INTERFACE;
  index: number;
};
const ChildrenSubjectSelection = ({navigation, route}: Props): JSX.Element => {
  const Item = route.params.item;

  console.log('item:', Item);

  const {t} = useTranslation();

  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const dispatch = useDispatch();
  const {member} = useSelector(state => state.member);
  const [subject, setsubject] = useState<{
    data: BOARD_SUBJECT_INTERFACE[];
    loading: boolean;
  }>({data: [], loading: false});

  useEffect(() => {
    GetAllSubject();
  }, []);

  const GetAllSubject = async () => {
    try {
      const res = await apiPost('api/questionSubject/get', {
        filter: ` AND CLASS_ID = ${Item.ID} `,
        // filter: ` AND BOARD_ID = ${Item.BOARD_ID} `,
        // filter: ` AND BOARD_ID = ${Item.BOARD_ID}  AND ID = ${Item.ID} `,
      });

      if (res && res.code === 200 && res.data) {
        // Assuming you want to handle the first element in the array

        setsubject({data: res.data, loading: false});
      } else {
      }
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Header
        label={t('QuestionPaperModule.SubjectSelection')}
        onBack={() => {
          navigation.goBack();
        }}
      />

      <View style={{flex: 1, padding: Sizes.Padding}}>
        {/* <Dropdown
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
          /> */}
        {/* <Dropdown
        value={Medim.}
        data={Class.data}
        onChange={item => {
          setClass({...Class, Item: item});

         

          GetMedim();
        }}
        valueField="NAME"
        labelField="NAME"
        labelStyle={{color: Colors.Black, ...Fonts.Bold3}}
        label="Select Class"
        textStyle={{color: Colors.Black, ...Fonts.Regular3}}
      /> */}

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
            renderItem={({item, index}: flatListProp) => {
              return (
                <Animated.View
                  entering={BounceIn.delay(500).duration(1500)}
                  exiting={BounceOut}
                  style={{flex: 1}}>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(Reducers.setSUBJECT_SELECTED(item));

                      navigation.navigate('ExamDetails');
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
                        justifyContent: 'center', // Center the content vertically
                        alignItems: 'center', // Center the content horizontally
                      }}>
                      <Subject width={35} height={35} />
                    </View>
                    <View style={{height: Sizes.Base}} />

                    <Text>{`${item.NAME}`}</Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

export default ChildrenSubjectSelection;
