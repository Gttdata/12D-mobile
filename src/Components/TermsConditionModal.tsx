import {View, Text} from 'react-native';
import React from 'react';
import {Modal} from '.';
import {useSelector} from '../Modules';

interface modalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
}
const TermsConditionModal = ({visible, onClose, title}: modalProps) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  return (
    <Modal
    containerStyle={{margin:0,justifyContent:'flex-end'}}
      title={title ? title : ''}
      isVisible={visible}
      onClose={onClose}

      
      style={{
        margin: 0,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius:0
      }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: Sizes.Padding,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text style={{fontSize: 25}}>•</Text>
          <Text
            style={{
              color: Colors.PrimaryText1,
              ...Fonts.Medium3,
              marginLeft: Sizes.Radius,
            }}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: Sizes.Base,
          }}>
          <Text style={{fontSize: 25}}>•</Text>
          <Text
            style={{
              color: Colors.PrimaryText1,
              ...Fonts.Medium3,
              marginLeft: Sizes.Radius,
            }}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: Sizes.Base,
          }}>
          <Text style={{fontSize: 25}}>•</Text>
          <Text
            style={{
              color: Colors.PrimaryText1,
              ...Fonts.Medium3,
              marginLeft: Sizes.Radius,
            }}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default TermsConditionModal;
