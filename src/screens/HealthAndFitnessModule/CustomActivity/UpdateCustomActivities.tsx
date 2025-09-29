import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {apiPost, Reducers, useDispatch, useSelector} from '../../../Modules';
import {
  Header,
  Icon,
  Modal,
  TextButton,
  TextInput,
  Toast,
} from '../../../Components';
import {HEALTH_FITNESS_ACTIVITY} from '../../../Modules/interface';
import {IMAGE_URL} from '../../../Modules/service';
import {Checkbox} from 'react-native-paper';
import {StackProps} from '../../../routes';
import Dropdown from '../../../Components/Dropdown';
import {FlashList} from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';

type Props = StackProps<'UpdateCustomActivities'>;
const UpdateCustomActivities = ({navigation, route}: Props) => {
  const {Item} = route.params;
  const dispatch = useDispatch();
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [activities, setActivities] = useState(
    Item.map((activity: HEALTH_FITNESS_ACTIVITY) => ({
      ...activity,
      IS_DELETE: false,
      selected: true,
      SET_COUNT: 1,
    })),
  );
  const [openModal, setOpenModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<HEALTH_FITNESS_ACTIVITY>();
  const [currentIndex, setCurrentIndex] = useState<number | any>(null);
  const [loading, setLoading] = useState(false);
  const {member} = useSelector(state => state.member);
  const [inputs, setInputs] = useState<{
    ACTIVITY_TYPE: any;
    ACTIVITY_VALUE: any;
    setCount: any;
  }>({
    ACTIVITY_TYPE: 'T',
    ACTIVITY_VALUE: 0,
    setCount: 1,
  });
  const [dropdownInput, setDropdownInput] = useState({
    time: {label: 'Sec', value: 'Sec'},
    weight: {label: 'Kg', value: 'Kg'},
    distance: {label: 'Km', value: 'Km'},
  });
  const handleInputChange = (
    index: number,
    item: HEALTH_FITNESS_ACTIVITY,
    value: any,
    setCount: number,
  ) => {
    setActivities((prevActivities: any) => {
      const updatedActivities = [...prevActivities];
      const updatedItem = {...updatedActivities[index]};
      updatedItem.ACTIVITY_VALUE = value;
      updatedItem.SET_COUNT = setCount;
      updatedItem.ACTIVITY_TYPE = inputs.ACTIVITY_TYPE;
      updatedActivities[index] = updatedItem;
      setCurrentItem(updatedItem);
      return updatedActivities;
    });
    handleSelectActivity(index);
  };

  const handleSelectActivity = (index: number) => {
    setActivities((prevActivities: any) => {
      const updatedActivities = [...prevActivities];
      const activity = updatedActivities[index];
      activity.selected = !activity.selected;
      activity.IS_DELETE = !activity.selected;
      return updatedActivities;
    });
  };
  const onUpdate = async () => {
    setLoading(true);
    const expandedActivities = activities.flatMap((activity: any) =>
      Array(activity.SET_COUNT).fill({...activity}),
    );
    const cleanedActivities = expandedActivities.map(
      ({SET_COUNT, ...rest}: any) => rest,
    );
    let body = {
      activityId: cleanedActivities,
    };
    try {
      const res = await apiPost('api/activityHead/updateUserHead', body);
      if (res && res.code === 200) {
        setLoading(false);
        Toast('Updated successfully');
        navigation.goBack();
      }
    } catch (error) {
      setLoading(false);
      console.warn(error);
    }
  };
  const renderActivityItem = ({
    item,
    index,
  }: {
    item: HEALTH_FITNESS_ACTIVITY | any;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        key={index.toString()}
        activeOpacity={0.8}
        onPress={() => {
          if (item.selected) {
            handleSelectActivity(index);
          } else {
            setInputs({
              ...inputs,
              ACTIVITY_TYPE: item.ACTIVITY_TYPE,
              ACTIVITY_VALUE:
                item.ACTIVITY_TYPE == 'T'
                  ? item.ACTIVITY_VALUE > 60
                    ? item.ACTIVITY_VALUE / 60
                    : item.ACTIVITY_VALUE
                  : item.ACTIVITY_TYPE == 'D'
                  ? item.ACTIVITY_VALUE > 1000
                    ? item.ACTIVITY_VALUE / 1000
                    : item.ACTIVITY_VALUE
                  : item.ACTIVITY_TYPE == 'W'
                  ? item.ACTIVITY_VALUE > 1000
                    ? item.ACTIVITY_VALUE / 1000
                    : item.ACTIVITY_VALUE
                  : item.ACTIVITY_VALUE,
            });
            item.ACTIVITY_TYPE == 'T'
              ? setDropdownInput({
                  ...dropdownInput,
                  time: {
                    value: item.ACTIVITY_VALUE > 60 ? 'Min' : 'Sec',
                    label: item.ACTIVITY_VALUE > 60 ? 'Min' : 'Sec',
                  },
                })
              : item.ACTIVITY_TYPE == 'W'
              ? setDropdownInput({
                  ...dropdownInput,
                  time: {
                    value: item.ACTIVITY_VALUE > 1000 ? 'Kg' : 'G',
                    label: item.ACTIVITY_VALUE > 1000 ? 'Kg' : 'G',
                  },
                })
              : setDropdownInput({
                  ...dropdownInput,
                  time: {
                    value: item.ACTIVITY_VALUE > 1000 ? 'Km' : 'M',
                    label: item.ACTIVITY_VALUE > 1000 ? 'Km' : 'M',
                  },
                });
            setCurrentItem(item);
            setCurrentIndex(index);
            setOpenModal(true);
          }
        }}
        style={{
          marginTop: Sizes.Radius,
          backgroundColor: item.selected
            ? Colors.Primary2 + 40
            : Colors.Secondary + 30,
          margin: 5,
          paddingHorizontal: Sizes.ScreenPadding,
          borderRadius: Sizes.Radius,
        }}>
        {!item.selected && (
          <View
            style={{
              alignSelf: 'flex-end',
              marginTop: 5,
              marginBottom: -6,
              marginRight: -5,
            }}>
            <Icon
              name="edit"
              type="MaterialIcons"
              size={17}
              color={Colors.Primary}
            />
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
          }}>
          <Checkbox
            status={item.selected ? 'checked' : 'unchecked'}
            color={Colors.Primary}
            onPress={() => handleSelectActivity(index)}
          />
          <View style={{width: Sizes.Base}} />

          <FastImage
            source={{
              // uri: IMAGE_URL + 'activityGIF/' + item.ACTIVITY_GIF,
              uri:
                IMAGE_URL +
                'activityTumbnailGIF/' +
                item.ACTIVITY_THUMBNAIL_GIF,
              priority: FastImage.priority.normal,
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 80,
              width: 80,
              margin: Sizes.Base,
              borderRadius: Sizes.Radius,
            }}
            resizeMode="cover"
          />
          <View
            style={{
              marginStart: Sizes.Base,
              flex: 1,
            }}>
            <Text
              style={{
                ...Fonts.Medium2,
                fontSize: 13,
                color: Colors.PrimaryText1,
              }}>
              {item.ACTIVITY_NAME}
            </Text>
            <Text
              style={{
                marginTop: 3,
                ...Fonts.Medium3,
                color: Colors.Primary,
              }}>
              {item.ACTIVITY_TYPE == 'T'
                ? Number(item.ACTIVITY_VALUE) > 60
                  ? Math.round(Number(item.ACTIVITY_VALUE / 60)) + ' Min'
                  : item.ACTIVITY_VALUE + ' Seconds'
                : item.ACTIVITY_TYPE == 'D'
                ? Number(item.ACTIVITY_VALUE) > 1000
                  ? Number(item.ACTIVITY_VALUE) / 1000 + ' Km'
                  : item.ACTIVITY_VALUE + ' M'
                : item.ACTIVITY_TYPE == 'W'
                ? Number(item.ACTIVITY_VALUE) > 1000
                  ? Number(item.ACTIVITY_VALUE) / 1000 + ' Kg'
                  : item.ACTIVITY_VALUE + ' G'
                : item.ACTIVITY_TYPE == 'S'
                ? item.ACTIVITY_VALUE + ' Repetitions'
                : ''}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.Background}}>
      <Header
        label={'Update ' + Item[0].HEAD_NAME}
        onBack={() => {
          navigation.goBack();
        }}
      />
      <View style={{flex: 1}}>
        <View style={{flex: 1, margin: Sizes.Padding}}>
          <FlashList
            showsVerticalScrollIndicator={false}
            data={activities}
            renderItem={renderActivityItem}
            keyExtractor={(item, index) => index.toString()}
            estimatedItemSize={200}
          />
        </View>
        <View style={{margin: Sizes.Padding}}>
          <TextButton
            label="Update"
            loading={loading}
            onPress={() => onUpdate()}
          />
        </View>
      </View>
      {openModal && currentItem && (
        <Modal
          style={{margin: 0}}
          containerStyle={{justifyContent: 'flex-end', margin: 0}}
          title={`Add Details for ${currentItem.ACTIVITY_NAME}`}
          isVisible={openModal}
          onClose={() => setOpenModal(false)}>
          <View style={{}}>
            <Text
              style={{
                ...Fonts.Regular2,
                color: Colors.PrimaryText1,
                textAlign: 'left',
                marginTop: Sizes.Padding,
              }}>
              Select activity type
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: Sizes.Radius,
                marginBottom: Sizes.Radius,
                width: '100%',
                alignSelf: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setInputs({...inputs, ACTIVITY_TYPE: 'T', setCount: 1});
                  setDropdownInput({
                    ...dropdownInput,
                    time: {label: 'Sec', value: 'Sec'},
                  });
                }}
                style={{
                  flex: 1,
                  backgroundColor:
                    inputs.ACTIVITY_TYPE == 'T'
                      ? Colors.Secondary
                      : Colors.White,
                  padding: Sizes.Base,
                  elevation: 6,
                  borderRadius: Sizes.ScreenPadding,
                }}>
                <Text
                  onPress={() => {
                    setInputs({...inputs, ACTIVITY_TYPE: 'T', setCount: 1});
                    setDropdownInput({
                      ...dropdownInput,
                      time: {label: 'Sec', value: 'Sec'},
                    });
                  }}
                  style={{
                    color: Colors.Primary,
                    ...Fonts.Medium2,
                    fontSize: 13,
                    textAlign: 'center',
                  }}>
                  Duration
                </Text>
              </TouchableOpacity>
              <View style={{width: Sizes.Base}} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setInputs({...inputs, ACTIVITY_TYPE: 'S', setCount: 1});
                }}
                style={{
                  flex: 1,
                  backgroundColor:
                    inputs.ACTIVITY_TYPE == 'S'
                      ? Colors.Secondary
                      : Colors.White,
                  padding: Sizes.Base,
                  elevation: 6,
                  borderRadius: Sizes.ScreenPadding,
                }}>
                <Text
                  onPress={() => {
                    setInputs({...inputs, ACTIVITY_TYPE: 'S', setCount: 1});
                  }}
                  style={{
                    color: Colors.Primary,
                    ...Fonts.Medium2,
                    fontSize: 13,
                    textAlign: 'center',
                  }}>
                  Repetition
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: Sizes.Base,
                marginBottom: Sizes.Radius,
                width: '100%',
                alignSelf: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setInputs({...inputs, ACTIVITY_TYPE: 'W', setCount: 1});
                  setDropdownInput({
                    ...dropdownInput,
                    weight: {label: 'Kg', value: 'Kg'},
                  });
                }}
                style={{
                  flex: 1,
                  backgroundColor:
                    inputs.ACTIVITY_TYPE == 'W'
                      ? Colors.Secondary
                      : Colors.White,
                  padding: Sizes.Base,
                  elevation: 6,
                  borderRadius: Sizes.ScreenPadding,
                }}>
                <Text
                  onPress={() => {
                    setInputs({...inputs, ACTIVITY_TYPE: 'W', setCount: 1});
                    setDropdownInput({
                      ...dropdownInput,
                      weight: {label: 'Kg', value: 'Kg'},
                    });
                  }}
                  style={{
                    color: Colors.Primary,
                    ...Fonts.Medium2,
                    fontSize: 13,
                    textAlign: 'center',
                  }}>
                  Weight
                </Text>
              </TouchableOpacity>
              <View style={{width: Sizes.Base}} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setInputs({...inputs, ACTIVITY_TYPE: 'D', setCount: 1});
                  setDropdownInput({
                    ...dropdownInput,
                    distance: {label: 'Km', value: 'Km'},
                  });
                }}
                style={{
                  flex: 1,
                  backgroundColor:
                    inputs.ACTIVITY_TYPE == 'D'
                      ? Colors.Secondary
                      : Colors.White,
                  padding: Sizes.Base,
                  elevation: 6,
                  borderRadius: Sizes.ScreenPadding,
                }}>
                <Text
                  onPress={() => {
                    setInputs({...inputs, ACTIVITY_TYPE: 'D', setCount: 1});
                    setDropdownInput({
                      ...dropdownInput,
                      distance: {label: 'Km', value: 'Km'},
                    });
                  }}
                  style={{
                    color: Colors.Primary,
                    ...Fonts.Medium2,
                    fontSize: 13,
                    textAlign: 'center',
                  }}>
                  Distance
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginTop: Sizes.Radius,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{flex: 1}}>
                <TextInput
                  labelStyle={{
                    ...Fonts.Medium2,
                    color: Colors.PrimaryText1,
                  }}
                  style={{width: '90%'}}
                  label={
                    inputs.ACTIVITY_TYPE == 'S'
                      ? 'Enter Repetition'
                      : inputs.ACTIVITY_TYPE == 'T'
                      ? 'Enter Time'
                      : inputs.ACTIVITY_TYPE == 'D'
                      ? 'Enter Distance'
                      : inputs.ACTIVITY_TYPE == 'W'
                      ? 'Enter Weight'
                      : ''
                  }
                  keyboardType="number-pad"
                  value={inputs.ACTIVITY_VALUE}
                  onChangeText={value => {
                    setInputs({
                      ...inputs,
                      ACTIVITY_VALUE: value,
                    });
                  }}
                  rightChild={
                    <View
                      style={{
                        width: inputs.ACTIVITY_TYPE != 'S' ? '40%' : '0%',
                      }}>
                      {inputs.ACTIVITY_TYPE == 'T' ||
                      inputs.ACTIVITY_TYPE == 'D' ||
                      inputs.ACTIVITY_TYPE == 'W' ? (
                        <Dropdown
                          data={
                            inputs.ACTIVITY_TYPE == 'T'
                              ? [
                                  {label: 'Sec', value: 'Sec'},
                                  {label: 'Min', value: 'Min'},
                                ]
                              : inputs.ACTIVITY_TYPE == 'D'
                              ? [
                                  {label: 'Km', value: 'Km'},
                                  {label: 'M', value: 'M'},
                                ]
                              : [
                                  {label: 'Kg', value: 'Kg'},
                                  {label: 'G', value: 'G'},
                                ]
                          }
                          value={
                            inputs.ACTIVITY_TYPE == 'T'
                              ? dropdownInput.time
                              : inputs.ACTIVITY_TYPE == 'D'
                              ? dropdownInput.distance
                              : dropdownInput.weight
                          }
                          onChange={item => {
                            inputs.ACTIVITY_TYPE == 'T'
                              ? setDropdownInput({...dropdownInput, time: item})
                              : inputs.ACTIVITY_TYPE == 'D'
                              ? setDropdownInput({
                                  ...dropdownInput,
                                  distance: item,
                                })
                              : setDropdownInput({
                                  ...dropdownInput,
                                  weight: item,
                                });
                          }}
                          labelField="label"
                          valueField="value"
                          dropdownStyle={{
                            paddingRight: 5,
                            paddingLeft: 15,
                            alignSelf: 'center',
                          }}
                          style={{
                            elevation: 0,
                            height: 30,
                          }}
                          iconStyle={{
                            height: 19,
                            width: 19,
                          }}
                        />
                      ) : null}
                    </View>
                  }
                  autoFocus={true}
                  placeholder={
                    inputs.ACTIVITY_TYPE == 'S'
                      ? 'Enter Repetition'
                      : inputs.ACTIVITY_TYPE == 'T'
                      ? 'Enter Time'
                      : inputs.ACTIVITY_TYPE == 'D'
                      ? 'Enter Distance'
                      : 'Enter Weight'
                  }
                />
              </View>
              <View style={{width: 14}} />
              <View style={{width: 14}} />

              <View style={{width: 14}} />

              <View
                style={{
                  flex: 0.5,
                }}>
                <View style={{flex: 1}}>
                  <TextInput
                    labelStyle={{
                      ...Fonts.Medium2,
                      color: Colors.PrimaryText1,
                    }}
                    label={'Set'}
                    value={inputs.setCount.toString()}
                    autoFocus={false}
                    onChangeText={value => {
                      setInputs({
                        ...inputs,
                        setCount: parseInt(value),
                      });
                    }}
                    style={{
                      alignContent: 'center',
                      paddingHorizontal: Sizes.Radius,
                    }}
                    rightChild={
                      <Icon
                        name="pluscircleo"
                        type="AntDesign"
                        size={20}
                        onPress={() => {
                          setInputs({
                            ...inputs,
                            setCount: parseInt(inputs.setCount, 10) + 1,
                          });
                        }}
                      />
                    }
                    leftChild={
                      <Icon
                        name="minuscircleo"
                        type="AntDesign"
                        size={20}
                        onPress={() => {
                          setInputs({
                            ...inputs,
                            setCount: Math.max(
                              parseInt(inputs.setCount, 10) - 1,
                              1,
                            ),
                          });
                        }}
                      />
                    }
                  />
                </View>
              </View>
            </View>

            <View style={{marginTop: Sizes.Padding * 2}}>
              <TextButton
                style={{
                  marginHorizontal: Sizes.Padding,
                  alignSelf: 'center',
                }}
                label="Add Activity"
                loading={false}
                onPress={() => {
                  if (inputs.ACTIVITY_VALUE == '') {
                    Toast('Please Enter value');
                  }
                  // else {
                  //   setOpenModal(false);
                  //   const updatedItem = {
                  //     ...currentItem,
                  //     ACTIVITY_VALUE:
                  //       inputs.ACTIVITY_TYPE == 'T'
                  //         ? dropdownInput.time.value == 'Sec'
                  //           ? parseInt(inputs.ACTIVITY_VALUE)
                  //           : parseInt(inputs.ACTIVITY_VALUE) * 60
                  //         : inputs.ACTIVITY_TYPE == 'W'
                  //         ? dropdownInput.weight.value == 'G'
                  //           ? parseInt(inputs.ACTIVITY_VALUE)
                  //           : parseInt(inputs.ACTIVITY_VALUE) * 1000
                  //         : inputs.ACTIVITY_TYPE == 'D'
                  //         ? dropdownInput.distance.value == 'M'
                  //           ? parseInt(inputs.ACTIVITY_VALUE)
                  //           : parseInt(inputs.ACTIVITY_VALUE) * 1000
                  //         : inputs.ACTIVITY_VALUE,
                  //     ACTIVITY_TYPE: inputs.ACTIVITY_TYPE,
                  //     ACTIVITY_ID: currentItem.ID,
                  //     CATEGORY: 'B',
                  //     SET_COUNT: inputs.setCount,
                  //   };
                  //   dispatch(Reducers.setSelectedActivities(updatedItem));
                  // }
                  else {
                    const value =
                      inputs.ACTIVITY_TYPE == 'T'
                        ? dropdownInput.time.value == 'Sec'
                          ? inputs.ACTIVITY_VALUE
                          : inputs.ACTIVITY_VALUE * 60
                        : inputs.ACTIVITY_TYPE == 'W'
                        ? dropdownInput.weight.value == 'G'
                          ? inputs.ACTIVITY_VALUE
                          : inputs.ACTIVITY_VALUE * 1000
                        : inputs.ACTIVITY_TYPE == 'D'
                        ? dropdownInput.distance.value == 'M'
                          ? inputs.ACTIVITY_VALUE
                          : inputs.ACTIVITY_VALUE * 1000
                        : inputs.ACTIVITY_VALUE;
                    handleInputChange(
                      currentIndex,
                      currentItem,
                      value,
                      inputs.setCount,
                    );
                    // handleSelectActivity(currentIndex);
                    setOpenModal(false);
                  }
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default UpdateCustomActivities;
