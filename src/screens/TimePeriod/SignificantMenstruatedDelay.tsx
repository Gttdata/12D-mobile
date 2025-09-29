import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useSelector} from '../../Modules';
import {StackProps} from '../../routes';
import {Icon} from '../../Components';
import {significantMenstrualDelay} from '../../../assets';

type Props = StackProps<'SignificantMenstruatedDelay'>;
const SignificantMenstruatedDelay = ({navigation}: Props) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{height: 200, backgroundColor: Colors.Secondary}}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              backgroundColor: Colors.Primary,
              height: 30,
              width: 30,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
              margin: Sizes.ScreenPadding,
            }}
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon
              name="arrow-back"
              type="Ionicons"
              size={19}
              color={Colors.White}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: Sizes.ScreenPadding,
            }}>
            <Text
              style={{
                ...Fonts.Bold1,
                color: Colors.PrimaryText1,
                alignSelf: 'flex-end',
                flex: 1,
              }}>
              Significant Menstrual Delay
            </Text>
            <Image
              source={significantMenstrualDelay}
              style={{
                height: 120,
                width: 188,
                marginTop: -30,
              }}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            marginVertical: Sizes.ScreenPadding,
            marginHorizontal: Sizes.Padding,
          }}>
          <Text style={{...Fonts.Medium3, color: Colors.PrimaryText}}>
            A delay in menstrual periods for 3 to 4 months is considered
            significant and indicates a prolonged disruption in the regular
            menstrual cycle as compared to delay in periods for 3-4 days. Short
            delay of 3 to 4 days is generally considered normal and not a cause
            for major concern while delay of several months is more noteworthy
            and warrants further investigation.
          </Text>
          <View style={{height: Sizes.Padding}} />

          <Text style={{...Fonts.Medium1, fontSize: 15, color: Colors.Black}}>
            Pregnancy
          </Text>
          <View style={{height: 5}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            Pregnancy is the most frequent factor in extended menstrual delays.
            If you are sexually active and there is a chance that you might be
            pregnant, you should use a pregnancy test to either confirm or rule
            out this possibility.
          </Text>

          <View style={{height: Sizes.ScreenPadding}} />
          <Text style={{...Fonts.Medium1, fontSize: 15, color: Colors.Black}}>
            Hormonal Imbalances
          </Text>
          <View style={{height: 5}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            Polycystic ovarian syndrome (PCOS), thyroid conditions, and other
            endocrine problems are examples of hormonal imbalances that can
            cause prolonged delays in menstrual cycles.
          </Text>

          <View style={{height: Sizes.ScreenPadding}} />
          <Text style={{...Fonts.Medium1, fontSize: 15, color: Colors.Black}}>
            Lifestyle Factors
          </Text>
          <View style={{height: 5}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            High levels of stress, drastic weight loss or gain, intense
            exercise, or inconsistent sleep habits can all affect hormonal
            balance and cause periods to be delayed. Stress and lifestyle
            factors.
          </Text>

          <View style={{height: Sizes.ScreenPadding}} />
          <Text style={{...Fonts.Medium1, fontSize: 15, color: Colors.Black}}>
            Medical Issues
          </Text>
          <View style={{height: 5}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            Some drugs, such as hormonal contraceptives or drugs for various
            medical issues, might influence and delay menstrual periods. Long
            menstruation delays may also be caused by underlying medical issues
            such ovarian cysts or uterine abnormalities.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignificantMenstruatedDelay;
