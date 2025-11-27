import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  BackHandler,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { DAILY_TRACK_BOOK_TASK } from "../../Modules/interface";
import {
  BASE_URL,
  Reducers,
  apiPost,
  useDispatch,
  useSelector,
} from "../../Modules";
import { Header, Icon, Modal, TextButton, Toast } from "../../Components";
import moment from "moment";
import { noData, scratchpattern } from "../../../assets";
import { StackProps } from "../../routes";
import {
  openDatabase,
  getTasksByDate,
  insertTasks,
  updateTasksByDate,
  deleteTasksByDate,
  createSubmitApiFlagTable,
  setSubmitApiCalledFlag,
  getSubmitApiCalledFlag,
  deleteTableData,
} from "./db";
import Days from "../../Components/Days";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BannerAds } from "../../Modules/AdsUtils";
// @ts-ignore
import Video from "react-native-video";
import { useFocusEffect } from "@react-navigation/native";
import Shimmer from "react-native-shimmer";
import LottieView from "lottie-react-native";
import TrackInfo from "./TrackInfo";
import Slider from "@react-native-community/slider";

type Props = StackProps<"GetTasks">;
const GetTasks = ({ navigation, route }: Props) => {
  const { Sizes, Colors, Fonts } = useSelector((state) => state.app);
  const { member } = useSelector((state) => state.member);
  const { type } = route.params;
  const { aniVideoButtonStatus, animationVideoData, animationVideoTime } =
    useSelector((state) => state.trackModule);
  const videoRef: any = useRef(null);
  const dispatch = useDispatch();
  const [videoLoad, setVideoLoad] = useState(true);
  const [infoModal, setInfoModal] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [unlockVideo, setUnlockVideo] = useState({
    lock: false,
    openWarnPopUp: false,
    showUnlockPopUp: false,
    disableRewardIcon: false,
  });
  const [unlockVideoLoader, setUnlockVideoLoader] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [taskData, setTaskData] = useState<{
    data: Array<DAILY_TRACK_BOOK_TASK>;
    loading: boolean;
  }>({
    data: [],
    loading: true,
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    loading: false,
    showSubmitButton: true,
  });
  const [openAlertMsg, setOpenAlertMsg] = useState(false);
  const [boom, setBoom] = useState(false);
  const [day, setDay] = useState<any>({
    startDay: null,
    totalDays: 0,
    currentDay: 0,
  });
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const isProgrammaticSeek = useRef(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [shoExitModal, setShowExitModal] = useState(false);

  // Throttle ref for progress handler
  const progressHandlerRef = useRef<NodeJS.Timeout | null>(null);

  useFocusEffect(
    useCallback(() => {
      GetReward();
    }, [navigation, selectedDate])
  );

  useEffect(() => {
    openDatabase();
    createSubmitApiFlagTable();
    getTrackTask();
  }, [selectedDate]);

  const getTrackTask = async () => {
    const submitApiCalled = await getSubmitApiCalledFlag(
      member?.ID,
      selectedDate
    );
    submitApiCalled
      ? setData({ ...data, showSubmitButton: false })
      : setData({ ...data, showSubmitButton: true });

    setTaskData({ ...taskData, loading: true });

    const subscriptionDetails = await AsyncStorage.getItem(
      "SUBSCRIPTION_DETAILS"
    );

    let subscriptionData = null;
    if (subscriptionDetails) {
      subscriptionData = JSON.parse(subscriptionDetails);
    }

    if (subscriptionDetails) {
      const subscriptionData = JSON.parse(subscriptionDetails);
      const startDate = moment(subscriptionData.START_DATE);
      const endDate = moment(subscriptionData.END_DATE);
      const today = moment();
      const totalDays = endDate.diff(startDate, "days") + 1;
      const currentDay = today.diff(startDate, "days") + 1;
      setDay({
        startDay: startDate,
        totalDays: totalDays,
        currentDay: currentDay > totalDays ? totalDays : currentDay,
      });
    }
    try {
      getTasksByDate(selectedDate, member?.ID, async (storedData: any) => {
        if (storedData.length > 0) {
          const buttonStatus = storedData.every(
            (item: DAILY_TRACK_BOOK_TASK) => item.STATUS !== "0"
          );
          if (buttonStatus && !submitApiCalled) {
            const res = await apiPost("api/userTrackbook/get", {
              filter: ` AND USER_ID = ${member?.ID} AND DATE(ASSIGNED_DATE) = "${selectedDate}" `,
              sortKey: "DIAMENTION_ID",
              sortValue: "ASC",
            });

            console.log("USER TREACKBOOK", res);

            const checkStatus = res.data.every(
              (item: DAILY_TRACK_BOOK_TASK) => item.STATUS !== "0"
            );
            if (checkStatus) {
              await setSubmitApiCalledFlag(member?.ID, selectedDate);
              getTrackTask();
            } else {
              setTaskData({ ...taskData, data: storedData, loading: false });
            }
          } else {
            setTaskData({ ...taskData, data: storedData, loading: false });
          }
        } else {
          const res = await apiPost("api/userTrackbook/get", {
            filter: `AND USER_ID = ${member?.ID} AND SUBSCRIPTION_DETAILS_ID = ${subscriptionData?.ID} AND DATE(ASSIGNED_DATE) = "${selectedDate}" `,
            sortKey: "DIAMENTION_ID",
            sortValue: "ASC",
          });
          // console.log('--------------', res)
          if (res && res.code === 200) {
            if (res.data.length > 0) {
              try {
                const data = res.data.map((item: DAILY_TRACK_BOOK_TASK) => ({
                  ...item,
                  ASSIGNED_DATE: moment(item.ASSIGNED_DATE).format(
                    "YYYY-MM-DD"
                  ),
                }));
                await insertTasks(data);
                setOpenAlertMsg(false);
                getTrackTask();
              } catch (e) {
                console.error("Failed to save data to SQLite", e);
              }
            } else {
              setTaskData({ ...taskData, loading: false, data: [] });
            }
          } else {
            setTaskData({ ...taskData, loading: false });
            Toast("Something went wrong. Please try again");
          }
        }
      });
    } catch (error) {
      setTaskData({ ...taskData, loading: false });
      console.error("Error:", error);
    }
  };

  const completeTask = async () => {
    setData({ ...data, loading: true });
    try {
      const bulkUpdateData = taskData.data.map((item) => {
        const newAssignedDate = moment(item.ASSIGNED_DATE).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        const newStatus = item.STATUS === "0" ? "N" : item.STATUS;
        return { ...item, ASSIGNED_DATE: newAssignedDate, STATUS: newStatus };
      });

      const res = await apiPost("api/userTrackbook/updateTask", {
        bulkUpdateData,
      });

      if (res && res.code == 200) {
        setOpenAlertMsg(false);
        if (bulkUpdateData.every((item) => item.STATUS == "D")) {
          setBoom(true);
        }
        await deleteTasksByDate(selectedDate);
        await setSubmitApiCalledFlag(member?.ID, selectedDate);
        Toast("Save data successfully");
        getTrackTask();
      } else {
        setData({ ...data, loading: false });
      }
    } catch (error) {
      setData({ ...data, loading: false });
      console.log("error..", error);
    }
  };

  const handleSelectButton = useCallback((item: DAILY_TRACK_BOOK_TASK, status: string) => {
    setTaskData((prevState) => {
      const updatedData = prevState.data.map((task) => {
        if (task.ID === item.ID) {
          task.STATUS = task.STATUS === status ? "0" : status;
        }
        return task;
      });
      return { ...prevState, data: updatedData };
    });
  }, []);

  const goBack = async () => {
    try {
      await updateTasksByDate(taskData.data);
    } catch (e) {
      console.log("Failed to save data to AsyncStorage", e);
    }
    navigation.navigate("Dashboard");
  };

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        goBack();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    }, [taskData.data, navigation])
  );

  const sortTaskData = (data: any) => {
    return data.sort((a: any, b: any) => {
      const currentTime = moment(new Date()).format("HH:mm:ss");
      const isDisabledA =
        (a.STATUS === "0" || a.STATUS === "N") &&
        currentTime > a.DISABLE_TIMING;
      const isDisabledB =
        (b.STATUS === "0" || b.STATUS === "N") &&
        currentTime > b.DISABLE_TIMING;

      const isBeforeEnableA = currentTime < a.ENABLE_TIME;
      const isBeforeEnableB = currentTime < b.ENABLE_TIME;

      const isEnabledA =
        a.STATUS !== "0" && a.STATUS !== "N" && currentTime > a.DISABLE_TIMING;
      const isEnabledB =
        b.STATUS !== "0" && b.STATUS !== "N" && currentTime > b.DISABLE_TIMING;

      if (isDisabledA !== isDisabledB) {
        return isDisabledA ? 1 : -1;
      }

      if (isBeforeEnableA !== isBeforeEnableB) {
        return isBeforeEnableA ? 1 : -1;
      }

      if (isEnabledA !== isEnabledB) {
        return isEnabledA ? 1 : -1;
      }

      return 0;
    });
  };

  // Memoized sorted data
  const sortedData = useMemo(() => {
    return sortTaskData(taskData.data);
  }, [taskData.data]);

  const GetReward = async () => {
    const details: any = await AsyncStorage.getItem("VIDEO_DETAILS");
    const data = JSON.parse(details);
    const USER_ANIMATION_DETAIL_ID = data.ID;
    try {
      let res = await apiPost("api/userRewards/get", {
        filter: `AND USER_ANIMATION_DETAIL_ID = ${USER_ANIMATION_DETAIL_ID} `,
      });
      console.log("GET REWARD", res);

      if (res && res.code == 200) {
        if (res.count == 0) {
          updateVideoTimingData();
        } else {
          setUnlockVideo({
            ...unlockVideo,
            disableRewardIcon: false,
            lock: false,
            showUnlockPopUp: false,
          });
          const status = res.data.every((item: any) => item.STATUS == "A");
          status
            ? dispatch(Reducers.setAniVideoButtonStatus(false))
            : dispatch(Reducers.setAniVideoButtonStatus(true));
        }
        setVideoPaused(false);
        setUnlockVideoLoader(false);
      }
    } catch (error) {
      console.error("Error fetching default images:", error);
    }
  };

  const updateVideoTimingData = async () => {
    setUnlockVideoLoader(true);
    try {
      const res = await apiPost("api/userAnimationDetails/addRewards", {
        USER_ID: member?.ID,
        PREVIOUS_SEQ: animationVideoTime.seqNo,
      });
      if (res && res.code == 200) {
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
      } else {
        Toast("Something wrong try again later..!");
        setUnlockVideoLoader(false);
      }
    } catch (error) { }
  };

  // Optimized showControls with useCallback
  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (controlTimeoutRef.current) clearTimeout(controlTimeoutRef.current);

    controlTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 5000);
  }, []);

  // Optimized progress handler with throttling
  const handleProgress = useCallback((e: any) => {
    // Throttle the progress updates
    if (progressHandlerRef.current) return;

    progressHandlerRef.current = setTimeout(() => {
      setCurrentTime(e.currentTime);

      if (!videoPaused && e.currentTime > animationVideoTime.startTime) {
        isProgrammaticSeek.current = true;
        videoRef.current.seek(animationVideoTime.startTime);
        setVideoPaused(true);
        setTimeout(() => {
          isProgrammaticSeek.current = false;
        }, 0);
      }
      progressHandlerRef.current = null;
    }, 100); // Update every 100ms instead of every frame
  }, [videoPaused, animationVideoTime.startTime]);

  // Memoized control handlers
  const handleSeekBack = useCallback(() => {
    const newTime = Math.max(currentTime - 10, 0);
    videoRef.current.seek(newTime);
    setCurrentTime(newTime);
  }, [currentTime]);

  const handleSeekForward = useCallback(() => {
    if (!videoPaused) {
      const newTime = Math.min(currentTime + 10, videoDuration);
      videoRef.current.seek(newTime);
      setCurrentTime(newTime);
    }
  }, [currentTime, videoDuration, videoPaused]);

  const handlePlayPause = useCallback(() => {
    setVideoPaused(!videoPaused);
    showControls();
  }, [videoPaused, showControls]);

  // Memoized video controls component
  const videoControls = useMemo(() => {
    if (!controlsVisible) return null;

    return (
      <>
        <Slider
          style={{
            width: '100%',
            position: 'absolute',
            bottom: 50,
            left: 0,
            right: 0,
            zIndex: 3,
          }}
          minimumValue={0}
          maximumValue={videoDuration}
          value={currentTime}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#888888"
          thumbTintColor="#FFFFFF"
          onValueChange={(value) => setCurrentTime(value)}
          onSlidingComplete={(value) => {
            videoRef.current.seek(value);
          }}
        />

        <View
          style={{
            position: "absolute",
            bottom: 10,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            zIndex: 3,
          }}
        >
          <TouchableOpacity onPress={handleSeekBack}>
            <Icon
              size={24}
              name="banckward"
              type="AntDesign"
              color={Colors.White}
            />
          </TouchableOpacity>

          {videoPaused ? (
            <TouchableOpacity onPress={handlePlayPause}>
              <Icon
                size={24}
                name="caretright"
                type="AntDesign"
                color={Colors.White}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handlePlayPause}>
              <Icon
                size={24}
                name="pause"
                type="AntDesign"
                color={Colors.White}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={handleSeekForward}>
            <Icon
              size={22}
              name="forward"
              type="AntDesign"
              color={Colors.White}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  }, [controlsVisible, currentTime, videoDuration, videoPaused, Colors, handleSeekBack, handleSeekForward, handlePlayPause]);

  // Memoized subscription days section
  const subscriptionDaysSection = useMemo(() => {
    if (taskData.loading) return null;

    return (
      <View
        style={{
          paddingVertical: Sizes.Padding,
          backgroundColor: Colors.Primary2,
          borderRadius: Sizes.Radius,
          marginTop: Sizes.Padding,
          marginHorizontal: Sizes.Padding,
        }}
      >
        <Text
          style={{
            color: Colors.White,
            ...Fonts.Bold2,
            marginLeft: Sizes.Padding,
          }}
        >
          Subscription Days
        </Text>
        <Days
          startDay={day.startDay}
          totalDays={day.totalDays}
          currentDay={day.currentDay}
          onPress={async (date: any) => {
            console.log("\n\n..date...", date);
            await updateTasksByDate(taskData.data);
            setSelectedDate(date);
          }}
        />
      </View>
    );
  }, [taskData.loading, day, Sizes, Colors, Fonts, taskData.data]);

  // Memoized task item renderer
  const renderTaskItem = useCallback(({ item, index }: { item: DAILY_TRACK_BOOK_TASK; index: number }) => {
    const backgroundColor =
      (item.STATUS == "0" || item.STATUS == "N") &&
        moment(new Date()).format("HH:mm:ss") > item.DISABLE_TIMING
        ? "#F1948A"
        : moment(new Date()).format("HH:mm:ss") < item.ENABLE_TIME
          ? "#D5DBDB"
          : (item.STATUS != "0" || item.STATUS != "N") &&
            moment(new Date()).format("HH:mm:ss") >
            item.DISABLE_TIMING
            ? "#D5F5E3"
            : Colors.White;

    const undoneButtonColor =
      (item.STATUS == "0" || item.STATUS == "N") &&
        moment(new Date()).format("HH:mm:ss") > item.DISABLE_TIMING
        ? "#EC7063"
        : moment(new Date()).format("HH:mm:ss") < item.ENABLE_TIME
          ? "#ACACAC"
          : moment(new Date()).format("HH:mm:ss") >
            item.DISABLE_TIMING
            ? item.STATUS == "U"
              ? "#2ECC71"
              : "#82E0AA"
            : item.STATUS === "U"
              ? Colors.Secondary
              : Colors.Background;

    const doneButtonColor =
      (item.STATUS == "0" || item.STATUS == "N") &&
        moment(new Date()).format("HH:mm:ss") > item.DISABLE_TIMING
        ? "#EC7063"
        : moment(new Date()).format("HH:mm:ss") < item.ENABLE_TIME
          ? "#ACACAC"
          : moment(new Date()).format("HH:mm:ss") >
            item.DISABLE_TIMING
            ? item.STATUS == "D"
              ? "#2ECC71"
              : "#82E0AA"
            : item.STATUS === "D"
              ? Colors.Secondary
              : Colors.Background;

    const undoneButtonTextColor =
      (item.STATUS == "0" || item.STATUS == "N") &&
        moment(new Date()).format("HH:mm:ss") > item.DISABLE_TIMING
        ? Colors.PrimaryText
        : moment(new Date()).format("HH:mm:ss") < item.ENABLE_TIME
          ? Colors.PrimaryText
          : moment(new Date()).format("HH:mm:ss") >
            item.DISABLE_TIMING
            ? item.STATUS == "U"
              ? Colors.White
              : "#196F3D"
            : item.STATUS === "U"
              ? Colors.Primary
              : Colors.Primary;

    const doneButtonTextColor =
      (item.STATUS == "0" || item.STATUS == "N") &&
        moment(new Date()).format("HH:mm:ss") > item.DISABLE_TIMING
        ? Colors.PrimaryText
        : moment(new Date()).format("HH:mm:ss") < item.ENABLE_TIME
          ? Colors.PrimaryText
          : moment(new Date()).format("HH:mm:ss") >
            item.DISABLE_TIMING
            ? item.STATUS == "D"
              ? Colors.White
              : "#196F3D"
            : item.STATUS === "D"
              ? Colors.Primary
              : Colors.Primary;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: backgroundColor,
          elevation: 6,
          shadowColor: Colors.Primary,
          padding: Sizes.Radius,
          paddingBottom: Sizes.Padding,
          borderRadius: Sizes.Radius,
          margin: 3,
          marginBottom: Sizes.Radius,
        }}
      >
        {/* Date */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: Sizes.Radius,
          }}
        >
          <Text
            style={{ ...Fonts.Medium3, color: Colors.PrimaryText1 }}
          >
            {moment(item.ASSIGNED_DATE).format("DD/MMM/YYYY")}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                ...Fonts.Medium3,
                color: Colors.PrimaryText1,
              }}
            >
              {item.ENABLE_TIME == "00:00:00" &&
                item.DISABLE_TIMING == "23:59:59"
                ? "Full Day"
                : item.ENABLE_TIME + "-" + item.DISABLE_TIMING}
            </Text>
          </View>
        </View>
        {/* Image and title */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ flexDirection: "row", flex: 1 }}>
            {item?.IMAGE_URL && (
              <Image
                source={{
                  uri:
                    BASE_URL +
                    "static/taskImage/" +
                    item?.IMAGE_URL,
                }}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                }}
              />
            )}

            <View style={{ marginLeft: Sizes.Radius, flex: 1 }}>
              <Text
                textBreakStrategy="highQuality"
                style={{
                  ...Fonts.Medium4,
                  color: Colors.PrimaryText1,
                  flex: 1,
                }}
              >
                {item.LABEL}
              </Text>
              {item.DESCRIPTIONS && (
                <Text
                  textBreakStrategy="highQuality"
                  style={{
                    ...Fonts.Medium3,
                    color: Colors.PrimaryText,
                  }}
                >
                  {item.DESCRIPTIONS}
                </Text>
              )}
            </View>
          </View>
        </View>
        {/* buttons */}
        {data.showSubmitButton &&
          selectedDate == moment(new Date()).format("YYYY-MM-DD") ? (
          <View
            style={{
              flexDirection: "row",
              marginTop: Sizes.Padding,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={
                moment(new Date()).format("HH:mm:ss") >
                  item.ENABLE_TIME &&
                  moment(new Date()).format("HH:mm:ss") <
                  item.DISABLE_TIMING
                  ? false
                  : true
              }
              onPress={() => {
                handleSelectButton(item, "U");
              }}
              style={{
                backgroundColor: undoneButtonColor,
                padding: 5,
                borderRadius: Sizes.ScreenPadding,
                width: 100,
                justifyContent: "center",
                alignItems: "center",
                elevation: 5,
              }}
            >
              <Text
                style={{
                  color: undoneButtonTextColor,
                  ...Fonts.Medium2,
                }}
              >
                Undone
              </Text>
            </TouchableOpacity>
            <View style={{ width: Sizes.Padding }} />
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={
                moment(new Date()).format("HH:mm:ss") >
                  item.ENABLE_TIME &&
                  moment(new Date()).format("HH:mm:ss") <
                  item.DISABLE_TIMING
                  ? false
                  : true
              }
              onPress={() => {
                handleSelectButton(item, "D");
              }}
              style={{
                backgroundColor: doneButtonColor,
                alignItems: "center",
                justifyContent: "center",
                padding: 5,
                borderRadius: Sizes.ScreenPadding,
                width: 100,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  color: doneButtonTextColor,
                  ...Fonts.Medium2,
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              backgroundColor:
                item.STATUS == "N" || item.STATUS == "0"
                  ? "#EC7063"
                  : item.STATUS == "U"
                    ? "#CCD1D1"
                    : "#52BE80",
              width: 150,
              alignSelf: "flex-end",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              marginBottom: -Sizes.Padding,
              marginRight: -Sizes.Radius,
              borderBottomRightRadius: Sizes.Radius,
              borderTopLeftRadius: Sizes.ScreenPadding,
              padding: 3,
            }}
          >
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <Icon
                name={
                  item.STATUS == "N" || item.STATUS == "0"
                    ? "clock-alert-outline"
                    : item.STATUS == "U"
                      ? "close-circle-outline"
                      : "check-circle-outline"
                }
                type="MaterialCommunityIcons"
                size={14}
                color={Colors.PrimaryText1}
              />
              <View style={{ width: Sizes.Base }} />
              <Text
                style={{
                  ...Fonts.Medium3,
                  color: Colors.PrimaryText1,
                }}
              >
                {item.STATUS == "N" || item.STATUS == "0"
                  ? "Not Performed"
                  : item.STATUS == "U"
                    ? "Not Completed"
                    : "Completed"}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }, [data.showSubmitButton, selectedDate, Sizes, Colors, Fonts, handleSelectButton]);

  const exitSubscription = async () => {
    setLoading(true);
    try {
      const data = await AsyncStorage.getItem("SUBSCRIPTION_DETAILS");

      if (!data) {
        console.warn("No subscription data found in storage.");
        return;
      }

      const parsedData = JSON.parse(data);
      const subscriptionData = {
        ID: parsedData?.USER_SUBSCRIPTION_ID,
      };

      console.log("Parsed Subscription Data:", subscriptionData);

      const res = await apiPost("api/userSubscription/exit", subscriptionData);
      if (res && res.code === 200) {
        setLoading(false);
        console.log("Exit successful", res);
        await AsyncStorage.setItem("SUBSCRIPTION_DETAILS", "");
        await AsyncStorage.removeItem("STAGE_NAME").catch(() => {
          AsyncStorage.setItem("STAGE_NAME", "");
        });
        await deleteTasksByDate(selectedDate);
        setShowExitModal(false);
        dispatch(Reducers.setShowSplash(true));
      } else {
        console.warn("Exit failed", res.message || res);
      }
    } catch (error) {
      console.error("Error during exit:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.White }}>
      <Header
        label={""}
        leftChild={
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                ...Fonts.Bold1,
                fontSize: 13,
                color: Colors.White,
                paddingHorizontal: Sizes.Base,
                textAlignVertical: "center",
              }}
            >
              {"Tasks"}
            </Text>
            <Icon
              name="information-circle-outline"
              type="Ionicons"
              color={Colors.Background}
              onPress={() => {
                setInfoModal(true);
              }}
            />
          </View>
        }
        onBack={async () => {
          await updateTasksByDate(taskData.data);
          navigation.navigate("Dashboard");
        }}
        rightChild={
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon
              name="crown"
              type="FontAwesome5"
              color={"#F6C324"}
              size={21}
              style={{ marginRight: Sizes.Padding }}
            />

            <TouchableOpacity
              style={{ marginRight: Sizes.Padding }}
              disabled={taskData.loading && !unlockVideo.lock}
              onPress={() => {
                unlockVideo.disableRewardIcon
                  ? setUnlockVideo({ ...unlockVideo, openWarnPopUp: true })
                  : navigation.navigate("RewardScreen");
              }}
            >
              <Icon
                size={24}
                name="gift"
                type="AntDesign"
                color={Colors.White}
              />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={taskData.loading && !unlockVideo.lock}
              onPress={() => {
                setShowExitModal(true);
              }}
            >
              <Icon
                size={24}
                name="exit-run"
                type="MaterialCommunityIcons"
                color={Colors.White}
              />
            </TouchableOpacity>
          </View>
        }
      />
      {infoModal ? <TrackInfo onClose={() => setInfoModal(false)} /> : null}
      <TouchableWithoutFeedback onPress={showControls}>
        <View
          style={{
            flex: 0.5,
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            <Video
              ref={videoRef}
              source={
                animationVideoData?.VIDEO_URL
                  ? {
                    uri:
                      BASE_URL +
                      "static/animationVideo/" +
                      animationVideoData.VIDEO_URL,
                  }
                  : require("../../../assets/video/Nature.mp4")
              }
              style={{
                width: "100%",
                height: "100%",
                zIndex: 1,
              }}
              resizeMode="cover"
              paused={unlockVideo.lock || videoPaused}
              onLoad={async (data: any) => {
                setVideoLoad(false);
                showControls();
                setVideoDuration(data.duration);
              }}
              onEnd={() => {
                setVideoPaused(true);
                setCurrentTime(videoDuration);
              }}
              onSeek={(d: any) => {
                if (
                  !isProgrammaticSeek.current &&
                  !videoPaused &&
                  d.currentTime > animationVideoTime.startTime
                ) {
                  isProgrammaticSeek.current = true;
                  videoRef.current.seek(animationVideoTime.startTime);
                  setVideoPaused(true);
                  setTimeout(() => {
                    isProgrammaticSeek.current = false;
                  }, 0);
                }
              }}
              onProgress={handleProgress}
            />

            {videoControls}

            {!videoLoad && unlockVideo.lock && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  setUnlockVideo({ ...unlockVideo, showUnlockPopUp: true });
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 2,
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: " rgba(255,255,255,0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <LottieView
                    source={require("../../../assets/LottieAnimation/rewardLock.json")}
                    autoPlay
                    loop
                    style={{
                      height: 70,
                      width: 70,
                    }}
                  />
                </View>
              </TouchableOpacity>
            )}
            {videoLoad && (
              <Shimmer
                duration={2000}
                pauseDuration={1000}
                animationOpacity={0.9}
                opacity={0.5}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: Sizes.Base,
                  shadowColor: Colors.Primary2,
                  backgroundColor: Colors.Secondary,
                }}
              >
                <View
                  style={{
                    height: 150,
                    width: "100%",
                    backgroundColor: Colors.Secondary,
                  }}
                >
                  <Text>{""}</Text>
                </View>
              </Shimmer>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {subscriptionDaysSection}

        <View style={{ flex: 1, margin: Sizes.Padding }}>
          {taskData.loading ? (
            <ActivityIndicator
              color={Colors.Primary}
              style={{ marginTop: Sizes.Header * 3, flex: 1 }}
            />
          ) : taskData.data.length == 0 ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 150,
              }}
            >
              <Image source={noData} style={{ height: 130, width: 130 }} />
            </View>
          ) : (
            <FlatList
              data={sortedData}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={renderTaskItem}
              removeClippedSubviews={true}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              windowSize={5}
            />
          )}
        </View>
      </ScrollView>

      {!taskData.loading && (
        <View
          style={{
            flexDirection: "row",
            margin: Sizes.Padding,
          }}
        >
          {taskData.data.length != 0 &&
            data.showSubmitButton &&
            selectedDate == moment(new Date()).format("YYYY-MM-DD") && (
              <View
                style={{
                  flex: 1,
                }}
              >
                <TextButton
                  label="Submit"
                  loading={false}
                  onPress={() => {
                    setOpenAlertMsg(true);
                  }}
                />
              </View>
            )}
        </View>
      )}

      {openAlertMsg ? (
        unlockVideo.disableRewardIcon ? (
          <Modal
            onClose={() => {
              setOpenAlertMsg(false);
            }}
            isVisible={openAlertMsg}
          >
            <View style={{ paddingVertical: Sizes.Base }}>
              <Text
                style={{
                  color: Colors.PrimaryText1,
                  ...Fonts.Bold2,
                }}
              >
                You missed a reward
              </Text>
              <Text
                style={{
                  color: Colors.PrimaryText1,
                  ...Fonts.Medium4,
                  marginTop: Sizes.Base,
                }}
              >
                First unlock the video so you will get a new reward, else you
                may loose that reward
              </Text>
              <View style={{ flexDirection: "row", marginTop: Sizes.Padding }}>
                <TextButton
                  style={{ flex: 1 }}
                  label="Unlock the Video"
                  loading={unlockVideoLoader}
                  onPress={() => {
                    updateVideoTimingData().then(() => {
                      setOpenAlertMsg(false);
                    });
                  }}
                />
              </View>
            </View>
          </Modal>
        ) : (
          <Modal
            onClose={() => {
              setOpenAlertMsg(false);
            }}
            isVisible={openAlertMsg}
          >
            <View style={{}}>
              <Text style={{ color: Colors.PrimaryText1, ...Fonts.Bold2 }}>
                Confirm submission of Tasks.
              </Text>
              <Text style={{ color: Colors.PrimaryText1, ...Fonts.Medium3 }}>
                Are you sure you wish to submit tasks? Once submitted, Changes
                cannot be done.
              </Text>
              <View style={{ flexDirection: "row", marginTop: Sizes.Padding }}>
                <TextButton
                  isBorder
                  style={{ flex: 1, borderColor: Colors.Secondary }}
                  label="Cancel"
                  loading={false}
                  onPress={() => setOpenAlertMsg(false)}
                />
                <View style={{ width: 16 }} />
                <TextButton
                  style={{ flex: 1 }}
                  label="Submit"
                  loading={data.loading}
                  onPress={() => {
                    completeTask();
                  }}
                />
              </View>
            </View>
          </Modal>
        )
      ) : null}

      {boom && (
        <Modal
          onClose={() => {
            setBoom(false);
          }}
          isVisible={boom}
        >
          <View style={{ paddingVertical: Sizes.Base, alignItems: "center" }}>
            <Image
              style={{
                width: Sizes.Width * 0.7,
                height: Sizes.Width * 0.7,
                borderRadius: Sizes.Radius,
              }}
              source={scratchpattern}
            />
            <Text
              style={{
                marginTop: Sizes.Base,
                color: Colors.Primary,
                ...Fonts.Bold2,
              }}
            >
              Congratulations!
            </Text>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Medium4,
              }}
            >
              You have been rewarded for completing today's tasks successfully.
              Check your reward in the reward tab.
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: Sizes.Radius,
                marginBottom: -Sizes.Radius,
              }}
            >
              <TextButton
                containerStyle={{ margin: 0 }}
                isBorder
                style={{
                  flex: 1,
                  borderColor: Colors.Secondary,
                  borderWidth: 0,
                }}
                label="Close"
                loading={false}
                onPress={() => setBoom(false)}
              />
            </View>
          </View>
          <LottieView
            source={require("../../../assets/LottieAnimation/cele.json")}
            style={{
              height: "85%",
              width: "100%",
              alignSelf: "center",
              position: "absolute",
            }}
            autoPlay={true}
            loop={false}
            onAnimationFinish={() => { }}
          />
        </Modal>
      )}
      {unlockVideo.openWarnPopUp && (
        <Modal
          onClose={() => {
            setUnlockVideo({ ...unlockVideo, openWarnPopUp: false });
          }}
          isVisible={unlockVideo.openWarnPopUp}
        >
          <View style={{ paddingVertical: Sizes.Base }}>
            <View style={{ flexDirection: "row" }}>
              <Icon name="alert-triangle" type="Feather" />
              <Text
                style={{
                  color: Colors.PrimaryText1,
                  ...Fonts.Bold2,
                  marginLeft: Sizes.Base,
                }}
              >
                Warning
              </Text>
            </View>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Medium4,
                marginTop: Sizes.Base,
              }}
            >
              Please unlock the video to receive your reward.
            </Text>
            <View style={{ flexDirection: "row", marginTop: Sizes.Padding }}>
              <TextButton
                style={{ flex: 1 }}
                label="Ok"
                loading={false}
                onPress={() => {
                  setUnlockVideo({ ...unlockVideo, openWarnPopUp: false });
                }}
              />
            </View>
          </View>
        </Modal>
      )}
      {unlockVideo.showUnlockPopUp && (
        <Modal
          onClose={() => {
            setUnlockVideo({ ...unlockVideo, showUnlockPopUp: false });
          }}
          isVisible={unlockVideo.showUnlockPopUp}
        >
          <View style={{ paddingVertical: Sizes.Base }}>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Bold2,
              }}
            >
              Unlock Video
            </Text>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Medium4,
                marginTop: Sizes.Base,
              }}
            >
              Are you sure you want to unlock the video to receive your rewards
              and play the video?
            </Text>
            <View style={{ flexDirection: "row", marginTop: Sizes.Padding }}>
              <TextButton
                isBorder
                style={{ flex: 1, borderColor: Colors.Secondary }}
                label="No"
                loading={false}
                onPress={() =>
                  setUnlockVideo({ ...unlockVideo, showUnlockPopUp: false })
                }
              />
              <View style={{ width: 16 }} />
              <TextButton
                style={{ flex: 1 }}
                label="Yes"
                loading={unlockVideoLoader}
                onPress={() => {
                  updateVideoTimingData();
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      {shoExitModal && (
        <Modal
          title="Confirm Exit"
          onClose={() => {
            setShowExitModal(false);
          }}
          isVisible={shoExitModal}
        >
          <View style={{ paddingVertical: Sizes.Base }}>
            <Text
              style={{
                marginBottom: 20,
                ...Fonts.Medium4,
                color: Colors.PrimaryText1,
              }}
            >
              Warning: Once you exit, your current subscription will expire, and
              all your tasks and challenges will be deleted.
            </Text>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TextButton
                style={{ flex: 1 }}
                label="Cancel"
                loading={false}
                onPress={() => {
                  setShowExitModal(false);
                }}
              />
              <View style={{ width: 16 }} />
              <TextButton
                style={{ flex: 1 }}
                label="Exit"
                loading={loading}
                onPress={() => {
                  exitSubscription();
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      <BannerAds />
    </View>
  );
};

export default GetTasks;