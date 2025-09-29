import { View, Text, TouchableOpacity, Image, BackHandler } from "react-native";
import React, { useEffect } from "react";
import { StackProps } from "../../routes";
import { useSelector } from "../../Modules";
import { Header, Icon, TextButton } from "../../Components";
import LinearGradient from "react-native-linear-gradient";
import {
  challenge1,
  emptyImg,
  task3,
  taskType_Challenge,
  taskType_Task,
} from "../../../assets";

type Props = StackProps<"SelectTaskType">;
const SelectTaskType = ({ navigation }: Props) => {
  const { Sizes, Colors, Fonts } = useSelector((state) => state.app);
  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Dashboard");
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: Colors.Background }}>
      <Header
        label="Track-Book"
        onBack={() => {
          navigation.navigate("Dashboard");
        }}
      />

      <View
        style={{
          flex: 1,
          marginTop: Sizes.ScreenPadding,
          marginHorizontal: Sizes.Padding,
          marginBottom: Sizes.ScreenPadding,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ height: "28%", width: "100%" }}
          onPress={() => {
            navigation.navigate("Task", { type: "T" });
          }}
        >
          <Image
            style={{
              width: "100%",
              height: "100%",
              borderRadius: Sizes.Radius,
            }}
            source={taskType_Task}
            // source={task3}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: Sizes.Radius,
              position: "absolute",
            }}
          >
            <Text
              style={{
                color: "white",
                ...Fonts.Bold1,
                position: "absolute",
                bottom: 14,
                left: Sizes.ScreenPadding,
                fontSize: 14,
              }}
            >
              {"Select minimum 5 tasks at a time"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: Sizes.ScreenPadding }} />

        <TouchableOpacity
          activeOpacity={0.8}
          style={{ height: "28%", width: "100%" }}
          onPress={() => {
            navigation.navigate("Task", { type: "C" });
          }}
        >
          <Image
            style={{
              width: "100%",
              height: "100%",
              borderRadius: Sizes.Radius,
            }}
            // source={challenge1}
            source={taskType_Challenge}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: Sizes.Radius,
              position: "absolute",
            }}
          >
            <Text
              style={{
                color: "white",
                ...Fonts.Bold1,
                position: "absolute",
                bottom: 14,
                left: Sizes.ScreenPadding,
                fontSize: 14,
              }}
            >
              {"Select one contest challenge at a time"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* <View style={{ marginVertical: 8 }}>
          <Text
            style={{
              textAlign: "justify",
              ...Fonts.Bold4,
              fontSize: 14,
              // top: -20,
            }}
          >
            1. Choose your weakness either from Tasks or from Challenges.
          </Text>
          <Text
            style={{
              textAlign: "justify",
              ...Fonts.Bold4,
              fontSize: 14,
            }}
          >
            2. From Tasks, you have to select minimum 5 tasks at a time ✅💪.
          </Text>
          <Text
            style={{
              textAlign: "justify",
              ...Fonts.Bold4,
              fontSize: 14,
            }}
          >
            3. From Challenges, you can select only one Contest Challenge at a
            time 🏆🎉.
          </Text>
          <Text
            style={{
              textAlign: "justify",
              ...Fonts.Bold4,
              fontSize: 14,
            }}
          >
            4. Improve self-productivity from Tasks ⏳.
          </Text>
          <Text
            style={{
              textAlign: "justify",
              ...Fonts.Bold4,
              fontSize: 14,
            }}
          >
            5. Participate in Contest Challenges 🌐🔥 and win Discount Coupons
            🛍️💸 and cash rewards 💵💰!
          </Text>

          <Text
            style={{
              textAlign: "justify",
              ...Fonts.Bold4,
              fontSize: 14,
            }}
          >
            6. Selected tasks or challenges cannot be updated until the plan
            expires.
          </Text>
        </View> */}
      </View>

      <View
        style={{
          marginBottom: Sizes.Padding,
          marginHorizontal: Sizes.ScreenPadding,
        }}
      >
        {/* <Text
          style={{
            marginHorizontal: 20,
            textAlign: 'justify',
            ...Fonts.Regular2,
            fontSize: 14,
            // top: -20,
            textAlignVertical: 'center',
          }}>
          <Icon
            name="infocirlceo"
            type="AntDesign"
            size={14}
            style={{top: 2}}
          />
          {
            '  Selected tasks or challenges cannot be updated until the plan expires.'
          }
        </Text> */}
        <TextButton
          label="Select from another dimension"
          loading={false}
          onPress={async () => {
            // await AsyncStorage.setItem('STAGE_NAME', '6-Questions');
            navigation.navigate("Dimensions");
          }}
        />
      </View>
    </View>
  );
};

export default SelectTaskType;
