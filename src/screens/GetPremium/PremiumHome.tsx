import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  ScrollView,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Reducers, apiPost, useDispatch, useSelector } from "../../Modules";
import {
  Header,
  Icon,
  Modal,
  TextButton,
  TextInput,
  Toast,
} from "../../Components";
import { PLAN_INTERFACE } from "../../Modules/interface";
import moment from "moment";
import Animated, { FadeInRight } from "react-native-reanimated";
import Shimmer from "react-native-shimmer";
import { logo, subscription } from "../../../assets";
import { isSubscriptionActive } from "../../Functions";

import RazorpayCheckout, { CheckoutOptions } from "react-native-razorpay";
import { RAZOR_PAY_ID_KEY } from "../../Modules/service";
import MathJaxComponent from "../../Components/MathJax";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PremiumHome = ({ navigation, route }: any) => {
  const { Sizes, Colors, Fonts } = useSelector((state) => state.app);

  const [selected, setSelected] = useState<any>([]);
  const subscriptionFun = isSubscriptionActive();
  const { member } = useSelector((state) => state.member);
  const [plans, setPlans] = useState<PLAN_INTERFACE[]>([]);
  const [loading, setLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(true);
  const [showbenifits, setShowbenifits] = useState(false);
  const [benifitsData, setBenifitsData] = useState<PLAN_INTERFACE>();
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponLoading, setShowCouponLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [DiscountAmount, setDiscountAmount] = useState(null);
  const [payableAmount, setPayableAmount] = useState(0);
  const [openWarnModal, setOpenWarnModal] = useState(false);
  const [couponData, setCouponData] = useState<any>({});
  useEffect(() => {
    subscriptionGet();
  }, []);
  const dispatch = useDispatch();
  const { type } = route.params;


  const getCouponMaster = async (code: any) => {
    setShowCouponLoading(true);
    try {
      const res = await apiPost("api/coupon/get", {
        filter: ` AND STATUS = 1 AND COUPON_CODE = "${code}" AND  DATE(EXPIRE_DATE) >= '${moment().format(
          "YYYY-MM-DD"
        )}' `,
      });
      if (res && res.code == 200) {
        // console.log(res);
        if (res.count > 0) {
          const foundCoupon: any = res.data.find(
            (coupon: any) => coupon.COUPON_CODE === code
          );
          if (foundCoupon) {
            if (foundCoupon.VALUE > selected.PRICE) {
              setDiscountAmount(foundCoupon.VALUE);
              setPayableAmount(0);
            } else {
              setDiscountAmount(foundCoupon.VALUE);
              setPayableAmount(selected.PRICE - foundCoupon.VALUE);
            }
            setCouponData(res.data[0]);
          } else {
            setDiscountAmount(null);
            Toast("Invalid Coupon Code");
          }
          setShowCouponLoading(false);
        } else {
          Toast("Invalid Coupon Code");
          setShowCouponLoading(false);
        }
      }
    } catch (error) {
      setShowCouponLoading(false);
      console.log("error..", error);
    }
  };



  const subscriptionGet = async () => {
    const ageGroup = await AsyncStorage.getItem('AgeGroup');
    console.log("AGE_GROUP", ageGroup);

    try {
      let filter = ` AND STATUS = 1 AND AGE_GROUP = ${ageGroup}`;
      // if (type === "C") {
      //   filter += ` AND IS_TRACKBOOK_AVAILABLE = 1`;
      // }

      const res = await apiPost("api/subscription/get", {
        filter: filter,
      });
      console.log("res..", res);

      if (res && res.code == 200) {
        setPlanLoading(false);
        setPlans(res.data);
        setBenifitsData(res.data[0]);
        setSelected(res.data[0]);
        setPayableAmount(res.data[0].PRICE);
      }
    } catch (error) {
      console.log("error..", error);
    }
  };

  const addSubscription = async (tId: string) => {
    if (validate()) {
      return;
    } else {
      try {
        const res = await apiPost("api/userSubscription/create", {
          USER_ID: member?.ID,
          SUBSCRIPTION_ID: benifitsData?.ID,
          TRANSACTION_ID: tId,
          PURCHASE_DATE: moment(new Date()).format("YYYY-MM-DD"),
          EXPIRE_DATE: moment(new Date())
            .add(benifitsData?.DAYS, "days")
            .format("YYYY-MM-DD"),
          PAID_AMOUNT: payableAmount,
          STATUS: 1,
          CLIENT_ID: 1,
          CREATED_MODIFIED_DATE: moment().format("YYYY-MM-DD hh-mm-ss"),
          COUPON_ID: couponData.ID ? couponData.ID : null,
        });
        if (res && res.code == 200) {
          sendMessage();
          couponData.ID ? addCouponCode() : null;
          setLoading(false);
          Toast("Subscription Added Successfully");
          dispatch(Reducers.setShowSplash(true));
        }
      } catch (error) {
        setLoading(false);
        console.log("error..", error);
      }
    }
  };
  const sendMessage = async () => {
    try {
      const res = await apiPost("api/subscription/sendSubscriptionMessage", {
        MOBILE_NUMBER: member?.MOBILE_NUMBER,
        NAME: member?.NAME,
      });
      if (res && res.code == 200) {
        console.log("Message sent");
      }
    } catch (error) {
      setLoading(false);
      console.log("error..", error);
    }
  };
  function encryptStringTo16Chars() {
    const newDate = "12Dimension" + Date.now();
    const convert = newDate.toString();
    return convert;
  }
  const validate = () => {
    if (selected.length <= 0) {
      Toast("Please Select plan");
      return true;
    } else {
      return false;
    }
  };
  const onPurchase = async (amount: any) => {
    try {
      setLoading(true);
      if (validate()) {
        setLoading(false);
        return;
      } else {
        if (payableAmount == 0) {
          addSubscription("");
        } else {
          const orderId = await apiPost("api/subscription/generateOrderId", {
            AMOUNT: Number(payableAmount) * 100,
          }).then((res) => {
            console.log(res);
            return res.data.id;
          });
          const options: CheckoutOptions = {
            order_id: orderId,
            description: "Payment for 12Dimension",
            currency: "INR",
            key: RAZOR_PAY_ID_KEY,
            amount: Math.round(Number(payableAmount) * 100),
            name: "12 Dimensions",
            prefill: {
              name: member?.NAME,
              email: member?.EMAIL_ID,
              contact: member?.MOBILE_NUMBER,
            },
            theme: { color: Colors.Primary },
            retry: { enabled: true, max_count: 3 },
            send_sms_hash: true,
          };
          console.log("options..", options);
          try {
            const response: any = await RazorpayCheckout.open(options);
            if (response && response.razorpay_payment_id) {
              addSubscription(response.razorpay_payment_id);
            } else {
              console.warn(
                "Payment Incomplete",
                "Payment did not complete successfully."
              );
            }
          } catch (error: any) {
            // console.warn("Payment error:", error);
            Toast("Canceled");
            // Alert.alert(`Error: ${error.code} | ${error.description}`);
          } finally {
            setLoading(false);
          }

          // RazorpayCheckout.open(options)
          //   .then((data) => {
          //     console.log("data..", data);
          //     addSubscription(data.razorpay_payment_id);
          //   })
          //   .catch((error) => {
          //     console.log(error);
          //     Alert.alert(`Error: ${error.code} | ${error.description}`);
          //   })
          //   .finally(() => {
          //     setLoading(false);
          //   });
        }
      }
    } catch (error) {
      console.log("error..", error);
      setLoading(false);
    }
  };
  const addCouponCode = async () => {
    try {
      const body = {
        USER_ID: member?.ID,
        COUPON_ID: couponData.ID,
        DISCOUNT_AMOUNT: couponData.VALUE,
        TOTAL_AMOUNT: selected.PRICE,
        DATETIME: moment().format("YYYY-MM-DD HH:MM:ss"),
        CLIENT_ID: 1,
      };
      console.log(body);
      const res = await apiPost("api/couponUsage/create", body);
      if (res && res.code == 200) {
        // console.log(res);
      }
    } catch (error) {
      console.log("error..", error);
    }
  };
  return (
    <View
      style={{
        backgroundColor: Colors.White,
        flex: 1,
      }}
    >
      <Header
        label="Upgrade to Premium"
        onBack={() => navigation.navigate("Dashboard")}
      />
      <ScrollView style={{ flex: 1 }}>
        <Image
          // source={require('../../../assets/gif/crown.gif')}
          source={subscription}
          style={{ height: 160, width: 180, alignSelf: "center" }}
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
                }}
              >
                <View
                  style={{
                    height: 150,
                    borderRadius: Sizes.Base,
                    marginVertical: Sizes.Radius,
                    shadowColor: Colors.Primary2,
                    width: "100%",
                    backgroundColor: Colors.Secondary,
                  }}
                >
                  <Text>{""}</Text>
                </View>
              </Shimmer>
            )}
          />
        ) : (
          <View style={{ flex: 1, padding: Sizes.ScreenPadding }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -Sizes.Base }}
              data={plans}
              renderItem={({
                item,
                index,
              }: {
                item: PLAN_INTERFACE;
                index: number;
              }) => {
                return (
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelected(item);
                        setShowbenifits(true);
                        setBenifitsData(item);
                        setPayableAmount(item.PRICE);
                        setCouponCode("");
                        setDiscountAmount(null);
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
                      }}
                    >
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
                            textAlign: "center",
                          }}
                        >
                          {"SAVE " + item.DISCOUNT + " %"}
                        </Text>
                        <Text
                          style={{
                            marginTop: Sizes.Base,
                            color: Colors.Primary,
                            ...Fonts.Bold2,
                            textAlign: "center",
                          }}
                        >
                          {item.LABEL}
                        </Text>
                        <Text
                          style={{
                            color: Colors.Primary,
                            ...Fonts.Bold1,
                            textAlign: "center",
                          }}
                        >
                          {item.DAYS + " Days"}
                        </Text>
                        <Text
                          style={{
                            marginBottom: Sizes.Base,
                            color: Colors.Primary,
                            ...Fonts.Medium3,
                            textAlign: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          {item.PRICE + " ₹"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />

            {selected?.DESCRIPTION ? (
              <>
                <Text
                  style={{
                    ...Fonts.Bold2,
                    color: Colors.Primary,
                    marginTop: Sizes.Radius,
                  }}
                >
                  {`Description:`}
                </Text>

                <View style={{ marginLeft: Sizes.ScreenPadding }}>
                  <MathJaxComponent text={selected.DESCRIPTION} />
                </View>
              </>
            ) : (
              <Text
                style={{
                  ...Fonts.Medium2,
                  color: Colors.Primary,
                  marginTop: Sizes.Radius,
                }}
              >
                No description available
              </Text>
            )}

            <Text
              style={{
                ...Fonts.Bold2,
                color: Colors.Primary,
                marginTop: Sizes.ScreenPadding,
              }}
            >
              Benefits
            </Text>

            {/*BENIFITS*/}
            <View
              style={{
                marginHorizontal: Sizes.ScreenPadding,
              }}
            >
              {/* <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: Colors.PrimaryText1, ...Fonts.Medium2 }}>
                  Access to ERP
                </Text>
                <Icon
                  name={benifitsData?.IS_ERP_AVAILBALE == 1 ? "check" : "cross"}
                  type="Entypo"
                  color={benifitsData?.IS_ERP_AVAILBALE == 1 ? "green" : "red"}
                />
              </View> */}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: Colors.PrimaryText1, ...Fonts.Medium2 }}>
                  Access to Health and FitnessPersonalized module.
                </Text>
                <Icon
                  name={
                    benifitsData?.IS_QUESTION_PAPER_AVAILABLE == 1
                      ? "check"
                      : "cross"
                  }
                  type="Entypo"
                  color={
                    benifitsData?.IS_QUESTION_PAPER_AVAILABLE == 1
                      ? "green"
                      : "red"
                  }
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: Colors.PrimaryText1, ...Fonts.Medium2 }}>
                  Access to Task book module
                </Text>
                <Icon
                  name={
                    benifitsData?.IS_TRACKBOOK_AVAILABLE == 1
                      ? "check"
                      : "cross"
                  }
                  type="Entypo"
                  color={
                    benifitsData?.IS_TRACKBOOK_AVAILABLE == 1 ? "green" : "red"
                  }
                />
              </View>
            </View>

            {/*APPLy COUPON*/}
            {showCouponInput ? (
              <Animated.View
                entering={FadeInRight}
                style={{ margin: Sizes.Padding }}
              >
                <TextInput
                  disable={couponLoading}
                  rightChild={
                    <TouchableOpacity
                      onPress={() => {
                        if (couponCode.trim() == "") {
                          Toast("Please Enter Coupon Code");
                        } else {
                          getCouponMaster(couponCode);
                        }
                      }}
                    >
                      {couponLoading ? (
                        <Image
                          style={{
                            height: 80,
                            width: 80,
                            alignSelf: "center",
                          }}
                          source={require("../../../assets/gif/loading_gif.gif")}
                        />
                      ) : DiscountAmount ? (
                        <Icon
                          name="verified"
                          type="MaterialIcons"
                          style={{ margin: Sizes.Base }}
                          size={22}
                          color={"green"}
                        />
                      ) : (
                        <Text
                          style={{
                            ...Fonts.Medium4,
                            color: Colors.Primary,
                            margin: Sizes.Base,
                          }}
                        >
                          Apply
                        </Text>
                      )}
                    </TouchableOpacity>
                  }
                  label="Enter Coupon Code"
                  onChangeText={(text) => {
                    setCouponCode(text);
                    setDiscountAmount(null);
                    setPayableAmount(selected.PRICE);
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
                    textAlign: "right",
                  }}
                >
                  Have coupon code?
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ flex: 1 }} />
      </ScrollView>
      {/*Bottom View*/}
      {/* {!subscriptionFun && (
        <View
          style={{
            bottom: Sizes.ScreenPadding,
            marginHorizontal: Sizes.ScreenPadding,
          }}
        >
          <TextButton
            leftChild={
              <Text style={{ color: Colors.White, ...Fonts.Bold2 }}>
                {payableAmount + "₹"}
              </Text>
            }
            label="Purchase Plan"
            loading={loading}
            onPress={() => {
              if (payableAmount == 0) {
                addSubscription("");
              } else {
                onPurchase(payableAmount);
              }
            }}
          />
        </View>
      )} */}


      <View
        style={{
          bottom: Sizes.ScreenPadding,
          marginHorizontal: Sizes.ScreenPadding,
        }}
      >
        <TextButton
          leftChild={
            <Text style={{ color: Colors.White, ...Fonts.Bold2 }}>
              {payableAmount + "₹"}
            </Text>
          }
          label="Purchase Plan"
          loading={loading}
          onPress={() => {
            if (payableAmount == 0) {
              addSubscription("");
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
          isVisible={openWarnModal}
        >
          <View
            style={{
              padding: Sizes.Base,
              backgroundColor: Colors.Background,
              borderRadius: Sizes.Radius,
            }}
          >
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Bold2,
                marginBottom: Sizes.Radius,
              }}
            >
              Failed
            </Text>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Medium3,
                marginBottom: Sizes.Padding,
              }}
            >
              Transaction failed. Use a coupon code and then purchase the plan.
              For the coupon code, contact
              <Text
                style={{
                  color: Colors.Primary,
                  ...Fonts.Medium3,
                  marginBottom: Sizes.Padding,
                }}
                onPress={() =>
                  Linking.openURL(`mailto:${"info@uvtechsoft.com"}`)
                }
              >
                {` info@uvtechsoft.com`}
              </Text>
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
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
