import React from 'react';
import {View, Text, TouchableOpacity, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next'; // If using i18n for translations
import {useSelector} from '../Modules';

interface DashboardCardProps {
  onPress: () => void;
  animationSource: any; // Adjust type as per your Lottie animation source
  title: string;
  description: string;
  startColor: string; // Custom start color
  endColor: string; // Custom end color
  customStyles?: ViewStyle; // Optional custom styles
  fromLeft?: boolean;
  imageSize?: any;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  onPress,
  animationSource,
  title,
  description,
  startColor,
  endColor,
  customStyles,
  fromLeft,
  imageSize,
}) => {
  const {t} = useTranslation(); // If using i18n for translations
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);

  return (
    <View style={{marginBottom: Sizes.Padding}}>
      <LinearGradient
        // colors={[
        //   fromLeft ? startColor : endColor,
        //   fromLeft ? endColor : startColor,
        // ]}
        colors={[endColor, endColor]}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
        style={{
          flex: 1,
          paddingBottom: Sizes.Base,
          elevation: 5,
          shadowColor: Colors.Primary,
          borderRadius: Sizes.Radius,
          ...customStyles,
        }}>
        {fromLeft ? (
          <TouchableOpacity
            style={{
              paddingHorizontal: Sizes.Padding,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onPress={onPress}>
            <LottieView
              source={animationSource}
              style={{
                height: imageSize ? imageSize : 96,
                width: imageSize ? imageSize : 96,
                borderRadius: 100,
              }}
              autoPlay
            />
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: Colors.White,
                  ...Fonts.Bold1,
                  textAlign: 'center',
                  marginTop: 6,
                }}>
                {title}
              </Text>
              <Text
                style={{
                  color: Colors.White,
                  ...Fonts.Medium3,
                  textAlign: 'center',
                  marginTop: 6,
                }}>
                {description}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              paddingHorizontal: Sizes.Padding,
              paddingVertical: Sizes.Base,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onPress={onPress}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: Colors.White,
                  ...Fonts.Bold1,
                  textAlign: 'center',
                  marginTop: 6,
                }}>
                {title}
              </Text>
              <Text
                style={{
                  color: Colors.White,
                  ...Fonts.Medium3,
                  textAlign: 'center',
                  marginTop: 6,
                }}>
                {description}
              </Text>
            </View>
            <LottieView
              source={animationSource}
              style={{
                height: imageSize ? imageSize : 96,
                width: imageSize ? imageSize : 96,
                borderRadius: 100,
              }}
              autoPlay={true}
              loop={false}
              direction={1}
            />
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
};

export default DashboardCard;
