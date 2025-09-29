import {
  View,
  Text,
  FlatList,
  FlatListProps,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Reducers, apiPost, useDispatch, useSelector} from '../../../Modules';
import {useTranslation} from 'react-i18next';
import {Header, Toast} from '../../../Components';
import {StackProps} from '../../../routes';
import {
  BOARD_SUBJECT_INTERFACE,
  GET_BOARD_CLASS,
} from '../../../Modules/interface2';
import Animated, {BounceIn, BounceOut} from 'react-native-reanimated';
import Dropdown from '../../../Components/Dropdown';
import {Subject, SubjectSelection, noData} from '../../../../assets';
import {Item} from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import LinearGradient from 'react-native-linear-gradient';
type Props = StackProps<'ChildrenClassSection'>;
type flatListProps = {
  item: BOARD_SUBJECT_INTERFACE;
  index: number;
};
const ChildrenClassSection = ({navigation}: Props): JSX.Element => {
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
  const GetAllClass = async () => {
    try {
      const res = await apiPost('api/questionPaperClass/get', {
        filter: ` AND BOARD_ID = ${member?.BOARD_ID}  `,
      });

      if (res && res.code === 200 && res.data && res.data.length > 0) {
        // Assuming you want to handle the first element in the array

        setClass({...Class, data: res.data, loading: false});
      } else {
      }
    } catch (error) {
      console.warn(error);
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Header
        label={t('QuestionPaperModule.selectClass')}
        onBack={() => {
          navigation.goBack();
        }}
      />

      <View
        style={{
          flex: 1,
          paddingHorizontal: Sizes.Padding,
          marginTop: Sizes.Base,
        }}>
        {member?.IS_ERP_MAPPED == 1 ? (
          <View style={{flex: 1}}>
            {Class.loading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ActivityIndicator size={'large'} color={Colors.Primary} />
              </View>
            ) : Class.data.length == 0 ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
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
                data={Class.data}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}: any) => {
                  const gradients = [
                    ['#b1cfa7', '#b1cfa7'], // Pastel Green
                    ['#f49d9d', '#f49d9d'], // Light Coral
                    ['#cbf188', '#cbf188'],

                    ['#9f9ee2', '#9f9ee2'], // Lavender
                    ['#e595cd', '#e595cd'], // Light Pink
                    // Light Green
                    ['#71c8d5', '#71c8d5'], // Light Blue
                    ['#e9de0d', '#e9de0d'],
                  ];
                  const gradient = gradients[index % gradients.length];

                  return (
                    <LinearGradient
                      colors={gradient}
                      style={{
                        paddingHorizontal: Sizes.Padding,
                        paddingVertical: Sizes.Base,
                        borderRadius: Sizes.Radius,
                        backgroundColor: Colors.Background,
                        marginVertical: Sizes.Base,
                      }}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          setSelectedClass(item);
                          navigation.navigate('ChildrenSubjectSelection', {
                            item: item,
                          });
                        }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <View>
                          <Image
                            source={SubjectSelection}
                            style={{
                              height: 35,
                              width: 35,
                            }}
                          />
                        </View>
                        <View
                          style={{
                            flex: 1,
                            marginLeft: Sizes.ScreenPadding,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              ...Fonts.Regular2,
                              color: Colors.Black,
                            }}>
                            {`Class : ${item.NAME}`}
                          </Text>
                          {/* <Text
                          style={{
                            ...Fonts.Medium2,
                            color: Colors.Black,
                            // marginLeft: Sizes.Padding,
                          }}>
                          {`Div : ${item.DIVISION_NAME}`}
                        </Text> */}
                        </View>
                      </TouchableOpacity>
                    </LinearGradient>
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
      </View>
    </View>
  );
};

export default ChildrenClassSection;
