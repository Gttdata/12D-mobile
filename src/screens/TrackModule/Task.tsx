import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  BackHandler,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  BASE_URL,
  Reducers,
  apiPost,
  useDispatch,
  useSelector,
} from "../../Modules";
import { StackProps } from "../../routes";
import {
  Header,
  Icon,
  Modal,
  TextButton,
  TextInput,
  Toast,
} from "../../Components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  TRACK_BOOK_QUESTION_OPTION_INTERFACE,
  TRACK_BOOK_TASK_DATA,
} from "../../Modules/interface";
import { emptyImg, noData } from "../../../assets";
import moment from "moment";
import { Checkbox } from "react-native-paper";
import TermsConditionModal from "../../Components/TermsConditionModal";

type Props = StackProps<"Task">;
const Task = ({ navigation, route }: Props) => {
  const { Sizes, Colors, Fonts } = useSelector((state) => state.app);
  const { member } = useSelector((state) => state.member);
  const { type } = route.params;
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { selectedTrackData, selectedChallengeData } = useSelector(
    (state) => state.trackModule
  );
  const [showBackAlert, setShowBackAlert] = useState(false);
  const [subscriptionDetailsId, setSubscriptionDetailsId] = useState("");
  const [taskDoneLoader, setTaskDoneLoader] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [termsAndCondition, setTermsAndCondition] = useState(false);
  const [data, setData] = useState({
    mandatoryData: [],
  });
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const backAction = () => {
      dispatch(Reducers.setSelectedTrackData([]));
      dispatch(Reducers.setSelectedChallengeData([]));
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [selectedTrackData]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const SubId: any = await AsyncStorage.getItem("SUBSCRIPTION_DETAILS");
      const actualId = JSON.parse(SubId);
      setSubscriptionDetailsId(actualId.ID);
      const ageGroup = await AsyncStorage.getItem("AgeGroup");
      const data = await AsyncStorage.getItem("OPTIONS");
      const optionData = data ? JSON.parse(data) : [];
      const previousDataString = await AsyncStorage.getItem(
        "DIMENSION_OPTIONS"
      );
      let previousData = previousDataString
        ? JSON.parse(previousDataString)
        : [];
      const mergedArray = [...optionData, ...previousData];
      const ids = mergedArray.map(
        (item: TRACK_BOOK_QUESTION_OPTION_INTERFACE) => {
          return item ? item.ID : undefined;
        }
      );

      const dimensions = [
        ...new Set(mergedArray.map((item) => item.DIAMENTION_ID)),
      ];
      const trackBookTaskRes = await apiPost("api/optionTaskMapping/get", {
        filter: `AND OPTION_ID IN (${ids}) AND TASK_STATUS = 1 AND TYPE = '${type}' AND AGE_GROUP = ${ageGroup}`,
        sortKey: "DIAMENTION_ID",
        sortValue: "ASC",
      });
      console.log("TRACKBOOKTASKRES", trackBookTaskRes);

      let taskData = [];
      if (trackBookTaskRes && trackBookTaskRes.code === 200) {
        // console.log('\n\n..trackBookTaskRes...', trackBookTaskRes.data);
        taskData = trackBookTaskRes.data;
      }
      const unMappedTaskRes = await apiPost("api/task/getUnmapped", {
        sortKey: "SEQ_NO",
        sortValue: "ASC",
        filter: ` AND TYPE = '${type}' AND DIAMENTION_ID IN (${dimensions.join(
          ","
        )}) AND STATUS = 1 AND AGE_CATEGORY_ID = ${ageGroup}`,
      });
      console.log("UNMAPPEDTASKRES", unMappedTaskRes);


      if (unMappedTaskRes && unMappedTaskRes.code === 200) {
        // console.log('\n\n..unMappedTaskRes...', unMappedTaskRes);
        const KEY_CHANGED = unMappedTaskRes.data.map((item: any) => ({
          ARCHIVE_FLAG: item.ARCHIVE_FLAG,
          CLIENT_ID: item.CLIENT_ID,
          CREATED_MODIFIED_DATE: item.CREATED_MODIFIED_DATE,
          DATE_DIFFERENCE: 1,
          DIAMENTION_ID: item.DIAMENTION_ID,
          DISABLE_TIME: "23:59:59",
          ENABLE_TIME: "00:00:00",
          FITNESS_ACTIVITY_ID: item.FITNESS_ACTIVITY_ID,
          ID: item.ID,
          TASK_ID: item.ID,
          READ_ONLY: item.READ_ONLY,
          TASK_DESCRIPTIONS: item.DESCRIPTIONS,
          TASK_IMAGE_URL: item.IMAGE_URL,
          TASK_LABEL: item.LABEL,
          TASK_SEQ_NO: item.SEQ_NO,
          TASK_STATUS: item.STATUS,
          TASK_PRIORITY: null,
          TYPE: item.TYPE,
        }));
        const sortedData = [
          ...taskData.filter(
            (task: TRACK_BOOK_TASK_DATA) => task.TASK_PRIORITY === "M"
          ),
          ...taskData.filter(
            (task: TRACK_BOOK_TASK_DATA) => task.TASK_PRIORITY === "R"
          ),
          ...taskData.filter(
            (task: TRACK_BOOK_TASK_DATA) => task.TASK_PRIORITY === "N"
          ),
          ...taskData.filter(
            (task: TRACK_BOOK_TASK_DATA) =>
              task.TASK_PRIORITY === null || task.TASK_PRIORITY === ""
          ),
        ];
        taskData = [...sortedData, ...KEY_CHANGED];
      }
      setTaskData(taskData);
      const mandatoryData = taskData.filter(
        (item: TRACK_BOOK_TASK_DATA) => item.TASK_PRIORITY == "M"
      );
      setData({ mandatoryData: mandatoryData });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error..", error);
    }
  };
  // const selectedAllData = [...selectedTrackData, ...data.mandatoryData];
  const selectedAllData = [
    ...(type === "C" ? selectedChallengeData : selectedTrackData),
    ...data.mandatoryData,
  ];

  const TRACKBOOK_DATA = selectedAllData.map((item: any) => ({
    TASK_ID: item.TASK_ID,
    SUBSCRIPTION_DETAILS_ID: subscriptionDetailsId,
    ASSIGNED_DATE: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    DATE_DIFFERENCE: item.DATE_DIFFERENCE == 0 ? 1 : item.DATE_DIFFERENCE,
    ENABLE_TIME: item.ENABLE_TIME,
    DISABLE_TIMING: item.DISABLE_TIME,
    USER_ID: member?.ID,
    STATUS: 0,
    CLIENT_ID: 1,
  }));
  const addTasks = async (TRACKBOOK_DATA: any) => {
    setTaskDoneLoader(true);
    try {
      let body = {
        TRACKBOOK_DATA,
        USER_SUBSCRIPTION_ID: subscriptionDetailsId,
      };
      const res = await apiPost("api/userTrackbook/add", body);
      if (res && res.code == 200) {
        await AsyncStorage.setItem("STAGE_NAME", "Task");
        setTaskDoneLoader(false);
        navigation.navigate("GetTasks", { type: "T" });
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("error..", error);
    }
  };
  console.log("TRACKBOOK_DATA", selectedAllData.length, type);
  return (
    <View style={{ flex: 1, backgroundColor: Colors.Background }}>
      <Header
        label={type == "T" ? `Task Book` : `Contest Challenges`}
        onBack={() => {
          dispatch(Reducers.setSelectedTrackData([]));
          dispatch(Reducers.setSelectedChallengeData([]));
          navigation.goBack();
        }}
      />
      <View style={{ flex: 1, margin: Sizes.Padding }}>
        <View
          style={{
            marginHorizontal: 3,
            marginBottom: Sizes.ScreenPadding,
            marginTop: Sizes.Padding,
          }}
        >
          <TextInput
            onChangeText={(txt) => {
              setSearchText(txt);
            }}
            value={searchText}
            placeholder="Search.."
            rightChild={
              <Icon
                name="search"
                type="Feather"
                style={{ marginRight: Sizes.Padding }}
              />
            }
            autoFocus={false}
          />
        </View>
        <View style={{ flex: 1 }}>
          {loading ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size={"small"} color={Colors.Primary} />
            </View>
          ) : taskData.length == 0 ? (
            <View
              style={{
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                resizeMode={"contain"}
                style={{
                  width: 170,
                  height: 170,
                }}
                source={noData}
                tintColor={Colors.Primary}
              />
            </View>
          ) : (
            <FlatList
              data={
                searchText.length == 0
                  ? taskData
                  : taskData.filter((item: TRACK_BOOK_TASK_DATA) => {
                    const taskLabel = item.TASK_LABEL.toLowerCase().includes(
                      searchText.toLowerCase()
                    );
                    const taskDescription =
                      item.TASK_DESCRIPTIONS?.toLowerCase().includes(
                        searchText.toLowerCase()
                      );
                    return taskLabel || taskDescription;
                  })
              }
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({
                item,
                index,
              }: {
                item: TRACK_BOOK_TASK_DATA;
                index: number;
              }) => {
                const isSelected =
                  type == "C"
                    ? selectedChallengeData.some(
                      (it: any) =>
                        it.QUESTION_ID === item.QUESTION_ID &&
                        it.ID === item.ID
                    )
                    : selectedTrackData.some(
                      (it: any) =>
                        it.QUESTION_ID === item.QUESTION_ID &&
                        it.ID === item.ID
                    );
                return (
                  <TouchableOpacity
                    activeOpacity={item.TASK_PRIORITY == "M" ? 1 : 0.8}
                    onPress={() => {
                      item.TASK_PRIORITY == "M"
                        ? null
                        : type == "C"
                          ? dispatch(Reducers.setSelectedChallengeData(item))
                          : dispatch(Reducers.setSelectedTrackData(item));
                    }}
                    style={{
                      flex: 1,
                      backgroundColor:
                        item.TASK_PRIORITY == "M"
                          ? "#A3E4D7"
                          : isSelected
                            ? Colors.Secondary
                            : Colors.Background,
                      elevation: 6,
                      shadowColor: Colors.Primary,
                      padding: Sizes.Padding,
                      borderRadius: Sizes.Base,
                      margin: 3,
                      marginBottom: Sizes.Padding,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: -18,
                      }}
                    >
                      <Text
                        style={{
                          ...Fonts.Medium2,
                          color: Colors.Primary,
                          fontSize: 11,
                          paddingTop: Sizes.Padding,
                          marginBottom: Sizes.Base,
                        }}
                      >
                        {item.ENABLE_TIME == "00:00:00" &&
                          item.DISABLE_TIME == "23:59:59"
                          ? "Full Day"
                          : `${item.ENABLE_TIME}-${item.DISABLE_TIME}`}
                      </Text>
                      {(item.TASK_PRIORITY == "M" ||
                        item.TASK_PRIORITY == "R") && (
                          <Text
                            style={{
                              ...Fonts.Medium3,
                              fontSize: 9,
                              color: Colors.White,
                              textAlign: "right",
                              paddingHorizontal: Sizes.Radius,
                              paddingVertical: 4,
                              backgroundColor:
                                item.TASK_PRIORITY == "M"
                                  ? "#48C9B0"
                                  : Colors.Primary2,
                              alignSelf: "flex-end",
                              paddingLeft: Sizes.Padding,
                              borderBottomLeftRadius: 18,
                              borderTopRightRadius: Sizes.Base,
                              position: "absolute",
                              right: -Sizes.Padding,
                              top: 4,
                            }}
                          >
                            {item.TASK_PRIORITY == "M"
                              ? "Mandatory"
                              : "Recommended"}
                          </Text>
                        )}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        flex: 1,
                        alignItems: "center",
                      }}
                    >
                      {item?.TASK_IMAGE_URL && (
                        <Image
                          source={{
                            uri:
                              BASE_URL +
                              "static/taskImage/" +
                              item?.TASK_IMAGE_URL,
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
                          style={{
                            ...Fonts.Medium2,
                            color: Colors.PrimaryText1,
                          }}
                        >
                          {item.TASK_LABEL}
                        </Text>
                        {item.TASK_DESCRIPTIONS && (
                          <Text
                            style={{
                              ...Fonts.Medium3,
                              color: Colors.PrimaryText,
                            }}
                          >
                            {item.TASK_DESCRIPTIONS}
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </View>

      {((type === 'T' && selectedAllData.length >= 5) || (type !== 'T' && selectedAllData.length === 1)) && <View style={{ flexDirection: 'row', alignItems: 'center', padding: Sizes.Padding }}>
        <Checkbox
          color={Colors.Primary}
          status={termsAndCondition ? 'checked' : 'unchecked'}
          onPress={() => {
            setTermsAndCondition(!termsAndCondition);
          }}
        />
        <Text
          onPress={() => {
            setTermsAndCondition(!termsAndCondition);
          }}
          style={{
            textAlign: 'center',
            ...Fonts.Medium3,
            color: Colors.PrimaryText,
            flex: 1,
          }}>
          {'I agree to all '}
          <Text
            onPress={() => {
              // Linking.openURL('https://www.12dimensionsapp.in/terms.html');
              // setOpenTermsModal(true);
              navigation.navigate('TrackTermsAndConditions')
            }}
            style={{
              ...Fonts.Bold3,
              color: 'blue',
            }}>
            Terms and Conditions, Disclaimer and Privacy policy
          </Text>
          {' of APP'}
        </Text>
      </View>}
      <View style={{ flexDirection: "row", marginHorizontal: Sizes.Padding }}>




        <TextButton
          isBorder
          label="Go back to dimensions"
          loading={false}
          onPress={() => {
            setShowBackAlert(true);
          }}
          style={{ marginBottom: Sizes.Padding, flex: 1 }}
        />
        <View style={{ width: Sizes.Radius }} />
        <TextButton
          label="Done"
          loading={taskDoneLoader}
          onPress={() => {
            if (type === "T") {
              if (selectedAllData.length < 5) {
                Toast("Please select at least 5 tasks.");
              } else if (termsAndCondition == false) {
                Toast("Please accept terms and conditions.");
              }
              else {
                addTasks(TRACKBOOK_DATA);
              }
            } else {
              if (selectedAllData.length < 1) {
                Toast("Please select at least 1 task.");
              } else if (termsAndCondition == false) {
                Toast("Please accept terms and conditions.");
              }
              else {
                addTasks(TRACKBOOK_DATA);
              }
            }
          }}

          style={{ marginBottom: Sizes.Padding, flex: 1 }}
        />
      </View>
      {showBackAlert && (
        <Modal
          isVisible={showBackAlert}
          onClose={() => {
            setShowBackAlert(false);
          }}
          title="Warning"
        >
          <View>
            <Text
              style={{
                color: Colors.PrimaryText1,
                ...Fonts.Medium3,
                marginTop: Sizes.Base,
              }}
            >
              If you go back, you will lose the previously filled data. Are you
              sure you want to go Back?
            </Text>

            <View style={{ flexDirection: "row", marginTop: Sizes.Padding }}>
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
                  await AsyncStorage.setItem("STAGE_NAME", "6-Questions");
                  await AsyncStorage.setItem("DIMENSION_OPTIONS", "");
                  dispatch(Reducers.setSelectedDimensionOptionData([]));
                  dispatch(Reducers.setSelectedDimensionNoOptions([]));
                  dispatch(
                    Reducers.setSelectedDimensionYesOptions({
                      item: {},
                      optionKey: "",
                    })
                  );
                  dispatch(Reducers.setSelectedTrackData([]));
                  setShowBackAlert(false);
                  navigation.navigate("Dimensions");
                }}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </Modal>
      )}

    </View>
  );
};

export default Task;
