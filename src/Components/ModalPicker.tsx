import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  FlatList,
  TextStyle,
  Modal as ModalComponent,
} from 'react-native';
import React, {useState} from 'react';
import {Icon} from '.';
import {useSelector} from '../Modules';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  onChange: (items: any) => void;
  value: any;
  data: any[];
  containerStyle?: ViewStyle;
  renderItemStyle?: ViewStyle | TextStyle;
  labelField: string | any;
  close?: boolean;
  style?: ViewStyle;
};
const ModalPicker: React.FC<Props> = ({
  onChange,
  title,
  onClose,
  visible,
  value,
  containerStyle,
  data,
  style,
  renderItemStyle,
  labelField,
  close = false,
}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  return (
    <ModalComponent
      visible={visible}
      transparent
      animationType={'fade'}
      onRequestClose={() => (value[labelField] || !close ? onClose() : null)}>
      <View style={[{flex: 1, justifyContent: 'center'}, containerStyle]}>
        <Text
          onPress={() => (value[labelField] || !close ? onClose() : null)}
          style={{
            flex: 1,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: Colors.modalBackground,
          }}
        />
        <View
          style={{
            margin: Sizes.ScreenPadding,
            padding: Sizes.Padding,
            borderRadius: Sizes.Base,
            backgroundColor: Colors.Background,
            maxHeight: 300,
            ...style,
          }}>
          {title ? (
            <View style={{flexDirection: 'row', marginBottom: Sizes.Radius}}>
              <Text
                style={{...Fonts.Bold2, color: Colors.PrimaryText1, flex: 1}}>
                {'' + title}
              </Text>
              <Icon
                type={'AntDesign'}
                name={'close'}
                onPress={() => (value[labelField] || !close ? onClose() : null)}
              />
            </View>
          ) : null}
          <FlatList
            data={data}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    onChange(item);
                    onClose();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                      item[labelField] == value[labelField]
                        ? Colors.Primary + 50
                        : '#FFF',
                    borderRadius: Sizes.Base,
                    ...renderItemStyle,
                  }}>
                  <View
                    style={{alignSelf: 'center', marginVertical: Sizes.Base}}>
                    <Text
                      style={{
                        ...Fonts.Regular2,
                        color: Colors.PrimaryText1,
                      }}>
                      {
                        // @ts-ignore
                        item?.[labelField]
                      }
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            // ItemSeparatorComponent={() => (
            //   <View
            //     style={{
            //       height: 0.7,
            //       width: '100%',
            //       backgroundColor: Colors.Disable,
            //       marginVertical: Sizes.Radius,
            //     }}
            //   />
            // )}
          />
        </View>
      </View>
    </ModalComponent>
  );
};

export default ModalPicker;