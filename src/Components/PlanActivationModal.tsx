import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Icon, Modal, TextButton, Toast } from ".";
import { apiPost, useSelector } from "../Modules";
import moment from "moment";
import { Checkbox } from "react-native-paper";
import { SUBSCRIPTION_DETAILS } from "../Modules/interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IMAGE_URL } from "../Modules/service";
import { emptyImg } from "../../assets";
import LottieView from "lottie-react-native";

interface modalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  setActivationSuccess: any;
}
const PlanActivationModal = ({
  visible,
  onClose,
  title,
  setActivationSuccess,
}: modalProps) => {
  const [subscriptioDetails, setSubscriptionDetails] =
    useState<SUBSCRIPTION_DETAILS>({} as SUBSCRIPTION_DETAILS);
  const { member } = useSelector((state) => state.member);

  const { Sizes, Colors, Fonts } = useSelector((state) => state.app);
  const [selectedAnimation, SetSelectedAnimation] = useState({
    ARCHIVE_FLAG: "",
    CLIENT_ID: 1,
    CREATED_MODIFIED_DATE: "",
    DESCRIPTION: "",
    ID: 0,
    READ_ONLY: "",
    SEQ_NO: 0,
    STATUS: 0,
    TITLE: "",
    VIDEO_URL: "",
    ANIMATION_DETAILS_ID: 0,
  });
  const [isSundayOff, setSundayOff] = useState(true);
  const [loading, setLoading] = useState(false);

  const [VideoData, setVideoData] = useState([]);
  useEffect(() => {
    getVideo();
    getSubscriptionDetails();
  }, []);
  const getVideo = async () => {
    try {
      const res = await apiPost("api/animation/get", {
        sortKey: "SEQ_NO",
        sortValue: "DESC",
        filter: `AND STATUS=1`,
      });
      if (res && res.code == 200) {
        // console.log("video data", res.data);
        setVideoData(res.data);
        SetSelectedAnimation(res.data[0]);
      }
    } catch (error) {}
  };
  const getSubscriptionDetails = async () => {
    try {
      const res = await apiPost("api/userSubscription/get", {
        filter: `AND STATUS=1 AND USER_ID=${member?.ID} AND EXPIRE_DATE > ${moment(
          new Date()
        ).format("YYYY-MM-DD")}`,
      });
      if (res && res.code == 200) {
        setSubscriptionDetails(res.data[0]);
      }
    } catch (error) {}
  };
  const onActivate = async () => {
    if (!selectedAnimation.TITLE) {
      Toast("Please select animation type");
      return;
    } else {
      setLoading(true);
      const data = await AsyncStorage.getItem("ANIMATION");
      try {
        let body = {
          USER_ID: member?.ID,
          SUBSCRIPTION_ID: subscriptioDetails.SUBSCRIPTION_ID,
          PURCHASE_DATE: subscriptioDetails.PURCHASE_DATE,
          EXPIRE_DATE: subscriptioDetails.EXPIRE_DATE,
          PAID_AMOUNT: subscriptioDetails.PAID_AMOUNT,
          STATUS: 1,
          CLIENT_ID: 1,
          subscriptionData: {
            IS_SUNDAY_OFF: isSundayOff ? 1 : 0,
            END_DATE: moment(new Date())
              .add(subscriptioDetails.DAYS, "days")
              .format("YYYY-MM-DD"),
            START_DATE: moment(new Date()).format("YYYY-MM-DD"),
            ANIMATION_ID: selectedAnimation.ID,
            ANIMATION_DETAILS_ID: selectedAnimation.ANIMATION_DETAILS_ID,
            ANIMATION_STATUS: selectedAnimation.STATUS,
            IS_CONTINUED: data ? 1 : 0,
            CLIENT_ID: 1,
            USER_SUBSCRIPTION_ID: subscriptioDetails.ID,
          },
        };
        const res = await apiPost("api/userSubscription/add", body);
        if (res && res.code == 200) {
          setLoading(false);
          Toast("Subscription Activated Succesfully");
          const jsonValue = JSON.stringify(selectedAnimation);
          await AsyncStorage.setItem("ANIMATION", jsonValue);
          setActivationSuccess(true);
          onClose();
        } else {
          setLoading(false);
          Toast("Something went wrong...");
        }
      } catch (error) {
        setLoading(false);
        console.log("error..", error);
      }
    }
  };
  return (
    <Modal
      animation="slide"
      containerStyle={{ margin: 0, justifyContent: "flex-end" }}
      title={title ? title : ""}
      isVisible={visible}
      onClose={onClose}
      style={{
        margin: 0,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
      }}
    >
      <View style={{}}>
        {selectedAnimation.TITLE && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: Sizes.Base,
            }}
          >
            <Checkbox
              status={isSundayOff ? "checked" : "unchecked"}
              color={Colors.Primary}
              onPress={() => setSundayOff(!isSundayOff)}
            />
            <Text
              style={{
                color: Colors.Primary,
                ...Fonts.Medium3,
                fontSize: 12,
              }}
            >
              Would you like to take the day off on Sunday?
            </Text>
          </View>
        )}
        {/* <Text
          style={{
            color: Colors.PrimaryText1,
            ...Fonts.Medium3,
            marginVertical: Sizes.Radius,
          }}>
          Select Animation Type
        </Text> */}
        <Text
          style={{
            color: Colors.PrimaryText1,
            ...Fonts.Medium3,
            marginBottom: Sizes.Radius,
          }}
        >
          Here are some animation videos with a social message in them to create
          social awareness. The video is locked and holds exciting virtual
          rewards! select the video, complete all the daily tasks/challenges
          selected by you, and win virtual rewards, thereby unlocking and
          bringing animation to life. Remember, if you fail to complete any
          task, you will miss the rewards connected to it, resulting in an
          unfinished video.
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            marginHorizontal: -Sizes.Base,
          }}
          data={VideoData}
          renderItem={({ item, index }: any) => {
            return (
              <View style={{}}>
                <TouchableOpacity
                  onPress={
                    index == 0
                      ? () => {
                          // console.log("selected animation", item);
                          SetSelectedAnimation(item);
                        }
                      : () => {
                          Toast("This Animation has been locked for now");
                        }
                  }
                  style={{
                    backgroundColor: Colors.White,
                    marginBottom: Sizes.Padding,
                    borderRadius: Sizes.Radius,
                    borderColor:
                      selectedAnimation.VIDEO_URL === item.VIDEO_URL
                        ? Colors.Primary
                        : Colors.Disable,
                    borderWidth: 2,
                    marginHorizontal: Sizes.Base,
                    width: 150,
                    height: 200,
                  }}
                >
                  <View style={{ height: "100%" }}>
                    <Text
                      // numberOfLines={3}
                      adjustsFontSizeToFit
                      style={{
                        backgroundColor:
                          selectedAnimation.VIDEO_URL === item.VIDEO_URL
                            ? Colors.Primary
                            : Colors.PrimaryText2,
                        borderRadius: Sizes.Radius - 2,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        padding: Sizes.Base,
                        color: Colors.White,
                        ...Fonts.Medium3,
                        fontSize: 12,
                        textAlign: "center",
                        height: "25%",
                      }}
                    >
                      {item.TITLE}
                    </Text>

                    <Image
                      source={
                        item.TEMPLATE_IMAGE
                          ? {
                              uri:
                                IMAGE_URL +
                                "templateImage/" +
                                item.TEMPLATE_IMAGE,
                            }
                          : emptyImg
                      }
                      style={{
                        height: "75%",
                        width: "100%",
                        borderBottomLeftRadius: Sizes.Radius,
                        borderBottomRightRadius: Sizes.Radius,
                      }}
                    />
                    {index != 0 ? (
                      <LottieView
                        source={require("../../assets/LottieAnimation/rewardLock.json")}
                        autoPlay
                        loop
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: [{ translateX: -25 }, { translateY: -25 }],
                          height: 50,
                          width: 50,
                        }}
                      />
                    ) : null}
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
        <TextButton
          label={loading ? "Activating..." : "Activate"}
          loading={loading}
          onPress={() => {
            onActivate();
          }}
        />
      </View>
    </Modal>
  );
};

export default PlanActivationModal;
