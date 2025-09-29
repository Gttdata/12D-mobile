import React, { ReactNode } from 'react';
import {Text, TextInput} from 'react-native-paper';
import {Colors, Sizes} from '../Modules/Modules';
import {KeyboardTypeOptions, View} from 'react-native';

interface Props {
  maxLength?: number;
  label?: string;
  multiline?: boolean;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  disable?: boolean;
  keyboardType?:KeyboardTypeOptions
  editable?:boolean
}

const TextInputSimple: React.FC<Props> = ({
  editable,
  label,
  keyboardType,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  maxLength,
  disable = false,
}) => {
  return (
    <TextInput
    editable={editable}
    keyboardType={keyboardType}
      multiline={multiline}
      maxLength={maxLength}
      activeUnderlineColor={Colors.Primary}
      right={<TextInput.Icon icon="pencil" size={20} />}
      underlineColor={Colors.Primary2}
      style={{backgroundColor: Colors.White, marginTop: Sizes.Padding}}
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      disabled={disable}
    />
  );
};

export default TextInputSimple;
