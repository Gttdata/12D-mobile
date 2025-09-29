import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {StackProps} from '../../../routes';
import {Reducers, useDispatch, useSelector} from '../../../Modules';
import {
  Header,
  Icon,
  Modal,
  TextButton,
  TextInput,
  Toast,
} from '../../../Components';
import {IMAGE_URL} from '../../../Modules/service';
import {HEALTH_FITNESS_ACTIVITY} from '../../../Modules/interface';
import Dropdown from '../../../Components/Dropdown';
import FastImage from 'react-native-fast-image';
type Props = StackProps<'DescriptionActivity'>;

const DescriptionActivity = ({navigation, route}: Props): JSX.Element => {
  const {Item, CURRANT_ITEM} = route.params;
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const dispatch = useDispatch();

  const RemovedHeader = Item.filter(item => item.type !== 'header');
  const index = RemovedHeader.findIndex(
    (item, idx) => item.ID === CURRANT_ITEM.ID,
  );
  const [openModal, setOpenModal] = useState(false);
  const [currentItem, setCurrentItem] =
    useState<HEALTH_FITNESS_ACTIVITY>(CURRANT_ITEM);
  const [inputs, setInputs] = useState({
    ACTIVITY_TYPE: 'T',
    ACTIVITY_VALUE: '',
    setCount: 1,
  });
  const [dropdownInput, setDropdownInput] = useState({
    time: {label: 'Sec', value: 'Sec'},
    weight: {label: 'Kg', value: 'Kg'},
    distance: {label: 'Km', value: 'Km'},
  });
  const [CurrantItem, setcurrentItem] = useState({
    ...RemovedHeader[index],
    indexs: index,
  });
  const [AllWorkouts, setAllWorkouts] =
    useState<HEALTH_FITNESS_ACTIVITY[]>(RemovedHeader);
  const {selectedActivities} = useSelector(state => state.customActivity);
  const isItemSelected = () => {
    return selectedActivities.some(activity => activity.ID === currentItem.ID);
  };
  const NextIndex = async () => {
    const currentIndex = AllWorkouts.findIndex(
      item => item.ID === CurrantItem.ID,
    );
    const nextIndex = (currentIndex + 1) % AllWorkouts.length;
    setCurrentItem({...AllWorkouts[nextIndex]});
    setcurrentItem({...AllWorkouts[nextIndex], indexs: nextIndex});
  };
  const PerviousIndex = async () => {
    const currentIndex = AllWorkouts.findIndex(
      item => item.ID === CurrantItem.ID,
    );
    if (currentIndex == 0) {
      return true;
    }

    const nextIndex = (currentIndex - 1) % AllWorkouts.length;
    setCurrentItem({...AllWorkouts[nextIndex]});

    setcurrentItem({...AllWorkouts[nextIndex], indexs: nextIndex});
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Header
        onBack={() => {
          navigation.goBack();
        }}
        label={CurrantItem.ACTIVITY_NAME}
      />
      <View style={{flex: 1, margin: Sizes.Padding}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <FastImage
            source={{
              uri: IMAGE_URL + 'activityGIF/' + CurrantItem.ACTIVITY_GIF,
              priority: FastImage.priority.normal,
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: Sizes.Height / 4,
              width: '100%',
              borderRadius: Sizes.Radius,
            }}
            resizeMode="contain"
          />
          <View style={{alignItems: 'flex-end', flex: 1}}>
            <Text style={{...Fonts.Bold1, color: Colors.Primary, fontSize: 14}}>
              {`${
                CurrantItem.indexs + 1 + '/' + AllWorkouts.length.toString()
              }`}
            </Text>
          </View>

          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginVertical: Sizes.Padding,
            }}>
            <Text style={{...Fonts.Bold1, color: Colors.Primary, fontSize: 14}}>
              {CurrantItem.ACTIVITY_TYPE == 'T'
                ? 'DURATION'
                : CurrantItem.ACTIVITY_TYPE == 'S'
                ? 'REPEATS'
                : CurrantItem.ACTIVITY_TYPE == 'D'
                ? 'Distance'
                : CurrantItem.ACTIVITY_TYPE == 'W'
                ? 'Weight'
                : ''}
            </Text>
            <Text
              style={{
                ...Fonts.Medium1,
                color: Colors.PrimaryText1,
                fontSize: 14,
              }}>
              {CurrantItem.ACTIVITY_TYPE == 'T'
                ? CurrantItem.ACTIVITY_VALUE + ' Seconds'
                : CurrantItem.ACTIVITY_TYPE == 'S'
                ? CurrantItem.ACTIVITY_VALUE + ' X'
                : CurrantItem.ACTIVITY_TYPE == 'D'
                ? CurrantItem.ACTIVITY_VALUE + ' Meter'
                : CurrantItem.ACTIVITY_TYPE == 'W'
                ? CurrantItem.ACTIVITY_VALUE + ' KG'
                : ''}
            </Text>
          </View>

          {CurrantItem.CATEGORY && (
            <View
              style={{
                justifyContent: 'space-between',
                marginVertical: Sizes.Base,
              }}>
              <Text
                style={{...Fonts.Bold1, color: Colors.Primary, fontSize: 14}}>
                {'CATEGORY'}
              </Text>
              <Text
                style={{
                  ...Fonts.Regular1,
                  color: Colors.PrimaryText1,
                  textAlign: 'justify',
                  fontSize: 12,
                }}>
                {CurrantItem.CATEGORY}
              </Text>
            </View>
          )}
          {CurrantItem.SUB_CATEGORY_NAME && (
            <View
              style={{
                justifyContent: 'space-between',
                marginVertical: Sizes.Base,
              }}>
              <Text
                style={{...Fonts.Bold1, color: Colors.Primary, fontSize: 14}}>
                {'SUB CATEGORY NAME'}
              </Text>

              <Text
                style={{
                  ...Fonts.Regular1,
                  color: Colors.PrimaryText1,
                  textAlign: 'justify',
                  fontSize: 12,
                }}>
                {CurrantItem.SUB_CATEGORY_NAME}
              </Text>
            </View>
          )}

          {CurrantItem.DESCRIPTION && (
            <View
              style={{
                justifyContent: 'space-between',
                marginVertical: Sizes.Base,
              }}>
              <Text
                style={{...Fonts.Bold1, color: Colors.Primary, fontSize: 14}}>
                {'DESCRIPTION'}
              </Text>
              <Text
                style={{
                  ...Fonts.Regular1,
                  color: Colors.PrimaryText1,
                  textAlign: 'justify',
                  fontSize: 12,
                }}>
                {CurrantItem.DESCRIPTION}
              </Text>
            </View>
          )}

          <View
            style={{
              justifyContent: 'space-between',
              marginVertical: Sizes.Base,
            }}></View>
          {/* <View
          style={{
            justifyContent: 'space-between',
            marginVertical: Sizes.Base,
          }}>
          <Text style={{...Fonts.Bold1, color: Colors.Primary, fontSize: 14}}>
            {'COMMON MISTAKES'}
          </Text>
          <Text
            style={{
              ...Fonts.Regular1,
              color: Colors.PrimaryText1,
              textAlign: 'justify',
              fontSize: 12,
            }}>
            {
              'Lorem ipsum dolor sit amet, consectetur adipisicing elitVoluptatibus, error.'
            }
          </Text>
          <Text
            style={{
              ...Fonts.Regular1,
              color: Colors.PrimaryText1,
              textAlign: 'justify',
              fontSize: 12,
            }}>
            {
              'Lorem ipsum dolor sit amet, consectetur adipisicing elitVoluptatibus, error.'
            }
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            marginVertical: Sizes.Base,
          }}>
          <Text style={{...Fonts.Bold1, color: Colors.Primary, fontSize: 14}}>
            {'BREATHING TIPS'}
          </Text>
          <Text
            style={{
              ...Fonts.Regular1,
              color: Colors.PrimaryText1,
              textAlign: 'justify',
              fontSize: 12,
            }}>
            {
              'Lorem ipsum dolor sit amet, consectetur adipisicing elitVoluptatibus, error.'
            }
          </Text>
          <Text
            style={{
              ...Fonts.Regular1,
              color: Colors.PrimaryText1,
              textAlign: 'justify',
              fontSize: 12,
            }}>
            {
              'Lorem ipsum dolor sit amet, consectetur adipisicing elitVoluptatibus, error.'
            }
          </Text>
        </View> */}
        </ScrollView>
      </View>
      <View style={{margin: Sizes.Padding, flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <TextButton
            leftChild={
              <Icon
                name="arrow-left-circle"
                type="Feather"
                color={Colors.White}
                onPress={() => {
                  PerviousIndex();
                }}
              />
            }
            rightChild={
              <Icon
                name="arrow-right-circle"
                type="Feather"
                color={Colors.White}
                onPress={() => {
                  NextIndex();
                }}
              />
            }
            onPress={() => {
              if (isItemSelected()) {
                dispatch(Reducers.setSelectedActivities(currentItem));
              } else {
                setOpenModal(true);
              }
            }}
            label={isItemSelected() ? 'REMOVE' : 'ADD'}
            loading={false}
          />
        </View>
        <View style={{width: Sizes.Padding}} />
        <View style={{flex: 1}}>
          <TextButton
            onPress={() => {
              navigation.goBack();
            }}
            label="CLOSE"
            loading={false}
          />
        </View>
      </View>
      {openModal && (
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
                                  {label: 'G', value: 'Gm'},
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
                      ? 'Enter sets'
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
                  } else {
                    setOpenModal(false);
                    const updatedItem = {
                      ...currentItem,
                      ACTIVITY_VALUE:
                        inputs.ACTIVITY_TYPE == 'T'
                          ? dropdownInput.time.value == 'Sec'
                            ? parseInt(inputs.ACTIVITY_VALUE)
                            : parseInt(inputs.ACTIVITY_VALUE) * 60
                          : inputs.ACTIVITY_TYPE == 'W'
                          ? dropdownInput.weight.value == 'G'
                            ? parseInt(inputs.ACTIVITY_VALUE)
                            : parseInt(inputs.ACTIVITY_VALUE) * 1000
                          : inputs.ACTIVITY_TYPE == 'D'
                          ? dropdownInput.distance.value == 'M'
                            ? parseInt(inputs.ACTIVITY_VALUE)
                            : parseInt(inputs.ACTIVITY_VALUE) * 1000
                          : inputs.ACTIVITY_VALUE,
                      ACTIVITY_TYPE: inputs.ACTIVITY_TYPE,
                      ACTIVITY_ID: currentItem.ID,
                      CATEGORY: 'B',
                      SET_COUNT: inputs.setCount,
                    };
                    dispatch(Reducers.setSelectedActivities(updatedItem));
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

export default DescriptionActivity;
