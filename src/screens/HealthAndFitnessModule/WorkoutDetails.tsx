import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {StackProps} from '../../routes';
import {useSelector} from '../../Modules';
import {Header, Icon, TextButton} from '../../Components';
import {IMAGE_URL} from '../../Modules/service';
import FastImage from 'react-native-fast-image';
type Props = StackProps<'WorkoutDetails'>;

const WorkoutDetails = ({navigation, route}: Props) => {
  const {Item, CURRANT_ITEM} = route.params;
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);

  const [CurrantItem, setCurrentItem] = useState(CURRANT_ITEM);

  const NextIndex = async () => {
    const currentIndex = Item.findIndex(
      (item: any) => item.ID === CurrantItem.ID,
    );

    const nextIndex = (currentIndex + 1) % Item.length;

    setCurrentItem({...Item[nextIndex], index: nextIndex});
  };
  const PerviousIndex = async () => {
    const currentIndex = Item.findIndex(
      (item: any) => item.ID === CurrantItem.ID,
    );
    if (currentIndex == 0) {
      return true;
    }

    const nextIndex = (currentIndex - 1) % Item.length;

    setCurrentItem({...Item[nextIndex], index: nextIndex});
  };

  // console.log('\n\n...CurrantItem...', CurrantItem);
  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Header
        onBack={() => {
          navigation.goBack();
        }}
        label={'Instructions'}
        TextStyles={{textAlign: 'center'}}
      />
      <View style={{flex: 1, margin: Sizes.Padding}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{height: Sizes.Base}} />

          <Text
            style={{
              ...Fonts.Bold1,
              textAlign: 'center',
              color: Colors.Primary,
              fontSize: 20,
            }}>{`${CurrantItem.ACTIVITY_NAME}`}</Text>
          <View style={{height: Sizes.Padding}} />
          <FastImage
            source={{
              uri: IMAGE_URL + 'activityGIF/' + CurrantItem.ACTIVITY_GIF,
              // uri:
              // IMAGE_URL + 'activityGIF/' + CurrantItem.ACTIVITY_THUMBNAIL_GIF,
              priority: FastImage.priority.high,
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
            }}
          />
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
            onPress={() => {}}
            label={CurrantItem.index + 1 + '/' + Item.length.toString()}
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
    </View>
  );
};

export default WorkoutDetails;
