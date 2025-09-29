import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useSelector} from '../../Modules';
import {StackProps} from '../../routes';
import {Icon} from '../../Components';
import {shortMenstrualDelay} from '../../../assets';

type Props = StackProps<'ShortMenstruatedDelay'>;
const ShortMenstruatedDelay = ({navigation}: Props) => {
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
              Short Menstrual Delay
            </Text>
            <Image
              source={shortMenstrualDelay}
              style={{
                height: 130,
                width: 250,
                marginTop: -32,
                marginRight: -80,
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
            A 5 to 6 day period delay is a very frequent occurrence and can
            occur for a variety of causes. Menstrual periods may be somewhat
            delayed due to a number of conditions, including:
          </Text>
          <View style={{height: Sizes.Padding}} />

          <Text style={{...Fonts.Medium1, fontSize: 15, color: Colors.Black}}>
            Hormonal Fluctuations
          </Text>
          <View style={{height: 5}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            Hormonal Fluctuations: Hormonal shifts might interfere with a
            woman's menstrual cycle's regularity. Periods may be delayed as a
            result of stress, weight changes, or hormone deviations.
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
            Lifestyle Factors: Some lifestyle choices, such as extreme exercise,
            abrupt dietary changes, travel, or disturbed sleep cycles, might
            affect menstrual cycles and somewhat postpone them.
          </Text>

          <View style={{height: Sizes.ScreenPadding}} />
          <Text style={{...Fonts.Medium1, fontSize: 15, color: Colors.Black}}>
            Medication or Birth Control
          </Text>
          <View style={{height: 5}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            Medication or Birth Control: Some drugs, such as hormonal
            contraceptives, can affect how frequently you get periods. There may
            occasionally be a little delay after starting or stopping hormonal
            drugs like birth control.
          </Text>

          <View style={{height: Sizes.ScreenPadding}} />
          <Text style={{...Fonts.Medium1, fontSize: 15, color: Colors.Black}}>
            Medical condition
          </Text>
          <View style={{height: 5}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            Thyroid diseases, reproductive abnormalities, and polycystic ovary
            syndrome (PCOS) are a few of the underlying medical conditions that
            can disrupt menstrual regularity and cause periods to be delayed.
          </Text>

          <View style={{height: Sizes.ScreenPadding}} />
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
            Missed periods are frequently brought on by pregnancy. Take a
            pregnancy test to rule out this possibility if you are sexually
            active and there is a chance of becoming pregnant.
          </Text>
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            A delay of 3 to 4 days in menstrual periods is generally considered
            normal. However, if the symptoms persist continuously for more than
            ten days or weeks, it is advisable to seek consultation from a
            healthcare provider.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ShortMenstruatedDelay;
