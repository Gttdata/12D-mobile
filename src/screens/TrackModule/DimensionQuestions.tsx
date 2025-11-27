import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Reducers, apiPost, useDispatch, useSelector } from '../../Modules';
import { Header, Icon, TextButton, TextInput, Toast } from '../../Components';
import {
  TRACK_BOOK_QUESTION_INTERFACE,
  TRACK_BOOK_QUESTION_OPTION_INTERFACE,
} from '../../Modules/interface';
import { StackProps } from '../../routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { noData } from '../../../assets';
// @ts-ignore
import StarRating from 'react-native-star-rating';
import { Checkbox, RadioButton } from 'react-native-paper';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = StackProps<'DimensionQuestions'>;
const DimensionQuestions = ({ navigation, route }: Props) => {
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const { itemData, call, headID } = route.params;
  const [question, setQuestion] = useState<TRACK_BOOK_QUESTION_INTERFACE[]>([]);
  const [questionOption, setQuestionOption] = useState<
    TRACK_BOOK_QUESTION_INTERFACE[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState(null);
  // Added for Search Bar
  const [search, setSearch] = useState<string>('');
  const searchHeight = useSharedValue(0);

  const { selectedDimensionOptionData, selectedDimensionYesOptions } =
    useSelector(state => state.dimensionQuestion);
  const dispatch = useDispatch();
  const [mainText, bracketText] = itemData.NAME.split('(');
  useEffect(() => {
    getQuestions();
  }, []);
  const getQuestions = async () => {

    const ageGroup = await AsyncStorage.getItem('AgeGroup');


    try {
      const res = await apiPost('api/questionary/get', {
        filter: ` AND STATUS = 1 AND IS_COMMON = 0 AND QUESTION_HEAD_ID = ${headID.ID ? headID.ID : 0
          } AND DIAMENTION_ID = ${itemData.ID} AND AGE_GROUP = ${ageGroup} `,
        sortValue: 'ASC',
        sortKey: 'SEQ_NO',
      });
      // console.log("AGE GROUP",res.data);

      if (res && res.code == 200) {
        if (res.data.length > 0) {
          setQuestion(res.data);
          await Promise.all(
            res.data.map((item: TRACK_BOOK_QUESTION_INTERFACE) =>
              item.IS_CHILD_AVAILABLE == 0
                ? getQuestionsOption(item)
                : Promise.resolve(),
            ),
          );
          setLoading(false);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('error..', error);
    }
  };
  const getQuestionsOption = async (item: TRACK_BOOK_QUESTION_INTERFACE) => {
    let ID_KEY = item.ID;
    try {
      const res = await apiPost('api/questionaryOptions/get', {
        filter: ` AND QUESTION_ID = ${item.ID} AND STATUS = 1 `,
      });
      console.log("QUESTIONARY GET", res.data);

      if (res && res.code == 200) {
        // console.log('\n\n\n\n...option res......', res);
        setQuestionOption((prevData: any) => [
          ...prevData,
          { [ID_KEY]: res.data },
        ]);
        // setOption(true);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('err..', error);
    }
  };
  const saveAllData = async () => {
    try {
      if (selectedDimensionOptionData.length == 0) {
        Toast('Select question');
      } else {
        await AsyncStorage.setItem('STAGE_NAME', 'DimensionQuestions');
        await AsyncStorage.setItem(
          'DIMENSION_OPTIONS',
          JSON.stringify(selectedDimensionOptionData),
        );
        navigation.navigate('SelectTaskType');
      }
    } catch (error) {
      console.log('error..', error);
    }
  };
  const skipQuestion = async (item: TRACK_BOOK_QUESTION_INTERFACE) => {
    try {
      const res = await apiPost('api/questionaryOptions/get', {
        filter: ` AND STATUS = 1 AND QUESTION_ID = ${item.ID} `,
      });
      if (res && res.code == 200) {
        if (res.data.length > 0) {
          dispatch(Reducers.setSelectedDimensionNoOptions(res.data));
        }
      }
    } catch (error) { }
  };
  const handleYesOptionSelect = (
    question: TRACK_BOOK_QUESTION_OPTION_INTERFACE,
    optionKey: string,
  ) => {
    dispatch(
      Reducers.setSelectedDimensionYesOptions({ item: question, optionKey }),
    );
  };
  const handleStarRatingSelect = (rate: number, questionId: number) => {
    const question: any = questionOption.find((q: any) => q[questionId]);
    if (question) {
      const options = question[questionId];
      const filteredOptions = options.filter((item: any) => item.RANGES != '');
      const bounds = filteredOptions.map((item: any) =>
        item.RANGES.split(' - ').map(Number),
      );
      const lowerBound = bounds.map((item: any) => item[0]);
      const upperBound = bounds.map((item: any) => item[1]);

      let rangeIndex = -1;
      for (let i = 0; i < lowerBound.length; i++) {
        if (rate >= lowerBound[i] && rate <= upperBound[i]) {
          rangeIndex = i;
          break;
        }
      }

      if (rangeIndex !== -1) {
        const selectedRange = {
          ...filteredOptions[rangeIndex],
          STAR_RATING_COUNT: rate,
        };

        setSelectedRange(selectedRange);
        dispatch(Reducers.setSelectedDimensionOptionData(selectedRange));
      }
    }
  };
  const renderedQuestions = useMemo<TRACK_BOOK_QUESTION_INTERFACE[]>(() => {
    const searchLower = search.toLowerCase();
    return question.filter(
      questions =>
        questions.LABEL.toLowerCase().includes(searchLower) ||
        questions.DESCRIPTION.toLowerCase().includes(searchLower),
    );
  }, [question, search]);
  const searchStyle = useAnimatedStyle(() => {
    return {
      marginTop: Sizes.ScreenPadding,
      height: searchHeight.value,
      overflow: 'hidden',
      opacity: interpolate(
        searchHeight.value,
        [0, 40 + Sizes.ScreenPadding],
        [0, 1],
      ),
    };
  });
  return (
    <View style={{ flex: 1, backgroundColor: '#E4F3FF' }}>
      <Header
        label={`${mainText}Questionnaire`}
        onBack={() => {
          navigation.goBack();
        }}
        rightChild={
          <Icon
            name="search"
            type="Feather"
            color={Colors.Background}
            onPress={() => {
              if (searchHeight.value == 0) {
                searchHeight.value = withTiming(40 + Sizes.ScreenPadding, {
                  duration: 500,
                });
              } else {
                searchHeight.value = withTiming(0, { duration: 500 });
              }
            }}
          />
        }
      />
      <View
        style={{
          flex: 1,
          marginHorizontal: Sizes.Padding,
        }}>
        {loading ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size={'small'} color={Colors.Primary} />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
            }}>
            <View
              style={{
                flex: 1,
                marginBottom: Sizes.ScreenPadding,
              }}>
              <Animated.View style={searchStyle}>
                <TextInput
                  onChangeText={txt => {
                    setSearch(txt);
                  }}
                  value={search}
                  placeholder="Search.."
                  rightChild={
                    search ? (
                      <Icon
                        name="close"
                        type="AntDesign"
                        style={{ marginRight: Sizes.Padding }}
                        onPress={() => setSearch(``)}
                      />
                    ) : null
                  }
                  autoFocus={false}
                />
              </Animated.View>
              <FlatList
                data={search ? renderedQuestions : question}
                ItemSeparatorComponent={() => (
                  <View style={{ height: Sizes.Base }} />
                )}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({
                  item,
                  index,
                }: {
                  item: TRACK_BOOK_QUESTION_INTERFACE;
                  index: number;
                }) => {
                  const isNoOptionSelected = selectedDimensionOptionData.some(
                    it => it.QUESTION_ID === item.ID,
                  );
                  const matchingItem: any = selectedDimensionOptionData.find(
                    it => it.QUESTION_ID === item.ID,
                  );
                  return (
                    <View key={item.ID}>
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: Colors.White,
                          elevation: Sizes.Base,
                          shadowColor: Colors.Primary,
                          padding: Sizes.Padding,
                          margin: 3,
                          borderRadius: Sizes.Base,
                          marginBottom: Sizes.Base,
                          paddingBottom: Sizes.ScreenPadding,
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => { }}
                          style={{
                            flex: 1,
                            shadowColor: Colors.Primary,
                            borderRadius: Sizes.Base,
                            marginBottom: Sizes.Radius,
                          }}>
                          <Text
                            style={{
                              flex: 1,
                              ...Fonts.Medium4,
                              fontSize: 13,
                              color: Colors.PrimaryText1,
                            }}>
                            {item.LABEL}
                          </Text>
                          <Text
                            style={{
                              flex: 1,
                              ...Fonts.Medium3,
                              fontSize: 11,
                              color: Colors.PrimaryText2,
                            }}>
                            {item.DESCRIPTION}
                          </Text>
                        </TouchableOpacity>
                        {item.IS_CHILD_AVAILABLE == 0 ? (
                          questionOption.map((it, index) => {
                            const keyName = Object.keys(it)[0];
                            const data = Object.values(it)[0];
                            // @ts-ignore
                            if (keyName == item.ID) {
                              return (
                                data.length > 0 &&
                                (data[0].QUESTION_TYPE == 3 ? (
                                  <View
                                    key={`index_${index}`}
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <View style={{ flex: 1 }}>
                                      <StarRating
                                        starSize={28}
                                        emptyStarColor={'#f6c324'}
                                        fullStarColor={'#F6C324'}
                                        disabled={false}
                                        maxStars={10}
                                        rating={
                                          matchingItem
                                            ? matchingItem.STAR_RATING_COUNT
                                            : 0
                                        }
                                        selectedStar={(rate: any) => {
                                          handleStarRatingSelect(rate, item.ID);
                                        }}
                                      />
                                    </View>
                                  </View>
                                ) : (
                                  data.map(
                                    (
                                      ite: TRACK_BOOK_QUESTION_OPTION_INTERFACE,
                                      index: number,
                                    ) => {
                                      const isSelected =
                                        selectedDimensionOptionData.some(
                                          it =>
                                            it.QUESTION_ID ===
                                            ite.QUESTION_ID &&
                                            it.ID === ite.ID,
                                        );
                                      const count =
                                        selectedDimensionOptionData.some(
                                          it =>
                                            it.QUESTION_ID ===
                                            ite.QUESTION_ID &&
                                            it.ID === ite.ID,
                                        );

                                      return (
                                        <View key={index}>
                                          <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {
                                              dispatch(
                                                Reducers.setSelectedDimensionOptionData(
                                                  ite,
                                                ),
                                              );
                                            }}
                                            style={{
                                              flex: 1,
                                              backgroundColor: isSelected
                                                ? Colors.Secondary
                                                : Colors.Background,
                                              elevation: 2,
                                              shadowColor: Colors.Primary,
                                              padding: Sizes.Base,
                                              paddingVertical: Sizes.Radius,
                                              borderRadius: Sizes.ScreenPadding,
                                              margin: 3,
                                              flexDirection: 'row',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                            }}>
                                            {ite.QUESTION_TYPE == 1 ? (
                                              <View
                                                style={{
                                                  transform: [{ scale: 0.8 }],
                                                  marginVertical: -Sizes.Radius,
                                                }}>
                                                <RadioButton
                                                  value={''}
                                                  uncheckedColor={
                                                    Colors.PrimaryText
                                                  }
                                                  color={Colors.Primary}
                                                  onPress={() => {
                                                    dispatch(
                                                      Reducers.setSelectedDimensionOptionData(
                                                        ite,
                                                      ),
                                                    );
                                                  }}
                                                  status={
                                                    isSelected
                                                      ? 'checked'
                                                      : 'unchecked'
                                                  }
                                                />
                                              </View>
                                            ) : (
                                              <View
                                                style={{
                                                  transform: [{ scale: 0.8 }],
                                                  marginVertical: -Sizes.Radius,
                                                }}>
                                                <Checkbox
                                                  uncheckedColor={
                                                    Colors.PrimaryText
                                                  }
                                                  color={Colors.Primary}
                                                  onPress={() => {
                                                    dispatch(
                                                      Reducers.setSelectedDimensionOptionData(
                                                        ite,
                                                      ),
                                                    );
                                                  }}
                                                  status={
                                                    isSelected
                                                      ? 'checked'
                                                      : 'unchecked'
                                                  }
                                                />
                                              </View>
                                            )}
                                            <Text
                                              style={{
                                                flex: 1,
                                                ...Fonts.Medium3,
                                                color: Colors.PrimaryText1,
                                                textAlign: 'justify',
                                                paddingLeft: Sizes.Radius,
                                              }}>
                                              {ite.LABEL}
                                            </Text>
                                          </TouchableOpacity>
                                        </View>
                                      );
                                    },
                                  )
                                ))
                              );
                            }
                            return null;
                          })
                        ) : (
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              justifyContent: 'center',
                            }}>
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => {
                                handleYesOptionSelect(item, 'No');
                                skipQuestion(item);
                              }}
                              style={{
                                backgroundColor: isNoOptionSelected
                                  ? Colors.Secondary
                                  : Colors.Background,
                                elevation: 5,
                                borderColor: Colors.Primary,
                                borderRadius: Sizes.ScreenPadding,
                                padding: 5,
                                width: 90,
                                justifyContent: 'flex-start',
                              }}>
                              <Text
                                style={{
                                  color: Colors.Primary,
                                  ...Fonts.Medium2,
                                  textAlign: 'center',
                                }}>
                                No
                              </Text>
                            </TouchableOpacity>
                            <View style={{ width: Sizes.Radius }} />
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => {
                                handleYesOptionSelect(item, 'Yes');
                                dispatch(
                                  Reducers.setSelectedDimensionNoOptions([
                                    item,
                                  ]),
                                );
                                item.IS_CHILD_AVAILABLE == 1
                                  ? navigation.push('DimensionQuestions', {
                                    itemData,
                                    call: 'Q',
                                    headID: item,
                                  })
                                  : navigation.push('DimensionQuestions', {
                                    itemData,
                                    call: 'O',
                                    headID: item,
                                  });
                              }}
                              style={{
                                backgroundColor:
                                  selectedDimensionYesOptions[item.ID] === 'Yes'
                                    ? Colors.Secondary
                                    : Colors.Background,
                                padding: 5,
                                borderRadius: Sizes.ScreenPadding,
                                width: 90,
                                justifyContent: 'flex-start',
                                elevation: 5,
                                borderColor: Colors.Primary,
                              }}>
                              <Text
                                style={{
                                  color: Colors.Primary,
                                  ...Fonts.Medium2,
                                  textAlign: 'center',
                                }}>
                                Yes
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                }}
                ListEmptyComponent={
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: Sizes.ScreenPadding * 2,
                    }}>
                    <Image
                      resizeMode={'contain'}
                      style={{
                        width: 160,
                        height: 160,
                      }}
                      source={noData}
                      tintColor={Colors.Primary}
                    />
                  </View>
                }
                contentContainerStyle={{
                  // marginTop: Sizes.ScreenPadding,
                  paddingBottom: Sizes.ScreenPadding,
                }}
              />
            </View>
            {!headID.ID && (
              <View style={{ flexDirection: 'row' }}>
                {/* <TextButton
                  isBorder
                  label="Select From another"
                  loading={false}
                  onPress={() => {
                    navigation.goBack();
                  }}
                  style={{marginBottom: Sizes.Padding, flex: 1}}
                /> */}
                <View style={{ width: Sizes.Radius }} />
                <TextButton
                  label="Done"
                  loading={false}
                  onPress={() => {
                    saveAllData();
                  }}
                  style={{ marginBottom: Sizes.Padding, flex: 1 }}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { padding: 16 },
  dropdown: {
    height: 50,
    backgroundColor: 'transparent',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  selectedStyle: {
    borderRadius: 12,
  },
});
export default DimensionQuestions;
