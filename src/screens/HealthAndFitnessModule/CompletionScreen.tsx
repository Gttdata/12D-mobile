import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import LottieView from 'lottie-react-native';
import {useSelector} from '../../Modules';
import {Modal, TextButton, Toast} from '../../Components';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
} from 'react-native-reanimated';
import {showAd} from '../../Modules/AdsUtils';

const CompletionScreen = ({navigation}) => {
  const [showModal, setShowModal] = useState(false);
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);

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
          Congratulations You Did it!
        </Text>
      )}
      <LottieView
        source={require('../../../assets/LottieAnimation/cele.json')}
        style={{
          height: '100%',
          width: '100%',
          alignSelf: 'center',
          position: 'absolute',
        }}
        autoPlay={true}
        loop={false}
        onAnimationFinish={() => {
          showAd(() => setShowModal(true));
          // setShowModal(true);
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
            Workout complete! You're one step closer to your fitness goals! 🚀
          </Text>
          <TextButton
            style={{marginTop: Sizes.ScreenPadding}}
            label="Continue"
            loading={false}
            onPress={() => {
              navigation.navigate('HealthAndFitnessHome');
            }}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default CompletionScreen;
