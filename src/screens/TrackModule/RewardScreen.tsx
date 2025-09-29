import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
} from "react-native";
import { StackProps } from "../../routes";
import { Header, Modal, TextButton, Toast } from "../../Components";
import {
  BASE_URL,
  Reducers,
  apiPost,
  apiPut,
  useDispatch,
  useSelector,
} from "../../Modules";
import { noData, scratchpattern } from "../../../assets";
import { ScratchCard } from "../../Components/ScratchCard";
import LottieView from "lottie-react-native";
import { REWARD_SCREEN_INTERFACE } from "../../Modules/interface2";
import { useImage } from "@shopify/react-native-skia";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = StackProps<"RewardScreen">;
interface ImageData {
  id: number;
  url: string;
  IS_BLUR: boolean;
  IS_LOCK: boolean;
}

const RewardScreen = ({ navigation, route }: Props): JSX.Element => {
  const { Sizes, Colors, Fonts } = useSelector((state) => state.app);
  const { member } = useSelector((state) => state.member);
  const { aniVideoButtonStatus, animationVideoData, animationVideoTime } =
    useSelector((state) => state.trackModule);
  const [Loader, SetLoader] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [openScratchCard, setOpenScratchCard] = useState(false);
  const [showBoom, setShowBoom] = useState(false);
  const [unlockItem, setUnlockItem] = useState<any>({
    data: {},
    id: 0,
  });
  const [RewardData, setRewardData] = useState<ImageData[]>([]);
  const image = useImage(scratchpattern);
  const [showRewardImage, setShowRewardImage] = useState(false);
  const [unlockVideoLoader, setUnlockVideoLoader] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    GetReward();
  }, []);

  const GetReward = async () => {
    const details: any = await AsyncStorage.getItem("VIDEO_DETAILS");
    const data = JSON.parse(details);
    const USER_ANIMATION_DETAIL_ID = data.ID;
    try {
      let res = await apiPost("api/userRewards/get", {
        filter: `AND USER_ANIMATION_DETAIL_ID = ${USER_ANIMATION_DETAIL_ID} `,
        // filter: `AND USER_ANIMATION_DETAIL_ID = ${USER_ANIMATION_DETAIL_ID} AND STATUS IN (1,'L','A') `,
      });
      if (res && res.code == 200) {
        if (res.count == 0) {
        } else {
          const status = res.data.every((item: any) => item.STATUS == "A");
          status
            ? dispatch(Reducers.setAniVideoButtonStatus(false))
            : dispatch(Reducers.setAniVideoButtonStatus(true));
          setRewardData(res.data);
        }
        SetLoader(false);
      }
    } catch (error) {
      console.error("Error fetching default images:", error);
    }
  };

  const ScratchCompleted = (item: any, index: number) => {
    const updatedRewardData = [...RewardData];
    updatedRewardData[index] = { ...updatedRewardData[index], IS_BLUR: false };
    UpdateStatus(item, "A");
  };

  const UpdateStatus = async (
    item: REWARD_SCREEN_INTERFACE,
    STATUS: string
  ) => {
    try {
      let body = {
        ...item,
        STATUS: STATUS,
      };
      const res = await apiPut("api/userRewards/update", body);
      if (res && res.code == 200) {
        // console.log('\n\n\nupdate status', res);
        setShowBoom(true);
        GetReward();
        setOpenScratchCard(false);
        setShowRewardImage(false);
        SetLoader(false);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: REWARD_SCREEN_INTERFACE;
    index: number;
  }) => {
    const itemWidth = (Sizes.Width - Sizes.Padding * 3) / 2;
    return (
      <TouchableOpacity
        style={{
          width: itemWidth,
          aspectRatio: 1,
          margin: Sizes.Base / 2,
          borderRadius: Sizes.Radius,
          overflow: "hidden",
        }}
        onPress={() => {
          if (item.STATUS === "L") {
          } else if (item.STATUS == 1) {
            setUnlockItem({ data: item, id: index });
            // setOpenAlert(true);
            setOpenScratchCard(true);
          }
        }}
      >
        {item.STATUS === "L" ? (
          <View style={{ flex: 1 }}>
            <Image
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                borderRadius: Sizes.Radius,
              }}
              source={scratchpattern}
            />
            <LottieView
              source={require("../../../assets/LottieAnimation/rewardLock.json")}
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
          </View>
        ) : item.STATUS == "U" ? (
          <TouchableOpacity
            onPress={() => {
              setUnlockItem({ data: item, id: index });
              // setOpenAlert(true);
              setOpenScratchCard(true);
            }}
            style={{ flex: 1 }}
          >
            <Image
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                borderRadius: Sizes.Radius,
              }}
              source={scratchpattern}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }}>
            <Image
              source={{
                uri: BASE_URL + "static/rewardImage/" + item.REWARD_IMG_URL,
              }}
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                borderRadius: Sizes.Radius,
              }}
            />
            <Text
              style={{
                ...Fonts.Medium4,
                color: Colors.PrimaryText1,
                textAlign: "center",
                // marginTop: -Sizes.Radius,
              }}
            >
              {"" + item.REWARD_NAME}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const sortRewardData = (data: ImageData[]) => {
    return data.sort((a: any, b: any) => {
      const order: any = { A: 1, U: 2, L: 3 };
      return order[a.STATUS] - order[b.STATUS];
    });
  };
  const sortedData = sortRewardData([...RewardData]);

  const updateVideoTimingData = async () => {
    setUnlockVideoLoader(true);
    try {
      const res = await apiPost("api/userAnimationDetails/addRewards", {
        USER_ID: member?.ID,
        PREVIOUS_SEQ: animationVideoTime.seqNo,
      });
      if (res && res.code == 200) {
        console.log("\n\nres...", res);
        setUnlockVideoLoader(false);
        SetLoader(true);
        getVideoDetails(animationVideoData.ID);
      } else {
        Toast("Something wrong please try again later..!");
        setUnlockVideoLoader(false);
      }
    } catch (error) {
      Toast("Something wrong please try again later..!");
      setUnlockVideoLoader(false);
      console.log("error..", error);
    }
  };
  // const getActivationDetails = async () => {
  //   const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  //   const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');
  //   AsyncStorage.setItem('SUBSCRIPTION_DETAILS', '');
  //   try {
  //     const res = await apiPost('api/userSubscriptionDetails/get', {
  //       filter: `AND USER_ID=${member?.ID} AND (START_DATE <= '${endOfMonth}' AND END_DATE >= '${startOfMonth}') `,
  //     });
  //     if (res && res.code == 200) {
  //       if (res.data.length > 0) {
  //         const jsonValue = JSON.stringify(res.data[0]);
  //         await AsyncStorage.setItem('SUBSCRIPTION_DETAILS', jsonValue);
  //         dispatch(Reducers.setAnimationVideoData(res.data[0]));
  //         getVideoDetails(res.data[0].ID);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const getVideoDetails = async (Id: number) => {
    try {
      const res = await apiPost("api/userAnimationDetails/get", {
        filter: `AND SUBSCRIPTION_DETAILS_ID = ${Id} AND STATUS = 1 `,
        sortKey: "ID",
        sortValue: "DESC",
      });
      if (res && res.code == 200) {
        const jsonValue = JSON.stringify(res.data[0]);
        await AsyncStorage.setItem("VIDEO_DETAILS", jsonValue);
        dispatch(Reducers.setAnimationVideoTime(res.data[0]));
        GetReward();
        navigation.goBack();
      } else {
        Toast("Something wrong try again later..");
      }
    } catch (error) {}
  };
  return (
    <View style={{ flex: 1 }}>
      <Header
        onBack={() => {
          navigation.goBack();
        }}
        label="Reward"
      />

      {Loader ? (
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: Sizes.Base,
          }}
        >
          <ActivityIndicator size={"small"} color={Colors.Primary} />
        </SafeAreaView>
      ) : RewardData.length === 0 ? (
        <SafeAreaView
          style={{
            flex: 1,
            alignItems: "center",
            marginHorizontal: Sizes.Base,
            marginTop: Sizes.Header * 2,
          }}
        >
          <Image
            resizeMode={"contain"}
            style={{ width: 150, height: 150 }}
            source={noData}
            tintColor={Colors.Primary}
          />
        </SafeAreaView>
      ) : (
        <View style={{ flex: 1 }}>
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium4,
              color: Colors.PrimaryText1,
              marginHorizontal: Sizes.ScreenPadding,
              marginTop: Sizes.ScreenPadding,
              marginBottom: -Sizes.Base,
            }}
          >
            Finish all daily tasks to unlock your next reward
          </Text>
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: Sizes.Padding,
              paddingVertical: Sizes.Padding,
            }}
            //@ts-ignore
            data={sortedData}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            renderItem={renderItem}
          />
        </View>
      )}

      {!aniVideoButtonStatus && (
        <View
          style={{
            margin: Sizes.Padding,
          }}
        >
          <TextButton
            label="Unlock Video"
            loading={unlockVideoLoader}
            onPress={() => {
              updateVideoTimingData();
            }}
            disable={aniVideoButtonStatus}
          />
        </View>
      )}

      {openAlert && (
        <Modal
          onClose={() => {
            setOpenAlert(false);
          }}
          isVisible={openAlert}
        >
          <View
            style={{
              padding: Sizes.Padding,
              backgroundColor: Colors.Background,
              borderRadius: Sizes.Radius,
            }}
          >
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Bold2,
                marginBottom: Sizes.Padding,
              }}
            >
              Reward Unlocked!!
            </Text>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Medium3,
                marginBottom: Sizes.Padding,
              }}
            >
              Are you sure you want to unlock this reward? Once unlocked, you'll
              be able to access its benefits.
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <TextButton
                isBorder
                style={{
                  flex: 1,
                  borderColor: Colors.Secondary,
                  marginRight: Sizes.Padding,
                }}
                label="No"
                loading={false}
                onPress={() => setOpenAlert(false)}
              />
              <TextButton
                style={{ flex: 1 }}
                label="Yes"
                loading={false}
                onPress={() => {
                  setOpenAlert(false);
                  setOpenScratchCard(true);
                  // UpdateStatus(unlockItem, 'U');
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      {openScratchCard && (
        <Modal
          containerStyle={{ flex: 1 }}
          title="Scratch image to unlock"
          onClose={() => {
            setShowRewardImage(false);
            setOpenScratchCard(false);
          }}
          isVisible={openScratchCard}
        >
          <View
            style={{
              alignItems: "center",
            }}
          >
            <ScratchCard
              STORK_WIDTH={50}
              // key={`scratch-${index}`}
              OnScratched={() => {
                Toast("scratch completed");
                ScratchCompleted(unlockItem.data, unlockItem.id);
              }}
              ChildrenStyle={{
                width: "100%",
                height: "100%",
                borderRadius: Sizes.Radius,
              }}
              style={{
                borderRadius: Sizes.Radius,
                marginVertical: Sizes.ScreenPadding,
                width: "100%",
                height: 300,
              }}
              setShowRewardImage={setShowRewardImage}
              //@ts-ignore
              image={image}
            >
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  borderRadius: Sizes.Radius,
                }}
              >
                {showRewardImage && (
                  <Image
                    source={{
                      uri:
                        BASE_URL +
                        "static/rewardImage/" +
                        unlockItem.data.REWARD_IMG_URL,
                    }}
                    style={{
                      height: "100%",
                      width: "100%",
                    }}
                  />
                )}
              </View>
            </ScratchCard>
          </View>
        </Modal>
      )}

      {showBoom && (
        <LottieView
          source={require("../../../assets/LottieAnimation/cele.json")}
          style={{
            height: "100%",
            width: "100%",
            alignSelf: "center",
            position: "absolute",
          }}
          autoPlay={true}
          loop={false}
          onAnimationFinish={() => {
            setShowBoom(false);
          }}
        />
      )}
    </View>
  );
};

export default RewardScreen;
