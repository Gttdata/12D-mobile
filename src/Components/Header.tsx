import {Text, TextInput, TextStyle, View, ViewStyle} from 'react-native';
import React, {LegacyRef, useRef, useState} from 'react';

import LinearGradient from 'react-native-linear-gradient';
import Icon from './Icon';
import {useSelector} from '../Modules';
interface HEADER_PROPS {
  onBack?: () => void;
  rightChild?: any;
  leftChild?: any;
  label: string;
  onSearch?: (text: string | null) => void;
  TextStyles?:TextStyle;
}
const Header = ({
  onBack,
  rightChild,
  leftChild,
  label,
  onSearch,
  TextStyles
}: HEADER_PROPS) => {
  const [searched, setSearched] = useState(false);
  const searchedRef: any = useRef<TextInput>();
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  return (
    <LinearGradient
      colors={[Colors.Primary2, Colors.Primary]}
      angle={110}
      style={{
        width: Sizes.Width,
        height: Sizes.Header,
        shadowOpacity: 0.5,
        elevation: 10,
      }}>
      <View
        style={{
          width: Sizes.Width,
          height: Sizes.Header,
          shadowOpacity: 0.5,
          elevation: 5,
          paddingHorizontal: Sizes.ScreenPadding,


        }}>
        {onSearch && searched ? (
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="arrow-back-ios"
              type="MaterialIcons"
              color={Colors.White}
              onPress={() => setSearched(false)}
              size={19}
              style={{alignSelf: 'center', marginBottom: 3}}
            />
            <TextInput
              ref={searchedRef}
              autoFocus
              onChangeText={text => onSearch(text)}
              style={{
                flex: 1,
                ...Fonts.Medium3,
                color: Colors.White,
              }}
              placeholder="Search Here"
              placeholderTextColor={Colors.White}
              focusable={true}
            />
            <Icon
              name="backspace"
              type="MaterialIcons"
              color={'#f8f8ff'}
              onPress={() => {
                searchedRef.current?.clear();
                onSearch('');
              }}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {onBack ? (
              <Icon
                name="arrow-back-ios"
                type="MaterialIcons"
                color={Colors.White}
                onPress={() => onBack()}
                style={{alignSelf: 'center', marginBottom: 3}}
                size={19}
              />
            ) : null}
            {leftChild ? leftChild : null}
            <Text
              style={{
                ...Fonts.Bold1,
                fontSize: 13,
                color: Colors.White,
                flex: 1,
                paddingHorizontal: Sizes.Base,
                textAlignVertical: 'center',
                ...TextStyles,

              }}>
              {label}
            </Text>
            {onSearch ? (
              <Icon
                name="search"
                type="Feather"
                color={Colors.White}
                style={{}}
                onPress={() => {
                  setSearched(true);
                }}
              />
            ) : null}
            {rightChild ? rightChild : null}
          </View>
        )}
      </View>
    </LinearGradient>
  );
};
export default Header;