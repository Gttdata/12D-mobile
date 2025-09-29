import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {Reducers, apiPost, useDispatch, useSelector} from '../../../Modules';
import {
  Header,
  Icon,
  Modal,
  TextButton,
  TextInput,
  Toast,
} from '../../../Components';
import {HEALTH_FITNESS_ACTIVITY} from '../../../Modules/interface';
import {StackProps} from '../../../routes';
import Dropdown from '../../../Components/Dropdown';
import SelectActivityRenderItem from './SelectActivityRenderItem';
import {FlashList} from '@shopify/flash-list';

type Props = StackProps<'SelectActivities'>;
const SelectActivities = ({navigation, route}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [activities, setActivities] = useState<HEALTH_FITNESS_ACTIVITY[]>([]);
  const {selectedActivities} = useSelector(state => state.customActivity);
  const [openModal, setOpenModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<HEALTH_FITNESS_ACTIVITY>();
  const [currentIndex, setCurrentIndex] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [allLoaded, setAllLoaded] = useState(false);

  const dispatch = useDispatch();
  const {Item} = route.params;
  const {member} = useSelector(state => state.member);
  const [inputs, setInputs] = useState<{
    ACTIVITY_TYPE: any;
    ACTIVITY_VALUE: any;
    setCount: any;
  }>({
    ACTIVITY_TYPE: 'T',
    ACTIVITY_VALUE: '',
    setCount: 1,
  });
  const [dropdownInput, setDropdownInput] = useState({
    time: {label: 'Sec', value: 'Sec'},
    weight: {label: 'Kg', value: 'Kg'},
    distance: {label: 'Km', value: 'Km'},
  });

  useEffect(() => {
    getActivities(1);
  }, []);

  const getActivities = async (pageNumber: number) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await apiPost('api/activity/get', {
        filter: ` AND ACTIVITY_CATEGORY_ID = ${Item.ID} AND STATUS = 1`,
        sortKey: 'ACTIVITY_SUB_CATEGORY_ID',
        sortValue: 'ASC',
        pageIndex: '' + pageNumber,
        pageSize: '' + 8,
      });

      if (res && res.code == 200) {
        const transformedData = transformDataWithHeaders(res.data);
        if (pageNumber === 1) {
          setActivities(transformedData);
        } else {
          setActivities(prevActivities => [
            ...prevActivities,
            ...transformedData,
          ]);
        }
        setLoading(false);
        setLoadingMore(false);
        if (res.data.length === 0) {
          setAllLoaded(true); // No more data to load
        }
      } else {
        Toast('Unable to get activities at that time, Please try again later');
        setLoading(false);
        setLoadingMore(false);
      }
    } catch (error) {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  const isItemSelected = useCallback(
    (index: number) => {
      return selectedActivities.some(
        activity => activity.ID === activities[index].ID,
      );
    },
    [selectedActivities, activities],
  );
  const transformDataWithHeaders = useCallback((data: any) => {
    const transformedData: any = [];
    const seenSubCategories = new Set();
    data.forEach((item: any) => {
      const subCategoryName = item.SUB_CATEGORY_NAME.trim();
      if (!seenSubCategories.has(subCategoryName)) {
        transformedData.push({
          type: 'header',
          SUB_CATEGORY_NAME: subCategoryName,
        });
        seenSubCategories.add(subCategoryName);
      }
      transformedData.push({type: 'item', ...item});
    });
    return transformedData;
  }, []);

  const handleEndReached = () => {
    if (!loadingMore && !allLoaded) {
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        getActivities(nextPage);
        return nextPage;
      });
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.Background}}>
      <Header
        label="Select Activities"
        onBack={() => {
          navigation.goBack();
        }}
      />
      {loading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={'large'} color={Colors.Primary} />
        </View>
      ) : activities.length > 0 ? (
        <View style={{flex: 1}}>
          <View style={{flex: 1, margin: Sizes.Padding}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={activities}
              renderItem={({item, index}) => (
                <SelectActivityRenderItem
                  item={item}
                  index={index}
                  isItemSelected={(items: number) => isItemSelected(items)}
                  onPress={() => {
                    if (isItemSelected(index)) {
                      dispatch(Reducers.setSelectedActivities(item));
                    } else {
                      navigation.navigate('DescriptionActivity', {
                        Item: activities,
                        CURRANT_ITEM: item,
                      });
                    }
                  }}
                  onSelected={() => {
                    setCurrentItem(item);
                    setCurrentIndex(index);
                    setOpenModal(true);
                  }}
                  onCheckBoxPress={() => {
                    if (isItemSelected(index)) {
                      dispatch(Reducers.setSelectedActivities(item));
                    } else {
                      setCurrentItem(item);
                      setCurrentIndex(index);
                      setOpenModal(true);
                    }
                  }}
                />
              )}
              keyExtractor={(item, index) =>
                item.type === 'header' ? `header-${index}` : item.ID.toString()
              }
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() =>
                loadingMore ? (
                  <ActivityIndicator size={'small'} color={Colors.Primary} />
                ) : null
              }
            />
          </View>
          <View style={{margin: Sizes.Padding}}>
            <TextButton
              label="Save"
              loading={false}
              onPress={() => navigation.goBack()}
            />
          </View>
        </View>
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: Colors.PrimaryText1, ...Fonts.Medium2}}>
            No Activities Found
          </Text>
        </View>
      )}

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

export default SelectActivities;
