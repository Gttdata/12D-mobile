import {
  View,
  Text,
  NativeModules,
  NativeEventEmitter,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BarChart, PieChart } from "react-native-gifted-charts";
import moment from "moment";
import { Checkbox, Switch } from "react-native-paper";
import { useSelector } from "../../Modules";
import { Header, Icon, Modal, TextButton, Toast } from "../../Components";
import { StackProps } from "../../routes";
import CheckImage from "../../Components/CheckImage";
import CheckImage2 from "../../Components/CheckImage2";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import {isSubscriptionActive} from '../../Functions';
import PurchaseSubscriptionModal from "../../Components/PurchaseSubscriptionModal";
import DigitalDetoxConfig from "./DigitalDetoxConfig";
import { BannerAds } from "../../Modules/AdsUtils";
import { comingSoon } from "../../../assets";

interface AppUsageData {
  appName: string;
  firstTimeStamp: string | undefined;
  lastTimeUsed: string;
  packageName: string;
  percentage: string;
  totalTimeInForeground: number;
  totalTimeUsed: string;
}

interface GraphData {
  TopFive: AppUsageData[];
  AllApps: AppUsageData[];
  TotalTime: string;
}

type Props = StackProps<"DigitalWellBing">;

const DigitalWellBing = ({ navigation }: Props): JSX.Element => {
  const { BackgroundServiceCheck, CheckUsedApp, BatteryRestrictions } =
    NativeModules;
  const checkUsedAppEvents = new NativeEventEmitter(CheckUsedApp);
  const [apps, setApps] = useState([]);
  const [Loader, setLoader] = useState(true);
  const { Colors, Sizes, Fonts } = useSelector((state) => state.app);
  const [tabIndex, setTabIndex] = useState(1);
  const [SelectedApps, setSelectedApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [AskPermission, setAskPermission] = useState<boolean>(false);
  const [graphData, setGraphData] = useState<GraphData>({
    TopFive: [],
    AllApps: [],
    TotalTime: "",
  });

  const generateColor = (percentage: number, index: number) => {
    const hue = (index * 137.508) % 360;
    const saturation = 100;
    const lightness = 50;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const getSelectedPackageNamesFromAsyncStorage = async () => {
    try {
      const selectedPackageNamesJSON = await AsyncStorage.getItem(
        "selectedPackageNames"
      );
      let selectedPackageNames = [];
      if (selectedPackageNamesJSON) {
        selectedPackageNames = JSON.parse(selectedPackageNamesJSON);
      }

      setSelectedApps(selectedPackageNames);
      return selectedPackageNames;
    } catch (error) {
      console.error(
        "Error retrieving selected package names from AsyncStorage:",
        error
      );
      return []; // Return an empty array in case of an error
    }
  };

  const formatTime = (timeInMilliseconds: number) => {
    const hours = Math.floor(timeInMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    );
    return `${hours} hours ${minutes} minutes`;
  };

  function convertTimestampToDate(timestamp: string | number | Date) {
    // Create a Date object from the timestamp
    const date = new Date(timestamp);

    // Use Intl.DateTimeFormat to format the date
    const formattedDate = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);

    // Format the date string as yyyy-MM-dd HH:mm:ss
    const [month, day, year] = formattedDate.split(", ")[0].split("/");
    const time = formattedDate.split(", ")[1];

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${time}`;
  }

  // const formatTimes = milliseconds => {
  //   const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  //   const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  //   return `${hours} hours ${minutes} minutes`;
  // };

  const AskPermissionUsage = async () => {
    const hasPermission = await CheckUsedApp.hasUsageStatsPermissions();
    if (!hasPermission) {
      setAskPermission(true);
    }
  };

  useEffect(() => {
    AskPermissionUsage();
  }, []);


  useEffect(() => {
    // const startDate = moment().startOf('day').valueOf();
    // const endDate = moment().endOf('day').valueOf();

    if (CheckUsedApp) {
      CheckUsedApp.getAppINTERVAL_DAILY();
    }
    function convertTimestampToDateTime(timestamp: number) {
      // Convert timestamp to milliseconds by multiplying with 1000
      let timestampMilliseconds = timestamp * 1000;

      // Create a new Date object with the provided timestamp in milliseconds
      let date = new Date(timestampMilliseconds);

      // Get the individual date and time components
      let year = date.getFullYear();
      let month = ("0" + (date.getMonth() + 1)).slice(-2);
      let day = ("0" + date.getDate()).slice(-2);
      let hours = ("0" + date.getHours()).slice(-2);
      let minutes = ("0" + date.getMinutes()).slice(-2);
      let seconds = ("0" + date.getSeconds()).slice(-2);

      // Construct the formatted date and time string
      let formattedDateTime =
        day +
        "-" +
        month +
        "-" +
        year +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;

      return formattedDateTime;
    }

    // Add an event listener for the 'onAppUsageChanged' event
    const appUsageListener = checkUsedAppEvents.addListener(
      "onAppUsageChanged",
      async (appUsageList) => {
        console.log("onAppUsageChanged fired!", appUsageList);
        const sortedAppUsage = appUsageList.sort(
          (a, b) => b.totalTimeInForeground - a.totalTimeInForeground
        );

        // Get the top 5 most used apps
        const top4Apps = sortedAppUsage.slice(0, 3);

        // Calculate the total time spent on mobile
        const totalTimeSpentOnMobile = sortedAppUsage.reduce(
          (total: number, app: { totalTimeInForeground: string }) =>
            total + parseInt(app.totalTimeInForeground),
          0
        );

        // Calculate the percentage of app usage for each app
        const appUsagePercentageWithColors = top4Apps.map(
          (app: any, index: number) => ({
            value: parseFloat(
              (
                (app.totalTimeInForeground / totalTimeSpentOnMobile) *
                100
              ).toFixed(0)
            ),
            color: generateColor(
              (app.totalTimeInForeground / totalTimeSpentOnMobile) * 100,
              index
            ),
            text:
              parseFloat(
                (
                  (app.totalTimeInForeground / totalTimeSpentOnMobile) *
                  100
                ).toFixed(0)
              ).toString() + "%",
            AppName: app.appName,
            LastTimeUsed: convertTimestampToDateTime(
              app.lastTimeUsed
            ).toString(),
            FirstTimeUsed: convertTimestampToDateTime(
              app.firstTimeStamp
            ).toString(),
          })
        );

        // Calculate the total time spent on mobile excluding top 4 apps
        const totalTimeAllApps = sortedAppUsage
          .slice(3) // Exclude top 4 apps
          .reduce(
            (total: number, app: any) =>
              total + parseInt(app.totalTimeInForeground),
            0
          );

        // Include the total time spent on mobile from all apps except the top 4 apps
        const totalCombinedTime = totalTimeSpentOnMobile + totalTimeAllApps;

        // Construct the array with top 5 apps including all apps' total time spent on mobile
        const topFiveAppsIncludingAll = [
          ...appUsagePercentageWithColors,
          {
            value: parseFloat(
              ((totalTimeAllApps / totalCombinedTime) * 100).toFixed(0)
            ),
            color: generateColor(
              (totalTimeAllApps / totalCombinedTime) * 100,
              4
            ), // Use index 4 for color
            text:
              parseFloat(
                ((totalTimeAllApps / totalCombinedTime) * 100).toFixed(0)
              ).toString() + "%",
            AppName: "Others",
          },
        ];

        let Selected = await getSelectedPackageNamesFromAsyncStorage();

        const appUsagePercentageWithTime = sortedAppUsage.map(
          (app: {
            appName: string;
            packageName: string;
            appIcon: string;
            lastTimeUsed: string;
            firstTimeStamp: string;
            totalTimeInForeground: string;
          }) => ({
            appName: app.appName,
            SELECTED:
              Selected && Selected.length > 0
                ? Selected.includes(app.packageName)
                  ? true
                  : false
                : true,
            packageName: app.packageName,
            appIcon: app.appIcon,
            lastTimeUsed: app.lastTimeUsed,
            firstTimeStamp: app.firstTimeStamp,
            totalTimeInForeground: parseInt(app.totalTimeInForeground),
            // Calculate percentage of time used by the app
            percentage:
              (
                (parseInt(app.totalTimeInForeground) / totalTimeSpentOnMobile) *
                100
              ).toFixed(2) + "%",
            // Convert total time used by the app to hours and minutes
            totalTimeUsed: formatTime(parseInt(app.totalTimeInForeground)),
          })
        );

        // Set the state graphData
        setGraphData({
          TopFive: topFiveAppsIncludingAll,
          AllApps: appUsagePercentageWithTime,
          TotalTime: formatTime(totalCombinedTime),
        });
        setLoading(false);
      }
    );

    return () => {
      appUsageListener.remove();
    };
  }, []);

  const renderLegendComponent = (latestArray: any) => {
    const rows = [];
    for (let i = 0; i < latestArray.length; i += 2) {
      const rowItems = latestArray.slice(i, i + 2);
      rows.push(
        <View key={i} style={{ flexDirection: "row", marginBottom: 10 }}>
          {rowItems.map((item: any, index: number) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: 150,

                // marginRight: index === 0 ? 20 : 0, // Add marginRight only for the first item in the row
              }}
            >
              {renderDot(item.color)}
              <Text
                style={{
                  color: Colors.Black,
                }}
              >{`${item.AppName}`}</Text>
            </View>
          ))}
        </View>
      );
    }
    return <>{rows}</>;
  };

  function millisecondsToHours(milliseconds: number) {
    return Math.round(milliseconds / (1000 * 60 * 60));
  }

  const renderDot = (color: string) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  // const onSwitchToggle = (index: number) => {
  //   const updatedData = [...graphData.AllApps]; // Create a copy of the array
  //   updatedData[index].SELECTED = !updatedData[index].SELECTED; // Toggle the SELECTED property
  //   setGraphData(prevState => ({
  //     ...prevState,
  //     AllApps: updatedData, // Update the state with the modified array
  //   }));
  // };

  return (
    // <View style={{ flex: 1, backgroundColor: Colors.White }}>
    //   <Header label="Digital Detox" onBack={() => navigation.goBack()} />
    //   <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    //     <Image
    //       style={{ height: 150, width: 150, alignItems: "center" }}
    //       source={comingSoon}
    //     ></Image>
    //   </View>
    // </View>

    <View style={{ flex: 1, backgroundColor: Colors.White }}>
      <Header label="Digital Detox" onBack={() => navigation.goBack()} />
      {/**TABS**/}
      <View
        style={{
          height: 43,
          margin: Sizes.Padding,
          marginTop: Sizes.Padding,
          borderRadius: Sizes.Padding * 2,
          elevation: 6,
          shadowColor: Colors.Primary2,
          flexDirection: 'row',
          backgroundColor: Colors.Background,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setTabIndex(1);
          }}
          style={{
            width: '50%',
            height: '100%',
            borderTopLeftRadius: Sizes.Padding * 2,
            borderBottomLeftRadius: Sizes.Padding * 2,
            backgroundColor: tabIndex == 1 ? Colors.Primary2 : Colors.White,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: tabIndex == 1 ? Colors.White : Colors.Primary2,
            }}>
            Digital Detox
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={async () => {
            // const data = await AsyncStorage.getItem('SUBSCRIPTION_DETAILS');

            // if (purchase) {
            //   setOpenPurchaseModal(purchase);
            // } else if (!purchase && !data) {
            //   setActivationModal(true);
            //   Toast('Please activate Plan');
            // } else {
            setTabIndex(2);
            // }
          }}
          style={{
            width: '50%',
            height: '100%',
            borderTopRightRadius: Sizes.Padding * 2,
            borderBottomRightRadius: Sizes.Padding * 2,
            backgroundColor: tabIndex == 2 ? Colors.Primary2 : Colors.White,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              ...Fonts.Medium2,
              color: tabIndex == 2 ? Colors.White : Colors.Primary2,
            }}>
            App usage
          </Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={Colors.Primary} size={'small'} />
        </View>
      )}

      {tabIndex == 2 && (
        <ScrollView>
          <View style={{ flex: 1, marginTop: -Sizes.Padding }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              {/* <PieChart
                data={graphData.TopFive}
                donut
                showText
                textColor={Colors.Black}
                textSize={10}
                focusOnPress
                fontWeight="bold"
                inwardExtraLengthForFocused={10}
                innerRadius={90}
                showTextBackground
                textBackgroundColor={Colors.White}
                textBackgroundRadius={15}
                backgroundColor={Colors.White}
                labelsPosition="onBorder"
                centerLabelComponent={() => (
                  <View
                    style={{
                      backgroundColor: Colors.White,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        ...Fonts.Bold1,
                        fontSize: 14,
                        color: Colors.Black,
                      }}>
                      Today
                    </Text>
                    <Text
                      style={{
                        ...Fonts.Bold1,
                        fontSize: 14,
                        color: Colors.Black,
                      }}>{`${graphData.TotalTime}`}</Text>
                  </View>
                )}
              /> */}

              {/* {renderLegendComponent(graphData.TopFive)} */}
            </View>
            <View style={{ flex: 1, padding: Sizes.ScreenPadding }}>
              <Text
                onPress={() => { }}
                style={{
                  ...Fonts.Bold1,
                  color: Colors.Black,
                  textAlign: 'center',
                  fontSize: 20,
                }}>{`Your Apps`}</Text>
              <Text
                onPress={() => { }}
                style={{
                  ...Fonts.Medium3,
                  color: Colors.Primary,
                  textAlign: 'center',
                  fontSize: 13,
                }}>{`frequently & higher usage apps displays first`}</Text>
              <FlatList
                data={graphData.AllApps}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      padding: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{ flexDirection: 'row' }}>
                      <CheckImage2
                        url={`data:image/png;base64,${item.appIcon}`}
                        style={{ width: 50, height: 50, marginRight: 10 }}
                      />
                      <View style={{ justifyContent: 'center' }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            ...Fonts.Regular1,
                            color: Colors.Black,
                            fontSize: 15,
                          }}>
                          {item.appName}
                        </Text>
                        <Text style={{ color: Colors.Black }}>
                          {item.totalTimeUsed}
                        </Text>
                      </View>
                    </View>

                    {/* <Switch
                value={item.SELECTED}
                onValueChange={value => {
                  onSwitchToggle(index);
                }}
                // style={{backgroundColor: Colors.Primary}}
                color={Colors.Primary}
              /> */}
                  </View>
                )}
              />
            </View>
            {/* <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: Sizes.Padding,
          paddingVertical: Sizes.Base,
        }}>
        <View style={{flex: 1}}>
          <TextButton
            onPress={() => {
              navigation.goBack();
            }}
            loading={false}
            label="Cancel"
          />
        </View>
        <View style={{width: Sizes.Padding}} />
        <View style={{flex: 1}}>
          <TextButton
            onPress={() => saveSelectedAppsToAsyncStorage()}
            loading={false}
            label="Submit"
          />
        </View>
      </View> */}
          </View>
        </ScrollView>
      )}

      {tabIndex == 1 && !loading && (
        <DigitalDetoxConfig
          ConfigData={graphData.AllApps}
          onCancel={() => {
            navigation.goBack();
          }}
        />
      )}

      {AskPermission && (
        <Modal
          onClose={() => {
            setAskPermission(false);
            navigation.goBack();
          }}
          isVisible={AskPermission}>
          <View style={{}}>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Bold2,
                fontSize: 14,
                textAlign: 'center',
              }}>
              Allow
            </Text>
            <Text style={{ color: Colors.PrimaryText1, ...Fonts.Medium2 }}>
              {`'Please enable usage access for this app to view app usage stats.`}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: Sizes.ScreenPadding,
              }}>
              <TextButton
                isBorder
                textStyle={{ fontSize: 12 }}
                style={{ flex: 1, borderColor: Colors.Secondary }}
                // label="Update One"
                label="Cancel"
                loading={false}
                onPress={() => {
                  navigation.goBack();
                  setAskPermission(false);
                }}
              />
              <View style={{ width: 16 }} />
              <TextButton
                textStyle={{ fontSize: 12 }}
                style={{ flex: 1 }}
                label="Allow"
                loading={false}
                onPress={async () => {
                  CheckUsedApp.requestUsageStatsPermission();
                  setAskPermission(false);
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default DigitalWellBing;
