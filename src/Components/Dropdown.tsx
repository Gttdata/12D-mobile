import React, { ReactNode, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { View, Text, ViewStyle, TextStyle, Keyboard, Platform } from 'react-native';
import { Dropdown as DropDown } from 'react-native-element-dropdown';
import { useSelector } from '../Modules';

interface DropdownProps {
  data: any[];
  onChange: (value: any) => void;
  value: any;
  loading?: boolean;
  disable?: boolean;
  label?: string;
  labelField?: string | any;
  valueField?: string;
  placeholder?: string;
  style?: ViewStyle;
  dropdownStyle?: ViewStyle;
  textStyle?: TextStyle;
  error?: boolean;
  labelStyle?: TextStyle;
  leftChild?: ReactNode;
  rightChild?: ReactNode;
  imp?: boolean;
  search?: boolean;
  iconStyle?: any;
  onFocus?: () => void; // Add onFocus prop
}

const Dropdown = forwardRef<any, DropdownProps>(({
  data,
  onChange,
  value,
  disable,
  error,
  label,
  labelField,
  labelStyle,
  leftChild,
  loading,
  placeholder,
  rightChild,
  style,
  textStyle,
  valueField,
  imp,
  dropdownStyle,
  search,
  iconStyle,
  onFocus, // Destructure onFocus
}, ref) => {
  const { Colors, Fonts, Sizes } = useSelector(state => state.app);
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownTop, setIsDropdownTop] = useState(false);

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        if (isFocused) {
          setIsDropdownTop(true);
        }
      }
    );

    const keyboardHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsDropdownTop(false);
      }
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [isFocused]);

  // Expose focus methods via ref if needed
  useImperativeHandle(ref, () => ({
    // You can add methods here if needed
  }));

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.(); // Call the onFocus callback if provided
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View style={{ width: '100%' }}>
      {label && (
        <Text
          style={{
            color: Colors.PrimaryText1,
            ...Fonts.Medium3,
            ...labelStyle,
          }}
          numberOfLines={1}
          adjustsFontSizeToFit>
          {'' + label}
          {imp ? '*' : ''}
        </Text>
      )}
      <View
        style={[
          {
            width: '100%',
            borderRadius: Sizes.Radius,
            height: 40,
            borderColor: disable
              ? Colors.Disable
              : error
                ? Colors.error
                : isFocused
                  ? Colors.Primary // Highlight when focused
                  : Colors.Primary2,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.White,
            borderWidth: isFocused ? 1 : 0, // Show border when focused
            elevation: 6,
            shadowColor: Colors.Primary,
          },
          { ...style },
        ]}>
        {leftChild ? leftChild : null}
        <DropDown
          dropdownPosition='auto'
          data={data}
          value={value}
          disable={disable}
          keyboardAvoiding={true} // changed false to true
          iconStyle={{ height: 25, width: 27, ...iconStyle }}
          labelField={labelField ? labelField : 'label'}
          valueField={valueField ? valueField : 'value'}
          placeholder={placeholder}
          onChange={onChange}
          search={search}
          onFocus={handleFocus} // Add onFocus handler
          onBlur={handleBlur} // Add onBlur handler
          inputSearchStyle={{
            height: 40,
            paddingHorizontal: 10,
            borderRadius: 8,
            ...Fonts.Regular3,
          }}
          style={[
            { flex: 1, paddingHorizontal: Sizes.Padding },
            { ...dropdownStyle },
          ]}
          autoScroll={true} // changed false to true
          containerStyle={{
            borderRadius: Sizes.Radius,
            borderWidth: 1,
            borderTopWidth: 0,
            borderColor: Colors.Primary,
            zIndex: 10,
            marginBottom: 8,
            marginTop: 10
          }}
          flatListProps={{
            nestedScrollEnabled: true,
            keyboardShouldPersistTaps: 'handled',
            ListEmptyComponent: () => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 20,
                  transform: isDropdownTop ? [{ scaleY: -1 }] : '',
                }}>
                <Text
                  style={{
                    ...Fonts.Regular3,
                    color: Colors.PrimaryText1,
                    textAlign: 'center',
                    transform: isDropdownTop ? [{ scaleX: -1 }] : '',
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit>
                  {'No Data Found'}
                </Text>
              </View>
            ),
          }}
          renderItem={item => {
            return (
              <Text
                style={[
                  {
                    flex: 1,
                    ...Fonts.Regular3,
                    paddingVertical: Sizes.Base,
                    paddingHorizontal: Sizes.Padding,
                    alignItems: 'center',
                    textAlignVertical: 'center',
                    justifyContent: 'center',
                    color: error ? Colors.error : Colors.PrimaryText1,
                  },
                  { ...textStyle },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit>
                {'' + item?.[labelField]}
              </Text>
            );
          }}
          placeholderStyle={[
            {
              flex: 1,
              ...Fonts.Regular3,
              alignItems: 'center',
              textAlignVertical: 'center',
              justifyContent: 'center',
              color: Colors.PrimaryText,
              paddingVertical: 0,
            },
            { ...textStyle },
          ]}
          selectedTextStyle={[
            {
              flex: 1,
              ...Fonts.Regular3,
              alignItems: 'center',
              textAlignVertical: 'center',
              justifyContent: 'center',
              color: Colors.PrimaryText1,
              paddingVertical: 0,
            },
            { ...textStyle },
          ]}
        />
        {rightChild ? rightChild : null}
      </View>
    </View>
  );
});

export default Dropdown;