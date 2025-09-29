import React from 'react';
import {View, Text, TouchableOpacity, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from './Icon';
import {useSelector} from '../Modules';

interface FloatingAddProps {
  onPress: () => void;
  style?: ViewStyle;
}
const BUTTON_SIZE = 55;
const FloatingAdd: React.FC<FloatingAddProps> = ({onPress, style}) => {
  const {Colors, Sizes} = useSelector(state => state.app);
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE / 2,
        overflow: 'hidden',
        elevation: 10,
        position: 'absolute',
        bottom: Sizes.ScreenPadding + 5,
        right: Sizes.ScreenPadding,
        ...style,
      }}>
      <LinearGradient
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
        colors={[Colors.Primary, Colors.Secondary]}>
        <Icon name="plus" color="white" type="AntDesign" size={35} />
      </LinearGradient>
    </TouchableOpacity>
  );
};
export default FloatingAdd;
