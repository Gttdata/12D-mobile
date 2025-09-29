import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  ActivityIndicator,
  Image,
  BackHandler,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {apiPost, useSelector} from '../../Modules';
import {Header, TextButton, Toast} from '../../Components';
import {StackProps} from '../../routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';

import {
  TRACK_BOOK_QUESTION_INTERFACE,
  TRACK_BOOK_QUESTION_OPTION_INTERFACE,
} from '../../Modules/interface';
import {noData} from '../../../assets';
import PurchaseSubscriptionModal from '../../Components/PurchaseSubscriptionModal';
import {isSubscriptionActive} from '../../Functions';
import {useFocusEffect} from '@react-navigation/native';

type Props = StackProps<'TrackBookQuestions'>;
const TrackBookQuestions = ({navigation, route}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {member} = useSelector(state => state.member);
  const [questionOptions, setQuestionOptions] = useState([]);
  const [question, setQuestion] = useState<TRACK_BOOK_QUESTION_INTERFACE[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const isLastQuestion = currentQuestionIndex === question.length - 1;
  const [rightAnimation, setRightAnimation] = useState(false);
  const [leftAnimation, setLeftAnimation] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState([]);
  const purchase = !isSubscriptionActive() ? true : false;
  const [openPurchaseModal, setOpenPurchaseModal] = useState(purchase);
  

  useEffect(() => {
  
    const backAction = () => {
      navigation.navigate('Dashboard');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  const onSelectOption = (option: string) => {
    if (question[currentQuestionIndex].QUESTION_TYPE === 1) {
      const updatedOptions = [...selectedOptions];
      updatedOptions[currentQuestionIndex] = option;
      setSelectedOptions(updatedOptions);
    } else if (question[currentQuestionIndex].QUESTION_TYPE === 2) {
      setSelectedOptions((prevSelectedOptions: any) => {
        const updatedOptions = [
          ...(prevSelectedOptions[currentQuestionIndex] || []),
        ];
        const index = updatedOptions.findIndex(item => item === option);
        if (index === -1) {
          updatedOptions.push(option);
        } else {
          updatedOptions.splice(index, 1);
        }
        return {
          ...prevSelectedOptions,
          [currentQuestionIndex]: updatedOptions,
        };
      });
    } else if (question[currentQuestionIndex].QUESTION_TYPE === 3) {
      const updatedOptions = [...selectedOptions];
      updatedOptions[currentQuestionIndex] = option;
      setSelectedOptions(updatedOptions);
    }
  };
  const onNextQuestion = () => {
    if (currentQuestionIndex < question.length - 1) {
      if (selectedOptions[currentQuestionIndex] == undefined) {
        Toast('Please select any option');
        return;
      }
      getQuestionsOption(question[currentQuestionIndex + 1]);
      setLeftAnimation(false);
      setRightAnimation(true);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
    }
  };
  const onPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setLeftAnimation(true);
      setRightAnimation(true);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  const slideAnimRight = new Animated.Value(leftAnimation ? -1000 : 1000);
  const slideInRight = () => {
    Animated.timing(slideAnimRight, {
      toValue: 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    setRightAnimation(false);
  };
  useEffect(() => {
    slideInRight();
  }, [rightAnimation, !loading]);
  useFocusEffect(
    React.useCallback(() => {
      getQuestions();
    }, [navigation]),
  );
  const getUserSubscriptionDetails = async () => {
    setLoading(true);
    try {
      const res = await apiPost('api/userSubscription/get', {
        filter: `AND USER_ID=${member?.ID}`,
      });
      if (res && res.code == 200) {
        if (res.count <= 0) {
          Toast('no plan');
        } else {
          setSubscriptionPlan(res.data);
          getQuestions();
        }
      }
    } catch (error) {
      console.log('error..', error);
    }
  };


  const getQuestions = async () => {
    const ageGroup = await AsyncStorage.getItem('AgeGroup');
    try {
      const res = await apiPost('api/questionary/get', {
        filter: ` AND IS_COMMON = 1 AND STATUS = 1 AND AGE_GROUP = ${ageGroup}  `,
      });
      console.log('res..', res);

      if (res && res.code == 200) {
        console.log('res..', res);
        setQuestion(res.data);
        if (res.data.length > 0) {
          getQuestionsOption(res.data[0]);
        } else {
          setOpenPurchaseModal(false);
          setLoading(false);
          navigation.navigate('Dimensions');
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('err..//', error);
    }
  };
  const getQuestionsOption = async (item: TRACK_BOOK_QUESTION_INTERFACE) => {
    setLoading(true);
    try {
      const res = await apiPost('api/questionaryOptions/get', {
        filter: ` AND QUESTION_ID = ${item.ID} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        setQuestionOptions(res.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('err..', error);
    }
  };
  const saveAllData = async () => {
    // const isAllQuestionsAnswered = question.every((question, index) => {
    //   const selectedOption = selectedOptions[index];
    //   const questionOption: any = questionOptions[index];
    //   return (
    //     selectedOption &&
    //     selectedOption.length > 0 &&
    //     questionOption.includes(selectedOption)
    //   );
    // });
    // if (!isAllQuestionsAnswered) {
    //   Toast(
    //     'Please select at least one option for each question before saving.',
    //   );
    //   return;
    // }
    if (selectedOptions[currentQuestionIndex] == undefined) {
      Toast('Please select any option');
      return;
    }
    try {
      const dataArray = [];
      for (const key in selectedOptions) {
        const value = selectedOptions[key];
        if (Array.isArray(value)) {
          dataArray.push(...value);
        } else {
          dataArray.push(value);
        }
      }
      await AsyncStorage.setItem('STAGE_NAME', '6-Questions');
      await AsyncStorage.setItem('OPTIONS', JSON.stringify(dataArray));
      const data = await AsyncStorage.getItem('OPTIONS');
      // console.log('Selected Options///:', data);
      setCurrentQuestionIndex(0);
      setQuestion([]);
      setQuestionOptions([]);
      setSelectedOptions([]);
      navigation.navigate('Dimensions');
    } catch (error) {
      console.log('Error storing data:', error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      {!loading && (
        <Header
          label="TrackBook Questionnaire"
          onBack={() => {
            navigation.navigate('Dashboard');
          }}
        />
      )}
      <View
        style={{
          flex: 1,
        }}>
        <View style={{flex: 1, marginHorizontal: Sizes.Padding}}>
          {loading ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size={'large'} color={Colors.Primary} />
            </View>
          ) : question.length == 0 ? (
            <View
              style={{
                height: '100%',
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
            <Animated.View
              style={{
                transform: [{translateX: slideAnimRight}],
                flex: 1,
                justifyContent: 'center',
              }}>
              <QuestionComponent
                key={currentQuestionIndex}
                question={question[currentQuestionIndex]}
                options={questionOptions}
                onNext={onNextQuestion}
                onPrevious={onPreviousQuestion}
                onOptionSelect={onSelectOption}
                selectedItem={
                  question[currentQuestionIndex].QUESTION_TYPE === 1
                    ? [selectedOptions[currentQuestionIndex]]
                    : selectedOptions[currentQuestionIndex]
                  // selectedOptions[currentQuestionIndex]
                }
                isFirstQuestion={currentQuestionIndex === 0}
                isLastQuestion={isLastQuestion}
                saveAllData={saveAllData}
              />
            </Animated.View>
          )}
        </View>
      </View>
      {!loading && openPurchaseModal && (
        <PurchaseSubscriptionModal
          onClose={() => {
            setOpenPurchaseModal(false);
          }}
          navigation={navigation}
          IgnoreFunction={() => {
            setOpenPurchaseModal(false);
          }}
          setOpenPurchaseModal={setOpenPurchaseModal}
          isVisible={openPurchaseModal}
          type='TB'
        />
      )}
    </View>
  );
};

const QuestionComponent = ({
  question,
  options,
  onNext,
  onPrevious,
  onOptionSelect,
  selectedItem,
  isFirstQuestion,
  isLastQuestion,
  saveAllData,
}: {
  question: TRACK_BOOK_QUESTION_INTERFACE;
  options: TRACK_BOOK_QUESTION_OPTION_INTERFACE[];
  onNext: any;
  onPrevious: any;
  onOptionSelect: any;
  selectedItem: any;
  isFirstQuestion: any;
  isLastQuestion: any;
  saveAllData: any;
}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [range, setRange] = useState<any>(0);
  const [selectedRange, setSelectedRange] = useState({});
  const getRating = (rate: number) => {
    const adjustedRate = rate;
    setRange(adjustedRate);
    const filteredOptions = options.filter((item: any) => item.RANGES != '');
    const bounds = filteredOptions.map((item: any) =>
      item.RANGES.split(' - ').map(Number),
    );
    const lowerBound = bounds.map((item: any) => item[0]);
    const upperBound = bounds.map((item: any) => item[1]);

    let rangeIndex = -1;
    for (let i = 0; i < lowerBound.length; i++) {
      if (adjustedRate >= lowerBound[i] && adjustedRate <= upperBound[i]) {
        rangeIndex = i;
        break;
      }
    }
    if (rangeIndex !== -1) {
      console.log(
        `The rounded value ${adjustedRate} falls within the range: "${filteredOptions[rangeIndex].RANGES}"`,
      );
      onOptionSelect(filteredOptions[rangeIndex]);
      setSelectedRange(filteredOptions[rangeIndex]);
    } else {
      // console.log(`The rounded value ${rate} is not within any range.`);
    }
  };
  return (
    <View style={{}}>
      <Text
        style={{
          ...Fonts.Medium1,
          fontSize: 14,
          color: Colors.PrimaryText1,
          textAlign: 'center',
          marginBottom: Sizes.ScreenPadding,
        }}>
        {`${question.LABEL}`}
      </Text>
      {question.QUESTION_TYPE == 3 ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Sizes.Radius,
            justifyContent: 'center',
          }}>
          <View style={{flex: 1}}>
            {/* <Rating
              ratingCount={10}
              showRating={false}
              imageSize={24}
              startingValue={0}
              onFinishRating={(rate: any) => {
                getRating(rate);
              }}
              onStartRating={(rate: any) => {
                getRating(rate);
              }}
            /> */}

            <StarRating
              starSize={31}
              emptyStarColor={'#F6C324'}
              fullStarColor={'#F6C324'}
              disabled={false}
              maxStars={10}
              rating={range}
              selectedStar={(rating: any) => getRating(rating)}
            />
          </View>
          {/* <Text style={{color: Colors.Primary, ...Fonts.Bold2}}>{range}</Text> */}
        </View>
      ) : (
        <FlatList
          data={options}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({
            item,
          }: {
            item: TRACK_BOOK_QUESTION_OPTION_INTERFACE;
          }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                padding: Sizes.Base,
                borderRadius: Sizes.Radius,
                elevation: 3,
                shadowColor: Colors.Primary,
                backgroundColor: selectedItem
                  ? selectedItem.includes(item)
                    ? Colors.Secondary
                    : Colors.Background
                  : Colors.Background,
                margin: 1,
                marginBottom: Sizes.Radius,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onPress={() => {
                onOptionSelect(item);
              }}>
              <Text
                style={{
                  ...Fonts.Medium2,
                  flex: 1,
                  color: Colors.PrimaryText,
                  textAlign: 'center',
                }}>
                {item.LABEL ? item.LABEL : item.RANGES}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
      <View
        style={{
          marginTop: Sizes.Padding,
        }}>
        {/* <TextButton
          label="Previous"
          loading={false}
          onPress={() => {
            onPrevious();
          }}
          style={{marginTop: Sizes.Padding, flex: 0.5}}
          disable={isFirstQuestion ? true : false}
          isBorder={true}
        /> */}
        <TextButton
          label={isLastQuestion ? 'Save' : 'Next'}
          loading={false}
          onPress={() => {
            isLastQuestion ? saveAllData() : onNext();
          }}
        />
      </View>
    </View>
  );
};
export default TrackBookQuestions;
