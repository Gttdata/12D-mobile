import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from '../../Modules';
import {Icon} from '../../Components';

interface Props {
  selectedCycleLength: any;
  setSelectedCycleLength: any;
}
const AverageCycleLength = ({
  selectedCycleLength,
  setSelectedCycleLength,
}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const cycleLength = Array.from({length: 30}, (_, i) => `${i + 1}`);
  const flatListRef = useRef<any>(null);

  const scrollToIndex = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({index, animated: true});
    }
  };

  const onViewableItemsChanged = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      const focusedItem = viewableItems[0].item;
      setSelectedCycleLength(focusedItem);
    }
  }).current;

  const handleUpPress = () => {
    const currentIndex = cycleLength.indexOf(selectedCycleLength);
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setSelectedCycleLength(cycleLength[newIndex]);
      scrollToIndex(newIndex);
    }
  };

  const handleDownPress = () => {
    const currentIndex = cycleLength.indexOf(selectedCycleLength);
    if (currentIndex < cycleLength.length - 1) {
      const newIndex = currentIndex + 1;
      setSelectedCycleLength(cycleLength[newIndex]);
      scrollToIndex(newIndex);
    }
  };

  useEffect(() => {
    const initialIndex = cycleLength.indexOf(selectedCycleLength);
    scrollToIndex(initialIndex);
  }, []);

  const renderHourItem = ({item}: any) => (
    <TouchableOpacity onPress={() => setSelectedCycleLength(item)}>
      <View
        style={[
          {
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
          },
          selectedCycleLength === item && {
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
              selectedCycleLength === item
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
          height: 250,
          width: 100,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: Colors.Primary2,
          borderRadius: 10,
          paddingVertical: 10,
        }}>
        <FlatList
          ref={flatListRef}
          data={cycleLength}
          keyExtractor={item => item}
          renderItem={renderHourItem}
          showsVerticalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="fast"
          snapToOffsets={cycleLength.map((_, index) => index * 50)}
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

export default AverageCycleLength;
