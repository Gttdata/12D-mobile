import React, { ReactNode, useState } from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
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
}
const Dropdown: React.FC<DropdownProps> = ({
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
}) => {
  const { Colors, Fonts, Sizes } = useSelector(state => state.app);
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
                : Colors.Primary2,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.White,
            borderWidth: 0,
            elevation: 6,
            shadowColor: Colors.Primary,
          },
          { ...style },
        ]}>
        {leftChild ? leftChild : null}
        <DropDown
        dropdownPosition='bottom'
          data={data}
          value={value}
          disable={disable}
          iconStyle={{ height: 25, width: 27, ...iconStyle }}
          labelField={labelField ? labelField : 'label'}
          valueField={valueField ? valueField : 'value'}
          placeholder={placeholder}
          onChange={onChange}
          search={search}
          inputSearchStyle={{
            height: 35, // or less
            paddingHorizontal: 10,
            borderRadius: 8,
            ...Fonts.Regular3,
          }}
          style={[
            { flex: 1, paddingHorizontal: Sizes.Padding },
            { ...dropdownStyle },
          ]}
          autoScroll={false}
          containerStyle={{
            borderRadius: Sizes.Radius,
            borderWidth: 1,
            borderTopWidth: 0,
            borderColor: Colors.Primary,
            zIndex: 10,
            marginBottom: 8,
            transform: [{ scaleY: 1 }]
          }}
          flatListProps={{
            
            ListEmptyComponent: () => (
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    flex: 1,
                    ...Fonts.Regular3,
                    alignItems: 'center',
                    textAlignVertical: 'center',
                    justifyContent: 'center',
                    color: Colors.PrimaryText1,

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
};
export default Dropdown;
