import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import {ovulationDuringPregnancy} from '../../../assets';
import {Icon} from '../../Components';
import {useSelector} from '../../Modules';
import {StackProps} from '../../routes';

type Props = StackProps<'OvulationDuringPregnancy'>;
const OvulationDuringPregnancy = ({navigation}: Props) => {
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
              Ovulation During Pregnancy
            </Text>
            <Image
              source={ovulationDuringPregnancy}
              style={{
                height: 135,
                width: 190,
                marginTop: -36,
                marginRight: -20,
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
          {/* <View style={{height: Sizes.Padding}} /> */}

          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            During pregnancy, ovulation is typically suppressed. Ovulation
            refers to the release of an egg from the ovary, which is a necessary
            step for conception to occur. Once pregnancy is established,
            hormonal changes take place in the body to support and maintain the
            pregnancy, and these changes inhibit ovulation.
          </Text>

          <View style={{height: Sizes.ScreenPadding}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            After a woman becomes pregnant, the developing fetus releases
            hormones that signal the body to cease ovulation. The placenta,
            which forms after the fertilized egg implants itself in the uterus,
            produces a hormone called human chorionic gonadotropin (hCG). This
            hormone is structurally similar to luteinizing hormone (LH), which
            is responsible for triggering ovulation. The presence of hCG in the
            body acts as a signal to halt the release of additional eggs from
            the ovaries.
          </Text>

          <View style={{height: Sizes.ScreenPadding}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            While exceedingly rare, there have been documented cases of
            superfetation, which is when a woman ovulates and conceives another
            baby while already being pregnant. However, superfetation is
            considered highly uncommon and not a typical occurrence in human
            pregnancies. The circumstances required for superfetation to happen
            are quite specific and involve unusual hormonal and physiological
            factors.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default OvulationDuringPregnancy;
