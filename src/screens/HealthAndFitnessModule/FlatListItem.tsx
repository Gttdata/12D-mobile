import React, {useState} from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import {useSelector} from '../../Modules';
import {Icon} from '../../Components';
import {IMAGE_URL} from '../../Modules/service';
import FastImage from 'react-native-fast-image';

const FlatListItem = ({
  item,
  index,
  data,
  scrollY,
  navigation,
}: // opacity,
// scale,
any) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [loadingImage, setLoadingImage] = useState(false);
  function onLoading(value: boolean) {
    setLoadingImage(value);
  }
  return (
    <Animated.View>
      <TouchableOpacity
        key={index.toString()}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('WorkoutDetails', {
            Item: data,
            CURRANT_ITEM: {...item, index},
          });
        }}
        style={{
          marginHorizontal: Sizes.Padding,
          backgroundColor: Colors.White,
          elevation: 5,
          shadowColor: Colors.Primary,
          paddingHorizontal: Sizes.ScreenPadding,
          borderRadius: Sizes.Radius,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
          }}>
          <Icon name="menu" type="Feather" />
          <View style={{width: Sizes.Base}} />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 80,
              width: 80,
              margin: Sizes.Base,
            }}>
            {loadingImage && (
              <ActivityIndicator size="small" color={Colors.Primary} />
            )}
            {
              <FastImage
                source={{
                  // uri: IMAGE_URL + 'activityGIF/' + item.ACTIVITY_GIF,
                  uri:
                    IMAGE_URL +
                    'activityTumbnailGIF/' +
                    item.ACTIVITY_THUMBNAIL_GIF,
                  // priority: FastImage.priority.normal,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
                onLoadStart={() => onLoading(true)}
                onLoadEnd={() => onLoading(false)}
                onError={() => onLoading(false)}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: loadingImage ? 0 : 80,
                  width: loadingImage ? 0 : 80,
                  margin: Sizes.Base,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            }
          </View>

          <View style={{flex: 1, marginStart: Sizes.Base}}>
            <Text
              numberOfLines={2}
              style={{
                ...Fonts.Bold1,
                fontSize: 14,
                color: Colors.PrimaryText1,
              }}>
              {item.ACTIVITY_NAME}
            </Text>
            <Text
              style={{
                ...Fonts.Regular3,
                color: Colors.Primary,
              }}>
              {item.ACTIVITY_TYPE == 'S'
                ? '' + item.ACTIVITY_VALUE + ' sets'
                : item.ACTIVITY_TYPE == 'T'
                ? Number(item.ACTIVITY_VALUE) > 60
                  ? `${Math.floor(Number(item.ACTIVITY_VALUE) / 60)} Min ${
                      Number(item.ACTIVITY_VALUE) % 60
                    } Sec`
                  : item.ACTIVITY_VALUE + ' Seconds'
                : item.ACTIVITY_TYPE == 'D'
                ? item.ACTIVITY_VALUE + ' meter'
                : item.ACTIVITY_VALUE + ' KG'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default FlatListItem;
