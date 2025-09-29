import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  // TextInput,
  FlatList,
  TextStyle,
} from 'react-native';
import React, {useState} from 'react';
import Icon from './Icon';
import {Colors, Sizes, Fonts} from '../Modules/Modules';
import {RadioButton} from 'react-native-paper';
import TextInput from './TextInput';
import Modal from './Modal';

type Props = {
  onChange: (items: any) => void;
  onClose: () => void;
  label: string;
  value: any[];
  style?: ViewStyle;
  data: any[];
  containerStyle?: ViewStyle;
  disable?: boolean;
  visible?: boolean;
  openModal?: boolean;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
  renderItemStyle?: ViewStyle | TextStyle;
  rightChild?: any;
  leftChild?: any;
  labelField: string | any;
  multiselect?: boolean;
};
const DropdownTextInput: React.FC<Props> = ({
  label,
  value,
  onChange,
  style,
  containerStyle,
  data,
  renderItemStyle,
  labelField,
  visible,
  onClose,
  multiselect = false,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const toggleItem = (item: any) => {
    try {
      if (multiselect) {
        const isSelected = value ? value.includes(item[labelField]) : false;

        // console.log('Here', isSelected);
        if (isSelected) {
          onChange(
            value.filter(selectedItem => selectedItem !== item[labelField]),
          );
        } else {
          if (value) onChange([...value, item[labelField]]);
          else onChange([item[labelField]]);
        }
      } else {
        onChange(item);
        onClose;
      }
    } catch (error) {
      // console.log('dfghjk', error);
    }
  };

  // console.log('data :', data);

  return (
    <Modal
      containerStyle={{justifyContent: 'flex-end', flex: 1}}
      onClose={onClose}
      isVisible={visible}>
      <View
        style={[
          {
            padding: Sizes.Padding,
            height: 300,
          },
          style,
        ]}>
        {data.length > 4 && (
          <View
            style={{
              paddingTop: Sizes.Padding,
            }}>
            <TextInput
              placeholder={`Search ${label}...`}
              value={searchValue}
              onChangeText={txt => {
                setSearchValue(txt);
              }}
              style={{
                borderWidth: 1,
                borderColor: Colors.PrimaryText1,
                borderRadius: Sizes.Radius,
                marginBottom: Sizes.Padding,
              }}
            />
          </View>
        )}
        <FlatList
          data={
            searchValue == ''
              ? data
              : data.filter(item =>
                  item[labelField]
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()),
                )
          }
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => toggleItem(item)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: Sizes.Radius,
                  ...renderItemStyle,
                }}>
                <RadioButton
                  status={
                    multiselect
                      ? value
                        ? value.includes(item[labelField])
                          ? 'checked'
                          : 'unchecked'
                        : 'unchecked'
                      : item[labelField] == value[labelField]
                      ? 'checked'
                      : 'unchecked'
                  }
                  onPress={() => toggleItem(item)}
                  uncheckedColor={Colors.PrimaryText2}
                  color={Colors.Primary2}
                  value=""
                />
                <View style={{marginLeft: Sizes.Padding}}>
                  <Text style={{...Fonts.R2, color: Colors.textColor}}>
                    {
                      // @ts-ignore
                      item?.[labelField]
                    }
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={({item, index}) => index}
          showsVerticalScrollIndicator={false}
          // ItemSeparatorComponent={() => (
          //   <View
          //     style={{
          //       height: 0.7,
          //       width: '100%',
          //       backgroundColor: Colors.PrimaryText1 + 90,
          //       marginBottom: Sizes.Base,
          //     }}
          //   />
          // )}
        />
      </View>
    </Modal>
  );
};

export default DropdownTextInput;
