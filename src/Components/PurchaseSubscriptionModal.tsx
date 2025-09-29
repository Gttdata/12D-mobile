import {View, Text, BackHandler} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector} from '../Modules';
import TextButton from './TextButton';
import Modal from './Modal';

interface props {
  isVisible: boolean;
  onClose: () => void;
  IgnoreFunction?: () => void;
  navigation: any;
  setOpenPurchaseModal:any;
  type?: string; 
}
const PurchaseSubscriptionModal = ({isVisible, onClose, navigation,setOpenPurchaseModal,IgnoreFunction,type}: props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Dashboard');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  // console.log(onClose());
  
  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose
        // isVisible
        //   ? navigation.navigate('Dashboard')
        //   : navigation.navigate('Dashboard')
      }
      containerStyle={{justifyContent: 'center'}}>
      <View
        style={{
          padding: Sizes.Base,
          borderRadius: Sizes.Radius,
        }}>
        <Text
          style={{
            color: Colors.Primary,
            ...Fonts.Medium1,
            textAlign: 'center',
          }}>
          Sorry you don't have any active Plan
        </Text>
        <Text
          style={{
            color: Colors.PrimaryText,
            ...Fonts.Regular2,
            textAlign: 'center',
          }}>
          Please Purchase plan to access this service
        </Text>
        <View style={{flexDirection:'row',marginTop: Sizes.ScreenPadding}}>
          <TextButton
          isBorder
          style={{flex:1}}
            label="Ignore"
            loading={false}
            onPress={() => {
              if(IgnoreFunction){
                IgnoreFunction()
              }else{
                setOpenPurchaseModal(false)
                navigation.goBack();
              }
            
            }}
          />
          <View style={{width:10}}></View>
           <TextButton
           style={{flex:1}}
            label="Purchase"
            loading={false}
            onPress={() => {
              setOpenPurchaseModal(false);
              navigation.navigate('PremiumHome', {type});
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default PurchaseSubscriptionModal;