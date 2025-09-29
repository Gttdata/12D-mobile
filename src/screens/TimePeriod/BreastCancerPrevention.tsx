import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {StackProps} from '../../routes';
import {useSelector} from '../../Modules';
import {Icon} from '../../Components';
import {breastCancerPrevention} from '../../../assets';

type Props = StackProps<'BreastCancerPrevention'>;
const BreastCancerPrevention = ({navigation}: Props) => {
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
              Breast Cancer Prevention
            </Text>
            <Image
              source={breastCancerPrevention}
              style={{
                height: 120,
                width: 120,
                marginTop: -20,
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
            Breast cancer is the most common cancer among women worldwide, but
            it is also one of the most treatable when detected early. That's why
            it's so important to take steps to prevent breast cancer and
            maintain good reproductive health.
          </Text>
          <View style={{height: Sizes.Padding}} />

          <Text style={{...Fonts.Medium1, fontSize: 15, color: Colors.Black}}>
            Here are some tips
          </Text>
          <View style={{height: 5}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
              marginTop: Sizes.Base,
            }}>
            • Maintain a healthy weight. Obesity is a risk factor for breast
            cancer. Aim to maintain a healthy weight for your height and body
            type.
          </Text>
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
              marginTop: Sizes.Base,
            }}>
            • Exercise regularly. Aim for at least 30 minutes of
            moderate-intensity exercise most days of the week. Exercise can help
            you maintain a healthy weight and reduce your risk of breast cancer.
          </Text>
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
              marginTop: Sizes.Base,
            }}>
            • Eat a healthy diet. Eat plenty of fruits, vegetables, and whole
            grains. Limit processed foods, red meat, and sugary drinks.
          </Text>
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
              marginTop: Sizes.Base,
            }}>
            • Limit alcohol intake. Alcohol is a risk factor for breast cancer.
            If you do drink alcohol, do so in moderation.
          </Text>
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
              marginTop: Sizes.Base,
            }}>
            • Breastfeed, if possible. Breastfeeding can help reduce your risk
            of breast cancer.
          </Text>
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
              marginTop: Sizes.Base,
            }}>
            • Get regular screenings. Start getting mammograms at age 40, or
            earlier if you have a high risk of breast cancer. Talk to your
            doctor about whether you may also benefit from other screenings,
            such as breast MRIs or genetic testing.
          </Text>

          <View style={{height: Sizes.ScreenPadding}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: Colors.PrimaryText1,
            }}>
            In addition to preventing breast cancer, it is also important to
            maintain good reproductive health. This includes:
          </Text>

          <View style={{height: Sizes.ScreenPadding}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            • Getting regular Pap tests and pelvic exams. Pap tests and pelvic
            exams can help detect cervical cancer and other reproductive health
            problems early.
          </Text>
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
              marginTop: Sizes.Base,
            }}>
            • Using birth control if you are not ready to get pregnant. There
            are many different types of birth control available, so talk to your
            doctor about the best option for you. By following these tips, you
            can take steps to prevent breast cancer and maintain good
            reproductive health.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default BreastCancerPrevention;
