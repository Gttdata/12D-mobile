import React, {ReactNode, useState} from 'react';
import {
  View,
  Text,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
  Image,
} from 'react-native';
import moment from 'moment';

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Icon from './Icon';
import {useSelector} from '../Modules';
interface DatePickerProps {
  value: string | Date;
  onChangeText: (text: string) => void;
  type?: 'date' | 'time' | 'datetime';
  label?: string;
  labelStyle?: TextStyle;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  error?: boolean;
  loading?: boolean;
  disable?: boolean;
  leftChild?: ReactNode;
  rightChild?: ReactNode;
  placeholder?: string;
  format?: string;
  maxDate?: string | Date;
  minDate?: string | Date;
  imp?: boolean;
  colorIcon?: string;
}
const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChangeText,
  type,
  label,
  labelStyle,
  containerStyle,
  style,
  error,
  loading,
  disable,
  leftChild,
  rightChild,
  format = 'DD/MMM/YYYY',
  placeholder,
  maxDate,
  minDate,
  imp,
  colorIcon,
}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const [show, setShow] = useState(false);
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
          disable ? setShow(false) : setShow(true);
        }}
        style={[
          {
            width: '100%',
            borderRadius: Sizes.Base,
            borderColor: disable ? Colors.Disable : Colors.Primary,
            borderWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: disable ? '#dddddd' : Colors.Background,
            shadowColor: Colors.Primary,
            height: Sizes.Field,
          },
          {...containerStyle},
        ]}>
        {leftChild ? leftChild : null}
        <Text
          style={[
            {
              paddingHorizontal: Sizes.Padding,
              ...Fonts.Regular3,
              alignItems: 'center',
              textAlignVertical: 'center',
              justifyContent: 'center',
              color: !String(value)?.length
                ? Colors.Disable
                : error
                ? Colors.error
                : Colors.Black,
              paddingVertical: 0,
              flex: 1,
            },
            {...style},
          ]}>
          {!String(value)?.length ? placeholder : moment(value).format(format)}
        </Text>
        {/* <Icon
          type="AntDesign"
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            paddingRight: Sizes.Base,
          }}
          name="calendar"
          color={colorIcon ? colorIcon : 'black'}
        /> */}

        {rightChild ? rightChild : null}
        {show ? (
          <DateTimePicker
            value={value ? new Date(String(value)) : new Date()}
            maximumDate={maxDate ? new Date(maxDate) : undefined}
            minimumDate={minDate ? new Date(minDate) : undefined}
            mode={type || 'date'}
            onChange={(e: DateTimePickerEvent, d: Date | undefined) => {
              setShow(false);
              if (type == 'date') {
                if (d) {
                  onChangeText(moment(d).format('YYYY-MM-DD HH:mm:ss'));
                }
              } else if (type == 'time') {
                onChangeText(moment(d).format('HH:mm:ss'));
              } else {
                onChangeText(moment(d).format('YYYY-MM-DD HH:mm:ss'));
              }
            }}
          />
        ) : null}
      </TouchableOpacity>
    </View>
  );
};
export default DatePicker;
