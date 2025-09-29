import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {StackProps} from '../../routes';
import {Icon} from '../../Components';
import {symptomsOfOvulation} from '../../../assets';
import {useSelector} from '../../Modules';

type Props = StackProps<'SymptomsOfOvulation'>;
const SymptomsOfOvulation = ({navigation}: Props) => {
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
                marginBottom: -30,
              }}>
              Symptoms of Ovulation
            </Text>
            <Image
              source={symptomsOfOvulation}
              style={{
                height: 120,
                width: 200,
                marginTop: -50,
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
          <View style={{height: 5}} />
          <Text style={{...Fonts.Medium1, fontSize: 15, color: Colors.Black}}>
            Change in basal body temperature
          </Text>
          <View style={{height: 5}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            Ovulation causes an increase in basal body temperature, which
            remains elevated during this time, as mentioned earlier. By tracking
            your basal body temperature over several months, you can identify
            patterns and detect noticeable changes more easily.
          </Text>

          <View style={{height: Sizes.ScreenPadding}} />
          <Text style={{...Fonts.Medium1, fontSize: 15, color: Colors.Black}}>
            Changes in the cervix
          </Text>
          <View style={{height: 5}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            During ovulation, the cervix undergoes changes such as increased
            height, softness, and openness. Checking for cervical changes, along
            with monitoring cervical mucus, can serve as signs of ovulation.
            However, becoming familiar with these differences may require
            practice and time, and it can be more challenging compared to
            observing other ovulation symptoms mentioned earlier.
          </Text>

          <View style={{height: Sizes.ScreenPadding}} />
          <Text style={{...Fonts.Medium1, fontSize: 15, color: Colors.Black}}>
            Light spotting or discharge
          </Text>
          <View style={{height: 5}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            The occurrence of brown discharge or spotting during ovulation is
            considered normal, although it may not be very common. This
            ovulation symptom can occur when the follicle surrounding the
            developing egg matures, grows, and eventually ruptures, leading to a
            small amount of bleeding.
          </Text>

          <View style={{height: Sizes.ScreenPadding}} />
          <Text style={{...Fonts.Medium1, fontSize: 15, color: Colors.Black}}>
            Breast soreness or tenderness
          </Text>
          <View style={{height: 5}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            Another possible sign of ovulation is experiencing tender breasts or
            sore nipples. This can be attributed to the surge of hormones that
            occurs before and after ovulation. Some women may notice breast
            tenderness just before ovulation, while others may experience it
            shortly after ovulation has taken place.
          </Text>

          <View style={{height: Sizes.ScreenPadding}} />
          <Text style={{...Fonts.Medium1, fontSize: 15, color: Colors.Black}}>
            Increased sensory perception
          </Text>
          <View style={{height: 5}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            In the latter half of a regular menstrual cycle, some women may
            experience a heightened sense of smell, which can serve as a sign of
            ovulation. During this fertile phase, the body becomes more
            receptive to the male pheromone known as androstenone, leading to a
            heightened attraction. Additionally, some women may also report a
            heightened sense of taste during this time.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SymptomsOfOvulation;
