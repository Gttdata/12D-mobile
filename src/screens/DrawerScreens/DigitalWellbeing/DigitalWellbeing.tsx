import {
  View,
  Text,
  NativeModules,
  NativeEventEmitter,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Sizes, Fonts} from '../../../Modules/Modules';
import {Header, Icon} from '../../../Components';
import {BarChart, PieChart} from 'react-native-gifted-charts';
import moment from 'moment';
import {Checkbox} from 'react-native-paper';

const {batteryRestrictionsModule, CheckUsedApp} = NativeModules;
const checkUsedAppEvents = new NativeEventEmitter(CheckUsedApp);

const DigitalWellbeing = ({navigation}) => {
  const [apps, setApps] = useState([]);
  const [graphData, setGraphData] = useState([]);
  useEffect(() => {
    CheckUsedApp.requestUsageStatsPermission();

    const startDate = moment().startOf('day').valueOf();
    const endDate = moment().endOf('day').valueOf();

   
    // Pass startDate and endDate to your native module
    CheckUsedApp.getAppUsageINTERVAL_DAILY(
      parseFloat(startDate),
      parseFloat(endDate),
    );

    // Add an event listener for the 'onAppUsageChanged' event
    const appUsageListener = checkUsedAppEvents.addListener(
      'onAppUsageChanged',
      appUsageList => {
        // Handle the received appUsageList in your component state or perform any desired actions
        // setAppUsageData(appUsageList);

        const sortedData = [...appUsageList].sort(
          (a, b) => b.totalTimeInForeground - a.totalTimeInForeground,
        );

        const mappedData = sortedData.slice(0, 30).map(item => ({
          value: millisecondsToHours(item.totalTimeInForeground),
          text: item.appName,
          appIcon: item.appIcon,
        }));

        // Set the state with the mapped data
        setGraphData(mappedData);
        // setApps(sortedData);

        // setApps(appUsageList)
      },
    );

    // Cleanup the event listener when the component unmounts
    return () => {
      appUsageListener.remove();
    };
  }, []);
  const data = [
    {value: 50, text: 'Whatsapp', color: '#25d366'},
    {value: 80, text: 'Instagram', color: '#962fbf'},
    {value: 90, text: 'Facebook', color: '#316FF6'},
    {value: 70, text: 'YouTube', color: '#FF0000'},
    {value: 70, text: 'Snapchat', color: '#FFFC00'},
  ];
  function millisecondsToHours(milliseconds) {
    return Math.round(milliseconds / (1000 * 60 * 60));
  }
  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Header label="Digital Wellbeing" onBack={() => navigation.goBack()} />
      <View
        style={{
          marginTop: Sizes.ScreenPadding,
          // backgroundColor: 'red',
          // justifyContent: 'center',
          alignItems: 'center',
        }}>
        <PieChart
          // paddingHorizontal={20}
          // shiftTextX={20}
          // shiftTextY={20}
          // paddingVertical={20}
          // shiftTextBackgroundX={20}
          // shiftTextBackgroundY={20}
          // shiftInnerCenterY={20}
          // backgroundColor="blue"
          data={graphData}
          // donut
          // tilt={20}
          // innerCircleColor='white'
          showText
          // showTextBackground
          textColor={Colors.text}
          strokeWidth={5}
          strokeColor="white"
          textSize={18}
          showValuesAsLabels
          inwardExtraLengthForFocused={20}
          sectionAutoFocus
          focused
          innerRadius={80}
          focusOnPress={true}
          labelsPosition="onBorder"
          centerLabelComponent={() => (
            <View>
              <Text style={{textAlign: 'center'}}>Today</Text>
              <Text>44 minutes</Text>
            </View>
          )}
        />
      </View>
      <View style={{padding: Sizes.ScreenPadding}}>
        <Text>Select Distraction Apps</Text>
        <FlatList
          data={graphData}
          renderItem={({item}) => (
            <View
              style={{
                padding: 10,
              }}>
              <Text>{item.text}</Text>
              <Image
                source={{uri: `file://${item.appIcon}`}}
                style={{width: 100, height: 100}}
              />

              <Checkbox status="checked" color={Colors.Primary} />
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default DigitalWellbeing;
