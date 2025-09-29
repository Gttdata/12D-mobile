import React, {FC, ReactNode} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {Icon} from '../Components';
import {useSelector} from '../Modules';

interface DynamicComponentProps {
  onPress?: () => void;
  selectText?: string;
  selectTextStyle?:TextStyle;
  labelText: string;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
  style?: ViewStyle;
  icon?: ReactNode;
  leftIcon?: ReactNode;
  disabled?: boolean;
  imp?: boolean;
}

const DropdownSimple: FC<DynamicComponentProps> = ({
  onPress,
  selectText,
  labelText,
  textStyle,
  containerStyle,
  style,
  disabled,
  icon,
  leftIcon,
  selectTextStyle,
  imp = true,
}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.8}
      style={[
        {
          // marginTop: 14,
          paddingVertical: Sizes.Base,
          borderRadius: Sizes.Radius,
          // borderBottomWidth: 1,
          // borderBottomColor: disabled ? Colors.Disable : Colors.Primary2,
        },
        containerStyle,
      ]}
      onPress={() => {
        if (!disabled && onPress) {
          onPress();
        }
      }}>
      {selectText && (
        <Text
          style={[{
            ...Fonts.Medium3,
            color: Colors.PrimaryText1,
            // paddingRight: 10,
          },selectTextStyle]}>
          {selectText}
          {imp && (
            <Text style={{color: Colors.Primary, marginLeft: Sizes.Padding}}>
              *
            </Text>
          )}
        </Text>
      )}
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: leftIcon ? 'center' : 'space-between',
            backgroundColor: disabled ? Colors.Disable : Colors.White,
          },
          style,
        ]}>
        {leftIcon ? leftIcon : null}
        <Text
          style={{
            ...Fonts.Medium3,
            color: Colors.PrimaryText,
            marginLeft: 4,
          }}>
          {labelText}
        </Text>
        {icon ? (
          icon
        ) : leftIcon ? null : (
          <Icon
            name="chevron-small-down"
            type="Entypo"
            size={30}
            color={disabled ? Colors.Disable : Colors.Primary}
            style={{alignSelf: 'flex-start', opacity: disabled ? 0.5 : 1}}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {},
  labelText: {
    marginLeft: 8,
  },
});

export default DropdownSimple;
