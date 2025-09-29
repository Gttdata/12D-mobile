import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { StackProps } from "../../routes";
import { IMAGE_URL, apiPost, apiPut } from "../../Modules/service";
import { useSelector } from "../../Modules";
import CircularProgress from "react-native-circular-progress-indicator";
import { Icon, TextButton, Toast } from "../../Components";
import WorkoutTimer from "../../Components/WorkoutTimer";
import moment from "moment";
import LottieView from "lottie-react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
} from "react-native-reanimated";
import { BannerAds } from "../../Modules/AdsUtils";
import SoundPlayer from "react-native-sound-player";
type Props = StackProps<"StartWorkout">;

const StartWorkout = ({ navigation, route }: Props) => {
  const { Sizes, Colors, Fonts } = useSelector((state) => state.app);
  const { member } = useSelector((state) => state.member);

  const {
    Item,
    prevWorkPerentage,
    TotalActivity,
    masterId,
    tabName,
    REST_TIME,
    ACTIVITY_TYPE,
  } = route.params;

  const [showCompletionAnimation, setCompletionAnimation] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(0);
  const [workoutTime, setWorkoutTime] = useState(null);
  const [workoutPercentage, setworkoutPercentage] = useState(prevWorkPerentage);
  const [restView, setRestView] = useState(true);
  const [pause, setPaused] = useState(false);
  const getPrevPercentage = async (type: any, status: string) => {
    try {
      const res = await apiPost("api/activityUser/get", {
        filter: `AND ID = ${masterId} `,
      });
      if (res && res.code == 200) {
        setworkoutPercentage(res.data[0].COMPLETED_PERCENTAGE);
        if (type == "update") {
          const percentage =
            tabName == "B"
              ? res.data[0].COMPLETED_PERCENTAGE
              : tabName == "I"
              ? res.data[0].INTERMEDIATE_PERCENTAGE
              : res.data[0].ELITE_PERCENTAGE;
          updateWorkoutPercentage(percentage, status);
        }
      }
    } catch (error) {
      console.log("error..", error);
    }
  };
  const updateWorkoutPercentage = async (
    workoutPercentage: any,
    status: string
  ) => {
    try {
      let body = {
        USER_ID: member?.ID,
        ID: masterId,
        // CURRENT_ACTIVITY_ID: Item[currentWorkout].ACTIVITY_ID,
        CURRENT_ACTIVITY_ID: Item[currentWorkout].ACTIVITY_MAPPING_ID,
        END_DATETIME: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        START_DATETIME: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        CLIENT_ID: 1,
        CATEGORY: Item[currentWorkout].CATEGORY,
      };
      {
        tabName == "B"
          ? (body = {
              ...body,
              COMPLETED_PERCENTAGE:
                status == "C"
                  ? workoutPercentage + 100 / TotalActivity.length
                  : workoutPercentage,
            })
          : Item[currentWorkout].CATEGORY == "B"
          ? (body = {
              ...body,
              COMPLETED_PERCENTAGE:
                status == "C"
                  ? workoutPercentage + 100 / TotalActivity.length
                  : workoutPercentage,
            })
          : Item[currentWorkout].CATEGORY == "I"
          ? (body = {
              ...body,
              INTERMEDIATE_PERCENTAGE:
                status == "C"
                  ? workoutPercentage + 100 / TotalActivity.length
                  : workoutPercentage,
            })
          : (body = {
              ...body,
              ELITE_PERCENTAGE:
                status == "C"
                  ? workoutPercentage + 100 / TotalActivity.length
                  : workoutPercentage,
            });
      }
      // console.log('body', body);
      const res = await apiPut("api/activityUser/update", body);
      if (res && res.code == 200) {
        if (Item.length - 1 === currentWorkout) {
          navigation.navigate("CompletionScreen");
        } else {
          setCurrentWorkout(currentWorkout + 1);
          setRestView(true);
          setPaused(false);
        }
      }
    } catch (error) {
      console.log("error..", error);
    }
  };
  const UpdateUserWorkout = async (status: string) => {
    try {
      let body = {
        ACTIVITY_GIF: Item[currentWorkout].ACTIVITY_GIF,
        // ACTIVITY_MAPPING_ID:Item[currentWorkout].ACTIVITY_MAPPING_ID,
        ACTIVITY_NAME: Item[currentWorkout].ACTIVITY_NAME,
        ACTIVITY_TYPE: Item[currentWorkout].ACTIVITY_TYPE,
        ACTIVITY_VALUE: Item[currentWorkout].ACTIVITY_VALUE,
        DESCRIPTION: Item[currentWorkout].DESCRIPTION,

        ID: Item[currentWorkout].ID,
        MASTER_ID: masterId,
        ACTIVITY_ID: Item[currentWorkout].ACTIVITY_ID,
        // ACTIVITY_TIMING:
        //   Item[currentWorkout].ACTIVITY_TYPE == 'T' ? workoutTime : '',
        // ACTIVITY_SETS:
        //   Item[currentWorkout].ACTIVITY_TYPE == 'S'
        //     ? Item[currentWorkout].ACTIVITY_SET
        //     : '',
        // ACTIVITY_STATUS:
        //   Item[currentWorkout].ACTIVITY_TYPE == 'S' ? 'C' : status,

        ACTIVITY_STATUS: status,
        COMPLETED_DATETIME: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        CLIENT_ID: 1,
        CATEGORY: tabName,
      };

      const res = await apiPut("api/activityUserMapping/update", body);
      if (res && res.code == 200) {
        getPrevPercentage("update", status);
      }
    } catch (error) {
      console.log("error..", error);
    }
  };

  const handleBack = () => {
    setPaused(true);
    SoundPlayer.pause();
    navigation.goBack();
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.White }}>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: Sizes.Padding,
            marginTop: Sizes.Base,
          }}
        >
          <Icon
            onPress={() => handleBack()}
            name="arrow-back"
            type="Ionicons"
            size={20}
            color={Colors.White}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: Colors.Secondary,
              justifyContent: "center",
              alignItems: "center",
            }}
          />
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              marginTop: Sizes.Base,
            }}
          >
            {restView && (
              <Text
                style={{
                  color: Colors.Black,
                  ...Fonts.Bold1,
                  textAlign: "center",
                  fontSize: 22,
                }}
              >
                {"Upcoming Exercise"}
              </Text>
            )}
            <Text
              style={{
                color: Colors.Primary,
                ...Fonts.Bold1,
                textAlign: "center",
                fontSize: 22,
              }}
            >
              {Item[currentWorkout].ACTIVITY_NAME}
            </Text>
          </View>
        </View>
        <Image
          resizeMethod="scale"
          source={{
            uri: IMAGE_URL + "activityGIF/" + Item[currentWorkout].ACTIVITY_GIF,
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            height: restView ? "41%" : 350,
            width: "100%",
            margin: Sizes.Base,
          }}
          resizeMode="contain"
        />

        {restView && (
          <Animated.View entering={FadeInDown}>
            <Text
              style={{
                color: Colors.Primary,
                ...Fonts.Bold1,
                textAlign: "center",
                fontSize: 36,
              }}
            >
              {currentWorkout == 0 ? "READY TO GO!" : "Take a Rest"}
            </Text>
            <View
              style={{ alignSelf: "center", marginTop: Sizes.ScreenPadding }}
            >
              <CircularProgress
                activeStrokeColor={Colors.Primary}
                value={0}
                radius={80}
                maxValue={REST_TIME}
                initialValue={REST_TIME}
                progressValueColor={Colors.Primary}
                activeStrokeWidth={15}
                inActiveStrokeWidth={15}
                duration={REST_TIME * 1000}
                onAnimationComplete={async () => {
                  setRestView(false);
                  ACTIVITY_TYPE == "C"
                    ? null
                    : SoundPlayer.playAsset(
                        require("../../../assets/sounds/start.mp3")
                      );
                  const data =
                    ACTIVITY_TYPE == "C" ? null : await SoundPlayer.getInfo();
                  console.log("Animation complete!", data);
                }}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.98}
              onPress={() => {
                setRestView(false);
                ACTIVITY_TYPE == "C"
                  ? null
                  : SoundPlayer.playAsset(
                      require("../../../assets/sounds/start.mp3")
                    );
              }}
              style={{
                flexDirection: "row",
                width: "85%",
                alignItems: "center",
                justifyContent: "space-evenly",
                alignSelf: "center",
                marginTop: Sizes.ScreenPadding,
              }}
            >
              <Text
                style={{
                  ...Fonts.Medium2,
                  color: Colors.PrimaryText1,
                  textAlign: "center",
                  width: "63%",
                  alignSelf: "center",
                }}
              >
                Skip rest time and start exercise immediately
              </Text>
              <Icon
                onPress={() => {
                  setRestView(false);
                  ACTIVITY_TYPE == "C"
                    ? null
                    : SoundPlayer.playAsset(
                        require("../../../assets/sounds/start.mp3")
                      );
                }}
                name="chevron-forward"
                type="Ionicons"
                size={24}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: Colors.Secondary,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  right: Sizes.Padding,
                  paddingLeft: 5,
                }}
              />
            </TouchableOpacity>
            <BannerAds />
          </Animated.View>
        )}
      </View>
      {!restView && (
        <Animated.View entering={FadeInUp} style={{ flex: 1 }}>
          {Item[currentWorkout].ACTIVITY_TYPE == "T"? (
           <WorkoutTimer
              onTimerTick={(time: any) => {
                setWorkoutTime(Item[currentWorkout].ACTIVITY_VALUE - time);
              }}
              durationInSeconds={Item[currentWorkout].ACTIVITY_VALUE}
              isPaused={pause}
              ACTIVITY_TYPE={ACTIVITY_TYPE}
              onTimerEnd={() => {
                if (!pause) {
                  UpdateUserWorkout("C");
                }
              }}
            />
          ) : Item[currentWorkout].ACTIVITY_TYPE == "S" ? (
            <Text
              style={{
                fontSize: 60,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >{`X ${Item[currentWorkout].ACTIVITY_VALUE}`}</Text>
          ) : Item[currentWorkout].ACTIVITY_TYPE == "D" ? (
            <Text
              style={{
                fontSize: 40,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {Number(Item[currentWorkout].ACTIVITY_VALUE) > 1000
                ? Number(Item[currentWorkout].ACTIVITY_VALUE) / 1000 + " Km"
                : Item[currentWorkout].ACTIVITY_VALUE + " Meter"}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 40,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {Number(Item[currentWorkout].ACTIVITY_VALUE) > 1000
                ? Number(Item[currentWorkout].ACTIVITY_VALUE) / 1000 + " Kg"
                : Item[currentWorkout].ACTIVITY_VALUE + " G"}
            </Text>
          )}

          {Item[currentWorkout].ACTIVITY_TYPE == "T" && (
            <View style={{ margin: Sizes.ScreenPadding }}>
              <TouchableOpacity
                onPress={() => {
                  setPaused(!pause);
                  if (!pause) {
                    SoundPlayer.pause();
                  } else {
                    SoundPlayer.play();
                  }
                }}
                style={{
                  backgroundColor: pause ? "red" : "lightgreen",
                  padding: Sizes.Base,
                  borderRadius: 40,
                  width: 80,
                  height: 80,
                  alignSelf: "center",
                }}
              >
                <Icon
                  size={50}
                  name={!pause ? "pause" : "controller-play"}
                  type={!pause ? "Ionicons" : "Entypo"}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  color={Colors.White}
                />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      )}

      {!restView && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingBottom: Sizes.Padding,
            marginHorizontal: Sizes.ScreenPadding,
          }}
        >
          <View style={{ flex: 1 }}>
            <TextButton
              isBorder
              label="Skip This Exercise"
              loading={false}
              onPress={() => {
                setPaused(true);
                ACTIVITY_TYPE == "C" ? null : SoundPlayer.pause();
                UpdateUserWorkout("S");
              }}
            />
          </View>
          {(Item[currentWorkout].ACTIVITY_TYPE == "S" ||
            Item[currentWorkout].ACTIVITY_TYPE == "D" ||
            Item[currentWorkout].ACTIVITY_TYPE == "W") && (
            <View style={{ width: 10 }} />
          )}
          {(Item[currentWorkout].ACTIVITY_TYPE == "S" ||
            Item[currentWorkout].ACTIVITY_TYPE == "D" ||
            Item[currentWorkout].ACTIVITY_TYPE == "W") && (
            <View style={{ flex: 1 }}>
              <TextButton
                label="Done"
                loading={false}
                onPress={() => {
                  UpdateUserWorkout("C");
                }}
              />
            </View>
          )}
        </View>
      )}
      {showCompletionAnimation && (
        <View style={{ flex: 1, position: "absolute", alignSelf: "center" }}>
          <LottieView
            source={require("../../../assets/LottieAnimation/cele.json")}
            style={{
              height: "100%",
              width: "100%",
              alignSelf: "center",
              position: "absolute",
            }}
            autoPlay={true}
          />
          <Text
            style={{
              position: "absolute",
              color: Colors.Primary,
              ...Fonts.Bold1,

              alignSelf: "center",
              textAlignVertical: "center",
            }}
          >
            Congratulations You Did it!
          </Text>
        </View>
      )}
    </View>
  );
};

export default StartWorkout;
