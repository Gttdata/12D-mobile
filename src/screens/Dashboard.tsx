import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  NativeModules,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import {
  Reducers,
  apiPost,
  useDispatch,
  useSelector,
  IMAGE_URL,
} from "../Modules";
import { Icon, Modal, TextButton, Toast } from "../Components";
import { StackProps } from "../routes";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import { isSubscriptionActive } from "../Functions";
import PlanActivationModal from "../Components/PlanActivationModal";
import {
  DD,
  DO,
  ERPA,
  HandF,
  NotificationIcon,
  searching,
  TB,
  UserIcon,
  WP,
  WeeklyPlannerBanner,
  AnimationBanner,
  BMIBanner,
  DailyOrganizerBanner,
  DigitalDetoxBanner,
  ERPBanner,
  HealthAndFitnessBanner,
  PeriodTrackerBanner,
  offerImage,
  erp,
  erpdashboard,
  health,
  digitalDetox,
  task_book_new,
  erp_new,
  daily_planner,
  weekly_planner_new,
  health_new,
  digital_detox_icon,
  daily_planner_ion,
  weekly_planner_icon,
  daily_planner_icon,
  tasks,
  school,
  fit,
  task_daily,
  digital,
} from "../../assets";
import { PermissionState } from "../Modules/interface2";
import TrackInfo from "./TrackModule/TrackInfo";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
const { BackgroundServiceCheck,
  CheckUsedApp
} = NativeModules;

interface MenuItem {
  id: number;
  title: string;
  icon: React.ReactNode;
  imageName?: any;
  backgroundColor: string;
  onPress: () => void;
}
type Props = StackProps<"Dashboard">;

const { width: screenWidth } = Dimensions.get("window");

const Dashboard = ({ navigation }: Props): JSX.Element => {
  const { Sizes, Colors, Fonts } = useSelector((state) => state.app);
  const { member } = useSelector((state) => state.member);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [ActivatePlanModal, setActivatePlanModal] = useState(false);
  const [detoxLoader, setDetoxLoader] = useState(false);
  const purchase = isSubscriptionActive() ? true : false;
  const [active, setActive] = useState(purchase);
  const [loading, setLoading] = useState(true);
  const [activationSuccess, setActivationSuccess] = useState(false);
  const [isTrackBookStarted, setIsTrackBookStarted] = useState(0);
  const [questionPaperInfo, setQuestionPaperInfo] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);

  const [AskPermission, setAskPermission] = useState<PermissionState>({
    Usages: false,
    DisplayOver: false,
  });
  const [CarouselData, setCarouselData] = useState<
    {
      TITLE: string;
      DESCRIPTION: string;
      URL: string;
    }[]
  >([]);

  // console.log("member", member);
  const [infoSlideShow, setInfoSlideShow] = useState(false);
  const videoRef: any = useRef(null);
  const onTrackBookPress = async () => {
    const isInfoSlideShow = await AsyncStorage.getItem("InfoSlideShown");
    if (!isInfoSlideShow) {
      setInfoSlideShow(true);
      return;
    }


    const data = await AsyncStorage.getItem("SUBSCRIPTION_DETAILS");
    console.log("data******2", data);
    if (active && !data) {
      Toast("Please activate plan");
      setActivatePlanModal(true);
    } else {
      const stage = await AsyncStorage.getItem("STAGE_NAME");
      console.log("stage", stage);
      if (isTrackBookStarted == 1) {
        navigation.navigate("GetTasks", { type: "D" });
      } else if (stage == null) {
        navigation.navigate("TrackBookQuestions");
      } else if (stage == "6-Questions") {
        dispatch(Reducers.setSelectedDimensionOptionData([]));
        dispatch(
          Reducers.setSelectedDimensionYesOptions({
            item: {},
            optionKey: "",
          })
        );
        navigation.navigate("Dimensions");
      } else if (stage == "DimensionQuestions") {
        dispatch(Reducers.setSelectedTrackData([]));
        navigation.navigate("SelectTaskType");
      } else if (stage == "Task") {
        dispatch(Reducers.setSelectedDimensionOptionData([]));
        dispatch(
          Reducers.setSelectedDimensionYesOptions({
            item: {},
            optionKey: "",
          })
        );
        dispatch(Reducers.setSelectedTrackData([]));
        navigation.navigate("TrackBookQuestions");
      }
    }
  };
  const onDigitalDetoxPress = async () => {
    // navigation.navigate("DigitalWellBing");
    requestPermissions();
    const isPermissionAvailable = await CheckUsedApp.hasOverlayPermission();
    if (isPermissionAvailable == false) {
      setAskPermission({ ...AskPermission, DisplayOver: true });
      return true;
    }
    const hasPermission = await CheckUsedApp.hasUsageStatsPermissions();
    if (!hasPermission) {
      setAskPermission({ ...AskPermission, Usages: true });
      return true;
    }
    if (hasPermission && isPermissionAvailable) {
      navigation.navigate("DigitalWellBing");
    }
  };
  // const menuItems: MenuItem[] = [
  //   {
  //     id: 1,
  //     title: "Health & fitness",
  //     icon: <HandF />,
  //     imageName:health_new,
  //     backgroundColor: "#E1323299",
  //     onPress: () => {
  //       navigation.navigate("HealthAndFitnessHome");
  //     },
  //   },
  //   {
  //     id: 2,
  //     title: "Task Book",
  //     icon: <TB />,
  //     imageName:task_book_new, 
  //     backgroundColor: "#1893F699",
  //     onPress: onTrackBookPress,
  //   },
  //   (member?.ROLE == "T" || member?.ROLE == "S") &&
  //   member?.APPROVAL_STATUS == "A"
  //     ? {
  //         id: 3,
  //         title: "ERP Attendance",
  //         icon: <ERPA />,
  //         imageName:erp_new,
  //         backgroundColor: "#2748FF99",
  //         onPress: () => {
  //           navigation.navigate("ErpDashboard");
  //         },
  //       }
  //     : // @ts-ignore
  //       (null as MenuItem),
  //   {
  //     id: 4,
  //     title: "Digital Detox",
  //     icon: <DD />,
  //     imageName:digitalDetox,
  //     backgroundColor: "#7C31FF99",
  //     onPress: onDigitalDetoxPress,
  //   },
  //   {
  //     id: 5,
  //     title: "Daily Organizer",
  //     icon: <DO />,
  //     imageName:daily_planner,
  //     backgroundColor: "#FFC20099",
  //     onPress: () => {
  //       navigation.navigate("TodoList");
  //     },
  //   },
  //   {
  //     id: 6,
  //     title: "Weekly Planner",
  //     icon: <WP />,
  //     imageName:weekly_planner_new,
  //     backgroundColor: "#24F92D99",
  //     onPress: () => {
  //       navigation.navigate("WeeklyTask");
  //     },
  //   },
  // ];




  const menuItems: MenuItem[] = [
    {
      id: 1,
      title: "Health & fitness",
      icon: <HandF />,
      imageName: fit,
      backgroundColor: "#E1323299",
      onPress: () => {
        navigation.navigate("HealthAndFitnessHome");
      },
    },
    {
      id: 2,
      title: "Task Book",
      icon: <TB />,
      imageName: tasks,
      backgroundColor: "#1893F699",
      onPress: onTrackBookPress,
    },
    (member?.ROLE == "T" || member?.ROLE == "S") &&
      member?.APPROVAL_STATUS == "A"
      ?
      {
        id: 3,
        title: "ERP",
        icon: <ERPA />,
        imageName: school,
        backgroundColor: "#2748FF99",
        onPress: () => {
          navigation.navigate("ErpDashboard");
        },
      }
      : // @ts-ignore
      (null as MenuItem),

    {
      id: 4,
      title: "Digital Detox",
      icon: <DD />,
      imageName: digital,
      backgroundColor: "#7C31FF99",
      onPress: onDigitalDetoxPress,
    },
    {
      id: 5,
      title: "Daily Organizer",
      icon: <DO />,
      imageName: task_daily,
      backgroundColor: "#FFC20099",
      onPress: () => {
        navigation.navigate("TodoList");
      },
    },
    {
      id: 6,
      title: "Weekly Planner",
      icon: <WP />,
      imageName: weekly_planner_icon,
      backgroundColor: "#24F92D99",
      onPress: () => {
        navigation.navigate("WeeklyTask");
      },
    },
  ];
  useFocusEffect(
    React.useCallback(() => {
      if (active) {
        getActivationDetails();
      }
    }, [navigation, activationSuccess])
  );

  useEffect(() => {
    getCarouselData();

  }, []);

  useFocusEffect(React.useCallback(() => { }, [navigation]));
  useEffect(() => {
    ChecKServices();
  }, []);

  const getCarouselData = async () => {
    // await AsyncStorage.setItem("SUBSCRIPTION_DETAILS", "");

    try {
      const res = await apiPost("api/banner/get", {
        filter: `AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        setCarouselData(res.data);
      }
    } catch (error) {
      console.log("err..", error);
    }
  };

  const ChecKServices = async () => {
    try {
      setAskPermission;
      const status = await BackgroundServiceCheck.isBackgroundServiceRunning();
      if (!status) {
        StartBackgroundServices();
      }
    } catch (error) { }
  };
  const getActivationDetails = async () => {
    const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
    const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
    const data = await AsyncStorage.getItem("ANIMATION");
    try {
      const res = await apiPost("api/userSubscriptionDetails/get", {
        filter: `AND STATUS=1 AND USER_ID = ${member?.ID} AND (START_DATE <= '${member?.SUBSCRIPTION_EXPIRE_DATE}' AND END_DATE >= '${member?.SUBSCRIPTION_EXPIRE_DATE}') `,
      });
      if (res && res.code == 200) {
        console.log('\n\n.res.data[0]..', res.data);
        if (res.data.length > 0) {
          const jsonValue = JSON.stringify(res.data[0]);
          setIsTrackBookStarted(res.data[0].IS_TRACKBOOK_STARTED);
          AsyncStorage.setItem("SUBSCRIPTION_DETAILS", jsonValue);
          dispatch(Reducers.setAnimationVideoData(res.data[0]));
          getVideodetails(res.data[0].ID);
        } else {
          setActivatePlanModal(true);
        }
      }
    } catch (error) { }
  };
  const getVideodetails = async (Id: number) => {
    try {
      const res = await apiPost("api/userAnimationDetails/get", {
        filter: `AND SUBSCRIPTION_DETAILS_ID = ${Id} AND STATUS = 1 `,
        sortKey: "ID",
        sortValue: "DESC",
      });
      if (res && res.code == 200) {
        setLoading(false);
        const jsonValue = JSON.stringify(res.data[0]);
        await AsyncStorage.setItem("VIDEO_DETAILS", jsonValue);
        dispatch(Reducers.setAnimationVideoTime(res.data[0]));
        videoRef.seek(5);
      }
    } catch (error) { }
  };
  const StartBackgroundServices = async () => {
    if (BackgroundServiceCheck) {
      const selectedPackageNamesJSON = await AsyncStorage.getItem(
        "selectedPackageNames"
      );
      const DetoxConfig = await AsyncStorage.getItem("DetoxConfig");
      if (selectedPackageNamesJSON) {
        BackgroundServiceCheck.startBackgroundService(
          selectedPackageNamesJSON,
          DetoxConfig
        );
      }
    } else {
      Toast("Background Services not working");
    }
  };
  async function requestPermissions() {
    try {
      const hasPermission = await CheckUsedApp.hasUsageStatsPermissions();
      const isPermissionRequired = await CheckUsedApp.hasOverlayPermission();
      if (isPermissionRequired === false) {
        setAskPermission({ ...AskPermission, DisplayOver: true });
      }
      if (!hasPermission) {
        setAskPermission({ ...AskPermission, Usages: true });
      } else {
        await CheckUsedApp.requestBatteryOptimizationExemption();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  var today = moment();
  var birthDate = moment(member?.DOB);
  var age = today.diff(birthDate, "years");


  useEffect(() => {
    getAgeCategory();
  }, []);

  const getAgeCategory = async () => {
    try {
      const res = await apiPost("api/ageGroup/get", {
        filter: `AND FROM_AGE <= ${age} AND TO_AGE >= ${age} AND STATUS = 1 `,
      });
      if (res && res.code == 200) {
        AsyncStorage.setItem("AgeGroup", "" + res.data[0].ID);
      }
    } catch (error) {
      console.log("err..", error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getCarouselData();

    setTimeout(() => {
      // Reload data here...
      setRefreshing(false);
    }, 2000);
  }, []);
  const renderMenuItem = (item: MenuItem) => {
    if (!item) return null;
    return (
      <TouchableOpacity
        onPress={item.onPress}
        key={item.id}
        style={[styles.menuItem]}
      >
        {/* {item.icon} */}
        <Image
          style={{
            height: item.id == 1 || item.id == 2 ? "90%" : "60%",
            width: item.id == 1 || item.id == 2 ? "90%" : "60%",
            marginTop: -10,

            // backgroundColor: item.backgroundColor,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
          source={item.imageName}
        ></Image>
        <Text style={[styles.menuItemText, { marginTop: item.id == 1 || item.id == 2 ? 0 : 10 }]}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Drawer");
            }}
            style={styles.iconButton}
          >
            <Icon type="MaterialIcons" name="menu" size={24} color="#3136DD" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting} allowFontScaling={false}>Hi, {member?.NAME}</Text>
          <Text style={styles.subGreeting} allowFontScaling={false} >
            It's Time To Challenge Your Limits.
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              navigation.navigate("NotificationHome");
            }}
          >
            <NotificationIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              navigation.navigate("Profile");
            }}
          >
            <UserIcon />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Carousel
          autoPlay={true}
          autoPlayInterval={5000}
          width={Sizes.Width}
          height={200}
          data={CarouselData}
          renderItem={({ index, item }) => (
            // <View
            //   style={{
            // backgroundColor: "#F0F0FF",
            // borderRadius: 16,
            // padding: 20,
            // // flexDirection: "row",
            // justifyContent: "space-between",
            // marginBottom: 20,
            // // height: 170,
            // width: "90%",
            // alignSelf: "center",
            // gap: 10,
            //   }}
            // >
            //   <View style={{ flex: 1 }}>
            //     <Text
            //       style={{
            //         fontSize: 20,
            //         fontWeight: "bold",
            //         color: "#444",
            //         marginBottom: 8,
            //       }}
            //     >
            //       {item.TITLE}
            //     </Text>
            //     <Text
            //       style={{
            //         fontSize: 14,
            //         color: "#666",
            //         lineHeight: 20,
            //       }}
            //     >
            //       {item.DESCRIPTION}
            //     </Text>
            //   </View>
            //   <View
            //     style={{ alignItems: "flex-end", justifyContent: "center" }}
            //   >
            <View
              style={{
                // backgroundColor: "#F0F0FF",
                borderRadius: 16,
                // padding: 20,
                // flexDirection: "row",
                // justifyContent: "space-between",
                marginBottom: 20,
                // height: "100%",
                width: "90%",
                overflow: "hidden",
                alignSelf: "center",
                gap: 10,
                height: 200
              }}
            >
              <Image
                source={{ uri: `${IMAGE_URL}bannerImage/${item.URL}` }}
                style={{ height: "100%", width: "100%" }}
                resizeMode="contain"
              />
            </View>
            //   </View>
            // </View>
          )}
        />

        <View style={styles.menuGrid}>{menuItems.map(renderMenuItem)}</View>
      </ScrollView>
      {infoSlideShow ? (
        <TrackInfo onClose={() => setInfoSlideShow(false)} />
      ) : null}
      {detoxLoader && (
        <Loader
          navigation={navigation}
          closeLoader={() => {
            setDetoxLoader(false);
          }}
        />
      )}
      {ActivatePlanModal && (
        <PlanActivationModal
          setActivationSuccess={setActivationSuccess}
          title="Activate Plan"
          onClose={() => {
            setActivatePlanModal(false);
          }}
          visible={ActivatePlanModal}
        />
      )}
      {AskPermission.DisplayOver && (
        <Modal
          onClose={() => {
            setAskPermission({ ...AskPermission, DisplayOver: false });
          }}
          isVisible={AskPermission.DisplayOver}
        >
          <View style={{}}>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Bold2,
                fontSize: 14,
                textAlign: "center",
              }}
            >
              Allow
            </Text>
            <Text style={{ color: Colors.PrimaryText1, ...Fonts.Medium2 }}>
              {`Please enable "Display over other apps" permission in the settings.`}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: Sizes.ScreenPadding,
              }}
            >
              <TextButton
                isBorder
                textStyle={{ fontSize: 12 }}
                style={{ flex: 1, borderColor: Colors.Secondary }}
                // label="Update One"
                label="Cancel"
                loading={false}
                onPress={() => {
                  setAskPermission({ ...AskPermission, DisplayOver: false });
                }}
              />
              <View style={{ width: 16 }} />
              <TextButton
                textStyle={{ fontSize: 12 }}
                style={{ flex: 1 }}
                label="Allow"
                loading={false}
                onPress={async () => {
                  await CheckUsedApp.requestOverlayPermission();
                  setAskPermission({ ...AskPermission, DisplayOver: false });
                }}
              />
            </View>
          </View>
        </Modal>
      )}
      {AskPermission.Usages && (
        <Modal
          onClose={() => {
            setAskPermission({ ...AskPermission, Usages: false });
          }}
          isVisible={AskPermission.Usages}
        >
          <View style={{}}>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Bold2,
                fontSize: 14,
                textAlign: "center",
              }}
            >
              Allow
            </Text>
            <Text style={{ color: Colors.PrimaryText1, ...Fonts.Medium2 }}>
              {`Please enable usage access for this app to view app usage stats.`}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: Sizes.ScreenPadding,
              }}
            >
              <TextButton
                isBorder
                textStyle={{ fontSize: 12 }}
                style={{ flex: 1, borderColor: Colors.Secondary }}
                // label="Update One"
                label="Cancel"
                loading={false}
                onPress={() => {
                  setAskPermission({ ...AskPermission, Usages: false });
                }}
              />
              <View style={{ width: 16 }} />
              <TextButton
                textStyle={{ fontSize: 12 }}
                style={{ flex: 1 }}
                label="Allow"
                loading={false}
                onPress={async () => {
                  await CheckUsedApp.requestUsageStatsPermission();
                  setAskPermission({ ...AskPermission, Usages: false });
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default Dashboard;
export const Loader = ({ navigation, closeLoader }: any) => {
  const { Colors, Sizes, Fonts } = useSelector((state) => state.app);
  // useEffect(() => {
  //   // const timer = setTimeout(() => {
  //   // navigation.navigate("DigitalWellBing");
  //   // closeLoader();
  //   // }, 5000); // 5 seconds delay

  //   // Cleanup the timeout if the component unmounts before the timeout is finished
  //   // return () => clearTimeout(timer);
  // }, []);

  return (
    <Modal isVisible={true} onClose={() => { }}>
      <View
        style={{
          // height: Sizes.Height * 0.4,
          alignItems: "center",
          justifyContent: "center",
          gap: Sizes.Padding,
        }}
      >
        <Image
          source={searching}
          style={{
            width: Sizes.Height * 0.2,
            height: Sizes.Height * 0.2,
          }}
        />
        <Text
          style={{
            ...Fonts.Bold1,
            color: Colors.Primary,
            fontSize: 20,
            paddingHorizontal: Sizes.Base,
          }}
        >
          Please Wait
        </Text>
        <Text
          style={{
            ...Fonts.Regular1,
            color: Colors.Primary,
            textAlign: "center",
            fontSize: 15,
            paddingHorizontal: Sizes.Base,
          }}
        >
          Please wait while we retrieve data from the mobile device. This
          process may take some time, so kindly wait until it is completed.
        </Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF",
    gap: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subGreeting: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  iconButton: {
    marginLeft: 16,
  },
  content: {
    marginTop: 16,
    flex: 1,
  },
  weeklyPlannerCard: {
    backgroundColor: "#F0F0FF",
    borderRadius: 16,
    padding: 20,
    // flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    // height: 170,
    width: "90%",
    alignSelf: "center",
  },
  weeklyPlannerText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 8,
  },
  cardSubtitle: {},
  illustration: {
    alignItems: "flex-end",
    justifyContent: "center",
    // flex: 1,
    // Add your illustration styling here
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  menuItem: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 16,
    padding: 8,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    // backgroundColor: "#F0F0FA",
    backgroundColor: "#FFFFFFFF"
  },
  menuItemText: {

    fontSize: 16,
    color: "#444",
    textAlign: "center",
    fontWeight: "bold",
  },
});
// return (
//   <View
//     style={{
//       flex: 1,
//       backgroundColor: Colors.Background,
//     }}
//   >
//     <StatusBar
//       barStyle="dark-content"
//       backgroundColor={Colors.Primary}
//       hidden={false}
//     />

//     <View
//       style={{
//         height: 166,
//         width: "100%",
//         zIndex: 1,
//       }}
//     >
//       <Image
//         source={dashboardBackground}
//         style={{
//           position: "absolute",
//           height: 200,
//           width: "100%",
//           backgroundColor: "transparent",
//           marginBottom: Sizes.Base,
//         }}
//       />
//       <View
//         style={{
//           flexDirection: "row",
//           margin: Sizes.ScreenPadding,
//         }}
//       >
//         <Icon
//           type="Feather"
//           name="menu"
//           color={Colors.White}
//           size={22}
//           onPress={() => {
//             navigation.navigate("Drawer");
//           }}
//         />
//         <Text
//           style={{
//             ...Fonts.Bold1,
//             fontSize: 16,
//             color: Colors.White,
//             flex: 1,
//             paddingHorizontal: Sizes.Base,
//           }}
//         >
//           Dashboard
//         </Text>
//         <TouchableOpacity
// onPress={() => {
//   navigation.navigate("NotificationHome");
// }}
//         >
//           <Icon
//             name="notifications-outline"
//             type="Ionicons"
//             color={Colors.White}
//             size={24}
//             style={{}}
//           />
//         </TouchableOpacity>
//       </View>
//       <Animated.View
//         entering={FadeInUp.duration(1000).springify()}
//         style={{ marginHorizontal: Sizes.ScreenPadding }}
//       >
//         <Text style={{ color: Colors.White, ...Fonts.Medium2, fontSize: 11 }}>
//           Welcome 🤗
//         </Text>
//         <Text style={{ color: Colors.White, ...Fonts.Bold1, fontSize: 14 }}>
//           {member?.NAME}
//         </Text>
//       </Animated.View>
//     </View>
//     <View
//       style={{
//         flex: 1,
//         paddingHorizontal: Sizes.Radius,
//         borderTopLeftRadius: Sizes.Radius,
//         borderTopRightRadius: Sizes.Radius,
//         paddingTop: Sizes.Base,
//         zIndex: 0,
//       }}
//     >
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: Sizes.Radius,
//           paddingTop: Sizes.Padding,
//         }}
//       >
//         {(member?.ROLE == "T" || member?.ROLE == "S") &&
//           member?.APPROVAL_STATUS == "A" && (
//             <LinearGradient
//               colors={["#9f359b", "#9f359b"]}
//               start={{ x: 0, y: 0.5 }}
//               end={{ x: 1, y: 0.5 }}
//               style={{
//                 flex: 1,
//                 paddingBottom: Sizes.Base,
//                 elevation: 5,
//                 shadowColor: Colors.Primary,
//                 borderRadius: Sizes.Radius,
//                 marginBottom: Sizes.Padding,
//               }}
//             >
//               <TouchableOpacity
//                 style={{
//                   paddingHorizontal: Sizes.Padding,
//                   paddingVertical: Sizes.Base,
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
// onPress={() => {
//   navigation.navigate("ErpDashboard");
// }}
//               >
//                 <View style={{ flex: 1 }}>
//                   <Text
//                     style={{
//                       color: Colors.White,
//                       ...Fonts.Bold1,
//                       textAlign: "center",
//                       marginTop: 6,
//                     }}
//                   >
//                     {"School ERP"}
//                   </Text>
//                   <Text
//                     style={{
//                       color: Colors.White,
//                       ...Fonts.Medium3,
//                       textAlign: "center",
//                     }}
//                   >
//                     {
//                       "A School ERP manages students, attendance, question papers, and assignments"
//                     }
//                   </Text>
//                 </View>
//                 <Image
//                   source={require("../../assets/images/SchoolERP.png")}
//                   style={{
//                     height: 80,
//                     width: 120,
//                   }}
//                 />
//               </TouchableOpacity>
//             </LinearGradient>
//           )}
//         <View>
//           <DashboardCard
//             fromLeft
// onPress={async () => {
//   const isInfoSlideShow = await AsyncStorage.getItem(
//     "InfoSlideShown"
//   );
//   if (!isInfoSlideShow) {
//     setInfoSlideShow(true);
//     return;
//   }
//   const data = await AsyncStorage.getItem("SUBSCRIPTION_DETAILS");
//   if (active && !data) {
//     Toast("Please activate plan");
//     setActivatePlanModal(true);
//   } else {
//     const stage = await AsyncStorage.getItem("STAGE_NAME");
//     if (isTrackBookStarted == 1) {
//       navigation.navigate("GetTasks", { type: "D" });
//     } else if (stage == null) {
//       navigation.navigate("TrackBookQuestions");
//     } else if (stage == "6-Questions") {
//       dispatch(Reducers.setSelectedDimensionOptionData([]));
//       dispatch(
//         Reducers.setSelectedDimensionYesOptions({
//           item: {},
//           optionKey: "",
//         })
//       );
//       navigation.navigate("Dimensions");
//     } else if (stage == "DimensionQuestions") {
//       dispatch(Reducers.setSelectedTrackData([]));
//       navigation.navigate("SelectTaskType");
//     } else if (stage == "Task") {
//       dispatch(Reducers.setSelectedDimensionOptionData([]));
//       dispatch(
//         Reducers.setSelectedDimensionYesOptions({
//           item: {},
//           optionKey: "",
//         })
//       );
//       dispatch(Reducers.setSelectedTrackData([]));
//       navigation.navigate("TrackBookQuestions");
//     }
//   }
// }}
//             animationSource={require("../../assets/LottieAnimation/myTrack.json")}
//             title={"Task Book"}
//             description="Overcome your weaknesses scattered within 12 life dimensions with age-appropriate tasks & challenges."
//             startColor="#73C6B6"
//             endColor="#117A65"
//             imageSize={90}
//           />
// {infoSlideShow ? (
//   <TrackInfo onClose={() => setInfoSlideShow(false)} />
// ) : null}

//           <DashboardCard
//             imageSize={85}
//             onPress={async () => {
//               requestPermissions();
//               const isPermissionAvailable =
//                 await CheckUsedApp.hasOverlayPermission();
//               if (isPermissionAvailable == false) {
//                 setAskPermission({ ...AskPermission, DisplayOver: true });
//                 return true;
//               }
//               const hasPermission =
//                 await CheckUsedApp.hasUsageStatsPermissions();
//               if (!hasPermission) {
//                 setAskPermission({ ...AskPermission, Usages: true });
//                 return true;
//               }
//               if (hasPermission && isPermissionAvailable) {
//                 navigation.navigate("DigitalWellBing");
//                 // setDetoxLoader(true);
//               }
//             }}
//             animationSource={require("../../assets/LottieAnimation/digitalDetoxOne.json")}
//             title={t("dashboard.DigitalDetox")}
//             description="Manage screen time and keep control on over-use of distracting mobile apps by blocking them."
//             startColor="#5DADE2"
//             endColor="#1a6496"
//           />
// {detoxLoader && (
//   <Loader
//     navigation={navigation}
//     closeLoader={() => {
//       console.log("closed");
//       setDetoxLoader(false);
//     }}
//   />
// )}

//           <DashboardCard
//             fromLeft
// onPress={() => {
//   navigation.navigate("HealthAndFitnessHome");
// }}
//             animationSource={require("../../assets/LottieAnimation/Health.json")}
//             title={t("dashboard.HealthAndFitness")}
//             description="Improve your fitness goals & manage your injuries & pains with our exclusive exercising videos. track your health with bmi calculator and period tracker."
//             startColor="#bada9b"
//             endColor="#5eb242"
//             imageSize={90}
//             customStyles={{}}
//           />

//           <DashboardCard
// onPress={() => {
//   navigation.navigate("TodoList");
// }}
//             animationSource={require("../../assets/LottieAnimation/ToDoList.json")}
//             title="Daily Organizer"
//             description="Organize task efficiency as per deadline and priorities"
//             startColor="#4da3d1"
//             endColor="#4da3d1"
//             imageSize={85}
//           />

//           <DashboardCard
//             fromLeft
//             imageSize={93}
// onPress={() => {
//   navigation.navigate("WeeklyTask");
// }}
//             animationSource={require("../../assets/LottieAnimation/WeekPlan.json")}
//             title={t("dashboard.WeeklyPlanner")}
//             description="Plan and manage your week's schedule effectively."
//             startColor="#E59866"
//             endColor="#D35400"
//           />

//           {/* <View style={{marginBottom: Sizes.Padding}}>
//             <LinearGradient
//               colors={['#FFBF00', '#FFBF00']}
//               start={{x: 0, y: 0.5}}
//               end={{x: 1, y: 0.5}}
//               style={{
//                 flex: 1,
//                 paddingBottom: Sizes.Base,
//                 elevation: 5,
//                 shadowColor: Colors.Primary,
//                 borderRadius: Sizes.Radius,
//               }}>
//               <TouchableOpacity
//                 style={{
//                   paddingHorizontal: Sizes.Padding,
//                   paddingVertical: Sizes.Base,
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                 }}
//                 onPress={async () => {
//                   periodTracking.started == 0
//                     ? navigation.navigate('TimePeriodQuestionary', {
//                         type: 'C',
//                         item: {},
//                       })
//                     : navigation.navigate('CircleCalender', {
//                         openPopUp: periodTracking.notDone == 1 ? true : false,
//                       });
//                 }}>
//                 <View style={{flex: 1}}>
//                   <Text
//                     style={{
//                       color: Colors.White,
//                       ...Fonts.Bold1,
//                       textAlign: 'center',
//                       marginTop: 6,
//                     }}>
//                     {'Period Tracker'}
//                   </Text>
//                   <Text
//                     style={{
//                       color: Colors.White,
//                       ...Fonts.Medium3,
//                       textAlign: 'center',
//                     }}>
//                     {
//                       'Track periods, symptoms, and fertility effortlessly with our comprehensive period tracker.'
//                     }
//                   </Text>
//                 </View>
//                 <Image
//                   source={require('../../assets/gif/periodTracker.gif')}
//                   style={{
//                     height: 67,
//                     width: 100,
//                     borderRadius: 100,
//                     marginTop: Sizes.Base,
//                     marginRight: -10,
//                   }}
//                 />
//               </TouchableOpacity>
//             </LinearGradient>
//           </View> */}
//         </View>
//       </ScrollView>
//     </View>

//     {/*FOR ACTVATING PLAN MODAL*/}
// {ActivatePlanModal && (
//   <PlanActivationModal
//     setActivationSuccess={setActivationSuccess}
//     title="Activate Plan"
//     onClose={() => {
//       setActivatePlanModal(false);
//     }}
//     visible={ActivatePlanModal}
//   />
// )}

// {AskPermission.DisplayOver && (
//   <Modal
//     onClose={() => {
//       setAskPermission({ ...AskPermission, DisplayOver: false });
//     }}
//     isVisible={AskPermission.DisplayOver}
//   >
//     <View style={{}}>
//       <Text
//         style={{
//           color: Colors.PrimaryText1,
//           ...Fonts.Bold2,
//           fontSize: 14,
//           textAlign: "center",
//         }}
//       >
//         Allow
//       </Text>
//       <Text style={{ color: Colors.PrimaryText1, ...Fonts.Medium2 }}>
//         {`Please enable "Display over other apps" permission in the settings.`}
//       </Text>
//       <View
//         style={{
//           flexDirection: "row",
//           marginTop: Sizes.ScreenPadding,
//         }}
//       >
//         <TextButton
//           isBorder
//           textStyle={{ fontSize: 12 }}
//           style={{ flex: 1, borderColor: Colors.Secondary }}
//           // label="Update One"
//           label="Cancel"
//           loading={false}
//           onPress={() => {
//             setAskPermission({ ...AskPermission, DisplayOver: false });
//           }}
//         />
//         <View style={{ width: 16 }} />
//         <TextButton
//           textStyle={{ fontSize: 12 }}
//           style={{ flex: 1 }}
//           label="Allow"
//           loading={false}
//           onPress={async () => {
//             await CheckUsedApp.requestOverlayPermission();
//             setAskPermission({ ...AskPermission, DisplayOver: false });
//           }}
//         />
//       </View>
//     </View>
//   </Modal>
// )}
// {AskPermission.Usages && (
//   <Modal
//     onClose={() => {
//       setAskPermission({ ...AskPermission, Usages: false });
//     }}
//     isVisible={AskPermission.Usages}
//   >
//     <View style={{}}>
//       <Text
//         style={{
//           color: Colors.PrimaryText1,
//           ...Fonts.Bold2,
//           fontSize: 14,
//           textAlign: "center",
//         }}
//       >
//         Allow
//       </Text>
//       <Text style={{ color: Colors.PrimaryText1, ...Fonts.Medium2 }}>
//         {`Please enable usage access for this app to view app usage stats.`}
//       </Text>
//       <View
//         style={{
//           flexDirection: "row",
//           marginTop: Sizes.ScreenPadding,
//         }}
//       >
//         <TextButton
//           isBorder
//           textStyle={{ fontSize: 12 }}
//           style={{ flex: 1, borderColor: Colors.Secondary }}
//           // label="Update One"
//           label="Cancel"
//           loading={false}
//           onPress={() => {
//             setAskPermission({ ...AskPermission, Usages: false });
//           }}
//         />
//         <View style={{ width: 16 }} />
//         <TextButton
//           textStyle={{ fontSize: 12 }}
//           style={{ flex: 1 }}
//           label="Allow"
//           loading={false}
//           onPress={async () => {
//             await CheckUsedApp.requestUsageStatsPermission();
//             setAskPermission({ ...AskPermission, Usages: false });
//           }}
//         />
//       </View>
//     </View>
//   </Modal>
// )}
//   </View>
// );
