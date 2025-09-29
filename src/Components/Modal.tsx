import React from 'react';
import {Modal as ModalComponent, Text, View, ViewStyle} from 'react-native';
import Icon from './Icon';
import {useSelector} from '../Modules';
import Animated, {FadeInDown} from 'react-native-reanimated';

type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animation?: 'fade' | 'slide';
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  title?: string;
};
const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  children,
  animation,
  style,
  containerStyle,
  title,
}) => {
  const {Colors, Sizes, Fonts} = useSelector(state => state.app);
  return (
    <ModalComponent
      visible={isVisible}
      transparent
      animationType={animation ? animation : 'slide'}
      onRequestClose={onClose}>
      <View style={[{flex: 1, justifyContent: 'center'}, containerStyle]}>
        <Text
          onPress={onClose}
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
          style={[
            {
              margin: Sizes.ScreenPadding,
              padding: Sizes.Padding,
              borderRadius: Sizes.Base,
              backgroundColor: Colors.Background,
            },
            style,
          ]}>
          {title ? (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{...Fonts.Bold2, color: Colors.PrimaryText1, flex: 1}}>
                {'' + title}
              </Text>
              <Icon
                type={'AntDesign'}
                name={'close'}
                onPress={() => onClose()}
              />
            </View>
          ) : null}
          {children}
        </View>
      </View>
    </ModalComponent>
  );
};
export default Modal;
