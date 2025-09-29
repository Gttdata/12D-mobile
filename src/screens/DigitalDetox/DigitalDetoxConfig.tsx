import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  NativeModules,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import moment from 'moment';
import { Checkbox, Switch } from 'react-native-paper';
import { apiPost, useSelector } from '../../Modules';
import {
  Header,
  Icon,
  Modal,
  TextButton,
  TextInput,
  Toast,
} from '../../Components';
import CheckImage2 from '../../Components/CheckImage2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedView } from 'react-native-reanimated/lib/typescript/reanimated2/component/View';
import Animated from 'react-native-reanimated';

type Props = {
  onCancel: () => void;
  ConfigData: any[];
};

const DigitalDetoxConfig: React.FC<Props> = ({ onCancel, ConfigData }) => {
  const { BackgroundServiceCheck } = NativeModules;
  const { Colors, Sizes, Fonts } = useSelector(state => state.app);
  const [infoModal, setInfoModal] = useState({
    modal: false,
    usageTime: false,
  });
  const [DetoxConfig, SetDetoxConfig] = useState({
    DETOX_DURATION: '',
    DETOX_TIME: '',
    SYSTEM_DATE: '',
  });

  const [IsRunning, setIsRunning] = useState(false);
  const [DetoxLoader, setDetoxLoader] = useState(false);

  const [Search, setSearch] = useState({
    Search: false,
    SearchText: '',
  });
  const [SelectedApps, setSelectedApps] = useState([]);

  const [graphData, setGraphData] = useState({
    TopFive: [],
    AllApps: ConfigData,
    TotalTime: '',
  });

  const [isBackgroundServiceRunning, setIsBackgroundServiceRunning] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [canSave, setCanSave] = useState(true);

  const generateColor = (percentage: number, index: number) => {
    const hue = (index * 137.508) % 360; // Generate hue value based on index
    const saturation = 100;
    const lightness = 50; // Fixed lightness value

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`; // Construct HSL color
  };

  const StartBackgroundServices = async () => {
    // console.log('StartBackgroundServices called');
    console.log('DD004-Start Background Services');
    if (BackgroundServiceCheck) {
      console.log('DD005-Background Service Check Passed');
      const selectedPackageNamesJSON = await AsyncStorage.getItem(
        'selectedPackageNames',
      );
      const DetoxConfig = await AsyncStorage.getItem('DetoxConfig');
      if (selectedPackageNamesJSON && DetoxConfig) {
        console.log('DD006-Starting Background Service');
        BackgroundServiceCheck.startBackgroundService(
          selectedPackageNamesJSON,
          DetoxConfig,
        );
        console.log('DD007-Detox Configs:', DetoxConfig);
        console.log('DD008-Selected Package Names:', selectedPackageNamesJSON);

        Toast('Apps Blocking Process Started');
        onCancel();
        // setIsRunning(true);
      } else {
        Toast('Please Save Changes');
      }
    } else {
      Toast('Background Services not working');
    }
  };
  const ReStartBackgroundServices = async () => {
    if (BackgroundServiceCheck) {
      const selectedPackageNamesJSON = await AsyncStorage.getItem(
        'selectedPackageNames',
      );
      const DetoxConfig = await AsyncStorage.getItem('DetoxConfig');
      if (selectedPackageNamesJSON && DetoxConfig) {
        BackgroundServiceCheck.startBackgroundService(
          selectedPackageNamesJSON,
          DetoxConfig,
        );
        Toast('Apps Blocking Process Started');
        setDetoxLoader(false);

        // setIsRunning(true);
      } else {
        Toast('Please Save Changes');
      }
    } else {
      Toast('Background Services not working');
    }
  };
  const clearStorageAndProceed = async () => {
    try {
      BackgroundServiceCheck.stopBackgroundService();
      setDetoxLoader(true);
      // Remove selectedPackageNames and DetoxConfig from AsyncStorage
      await AsyncStorage.removeItem('selectedPackageNames');
      await AsyncStorage.removeItem('DetoxConfig');
      saveSelectedAppsAndRestartToAsyncStorage();

      // Proceed with the next process after both items are removed
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      // Handle errors here, if necessary
    }
  };
  const saveSelectedAppsToAsyncStorage = async () => {
    try {
      console.log('DD001-First time save button clicked');

      const selectedPackageNames = graphData.AllApps.filter(
        item =>
          item.SELECTED && item.packageName != 'com.uvtechsoft.dimensions',
      ).map(item => item.packageName);
      const selectedPackageNamesJSON = JSON.stringify(selectedPackageNames);

      const DetoxConfigs = JSON.stringify(DetoxConfig);
      await AsyncStorage.setItem(
        'selectedPackageNames',
        selectedPackageNamesJSON,
      );
      console.log('DD002-Detox Configs:', DetoxConfigs);
      console.log('DD003-Selected Package Names:', selectedPackageNamesJSON);
      await AsyncStorage.setItem('DetoxConfig', DetoxConfigs);
      Toast('Block List Updated Successfully');
    } catch (error) {
      console.error(
        'Error saving selected package names to AsyncStorage:',
        error,
      );
    }
  };
  const saveSelectedAppsAndRestartToAsyncStorage = async () => {
    try {
      const selectedPackageNames = graphData.AllApps.filter(
        item =>
          item.SELECTED && item.packageName != 'com.uvtechsoft.dimensions',
      ).map(item => item.packageName);
      const selectedPackageNamesJSON = JSON.stringify(selectedPackageNames);
      const DetoxConfigs = JSON.stringify(DetoxConfig);
      await AsyncStorage.setItem(
        'selectedPackageNames',
        selectedPackageNamesJSON,
      );
      await AsyncStorage.setItem('DetoxConfig', DetoxConfigs);
      Toast('Block List Updated Successfully');
      ReStartBackgroundServices();
    } catch (error) {
      console.error(
        'Error saving selected package names to AsyncStorage:',
        error,
      );
    }
  };
  const getSelectedPackageNamesFromAsyncStorage = async () => {
    try {
      // Retrieve the selectedPackageNamesJSON string from AsyncStorage
      const selectedPackageNamesJSON = await AsyncStorage.getItem(
        'selectedPackageNames',
      );

      let selectedPackageNames = {};
      // Parse the JSON string to an array of package names
      if (selectedPackageNamesJSON) {
        const selectedPackageNames = JSON.parse(selectedPackageNamesJSON);
        setSelectedApps(selectedPackageNames);
        return selectedPackageNames;
      }

      return selectedPackageNames;
    } catch (error) {
      console.error(
        'Error retrieving selected package names from AsyncStorage:',
        error,
      );
      return []; // Return an empty array in case of an error
    }
  };
  useEffect(() => {
    GetConfig();
  }, []);
  useEffect(() => {
    ChecKServices();
  }, []);

  function isDisableApp(packageName: string): boolean {
    if (packageName == `com.uvtechsoft.dimensions`) {
      return true;
    } else {
      return false;
    }
  }

  const ChecKServices = async () => {
    try {
      const status = await BackgroundServiceCheck.isBackgroundServiceRunning();
      setIsRunning(status);
    } catch (error) { }
  };

  const GetConfig = async () => {
    let res = await apiPost('globalSettings/getDetoxInfo', {});
    const DetoxConfig = await AsyncStorage.getItem('DetoxConfig');
    const selectedPackageNamesJSON = await AsyncStorage.getItem(
      'selectedPackageNames',
    );
    if (DetoxConfig) {
      const parsedConfig = JSON.parse(DetoxConfig);
      SetDetoxConfig(parsedConfig);
    } else {
      SetDetoxConfig({
        DETOX_DURATION: res.data[0].DETOX_DURATION,
        DETOX_TIME: res.data[0].DETOX_TIME,
        SYSTEM_DATE: res.data[0].SYSTEM_DATE,
      });
    }
  };

  const onSwitchToggle = (index: number) => {
    const updatedData = [...graphData.AllApps]; // Create a copy of the array
    updatedData[index].SELECTED = !updatedData[index].SELECTED; // Toggle the SELECTED property
    setGraphData(prevState => ({
      ...prevState,
      AllApps: updatedData, // Update the state with the modified array
    }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.White }}>
      <View style={{ flex: 1 }}>
        <ScrollView stickyHeaderIndices={[3]}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: Sizes.Base,
            }}>
            <Text style={{ ...Fonts.Bold1, color: Colors.Primary }}>
              Discover a Discipline you
            </Text>

            <Text
              style={{ ...Fonts.Medium3, color: Colors.Primary2, fontSize: 12 }}>
              Begin Your Digital Detox Journey
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: Sizes.Padding,
              marginBottom: Sizes.ScreenPadding,
              marginTop: Sizes.Base,
              flexDirection: 'row',
              height: Sizes.Field,
            }}>
            <View style={{ flex: 1 }}>
              <TextInput
                rightChild={
                  <Icon
                    onPress={() =>
                      setInfoModal({ ...infoModal, modal: true, usageTime: true })
                    }
                    style={{ marginRight: Sizes.Base }}
                    name="info-with-circle"
                    type="Entypo"
                  />
                }
                placeholder="Please Enter usage duration"
                value={DetoxConfig.DETOX_TIME}
                label="Usage duration (Min)"
                style={{ flex: 1 }}
                autoFocus={false}
                keyboardType="number-pad"
                onChangeText={value => {
                  SetDetoxConfig({ ...DetoxConfig, DETOX_TIME: value });
                }}
              />
            </View>
            <View style={{ width: Sizes.Padding }} />
            <View style={{ flex: 1 }}>
              <TextInput
                rightChild={
                  <Icon
                    onPress={() =>
                      setInfoModal({
                        ...infoModal,
                        modal: true,
                        usageTime: false,
                      })
                    }
                    style={{ marginRight: Sizes.Base }}
                    name="info-with-circle"
                    type="Entypo"
                  />
                }
                value={DetoxConfig.DETOX_DURATION}
                autoFocus={false}
                label="Blockage Time (Min)"
                placeholder="Please Enter Blockage Time"
                keyboardType="number-pad"
                style={{ flex: 1 }}
                onChangeText={value => {
                  SetDetoxConfig({ ...DetoxConfig, DETOX_DURATION: value });
                }}
              />
            </View>
          </View>
          <Text
            style={{
              ...Fonts.Medium3,
              color: Colors.Black,
              fontSize: 10,
              textAlign: 'center',
              marginTop: Sizes.Padding,
            }}>
            You can set your mobile usage duration and mobile block duration as
            per requirement. For effective detoxification, all the apps in the
            mobile are kept in block mode. However you can unblock or re-block
            any application as per your need and convenience.
          </Text>
          <View
            style={{
              height: Sizes.Field,
              paddingHorizontal: Sizes.Padding,
              zIndex: 1,
              backgroundColor: Colors.White,
              marginVertical: Sizes.Base,
            }}>
            <TextInput
              numberOfLines={1}
              autoFocus={false}
              rightChild={
                <View style={{ flexDirection: 'row' }}>
                  {Search.Search ? (
                    <Icon
                      name="x-circle"
                      type="Feather"
                      color={Colors.Primary}
                      onPress={() => {
                        setGraphData({ ...graphData, AllApps: ConfigData });
                        setSearch({ Search: false, SearchText: '' });
                      }}
                      size={19}
                      style={{
                        alignSelf: 'center',
                        marginHorizontal: Sizes.Base,
                      }}
                    />
                  ) : (
                    <Icon
                      name="search"
                      type="Feather"
                      color={Colors.Primary}
                      onPress={() => {
                        setSearch({ Search: false, SearchText: '' });
                      }}
                      size={19}
                      style={{
                        alignSelf: 'center',
                        marginHorizontal: Sizes.Base,
                      }}
                    />
                  )}
                </View>
              }
              label="Search Apps"
              placeholder="Search app for Block/Unblock"
              value={Search.SearchText}
              onChangeText={text => {
                if (text == '') {
                  setSearch({ Search: false, SearchText: text });

                  setGraphData({ ...graphData, AllApps: ConfigData });
                } else {
                  const filteredData = graphData.AllApps.filter(item =>
                    item.appName.toLowerCase().includes(text.toLowerCase()),
                  );
                  setSearch({ Search: true, SearchText: text });
                  setGraphData({ ...graphData, AllApps: filteredData });
                }
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              padding: Sizes.ScreenPadding,
              marginTop: Sizes.Base,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                onPress={() => { }}
                style={{
                  ...Fonts.Medium2,
                  color: Colors.PrimaryText1,
                  textAlign: 'center',
                }}>{`Your Apps`}</Text>
              <Text
                onPress={() => { }}
                style={{
                  ...Fonts.Medium2,

                  color: Colors.PrimaryText1,
                  textAlign: 'center',
                }}>{`Status`}</Text>
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={graphData.AllApps}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    opacity: isDisableApp(item.packageName) ? 0.5 : 1,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{ flexDirection: 'row' }}>
                    <CheckImage2
                      url={`data:image/png;base64,${item.appIcon}`}
                      style={{ width: 40, height: 40, marginRight: 10 }}
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
                      <Text>{item.totalTimeUsed}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={
                      isDisableApp(item.packageName)
                        ? () => {
                          // console.log('disabled Package', item.packageName);
                        }
                        : () => onSwitchToggle(index)
                    }>
                    <Text
                      style={{
                        color: isDisableApp(item.packageName)
                          ? '#c22828'
                          : item.SELECTED
                            ? 'green'
                            : '#c22828',
                        ...Fonts.Medium2,
                      }}>
                      {isDisableApp(item.packageName)
                        ? 'Unblocked'
                        : item.SELECTED
                          ? 'Blocked'
                          : 'Unblocked'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          flexDirection: 'row',
          padding: Sizes.Padding,
          gap: Sizes.Padding,
          height: Sizes.Padding * 2 + 45,
        }}>
        <Animated.View
          style={[
            {
              flexShrink: 1,
              borderRadius: 30,
              backgroundColor: IsRunning ? 'red' : 'green',
            },
          ]}>
          <TouchableOpacity
            onPress={() => {

              if (IsRunning) {
                setDetoxLoader(true);
                NativeModules.BackgroundServiceCheck.stopBackgroundService();
                AsyncStorage.removeItem('selectedPackageNames');
                AsyncStorage.removeItem('DetoxConfig');
                Toast('Apps Blocking Process Stopped');
                setIsRunning(false);
                setCanSave(true);
                onCancel();
              } else {
                if (!canSave) {
                  setDetoxLoader(true);
                  StartBackgroundServices();
                  setIsRunning(true);
                } else {
                  Toast('Please Save and Reload before starting');
                }
              }
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 23,
              paddingHorizontal: Sizes.Padding * 1.5,
              flexDirection: 'row',
              gap: Sizes.Base,
            }}>
            {IsRunning ? (
              <Icon name={'close'} type="AntDesign" color={Colors.Background} />
            ) : null}
            <Text style={{ ...Fonts.Bold2, color: Colors.Background }}>
              {IsRunning ? 'Stop' : 'Start'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <View style={{ flexGrow: 1 }}>
          <TouchableOpacity
            disabled={!canSave || isSaving || IsRunning} // 🔹 added IsRunning
            onPress={async () => {
              if (!DetoxConfig.DETOX_TIME) {
                Toast('Please Enter Usage Time');
                return;
              }
              if (!DetoxConfig.DETOX_DURATION) {
                Toast('Please Enter Blockage Duration');
                return;
              }
              if (parseInt(DetoxConfig.DETOX_TIME) <= 0) {
                Toast('Usage Time must be greater than 0');
                return;
              }
              if (parseInt(DetoxConfig.DETOX_DURATION) <= 0) {
                Toast('Blockage Duration must be greater than 0');
                return;
              }

              setIsSaving(true);
              try {
                const selectedPackageNamesJSON = await AsyncStorage.getItem(
                  'selectedPackageNames',
                );
                const DetoxConfigSaved = await AsyncStorage.getItem('DetoxConfig');

                if (selectedPackageNamesJSON && DetoxConfigSaved) {
                  setDetoxLoader(true);
                  clearStorageAndProceed();
                } else {
                  await saveSelectedAppsToAsyncStorage();
                }
                setCanSave(false);
              } catch (error) {
                console.error('Error saving configs:', error);
              } finally {
                setIsSaving(false);
              }
            }}
            style={{
              flex: 1,
              height: 45,
              backgroundColor:
                !canSave || isSaving || IsRunning ? 'gray' : Colors.Primary,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: Sizes.Padding,
              borderRadius: 23,
              flexDirection: 'row',
              gap: Sizes.Base,
            }}>
            <Text style={{ ...Fonts.Bold2, color: Colors.Background }}>
              {isSaving ? 'Saving...' : 'Save And Reload'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        isVisible={infoModal.modal}
        onClose={() =>
          setInfoModal({ ...infoModal, modal: false, usageTime: false })
        }
        title={infoModal.usageTime ? 'Usage Duration' : 'Usage Blockage Time'}>
        <View>
          <Text
            style={{
              color: Colors.PrimaryText,
              ...Fonts.Regular2,
              marginVertical: Sizes.Radius,
            }}>
            {infoModal.usageTime
              ? 'This setting allows you to determine a time frame (in minutes) of total mobile usage you think is necessary. For e.g. if you set the usage time to 60 minutes (1 hour), this app will limit the usage of your mobile up to total of 60 minutes.'
              : `This setting allows you to determine a time frame (in minutes) for blockage of all apps (except unblocked apps) once defined Usage Time for the mobile Phone completes. I.e. if your mobile usage exceeds beyond your defined Usage Time frame, all mobile apps (except unblocked apps) will get blocked for selected Blockage Time frame. However all previous settings will be restored once blockage time frame overs. For e.g. if you set Usage Time to 60 minutes and Blockage Time to 90 minutes, all apps (except unblocked apps) will get blocked for 90 minutes after total Usage Time of mobile exceeds 60 minutes.`}
          </Text>
        </View>
      </Modal>
    </View>
  );
};

export default DigitalDetoxConfig;

// import React from 'react';
// import {FlatList, Text, TouchableOpacity, View} from 'react-native';
// import {Swipeable} from 'react-native-gesture-handler';

// const MySwipeableComponent = () => {
//   const renderRightActions = () => {
//     return (
//       <TouchableOpacity
//         onPress={() => {
//           // Handle action when swiped right
//           console.log('Swiped right action');
//         }}>
//         <View
//           style={{
//             backgroundColor: 'red',
//             justifyContent: 'center',
//             alignItems: 'center',
//             width: 100,
//             height: 50,
//             marginTop:5,
//             padding:10
//           }}>
//           <Text>Right Swipe</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderLeftActions = () => {
//     return (
//       <TouchableOpacity
//         onPress={() => {
//           // Handle action when swiped right
//           console.log('Swiped right action');
//         }}>
//         <View
//           style={{
//             backgroundColor: 'green',
//             justifyContent: 'center',
//             alignItems: 'center',
//             width: 100,
//             marginTop:5,
//             padding:10

//           }}>
//           <Text>Right Swipe</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     // <Swipeable renderRightActions={renderRightActions} renderLeftActions={renderRightActions}>
//     //   <View
//     //     style={{
//     //       backgroundColor: 'blue',
//     //       height: 50,
//     //       justifyContent: 'center',
//     //       alignItems: 'center',
//     //     }}>
//     //     <Text>Swipe Me</Text>
//     //   </View>
//     // </Swipeable>
//     <View style={{flex: 1, backgroundColor: 'white'}}>
//       <FlatList
//         data={[1, 2, 3]}
//         renderItem={({item}) => (
//           <Swipeable
//             renderRightActions={renderRightActions}
//             renderLeftActions={renderLeftActions}>
//             <View style={{backgroundColor: 'pink', padding: 10,marginTop:5}}>
//               <Text style={{textAlign:'center'}}>poo</Text>
//             </View>
//           </Swipeable>
//         )}></FlatList>
//     </View>
//   );
// };

// export default MySwipeableComponent;
