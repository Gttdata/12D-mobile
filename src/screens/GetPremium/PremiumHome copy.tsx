// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   Image,
//   FlatList,
//   ScrollView,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {apiPost, useSelector} from '../../Modules';
// import {Header, Icon, TextButton, TextInput, Toast} from '../../Components';
// import LottieView from 'lottie-react-native';
// import {Checkbox, Switch} from 'react-native-paper';
// import RNUpiPayment from 'react-native-upi-payment';
// import {PLAN_INTERFACE} from '../../Modules/interface';
// import moment from 'moment';
// import Animated, {BounceInRight, FadeInRight} from 'react-native-reanimated';

// const PremiumHome = ({navigation}) => {
//   const {Sizes, Colors, Fonts} = useSelector(state => state.app);

//   const [selected, setSelected] = useState([]);

//   const {member} = useSelector(state => state.member);

//   const [plans, setPlans] = useState<PLAN_INTERFACE[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [showbenifits, setShowbenifits] = useState(false);
//   const [benifitsData, setBenifitsData] = useState<PLAN_INTERFACE>();
//   const [showCouponInput, setShowCouponInput] = useState(false);
//   const [couponLoading, setShowCouponLoading] = useState(false);
//   const [couponCode, setCouponCode] = useState('');
//   const [CDiscountAmount, setDiscountAmount] = useState(null);
//   const [payableAmount, setPayableAmount] = useState(0);

//   useEffect(() => {
//     subscriptionGet();
//   }, []);

//   const getCouponMaster = async code => {
//     setShowCouponLoading(true);
//     try {
//       const res = await apiPost('api/coupon/get', {});

//       if (res && res.code == 200) {
//         setShowCouponLoading(false);
//         const foundCoupon = res.data.find(
//           coupon => coupon.COUPON_CODE === code,
//         );
//         if (foundCoupon) {
//           setDiscountAmount(foundCoupon.VALUE);
//           setPayableAmount(selected.PRICE - foundCoupon.VALUE);
//         } else {
//           Toast('Invalid Coupon Code');
//         }

//         console.log('\n\ngetCouponMaster', foundCoupon);
//       }
//     } catch (error) {
//       setShowCouponLoading(false);
//       console.log('error..', error);
//     }
//   };
//   console.log('\n\ndiscount amount', selected.PRICE);
//   const subscriptionGet = async () => {
//     try {
//       const res = await apiPost('api/subscription/get', {});
//       if (res && res.code == 200) {
//         setPlans(res.data);
//         setBenifitsData(res.data[0]);
//         // console.log('res...*******', res);
//       }
//     } catch (error) {
//       console.log('error..', error);
//     }
//   };
//   const addsubscription = async () => {
//     // if (validate()) {
//     //   return;
//     // } else {
//       try {
//         const res = await apiPost('api/userSubscription/create', {
//           USER_ID: member?.ID,
//           SUBSCRIPTION_ID: benifitsData?.ID,
//           PURCHASE_DATE: moment(new Date()).format('YYYY-MM-DD'),
//           EXPIRE_DATE: moment(new Date())
//             .add(benifitsData?.DAYS, 'days')
//             .format('YYYY-MM-DD'),
//           PAID_AMOUNT: payableAmount,
//           STATUS: 1,
//           CLIENT_ID: 1,
//         });
//         console.log('\n\n\nbeforeadd subscriotion response', res);
//         if (res && res.code == 200) {
//           setLoading(false);
//           navigation.navigate('Dashboard');
//           console.log('\n\n\nadd subscriotion response', res);
//         }
//       } catch (error) {
//         setLoading(false);
//         console.log('error..', error);

//     }
//   };
//   function encryptStringTo16Chars() {
//     const newDate = '12Dimnsion' + Date.now();
//     const convert = newDate.toString();
//     return convert;
//   }

//   const validate = () => {
//     if (selected.length <= 0) {
//       Toast('Please Select plan');
//       return true;
//     } else {
//       return false;
//     }
//   };

//   const onPurchase = async item => {
//     if (validate()) {
//       return;
//     } else {
//       setLoading(true);
//       RNUpiPayment.initializePayment(
//         {
//           vpa: 'uvtechsoft@icici',
//           payeeName: 'UVTechsoft',
//           amount: item.PRICE,
//           transactionNote: '12Dimension',
//           transactionRef: encryptStringTo16Chars(),
//         },
//         async (success: any) => {addsubscription()},
//         (error: any) => {
//           setLoading(false);
//           Alert.alert(
//             'Transaction Failed',
//             error
//               ? error.message
//                 ? error.message
//                 : 'Please Try Again later'
//               : 'Please Try Again later',
//           );
//         },
//       );
//     }
//   };
//   return (
//     <View
//       style={{
//         backgroundColor: Colors.White,
//         flex: 1,
//       }}>
//       <Header label="Upgrade to Premium" onBack={() => navigation.goBack()} />
//       <ScrollView style={{flex: 1}}>
//         <Image
//           source={require('../../../assets/gif/crown.gif')}
//           style={{height: 200, width: 200, alignSelf: 'center'}}
//         />
//         <View style={{flex: 1, paddingHorizontal: Sizes.ScreenPadding}}>
//           <FlatList
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={{marginHorizontal: -Sizes.Base}}
//             // numColumns={2}
//             data={plans}
//             renderItem={({item, index}) => {
//               return (
//                 <View style={{flex: 1}}>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setSelected(item);
//                       setShowbenifits(true);
//                       setBenifitsData(item);
//                       setPayableAmount(item.PRICE);
//                     }}
//                     style={{
//                       backgroundColor: Colors.White,
//                       flex: 1,
//                       marginBottom: Sizes.Padding,
//                       borderRadius: Sizes.Radius,
//                       borderColor:
//                         selected === item ? Colors.Primary : Colors.Disable,
//                       borderWidth: 2,
//                       marginHorizontal: Sizes.Base,
//                       width: 150,
//                     }}>
//                     <View>
//                       <Text
//                         style={{
//                           backgroundColor:
//                             selected === item
//                               ? Colors.Primary
//                               : Colors.PrimaryText2,
//                           borderRadius: Sizes.Radius - 2,
//                           padding: 3,
//                           color: Colors.White,
//                           textAlign: 'center',
//                         }}>
//                         {'SAVE ' + item.DISCOUNT + ' %'}
//                       </Text>
//                       <Text
//                         style={{
//                           marginTop: Sizes.Base,
//                           color: Colors.Primary,
//                           ...Fonts.Bold2,
//                           textAlign: 'center',
//                         }}>
//                         {item.LABEL}
//                       </Text>
//                       <Text
//                         style={{
//                           color: Colors.Primary,
//                           ...Fonts.Bold1,
//                           textAlign: 'center',
//                         }}>
//                         {item.DAYS + ' Days'}
//                       </Text>
//                       <Text
//                         style={{
//                           marginBottom: Sizes.Base,
//                           color: Colors.Primary,
//                           ...Fonts.Medium3,
//                           textAlign: 'center',
//                           justifyContent: 'flex-end',
//                         }}>
//                         {item.PRICE + ' ₹'}
//                       </Text>
//                     </View>
//                   </TouchableOpacity>
//                 </View>
//               );
//             }}></FlatList>
//           <Text
//             style={{
//               ...Fonts.Bold2,
//               color: Colors.Primary,
//               marginTop: Sizes.ScreenPadding,
//             }}>
//             Benefits
//           </Text>

//           {/*BENIFITS*/}
//           <View
//             style={{
//               marginHorizontal: Sizes.ScreenPadding,
//             }}>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//               }}>
//               <Text style={{color: Colors.PrimaryText1, ...Fonts.Medium2}}>
//                 Access to ERP
//               </Text>
//               <Icon
//                 name={benifitsData?.IS_ERP_AVAILABLE ? 'check' : 'cross'}
//                 type="Entypo"
//                 color={benifitsData?.IS_ERP_AVAILABLE ? 'green' : 'red'}></Icon>
//             </View>

//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//               }}>
//               <Text style={{color: Colors.PrimaryText1, ...Fonts.Medium2}}>
//                 Access to question paper module
//               </Text>
//               <Icon
//                 name={
//                   benifitsData?.IS_QUESTION_PAPER_AVAILABLE ? 'check' : 'cross'
//                 }
//                 type="Entypo"
//                 color={
//                   benifitsData?.IS_QUESTION_PAPER_AVAILABLE ? 'green' : 'red'
//                 }></Icon>
//             </View>

//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//               }}>
//               <Text style={{color: Colors.PrimaryText1, ...Fonts.Medium2}}>
//                 Access to Trackbook module
//               </Text>
//               <Icon
//                 name={benifitsData?.IS_TRACKBOOK_AVAILABLE ? 'check' : 'cross'}
//                 type="Entypo"
//                 color={
//                   benifitsData?.IS_TRACKBOOK_AVAILABLE ? 'green' : 'red'
//                 }></Icon>
//             </View>
//           </View>

//           {/*APPLy COUPON*/}
//           {showCouponInput ? (
//             <Animated.View
//               entering={FadeInRight}
//               style={{margin: Sizes.Padding}}>
//               <TextInput
//                 disable={couponLoading}
//                 rightChild={
//                   <TouchableOpacity
//                     onPress={() => {
//                       if (couponCode.trim() == '') {
//                         Toast('Please Enter Coupon Code');
//                       } else {
//                         getCouponMaster(couponCode);
//                       }
//                     }}>
//                     {couponLoading ? (
//                       <Image
//                         style={{
//                           height: 100,
//                           width: 100,
//                           alignSelf: 'center',
//                         }}
//                         source={require('../../../assets/gif/loading_gif.gif')}
//                       />
//                     ) : (
//                       <Icon
//                         name="checkcircle"
//                         type="AntDesign"
//                         style={{margin: Sizes.Base}}></Icon>
//                     )}
//                   </TouchableOpacity>
//                 }
//                 label="Enter Coupon Code"
//                 onChangeText={text => {
//                   setCouponCode(text);
//                 }}
//                 value={couponCode}></TextInput>
//             </Animated.View>
//           ) : (
//             <TouchableOpacity onPress={() => setShowCouponInput(true)}>
//               <Text
//                 style={{
//                   color: Colors.Primary,
//                   ...Fonts.Medium2,
//                   margin: Sizes.Padding,
//                   textAlign: 'right',
//                 }}>
//                 have coupon code?
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </ScrollView>
//       {/*Bottom View*/}
//       <View
//         style={{
//           bottom: Sizes.ScreenPadding,
//           marginHorizontal: Sizes.ScreenPadding,
//         }}>
//         <TextButton
//           leftChild={
//             <Text style={{color: Colors.White, ...Fonts.Bold2}}>
//               {payableAmount + '₹'}
//             </Text>
//           }
//           label="Purchase Plan"
//           loading={loading}
//           onPress={() => {
//             if (selected.length!=0 && payableAmount <= 0) {

//                addsubscription();
//             } else {

//                onPurchase(benifitsData);
//             }
//           }}
//         />
//       </View>
//     </View>
//   );
// };

// export default PremiumHome;

import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  ScrollView,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Reducers, apiPost, useDispatch, useSelector} from '../../Modules';
import {
  Header,
  Icon,
  Modal,
  TextButton,
  TextInput,
  Toast,
} from '../../Components';
// import RNUpiPayment from 'react-native-upi-payment';
import {PLAN_INTERFACE} from '../../Modules/interface';
import moment from 'moment';
import Animated, {FadeInRight} from 'react-native-reanimated';

import Shimmer from 'react-native-shimmer';
import {subscription} from '../../../assets';

const PremiumHome = ({navigation}: any) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);

  const [selected, setSelected] = useState<any>([]);
  // const [selectedAnimation, SetSelectedAnimation] = useState<ANIMATION_MASTER>({
  //   ARCHIVE_FLAG: '',
  //   CLIENT_ID: 1,
  //   CREATED_MODIFIED_DATE: '',
  //   DESCRIPTION: '',
  //   ID: 0,
  //   READ_ONLY: '',
  //   SEQ_NO: 0,
  //   STATUS: 0,
  //   TITLE: '',
  //   VIDEO_URL: '',
  // });

  const {member} = useSelector(state => state.member);
  const [plans, setPlans] = useState<PLAN_INTERFACE[]>([]);
  const [loading, setLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(true);
  const [showbenifits, setShowbenifits] = useState(false);
  const [benifitsData, setBenifitsData] = useState<PLAN_INTERFACE>();
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponLoading, setShowCouponLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [DiscountAmount, setDiscountAmount] = useState(null);
  const [payableAmount, setPayableAmount] = useState(0);
  const [openWarnModal, setOpenWarnModal] = useState(false);
  const [couponData, setCouponData] = useState<any>({});
  useEffect(() => {
    subscriptionGet();
  }, []);
  const dispatch = useDispatch();

  const getCouponMaster = async (code: any) => {
    setShowCouponLoading(true);
    try {
      const res = await apiPost('api/coupon/get', {
        filter: ` AND STATUS = 1 AND COUPON_CODE = "${code}" AND  DATE(EXPIRE_DATE) >= '${moment().format(
          'YYYY-MM-DD',
        )}' `,
      });
      if (res && res.code == 200) {
        if (res.count > 0) {
          const foundCoupon: any = res.data.find(
            (coupon: any) => coupon.COUPON_CODE === code,
          );
          if (foundCoupon) {
            if (foundCoupon.VALUE > selected.PRICE) {
              setDiscountAmount(foundCoupon.VALUE);
              setPayableAmount(0);
            } else {
              setDiscountAmount(foundCoupon.VALUE);
              setPayableAmount(selected.PRICE - foundCoupon.VALUE);
            }
          } else {
            setDiscountAmount(null);
            Toast('Invalid Coupon Code');
          }
          setShowCouponLoading(false);
        } else {
          Toast('Invalid Coupon Code');
          setShowCouponLoading(false);
        }
      }
    } catch (error) {
      setShowCouponLoading(false);
      console.log('error..', error);
    }
  };

  const subscriptionGet = async () => {
    try {
      const res = await apiPost('api/subscription/get', {});
      console.log("res++", res);
      
      if (res && res.code == 200) {
        // console.log('\n\n subscriptionGet', res);
        setPlanLoading(false);
        setPlans(res.data);
        setBenifitsData(res.data[0]);
      }
    } catch (error) {
      console.log('error..', error);
    }
  };

  const addSubscription = async () => {
    if (validate()) {
      return;
    } else {
      try {
        const res = await apiPost('api/userSubscription/create', {
          USER_ID: member?.ID,
          SUBSCRIPTION_ID: benifitsData?.ID,
          PURCHASE_DATE: moment(new Date()).format('YYYY-MM-DD'),
          EXPIRE_DATE: moment(new Date())
            .add(benifitsData?.DAYS, 'days')
            .format('YYYY-MM-DD'),
          PAID_AMOUNT: payableAmount,
          STATUS: 1,
          CLIENT_ID: 1,
          // ID: selectedAnimation.ID,
          // USER_SUBSCRIPTION_ID: selectedAnimation.ID,
          CREATED_MODIFIED_DATE: moment().format('YYYY-MM-DD hh-mm-ss'),
          // READ_ONLY: selectedAnimation.READ_ONLY,
          // ARCHIVE_FLAG: selectedAnimation.ARCHIVE_FLAG,
          // ANIMATION_ID: selectedAnimation.ID,
          // VIDEO_URL: selectedAnimation.VIDEO_URL,
        });
        if (res && res.code == 200) {
          addCouponCode();
          setLoading(false);
          Toast('Subscription Added Successfully');
          dispatch(Reducers.setShowSplash(true));
        }
      } catch (error) {
        setLoading(false);
        console.log('error..', error);
      }
    }
  };
  function encryptStringTo16Chars() {
    const newDate = '12Dimension' + Date.now();
    const convert = newDate.toString();
    return convert;
  }
  const validate = () => {
    if (selected.length <= 0) {
      Toast('Please Select plan');
      return true;
    } else {
      return false;
    }
  };
  const onPurchase = async (amount: any) => {
    if (validate()) {
      return;
    } else {
      setLoading(true);
      // RNUpiPayment.initializePayment(
      //   {
      //     vpa: 'uvtechsoft@icici',
      //     payeeName: 'UVTechsoft',
      //     amount: amount,
      //     transactionNote: '12Dimensions',
      //     transactionRef: encryptStringTo16Chars(),
      //   },
      //   async (success: any) => {
      //     addSubscription();
      //   },
      //   (error: any) => {
      //     setLoading(false);
      //     setOpenWarnModal(true);
      //     // Alert.alert(
      //     //   'Transaction Failed',
      //     //   error
      //     //     ? error.message
      //     //       ? error.message
      //     //       : 'Please Try Again later'
      //     //     : 'Please Try Again later',
      //     // );
      //   },
      // );
      addSubscription();
    }
  };
  const addCouponCode = async () => {
    try {
      const body = {
        USER_ID: member?.ID,
        COUPON_ID: couponData.ID,
        DISCOUNT_AMOUNT: couponData.VALUE,
        TOTAL_AMOUNT: selected.PRICE,
        DATETIME: moment().format('YYYY-MM-DD HH:MM:ss'),
        CLIENT_ID: 1,
      };
      // console.log(body);
      const res = await apiPost('api/couponUsage/create', body);
      if (res && res.code == 200) {
        console.log(res);
      }
    } catch (error) {
      console.log('error..', error);
    }
  };
  return (
    <View
      style={{
        backgroundColor: Colors.White,
        flex: 1,
      }}>
      <Header
        label="Upgrade to Premium"
        onBack={() => navigation.navigate('Dashboard')}
      />
      <ScrollView style={{flex: 1}}>
        <Image
          // source={require('../../../assets/gif/crown.gif')}
          source={subscription}
          style={{height: 160, width: 180, alignSelf: 'center'}}
        />
        {planLoading ? (
          <FlatList
            data={[1, 1, 1, 1]}
            renderItem={() => (
              <Shimmer
                duration={2000}
                pauseDuration={1000}
                animationOpacity={0.9}
                opacity={0.5}
                style={{
                  marginHorizontal: Sizes.ScreenPadding,
                  marginTop: Sizes.Padding,
                }}>
                <View
                  style={{
                    height: 150,
                    borderRadius: Sizes.Base,
                    marginVertical: Sizes.Radius,
                    shadowColor: Colors.Primary2,
                    width: '100%',
                    backgroundColor: Colors.Secondary,
                  }}>
                  <Text>{''}</Text>
                </View>
              </Shimmer>
            )}
          />
        ) : (
          <View style={{flex: 1, padding: Sizes.ScreenPadding}}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{marginHorizontal: -Sizes.Base}}
              data={plans}
              renderItem={({
                item,
                index,
              }: {
                item: PLAN_INTERFACE;
                index: number;
              }) => {
                return (
                  <View style={{flex: 1}}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelected(item);
                        setShowbenifits(true);
                        setBenifitsData(item);
                        setPayableAmount(item.PRICE);
                      }}
                      style={{
                        backgroundColor: Colors.White,
                        flex: 1,
                        marginBottom: Sizes.Padding,
                        borderRadius: Sizes.Radius,
                        borderColor:
                          selected === item ? Colors.Primary : Colors.Disable,
                        borderWidth: 2,
                        marginHorizontal: Sizes.Base,
                        width: 150,
                      }}>
                      <View>
                        <Text
                          style={{
                            backgroundColor:
                              selected === item
                                ? Colors.Primary
                                : Colors.PrimaryText2,
                            borderRadius: Sizes.Radius - 2,
                            padding: 3,
                            margin: -1,
                            color: Colors.White,
                            textAlign: 'center',
                          }}>
                          {'SAVE ' + item.DISCOUNT + ' %'}
                        </Text>
                        <Text
                          style={{
                            marginTop: Sizes.Base,
                            color: Colors.Primary,
                            ...Fonts.Bold2,
                            textAlign: 'center',
                          }}>
                          {item.LABEL}
                        </Text>
                        <Text
                          style={{
                            color: Colors.Primary,
                            ...Fonts.Bold1,
                            textAlign: 'center',
                          }}>
                          {item.DAYS + ' Days'}
                        </Text>
                        <Text
                          style={{
                            marginBottom: Sizes.Base,
                            color: Colors.Primary,
                            ...Fonts.Medium3,
                            textAlign: 'center',
                            justifyContent: 'flex-end',
                          }}>
                          {item.PRICE + ' ₹'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
            
            <Text
              style={{
                ...Fonts.Bold2,
                color: Colors.Primary,
                marginTop: Sizes.ScreenPadding,
              }}>
              Benefits
            </Text>

            {/*BENIFITS*/}
            <View
              style={{
                marginHorizontal: Sizes.ScreenPadding,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: Colors.PrimaryText1, ...Fonts.Medium2}}>
                  Access to ERP
                </Text>
                <Icon
                  name={benifitsData?.IS_ERP_AVAILABLE ? 'check' : 'cross'}
                  type="Entypo"
                  color={benifitsData?.IS_ERP_AVAILABLE ? 'green' : 'red'}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: Colors.PrimaryText1, ...Fonts.Medium2}}>
                  Access to question paper module
                </Text>
                <Icon
                  name={
                    benifitsData?.IS_QUESTION_PAPER_AVAILABLE
                      ? 'check'
                      : 'cross'
                  }
                  type="Entypo"
                  color={
                    benifitsData?.IS_QUESTION_PAPER_AVAILABLE ? 'green' : 'red'
                  }
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: Colors.PrimaryText1, ...Fonts.Medium2}}>
                  Access to Trackbook module
                </Text>
                <Icon
                  name={
                    benifitsData?.IS_TRACKBOOK_AVAILABLE ? 'check' : 'cross'
                  }
                  type="Entypo"
                  color={benifitsData?.IS_TRACKBOOK_AVAILABLE ? 'green' : 'red'}
                />
              </View>
            </View>

            {/*APPLy COUPON*/}
            {showCouponInput ? (
              <Animated.View
                entering={FadeInRight}
                style={{margin: Sizes.Padding}}>
                <TextInput
                  disable={couponLoading}
                  rightChild={
                    <TouchableOpacity
                      onPress={() => {
                        if (couponCode.trim() == '') {
                          Toast('Please Enter Coupon Code');
                        } else {
                          getCouponMaster(couponCode);
                        }
                      }}>
                      {couponLoading ? (
                        <Image
                          style={{
                            height: 80,
                            width: 80,
                            alignSelf: 'center',
                          }}
                          source={require('../../../assets/gif/loading_gif.gif')}
                        />
                      ) : (
                        <Icon
                          name="verified"
                          type="MaterialIcons"
                          style={{margin: Sizes.Base}}
                          size={22}
                          color={DiscountAmount ? 'green' : Colors.Disable}
                        />
                      )}
                    </TouchableOpacity>
                  }
                  label="Enter Coupon Code"
                  onChangeText={text => {
                    setCouponCode(text);
                    setDiscountAmount(null);
                  }}
                  value={couponCode}
                  placeholder="Enter Coupon Code"
                />
              </Animated.View>
            ) : (
              <TouchableOpacity onPress={() => setShowCouponInput(true)}>
                <Text
                  style={{
                    color: Colors.Primary,
                    ...Fonts.Medium2,
                    margin: Sizes.Padding,
                    textAlign: 'right',
                  }}>
                  Have coupon code?
                </Text>
              </TouchableOpacity>
            )}

            {/* <Text
            style={{
              ...Fonts.Bold2,
              color: Colors.Primary,
              marginVertical: Sizes.Base,
            }}>
            Select Animation Type
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{marginHorizontal: -Sizes.Base}}
            data={VideoData}
            renderItem={({item, index}) => {
              return (
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    onPress={() => {
                      SetSelectedAnimation(item);
                    }}
                    style={{
                      backgroundColor: Colors.White,
                      flex: 1,
                      marginBottom: Sizes.Padding,
                      borderRadius: Sizes.Radius,
                      borderColor:
                        selectedAnimation.VIDEO_URL === item.VIDEO_URL
                          ? Colors.Primary
                          : Colors.Disable,
                      borderWidth: 2,
                      marginHorizontal: Sizes.Base,
                      width: 150,
                    }}>
                    <View>
                      <Text
                        style={{
                          backgroundColor:
                            selectedAnimation.VIDEO_URL === item.VIDEO_URL
                              ? Colors.Primary
                              : Colors.PrimaryText2,
                          borderRadius: Sizes.Radius - 2,
                          padding: Sizes.Base,
                          color: Colors.White,
                          ...Fonts.Medium3,
                          fontSize:12,
                          textAlign: 'center',
                        }}>
                        {item.TITLE}
                      </Text>
                     
                      <Text
                        style={{
                          padding:Sizes.Base,
                          color: Colors.PrimaryText1,
                          ...Fonts.Medium3,
                          textAlign: 'center',
                        }}>
                        {item.DESCRIPTION}
                      </Text>
                     
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}/> */}
          </View>
        )}

        <View style={{flex: 1}} />
      </ScrollView>
      {/*Bottom View*/}
      <View
        style={{
          bottom: Sizes.ScreenPadding,
          marginHorizontal: Sizes.ScreenPadding,
        }}>
        <TextButton
          leftChild={
            <Text style={{color: Colors.White, ...Fonts.Bold2}}>
              {payableAmount + '₹'}
            </Text>
          }
          label="Purchase Plan"
          loading={loading}
          onPress={() => {
            if (payableAmount == 0) {
              addSubscription();
            } else {
              onPurchase(payableAmount);
            }
          }}
        />
      </View>
      {openWarnModal && (
        <Modal
          onClose={() => {
            setOpenWarnModal(false);
          }}
          isVisible={openWarnModal}>
          <View
            style={{
              padding: Sizes.Base,
              backgroundColor: Colors.Background,
              borderRadius: Sizes.Radius,
            }}>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Bold2,
                marginBottom: Sizes.Radius,
              }}>
              Failed
            </Text>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Medium3,
                marginBottom: Sizes.Padding,
              }}>
              Transaction failed. Use a coupon code and then purchase the plan.
              For the coupon code, contact
              <Text
                style={{
                  color: Colors.Primary,
                  ...Fonts.Medium3,
                  marginBottom: Sizes.Padding,
                }}
                onPress={() =>
                  Linking.openURL(`mailto:${'info@uvtechsoft.com'}`)
                }>
                {` info@uvtechsoft.com`}
              </Text>
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TextButton
                style={{
                  flex: 1,
                  borderColor: Colors.Secondary,
                }}
                label="Ok"
                loading={false}
                onPress={() => setOpenWarnModal(false)}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default PremiumHome;

// type menuIconType = {
//   onPress: () => void;
//   icon: ReactNode;
//   name: string;
//   value?: number;
// };
// type sliderType = {
//   data: any[];
//   renderItem: ({item}: any) => JSX.Element;
//   showIndex: boolean;
// };
// const MenuIcons: React.FC<menuIconType> = ({icon, name, onPress, value}) => {
//   const {Colors, Sizes, Fonts} = useSelector(state => state.app);
//   return (
//     <TouchableOpacity
//       activeOpacity={0.7}
//       onPress={onPress}
//       style={{
//         alignItems: 'center',
//         width: '25%',
//         paddingHorizontal: Sizes.Base,
//         // marginHorizontal: Size.radius,
//       }}>
//       <LinearGradient
//         colors={['#FF7A7A', '#FF4B4B']}
//         style={{
//           height: wp(10),
//           width: wp(10),
//           borderRadius: Sizes.Radius,
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}>
//         {icon}
//       </LinearGradient>
//       <Text
//         style={{
//           ...Fonts.Regular3,
//           color: Colors.PrimaryText1,
//           textAlign: 'center',
//         }}>
//         {'' + name}
//       </Text>
//     </TouchableOpacity>
//   );
// };
// const Slider: React.FC<sliderType> = ({data, renderItem, showIndex}) => {
//   const {Colors, Sizes} = useSelector(state => state.app);
//   const [active, setActive] = useState(0);
//   return (
//     <View style={{width: '100%'}}>
//       <Carousel
//         data={data}
//         layout="default"
//         loop
//         autoplay
//         autoplayInterval={3000}
//         sliderWidth={Sizes.Width}
//         itemWidth={Sizes.Width - Sizes.ScreenPadding * 2}
//         onSnapToItem={(index: number) => setActive(index)}
//         renderItem={renderItem}
//       />
//       {showIndex ? (
//         <Pagination
//           dotsLength={data.length}
//           activeDotIndex={active}
//           containerStyle={{
//             position: 'absolute',
//             bottom: Sizes.ScreenPadding,
//             alignSelf: 'center',
//             paddingVertical: 0,
//             marginVertical: 0,
//             // height: 0,
//           }}
//           dotStyle={{
//             width: 16,
//             height: 9,
//             borderRadius: 5,
//             backgroundColor: Colors.Primary,
//             borderColor: Colors.Background,
//           }}
//           inactiveDotStyle={{
//             width: 8,
//             height: 8,
//             borderRadius: 5,
//             borderColor: Colors.Primary,
//             backgroundColor: Colors.Background,
//             borderWidth: 1,
//           }}
//           inactiveDotOpacity={1}
//           inactiveDotScale={1}
//         />
//       ) : null}
//     </View>
