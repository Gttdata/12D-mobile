import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from '../../Modules';
import {Icon} from '../../Components';

interface Props {
  selectedPeriodLength: any;
  setSelectedPeriodLength: any;
}
const AveragePeriodLength = ({selectedPeriodLength,setSelectedPeriodLength}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const periodLength = Array.from({length: 10}, (_, i) => `${i + 1}`);
  const flatListRef = useRef<any>(null);

  const scrollToIndex = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({index, animated: true});
    }
  };

  const onViewableItemsChanged = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      const focusedItem = viewableItems[0].item;
      setSelectedPeriodLength(focusedItem);
    }
  }).current;
  const handleUpPress = () => {
    const currentIndex = periodLength.indexOf(selectedPeriodLength);
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setSelectedPeriodLength(periodLength[newIndex]);
      scrollToIndex(newIndex);
    }
  };

  const handleDownPress = () => {
    const currentIndex = periodLength.indexOf(selectedPeriodLength);
    if (currentIndex < periodLength.length - 1) {
      const newIndex = currentIndex + 1;
      setSelectedPeriodLength(periodLength[newIndex]);
      scrollToIndex(newIndex);
    }
  };

  useEffect(() => {
    const initialIndex = periodLength.indexOf(selectedPeriodLength);
    scrollToIndex(initialIndex);
  }, []);

  const renderHourItem = ({item}: any) => (
    <TouchableOpacity onPress={() => setSelectedPeriodLength(item)}>
      <View
        style={[
          {
            height: 70,
            justifyContent: 'center',
            alignItems: 'center',
          },
          selectedPeriodLength === item && {
            backgroundColor: Colors.Secondary + '80',
            borderRadius: 30,
            marginHorizontal: 24,
            height: 50,
          },
        ]}>
        <Text
          style={{
            ...Fonts.Regular2,
            fontSize: 22,
            color:
              selectedPeriodLength === item
                ? Colors.Primary
                : Colors.PrimaryText1,
            textAlignVertical: 'center',
            textAlign: 'center',
          }}>
          {item}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{alignItems: 'center'}}>
      <TouchableOpacity onPress={handleUpPress}>
        <Icon name="chevron-small-up" type="Entypo" size={27} />
      </TouchableOpacity>
      <View
        style={{
          height: 200,
          width: 100,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: Colors.Primary2,
          borderRadius: 10,
          paddingVertical: 10,
        }}>
        <FlatList
          ref={flatListRef}
          data={periodLength}
          keyExtractor={item => item}
          renderItem={renderHourItem}
          showsVerticalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="fast"
          snapToOffsets={periodLength.map((_, index) => index * 50)}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
          }}
          getItemLayout={(data, index) => ({
            length: 50,
            offset: 50 * index,
            index,
          })}
        />
      </View>
      <TouchableOpacity onPress={handleDownPress}>
        <Icon name="chevron-small-down" type="Entypo" size={27} />
      </TouchableOpacity>
    </View>
  );
};

export default AveragePeriodLength;
