import {
  ActivityIndicator,
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Alert} from 'react-native';
import Icon from './Icon';
import {useSelector} from '../Modules';
interface INPUT_INTERFACE {
  leftChild?: any;
  rightChild?: any;
  value: string | number | undefined | null;
  placeholder?: string;
  disable?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  error?: boolean;
  label?: string;
  labelStyle?: TextStyle;
  imp?: boolean;
  loading?: boolean;
  onSelect: (file: {name: string; path: string; type: string}) => void;
}
const ImagePicker = ({
  leftChild,
  rightChild,
  value,
  placeholder = 'Select Image',
  disable,
  style,
  textStyle,
  error,
  label,
  labelStyle,
  imp,
  onSelect,
  loading,
}: INPUT_INTERFACE) => {
  const {Colors, Fonts, Sizes} = useSelector(state => state.app);
  const onPress = () => {
    Alert.alert(
      'Pick Image',
      'Pick "Camera" or "Gallery"',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Camera',
          onPress: () => {
            ImageCropPicker.openCamera({
              compressImageQuality: 0.7,
            }).then(image => {
              let extension = image.path.split('.').pop();
              onSelect({
                path: image.path,
                type: image.mime,
                name: 'IMG_' + Date.now() + '.' + extension,
              });
            });
          },
          style: 'default',
        },
        {
          text: 'Gallery',
          onPress: () => {
            ImageCropPicker.openPicker({compressImageQuality: 0.7}).then(
              image => {
                let extension = image.path.split('.').pop();
                onSelect({
                  path: image.path,
                  type: image.mime,
                  name: 'IMG_' + Date.now() + '.' + extension,
                });
              },
            );
          },
          style: 'default',
        },
      ],
      {cancelable: true, onDismiss: () => {}},
    );
  };
  return (
    <View style={{width: '100%'}}>
      {label && (
        <Text
          style={{
            ...Fonts.Regular3,
            color: Colors.Black,
            ...labelStyle,
          }}
          numberOfLines={1}
          adjustsFontSizeToFit>
          {'' + label}
          {imp ? (
            <Text
              style={{
                ...Fonts.Regular3,
                color: '#FF0123',
                ...labelStyle,
              }}>
              {'*'}
            </Text>
          ) : (
            ''
          )}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => {
          onPress();
        }}
        disabled={disable}
        activeOpacity={0.7}
        style={[
          {
            width: '100%',
            borderRadius: Sizes.Base,
            height: Sizes.Field,
            borderColor: error
              ? Colors.error
              : disable
              ? Colors.Disable
              : Colors.Primary,
            borderWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: Colors.Primary,
          },
          {...style},
        ]}>
        {leftChild ? leftChild : null}
        <Text
          style={[
            {
              flex: 1,
              paddingHorizontal: Sizes.Padding,
              ...Fonts.Regular3,
              alignItems: 'center',
              justifyContent: 'center',
              color: error
                ? Colors.error
                : value
                ? Colors.Black
                : Colors.Disable,
              paddingVertical: 0,
            },
            textStyle,
          ]}>
          {value ? value : placeholder}
        </Text>
        {loading ? (
          <ActivityIndicator color={Colors.Primary} />
        ) : rightChild ? (
          rightChild
        ) : (
          <Icon
            name={'camera'}
            type="Entypo"
            style={{paddingHorizontal: Sizes.Padding}}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ImagePicker;

const styles = StyleSheet.create({});
