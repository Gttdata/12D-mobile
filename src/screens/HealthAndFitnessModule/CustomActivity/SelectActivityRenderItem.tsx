import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {HEALTH_FITNESS_ACTIVITY} from '../../../Modules/interface';
import {useSelector} from '../../../Modules';
import {Checkbox} from 'react-native-paper';
import {IMAGE_URL} from '../../../Modules/service';
import {Icon} from '../../../Components';
import FastImage from 'react-native-fast-image';

const SelectActivityRenderItem = ({
  item,
  index,
  isItemSelected,
  onPress,
  onSelected,
  onCheckBoxPress,
}: {
  item: HEALTH_FITNESS_ACTIVITY;
  index: number;
  isItemSelected: (index: number) => boolean;
  onPress: () => void;
  onSelected: () => void;
  onCheckBoxPress: () => void;
}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [loadingImage, setLoadingImage] = useState(false);
  function onLoading(value: boolean) {
    setLoadingImage(value);
  }
  if (item.type === 'header') {
    return (
      <Text
        style={{
          color: Colors.Primary,
          ...Fonts.Medium2,
          marginLeft: Sizes.Radius,
        }}>
        {item.SUB_CATEGORY_NAME}
      </Text>
    );
  } else {
    return (
      <View>
        <TouchableOpacity
          key={index.toString()}
          activeOpacity={0.8}
          onPress={() => {
            onPress();
          }}
          style={{
            marginTop: Sizes.Radius,
            backgroundColor: isItemSelected(index)
              ? Colors.Primary2 + 40
              : Colors.White,
            margin: 5,
            paddingHorizontal: Sizes.ScreenPadding,
            borderRadius: Sizes.Radius,
          }}>
          {!isItemSelected(index) && (
            <TouchableOpacity
              onPress={() => {
                onSelected();
              }}
              style={{
                position: 'absolute',
                top: Sizes.Padding,
                right: Sizes.Padding,
              }}>
              <Icon
                name="edit"
                type="MaterialIcons"
                size={17}
                color={Colors.Primary}
              />
            </TouchableOpacity>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}>
            <Checkbox
              status={isItemSelected(index) ? 'checked' : 'unchecked'}
              color={Colors.Primary}
              onPress={() => {
                onCheckBoxPress();
              }}
            />
            <View style={{width: Sizes.Base}} />
            {loadingImage && (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 80,
                  width: 80,
                  margin: Sizes.Base,
                  borderRadius: Sizes.Base,
                }}>
                <ActivityIndicator size="small" color={Colors.Primary} />
              </View>
            )}
            {
              <FastImage
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: loadingImage ? 0 : 80,
                  width: loadingImage ? 0 : 80,
                  margin: Sizes.Base,
                  borderRadius: Sizes.Base,
                }}
                source={{
                  // uri: IMAGE_URL + 'activityGIF/' + item.ACTIVITY_GIF,
                  uri:
                    IMAGE_URL +
                    'activityTumbnailGIF/' +
                    item.ACTIVITY_THUMBNAIL_GIF,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
                onLoadStart={() => onLoading(true)}
                onLoadEnd={() => onLoading(false)}
                onError={() => onLoading(false)}
              />
            }
            <View
              style={{
                marginHorizontal: Sizes.Padding,
                marginTop: Sizes.ScreenPadding,
                flex: 1,
              }}>
              <Text
                style={{
                  ...Fonts.Medium2,
                  fontSize: 14,
                  color: Colors.PrimaryText1,
                  flex: 1,
                }}>
                {item.ACTIVITY_NAME}
              </Text>
              <Text
                style={{
                  marginTop: Sizes.Base,
                  ...Fonts.Medium3,
                  color: Colors.Primary,
                }}>
                {item.ACTIVITY_TYPE == 'S'
                  ? item.ACTIVITY_VALUE + ' sets'
                  : item.ACTIVITY_TYPE == 'T'
                  ? item.ACTIVITY_VALUE + ' Min'
                  : item.ACTIVITY_TYPE == 'D'
                  ? item.ACTIVITY_VALUE + ' Meter'
                  : item.ACTIVITY_TYPE == 'W'
                  ? item.ACTIVITY_VALUE + ' KG'
                  : ''}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
};

export default SelectActivityRenderItem;
