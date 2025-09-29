import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from '../../../Modules';
import LottieView from 'lottie-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TextButton } from '../../../Components';
import { StackProps } from '../../../routes';

type Props = StackProps<'BmiCompeted'>;


const BmiCompeted = ({navigation,route}:Props):JSX.Element => {
  const [showModal, setShowModal] = useState(false);
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);


  const BMI ={route}

  // useEffect(() => {
  //   setTimeout(() => {
  //     setShowModal(true);
  //   }, 3000);
  // }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.White,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {!showModal && (
        <Text
          style={{
            position: 'absolute',
            color: Colors.Primary,
            ...Fonts.Bold1,

            alignSelf: 'center',
            textAlignVertical: 'center',
          }}>
          Your Bmi is Successfully Updated
        </Text>
      )}
      <LottieView
        source={require('../../../../assets/LottieAnimation/cele.json')}
        style={{
          height: '100%',
          width: '100%',
          alignSelf: 'center',
          position: 'absolute',
        }}
        autoPlay={true}
        loop={false}
        onAnimationFinish={() => {
          setShowModal(true);
        }}
      />

      {showModal && (
        <Animated.View
          entering={FadeInDown}
          style={{
            position: 'absolute',

            padding: Sizes.ScreenPadding,
            backgroundColor: Colors.White,
            elevation: 10,
            margin: Sizes.ScreenPadding,
            borderRadius: Sizes.Radius,
          }}>
          <Text
            style={{
              color: Colors.Primary,
              ...Fonts.Bold2,
              alignSelf: 'center',
              textAlignVertical: 'center',
            }}>
           Your Bmi is {BMI.route.params.BMI}
          </Text>
          <TextButton
            style={{marginTop: Sizes.ScreenPadding}}
            label="Done"
            loading={false}
            onPress={() => {navigation.popToTop()}}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default BmiCompeted;
