import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput as TextField,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import React, {useRef} from 'react';
import {useSelector} from '../Modules';
interface INPUT_INTERFACE {
  leftChild?: any;
  rightChild?: any;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  disable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  maxLength?: number;
  numberOfLines?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
  error?: boolean;
  label?: string;
  labelStyle?: TextStyle;
  hidden?: boolean;
  imp?: boolean;
  autoFocus?: boolean;
}
const TextInput = ({
  leftChild,
  rightChild,
  value,
  placeholder,
  onChangeText,
  numberOfLines,
  disable,
  keyboardType = 'default',
  multiline = false,
  maxLength,
  style,
  textStyle,
  error,
  label,
  labelStyle,
  hidden,
  imp,
  autoFocus = true,
}: INPUT_INTERFACE) => {
  const {Colors, Fonts, Sizes} = useSelector(state => state.app);
  const textFieldRef = useRef<TextField | null>(null);

  return (
    <View style={{width: '100%'}}>
      {label && (
        <Text
          style={{
            ...Fonts.Medium3,
            color: Colors.PrimaryText1,
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
      <TouchableWithoutFeedback
        onPress={() => {
          if (multiline) {
            textFieldRef.current?.focus();
          }
        }}>
        <View
          style={[
            {
              width: '100%',
              borderRadius: Sizes.Radius,
              minHeight: multiline ? Sizes.Field * 2 : 40,
              maxHeight: multiline ? Sizes.Field * 3 : 40,
              borderColor: disable
                ? Colors.Disable
                : error
                ? Colors.error
                : Colors.Primary2,
              // borderWidth: 1,
              borderWidth: 0,
              elevation: 6,
              shadowColor: Colors.Primary,
              flexDirection: 'row',
              alignItems: multiline ? 'flex-start' : 'center',
              backgroundColor: Colors.White,
            },
            {...style},
          ]}>
          {leftChild ? leftChild : null}

          <TextField
                      ref={textFieldRef}

            focusable={true}
            autoFocus={autoFocus}
            secureTextEntry={hidden ? true : false}
            keyboardType={keyboardType}
            value={value}
            numberOfLines={numberOfLines}
            onChangeText={(text: string) => {
              onChangeText(text);
            }}
            style={[
              {
                flex: 1,
                paddingHorizontal: Sizes.Padding,
                ...Fonts.Medium3,
                alignItems: 'center',
                textAlignVertical: multiline ? 'center' : 'center',
                justifyContent: 'center',
                color: error ? Colors.error : Colors.PrimaryText1,
                paddingVertical: 0,
              },
              {...textStyle},
            ]}
            editable={!disable}
            placeholder={placeholder}
            placeholderTextColor={
              error
                ? Colors.error + '80'
                : disable
                ? Colors.Disable
                : Colors.PrimaryText2
            }
            multiline={multiline}
            maxLength={maxLength}
          />

          {rightChild ? rightChild : null}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default TextInput;

const styles = StyleSheet.create({});
