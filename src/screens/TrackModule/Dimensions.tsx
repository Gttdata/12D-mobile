import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  BackHandler,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  BASE_URL,
  Reducers,
  apiPost,
  useDispatch,
  useSelector,
} from '../../Modules';
import { Header, Modal, TextButton } from '../../Components';
import { StackProps } from '../../routes';
import { DIMENSION_INTERFACE } from '../../Modules/interface';
import LinearGradient from 'react-native-linear-gradient';
import { emptyImg, noData } from '../../../assets';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isSubscriptionActive } from '../../Functions';
import PurchaseSubscriptionModal from '../../Components/PurchaseSubscriptionModal';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import moment from 'moment';

type Props = StackProps<'Dimensions'>;
const Dimensions = ({ navigation, route }: Props) => {
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const purchase = !isSubscriptionActive() ? true : false;
  const [openPurchaseModal, setOpenPurchaseModal] = useState(purchase);

  const dispatch = useDispatch();
  useEffect(() => {
    console.log('useEffect called');
    console.log('purchase', purchase);
    console.log('openPurchaseModal', openPurchaseModal);
    // getSubscriptionDetails();
  }, []);
  useFocusEffect(
    React.useCallback(() => {

      const backAction = () => {
        navigation.navigate('Dashboard');
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, [navigation]),
  );
  useFocusEffect(
    React.useCallback(() => {

      getDimension();


    }, [navigation]),

  );
  const [dimension, setDimension] = useState<DIMENSION_INTERFACE[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBackAlert, setShowBackAlert] = useState(false);
  const [showGoBackButton, setShowGoBachButton] = useState(false);
  const { member } = useSelector(state => state.member);
  //  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);


  const dob = member?.DOB;
  if (dob) {
    const age = moment().diff(moment(dob, 'YYYY-MM-DD'), 'years');
    console.log('Age:', age);
  }


  // const getSubscriptionDetails = async () => {
  //   console.log("getSubscriptionDetails called");  // Add this
  //   try {
  //     const res = await apiPost("api/userSubscription/get", {
  //       filter: `AND STATUS=1 AND USER_ID=${member?.ID} AND EXPIRE_DATE > ${moment(new Date()).format("YYYY-MM-DD")}`,
  //     });
  //     console.log("getSubscriptionDetails response", res);  // Log response
  //     if (res && res.code == 200) {
  //       setSubscriptionDetails(res.data);
  //     }
  //   } catch (error) {
  //     console.log("getSubscriptionDetails error:", error);  // Log error
  //   }
  // };



  const getDimension = async () => {
    const data = await AsyncStorage.getItem('OPTIONS');
    const optionData = data ? JSON.parse(data) : [];
    setShowGoBachButton(optionData.length > 0);

    const subscriptionStr = await AsyncStorage.getItem('SUBSCRIPTION_DETAILS');
    console.log('data******1', subscriptionStr);

    let dimensionIdFilter = '';

    if (subscriptionStr) {
      const subscription = JSON.parse(subscriptionStr);
      if (subscription?.DIAMENTION_ID) {
        dimensionIdFilter = ` AND ID = ${subscription.DIAMENTION_ID}`;
      }
    }

    try {
      const res = await apiPost('api/diamentions/get', {
        filter: ` AND STATUS = 1${dimensionIdFilter}`,
        sortValue: 'ASC',
      });

      console.log('SUB', res.data);

      if (res && res.code === 200) {
        setDimension(res.data);
      }
    } catch (error) {
      console.log('err..', error);
    } finally {
      setLoading(false); // always stop loading spinner
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: Colors.Background }}>
      <Header
        label="12 Life Dimensions"
        onBack={() => {
          navigation.navigate('Dashboard');
        }}
      />
      <View style={{ flex: 1, margin: Sizes.Padding }}>
        {loading ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size={'large'} color={Colors.Primary} />
          </View>
        ) : dimension.length == 0 ? (
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
          <View style={{ flex: 1 }}>
            <FlatList
              data={dimension}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => (
                <View style={{ height: Sizes.Padding }} />
              )}
              renderItem={({
                item,
                index,
              }: {
                item: DIMENSION_INTERFACE;
                index: number;
              }) => {
                const [mainText, bracketText] = item.NAME.split('(');
                const formattedBracketText = bracketText
                  ? bracketText.replace(')', '')
                  : '';
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      dispatch(Reducers.setSelectedDimensionOptionData([]));
                      if (purchase) {
                        setOpenPurchaseModal(true);
                      } else {
                        navigation.navigate('DimensionQuestions', {
                          itemData: item,
                          call: 'Q',
                          headID: {},
                        });
                      }
                    }}
                    style={{
                      height: 135,
                      flex: 1,
                      overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
                      backgroundColor: '#fff',
                      elevation: 5,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: Sizes.Radius,
                    }}>

                    <View style={{
                      flex: 1,
                      flexDirection: 'row',
                      // borderWidth: 1,
                      // borderColor: '#ccc',
                      // borderRadius: Sizes.Radius,
                      overflow: 'hidden',
                    }}>

                      <Image
                        style={{
                          width: '40%',
                          height: '100%',
                          // borderRadius: Sizes.Radius, 
                        }}
                        resizeMode="cover"
                        source={
                          item.IMAGE_URL
                            ? { uri: `${BASE_URL}static/diamentionImage/${item.IMAGE_URL}` }
                            : emptyImg
                        }

                      />

                      {/* Text Section */}
                      <View style={{ flex: 1, padding: Sizes.Padding, justifyContent: 'center' }}>
                        <Text
                          style={{
                            color: 'black',
                            ...Fonts.Bold1,
                            fontSize: 16,
                            marginBottom: 4,
                          }}
                        // numberOfLines={1}
                        >
                          {mainText}
                        </Text>
                        {formattedBracketText !== '' && (
                          <Text
                            style={{
                              color: 'black',
                              ...Fonts.Bold4,
                              fontSize: 13,
                              marginBottom: 0,
                            }}
                            numberOfLines={1}
                          >
                            {formattedBracketText}
                          </Text>
                        )}
                        {item.DESCRIPTION && (
                          <Text
                            // numberOfLines={3}
                            style={{
                              color: '#333',
                              ...Fonts.Medium3,
                              fontSize: 10,
                            }}
                          >
                            {item.DESCRIPTION}
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
        {showGoBackButton && (
          <TextButton
            label="Go back to questionnaire"
            loading={false}
            onPress={() => {
              setShowBackAlert(true);
            }}
            style={{ marginTop: Sizes.Padding }}
          />
        )}
      </View>
      {showBackAlert && (
        <Modal
          isVisible={showBackAlert}
          onClose={() => {
            setShowBackAlert(false);
          }}
          title="Warning">
          <View>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Medium3,
                marginTop: Sizes.Base,
              }}>
              If you go back, you will lose the previously filled data. Are you
              sure you want to go Back?
            </Text>

            <View style={{ flexDirection: 'row', marginTop: Sizes.Padding }}>
              <TextButton
                isBorder
                label="Cancel"
                loading={false}
                onPress={() => {
                  setShowBackAlert(false);
                }}
                style={{ flex: 1 }}
              />
              <View style={{ width: Sizes.Radius }}></View>
              <TextButton
                label="Yes"
                loading={false}
                onPress={async () => {
                  dispatch(Reducers.setSelectedDimensionOptionData([]));
                  setShowBackAlert(false);
                  await AsyncStorage.setItem('STAGE_NAME', '');
                  await AsyncStorage.setItem('OPTIONS', '');
                  navigation.navigate('TrackBookQuestions');
                }}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </Modal>
      )}

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
          type="C"
        />
      )}
    </View>
  );
};
export default Dimensions;
