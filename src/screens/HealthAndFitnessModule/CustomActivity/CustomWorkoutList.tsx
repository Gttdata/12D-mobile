import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import { useSelector } from "../../../Modules";
import { IMAGE_URL, apiPost } from "../../../Modules/service";
import { Icon, TextButton, Toast } from "../../../Components";
import LinearGradient from "react-native-linear-gradient";
import Shimmer from "react-native-shimmer";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import { custom, noData } from "../../../../assets";
import { StackProps } from "../../../routes";
import FloatingAdd from "../../../Components/FloatingAdd";
import { isSubscriptionActive } from "../../../Functions";
import { showAd } from "../../../Modules/AdsUtils";
import { FlashList } from "@shopify/flash-list";
import FastImage from "react-native-fast-image";
type activityUser = {
  ACTIVITY_HEAD: number;
  ARCHIVE_FLAG: "F";
  CATEGORY: null | "B" | "I" | "E";
  CLIENT_ID: 1;
  COMPLETED_PERCENTAGE: number;
  CREATED_MODIFIED_DATE: Date;
  CURRENT_ACTIVITY_ID: null | number;
  DESCRIPTION: null | string;
  ELITE_PERCENTAGE: number;
  END_DATETIME: null | Date;
  ID: number;
  INTERMEDIATE_PERCENTAGE: number;
  READ_ONLY: "N";
  START_DATETIME: Date;
  USER_ID: number;
};
type activityHead = {
  ACTIVITY_GIF: string;
  ACTIVITY_ID: number;
  ACTIVITY_NAME: string;
  ACTIVITY_TYPE: "T" | "S" | "D" | "W";
  ACTIVITY_VALUE: string | number;
  ARCHIVE_FLAG: "F";
  CATEGORY: "B" | "I" | "E";
  CLIENT_ID: 1;
  CREATED_MODIFIED_DATE: Date;
  DESCRIPTION: string;
  HEAD_ID: number;
  HEAD_NAME: string;
  ID: number;
  READ_ONLY: "N";
  SEQ_NO: number;
  USER_ID: number | 0;
};
type activityUserDetails = {
  ACTIVITY_GIF: null | string;
  ACTIVITY_ID: null | number;
  ACTIVITY_MAPPING_ID: number;
  ACTIVITY_NAME: null | string;
  ACTIVITY_SETS: null;
  ACTIVITY_STATUS: "I" | "C";
  ACTIVITY_TIMING: null;
  ACTIVITY_TYPE: "T" | "S" | "D" | "W";
  ACTIVITY_VALUE: string | number;
  ARCHIVE_FLAG: "F";
  CATEGORY: "B" | "I" | "E";
  CLIENT_ID: 1;
  COMPLETED_DATETIME: null | Date;
  CREATED_MODIFIED_DATE: Date;
  DESCRIPTION: null | string;
  ID: number;
  MASTER_ID: number;
  READ_ONLY: "N";
  SEQ_NO: number;
};

type Props = StackProps<"CustomWorkoutList">;
const CustomWorkoutList = ({ navigation, route }: Props) => {
  const { Sizes, Colors, Fonts } = useSelector((state) => state.app);
  const { member } = useSelector((state) => state.member);
  const { Item, index } = route.params;
  const [loading, setLoading] = useState({
    loader: false,
    startActivity: false,
  });

  const [activityUser, setActivityUser] = useState<activityUser | null>(null);
  const [data, setData] = useState<activityHead[] | activityUserDetails[]>([]);
  const IsActive = isSubscriptionActive();

  const completePercentage = useMemo<number>(() => {
    let percent = 0;
    if (activityUser && activityUser.ID) {
      percent = Number(activityUser.COMPLETED_PERCENTAGE);

      return percent;
    }
    return 0;
  }, [activityUser]);

  const onStartActivity = async () => {
    setLoading({ ...loading, startActivity: true });
    try {
      const res = await apiPost("api/activityUser/add", {
        USER_ID: member?.ID,
        START_DATETIME: moment(new Date()).format("YYYY-MM-DD HH:mm"),
        ACTIVITY_HEAD: Item.ID,
        activityId: data.map((item) => item.ID).join(","),
        CLIENT_ID: 1,
      });
      if (res && res.code == 200) {
        await getUserDetails(res.MASTER_ID, "start");
        setLoading({ ...loading, startActivity: false });
      } else {
        Toast("Unable To start the activies, Please try again later");
        setLoading({ ...loading, startActivity: false });
      }
    } catch (error) {
      setLoading({ ...loading, startActivity: false });
    }
  };
  useFocusEffect(
    useCallback(() => {
      checkUserMaster();
    }, [navigation])
  );
  const checkUserMaster = async () => {
    setLoading({ ...loading, loader: true });
    try {
      const res = await apiPost("api/activityUser/get", {
        filter: ` AND DATE(START_DATETIME) = ${moment(new Date()).format(
          "'YYYY-MM-DD'"
        )} AND ACTIVITY_HEAD = ${Item.ID} AND USER_ID = ${member?.ID}`,
      });
      if (res && res.code == 200) {
        if (res.data.length > 0) {
          setActivityUser(res.data[0]);
          getUserDetails(res.data[0].ID, "initial");
        } else {
          getActivities();
        }
      } else {
        Toast("Unable to get the data. Please try again later");
        setLoading({ ...loading, loader: false });
      }
    } catch (error) {
      setLoading({ ...loading, loader: false });
    }
  };
  const getUserDetails = async (data: any, type: string) => {
    try {
      const res = await apiPost("api/activityUserMapping/get", {
        filter: `AND MASTER_ID = ${data}`,
        sortKey: "ID",
        sortValue: "ASC",
      });
      if (res && res.code == 200) {
        if (res.data.length > 0) {
          setData(res.data);

          setLoading({ ...loading, loader: false });
          if (type == "start") {
            if (IsActive) {
              navigation.navigate("StartWorkout", {
                Item: res.data,
                prevWorkPerentage: 0,
                TotalActivity: res.data,
                masterId: data,
                tabName: "B",
                REST_TIME: Item.REST_TIME,
                ACTIVITY_TYPE: "C",
              });
            } else {
              showAd(() => {
                navigation.navigate("StartWorkout", {
                  Item: res.data,
                  prevWorkPerentage: 0,
                  TotalActivity: res.data,
                  masterId: data,
                  tabName: "B",
                  REST_TIME: Item.REST_TIME,
                  ACTIVITY_TYPE: "C",
                });
              });
            }
          }
        } else {
          getActivities();
        }
      } else {
        Toast("Unable to get the data. Please try again later");
        setLoading({ ...loading, loader: false });
      }
    } catch (error) {
      console.warn(error);
      setLoading({ ...loading, loader: false });
    }
  };
  const getActivities = async () => {
    try {
      const res = await apiPost("api/activityHeadMapping/get", {
        filter: `AND HEAD_ID=${Item.ID} AND USER_ID=${member?.ID}`,
        sortKey: "ID",
        sortValue: "ASC",
      });
      if (res && res.code == 200) {
        setData(res.data);
        setActivityUser(null);
        setLoading({ ...loading, loader: false });
      } else {
        Toast("Unable to get activities at that time, Please try again later");
        setLoading({ ...loading, loader: false });
      }
    } catch (error) {
      setLoading({ ...loading, loader: false });
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: "25%", width: "100%" }}>
        <Image
          style={{
            width: "100%",
            height: "100%",
            borderBottomLeftRadius: Sizes.Radius,
            borderBottomRightRadius: Sizes.Radius,
          }}
          source={custom(index)}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: Sizes.Radius,
            position: "absolute",
            right: 0,
            left: 0,
            flex: 1,
          }}
        >
          <Text
            style={{
              flex: 1,
              color: "white",
              ...Fonts.Bold1,
              position: "absolute",
              bottom: Sizes.ScreenPadding,
              left: Sizes.ScreenPadding,
              right: Sizes.ScreenPadding,
            }}
          >
            {Item.HEAD_NAME}
          </Text>
        </LinearGradient>
        <Icon
          onPress={() => navigation.goBack()}
          name="arrow-back"
          type="Ionicons"
          size={20}
          color={Colors.White}
          style={{
            position: "absolute",
            top: Sizes.ScreenPadding,
            left: Sizes.ScreenPadding,
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: Colors.Primary2,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2,
          }}
        />
        {activityUser == null && (
          <Icon
            onPress={() =>
              navigation.navigate("UpdateCustomActivities", { Item: data })
            }
            name="edit"
            type="AntDesign"
            size={20}
            color={Colors.White}
            style={{
              position: "absolute",
              top: Sizes.ScreenPadding,
              right: Sizes.ScreenPadding,
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: Colors.Primary2,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2,
            }}
          />
        )}
        {activityUser == null && (
          <TouchableOpacity
            style={{
              height: 30,
              width: 30,
              borderRadius: 15,
              position: "absolute",
              bottom: Sizes.ScreenPadding,
              right: Sizes.ScreenPadding,
            }}
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate("CreatecustomList", {
                data: data,
                type: "U",
                HEAD_ID: Item.ID,
              });
            }}
          >
            <LinearGradient
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 15,
              }}
              colors={[Colors.Primary, Colors.Secondary]}
            >
              <Icon name="plus" color="white" type="AntDesign" size={20} />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
      <View style={{ flex: 1 }}>
        {loading.loader ? (
          <FlatList
            data={[1, 1, 1, 1]}
            renderItem={() => (
              <Shimmer
                duration={2000}
                pauseDuration={1000}
                animationOpacity={0.9}
                opacity={0.5}
                style={{
                  marginTop: Sizes.Padding,
                }}
              >
                <View
                  style={{
                    borderRadius: Sizes.Base,
                    shadowColor: Colors.Primary,
                    padding: Sizes.Padding,
                    backgroundColor: Colors.Secondary + 50,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        height: 60,
                        width: 60,
                        backgroundColor: Colors.Primary2 + 90,
                        borderRadius: 30,
                      }}
                    />
                    <View
                      style={{
                        marginLeft: Sizes.ScreenPadding,
                      }}
                    >
                      <View
                        style={{
                          height: 20,
                          width: 200,
                          marginBottom: Sizes.Base,
                          backgroundColor: Colors.Primary2 + 90,
                        }}
                      />
                      <View
                        style={{
                          height: 20,
                          width: 200,
                          backgroundColor: Colors.Primary2 + 90,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </Shimmer>
            )}
          />
        ) : (
          <View style={{ flex: 1, marginTop: Sizes.Padding }}>
            <FlashList
              contentContainerStyle={{ paddingVertical: Sizes.Base }}
              data={data}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View style={{ height: Sizes.Padding }} />
              )}
              estimatedItemSize={200}
              renderItem={({ index, item }) => {
                return (
                  <RenderItem
                    index={index}
                    item={item}
                    navigation={navigation}
                    data={data}
                  />
                );
              }}
            />
          </View>
        )}

        <View style={{ margin: Sizes.Padding }}>
          {activityUser && activityUser.ID ? (
            completePercentage == 100 || completePercentage > 99 ? (
              <TextButton
                label={"Completed"}
                loading={loading.startActivity}
                onPress={() => {
                  Toast("You completed your daily limit.");
                }}
              />
            ) : (
              <TextButton
                label={"Continue " + completePercentage + "%"}
                loading={loading.startActivity}
                onPress={() => {
                  const pendingActivities = data.filter(
                    (item: any) =>
                      item.ACTIVITY_STATUS == "I" || item.ACTIVITY_STATUS == "S"
                  );

                  if (IsActive) {
                    navigation.navigate("StartWorkout", {
                      Item: pendingActivities,
                      prevWorkPerentage: completePercentage,
                      TotalActivity: data,
                      masterId: activityUser.ID,
                      tabName: "B",
                      REST_TIME: Item.REST_TIME,
                      ACTIVITY_TYPE: "C",
                    });
                  } else {
                    showAd(() => {
                      navigation.navigate("StartWorkout", {
                        Item: pendingActivities,
                        prevWorkPerentage: completePercentage,
                        TotalActivity: data,
                        masterId: activityUser.ID,
                        tabName: "B",
                        REST_TIME: Item.REST_TIME,
                        ACTIVITY_TYPE: "C",
                      });
                    });
                  }
                }}
              />
            )
          ) : (
            <TextButton
              label={"Start"}
              loading={loading.startActivity}
              onPress={() => {
                onStartActivity();
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default CustomWorkoutList;

const RenderItem = ({ index, item, navigation, data }: any) => {
  const { Sizes, Colors, Fonts } = useSelector((state) => state.app);
  const [loadingImage, setLoadingImage] = useState(false);
  function onLoading(value: boolean) {
    setLoadingImage(value);
  }
  return (
    <TouchableOpacity
      key={index.toString()}
      activeOpacity={0.8}
      onPress={() => {
        navigation.navigate("WorkoutDetails", {
          Item: data,
          CURRANT_ITEM: { ...item, index },
        });
      }}
      style={{
        marginHorizontal: Sizes.Padding,
        backgroundColor: Colors.White,
        elevation: 5,
        shadowColor: Colors.Primary,
        paddingHorizontal: Sizes.ScreenPadding,
        borderRadius: Sizes.Radius,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Icon name="menu" type="Feather" />
        <View style={{ width: Sizes.Base }} />
        {loadingImage && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 80,
              width: 80,
              margin: Sizes.Base,
              alignSelf: "center",
            }}
          >
            <ActivityIndicator size="small" color={Colors.Primary} />
          </View>
        )}
        {
          <FastImage
            source={{
              // uri: IMAGE_URL + 'activityGIF/' + item.ACTIVITY_GIF
              uri:
                IMAGE_URL +
                "activityTumbnailGIF/" +
                item.ACTIVITY_THUMBNAIL_GIF,
              priority: FastImage.priority.normal,
            }}
            onLoadStart={() => onLoading(true)}
            onLoadEnd={() => onLoading(false)}
            onError={() => onLoading(false)}
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: loadingImage ? 0 : 80,
              width: loadingImage ? 0 : 80,
              margin: Sizes.Base,
              alignSelf: "center",
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        }
        <View style={{ marginStart: Sizes.Base, flex: 1 }}>
          <Text
            numberOfLines={2}
            style={{
              ...Fonts.Medium2,
              fontSize: 14,
              color: Colors.PrimaryText1,
            }}
          >
            {item.ACTIVITY_NAME}
          </Text>
          <Text
            style={{
              ...Fonts.Regular3,
              color: Colors.Primary,
            }}
          >
            {item.ACTIVITY_TYPE == "T"
              ? Number(item.ACTIVITY_VALUE) > 60
                ? `${Math.floor(Number(item.ACTIVITY_VALUE) / 60)} Min ${
                    Number(item.ACTIVITY_VALUE) % 60
                  } Sec`
                : item.ACTIVITY_VALUE + " Seconds"
              : item.ACTIVITY_TYPE == "D"
              ? Number(item.ACTIVITY_VALUE) > 1000
                ? Number(item.ACTIVITY_VALUE) / 1000 + " Km"
                : item.ACTIVITY_VALUE + " M"
              : item.ACTIVITY_TYPE == "W"
              ? Number(item.ACTIVITY_VALUE) > 1000
                ? Number(item.ACTIVITY_VALUE) / 1000 + " Kg"
                : item.ACTIVITY_VALUE + " G"
              : item.ACTIVITY_TYPE == "S"
              ? item.ACTIVITY_VALUE + " RepetitionS"
              : ""}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
