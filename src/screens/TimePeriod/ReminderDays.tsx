import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from '../../Modules';

interface Props {
  selectedReminderDays: any;
  setSelectedReminderDays: any;
}
const ReminderDays = ({
  selectedReminderDays,
  setSelectedReminderDays,
}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const days = Array.from({length: 7}, (_, i) => `${i + 1}`);
  const flatListRef = useRef<any>(null);

  const scrollToIndex = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({index, animated: true});
    }
  };

  const onViewableItemsChanged = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      const focusedItem = viewableItems[0].item;
      setSelectedReminderDays(focusedItem);
    }
  }).current;

  useEffect(() => {
    const initialIndex = days.indexOf(selectedReminderDays);
    scrollToIndex(initialIndex);
  }, []);

  const renderReminderDaysItem = ({item}: any) => (
    <TouchableOpacity onPress={() => setSelectedReminderDays(item)}>
      <View
        style={[
          {
            width: 70,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <Text
          style={{
            ...Fonts.Medium2,
            color:
              selectedReminderDays === item
                ? Colors.Primary
                : Colors.PrimaryText1,
            textAlignVertical: 'center',
            textAlign: 'center',
          }}>
          {item}
        </Text>
        <Text
          style={{
            ...Fonts.Medium3,
            color:
              selectedReminderDays === item
                ? Colors.Primary
                : Colors.PrimaryText1,
            textAlignVertical: 'center',
            textAlign: 'center',
          }}>
          {item == 1 ? 'day' : 'days'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{alignItems: 'center'}}>
      <View
        style={{
          width: '100%',
          overflow: 'hidden',
        }}>
        <FlatList
          ref={flatListRef}
          data={days}
          horizontal
          keyExtractor={item => item}
          renderItem={renderReminderDaysItem}
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="fast"
          snapToOffsets={days.map((_, index) => index * 50)}
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
    </View>
  );
};

export default ReminderDays;
