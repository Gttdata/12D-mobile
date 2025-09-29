import {
  ActivityIndicator,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {ViewStyle} from 'react-native';
import {TextStyle} from 'react-native';
import {useSelector} from '../Modules';

interface TEXT_BUTTON {
  label: string;
  onPress: () => void;
  loading: boolean;
  disable?: boolean;
  colors?: string[];
  leftChild?: any;
  rightChild?: any;
  style?: ViewStyle;
  ViewStyle?: ViewStyle;
  textStyle?: TextStyle;
  isBorder?: boolean;
}
const TitleComponent = ({
  label,
  onPress,
  loading,
  disable,
  leftChild,
  rightChild,
  colors,
  style,
  ViewStyle,
  textStyle,
  isBorder,
}: TEXT_BUTTON) => {
  const {Colors, Fonts, Sizes} = useSelector(state => state.app);
  const colorCode = disable
    ? ['#808080', '#999999']
    : colors
    ? colors
    : [Colors.Primary, Colors.Primary];
  return (
    <TouchableOpacity
      style={{
        width: '100%',
        height: Sizes.Field,
        borderRadius: Sizes.Radius,
        elevation: 5,
        ...style,
      }}
      onPress={() => onPress()}
      activeOpacity={1}
      disabled={disable || loading}
      hitSlop={{bottom: 10, left: 10, right: 10, top: 10}}>
      <View
        style={{
          flex: 1,
          margin: 1,
          backgroundColor: isBorder ? Colors.White : 'transparent',
          borderRadius: Sizes.Radius - 1,
          paddingHorizontal: Sizes.Radius,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          ...ViewStyle,
        }}>
        {leftChild ? leftChild : null}
        <Text
          style={{
            ...Fonts.Bold2,
            flex: 1,
            textAlign: 'center',
            textAlignVertical: 'center',
            color: isBorder ? colorCode[0] : Colors.White,
            ...textStyle,
          }}
          numberOfLines={1}
          selectable={false}>
          {label}
        </Text>
        {loading ? (
          <ActivityIndicator
            color={isBorder ? colorCode[0] : Colors.White}
            style={{
              position: 'absolute',
              right: 10,
            }}
          />
        ) : null}
        {rightChild ? rightChild : null}
      </View>
    </TouchableOpacity>
  );
};

export default TitleComponent;
