import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import React from 'react';
import {useSelector} from '../../Modules';
import {StackProps} from '../../routes';
import {Header, Icon} from '../../Components';
import {NeverMenstruated} from '../../../assets';

// '#FCBACB99'  '#F05F80'
type Props = StackProps<'NeverMenstruate'>;
const NeverMenstruate = ({navigation}: Props) => {
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
              Never Menstruated
            </Text>
            <Image
              source={NeverMenstruated}
              style={{
                height: 160,
                width: 160,
                marginTop: -45,
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
            Below mentioned are several factors are responsible for Lack of
            menstruation in girls who has reached the age of 16
          </Text>
          <View style={{height: Sizes.Padding}} />

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
            Hormonal ailments including PCOS and hypothalamic-pituitary
            disorders may interfere with the normal hormonal signals that cause
            menstruation to begin. These ailments can lead to a delay or absence
            of periods.
          </Text>

          <View style={{height: Sizes.ScreenPadding}} />
          <Text style={{...Fonts.Medium1, fontSize: 15, color: Colors.Black}}>
            Genetic Conditions
          </Text>
          <View style={{height: 5}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            Chromosomal or Genetic Disorders Despite secondary sexual features,
            some genetic or chromosomal defects, such as Turner syndrome or
            Androgen Insensitivity Syndrome (AIS), can disrupt the development
            of the reproductive organs and cause primary amenorrhea (lack of
            menstruation).
          </Text>

          <View style={{height: Sizes.ScreenPadding}} />
          <Text style={{...Fonts.Medium1, fontSize: 15, color: Colors.Black}}>
            Amenorrhea
          </Text>
          <View style={{height: 5}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            Primary amenorrhea can be brought on by structural abnormalities or
            anomalies of the reproductive organs, such as an imperforate hymen
            or Mullerian agenesis, which may block the flow of menstrual blood.
          </Text>

          <View style={{height: Sizes.ScreenPadding}} />
          <Text style={{...Fonts.Medium1, fontSize: 15, color: Colors.Black}}>
            Constitutional Delay
          </Text>
          <View style={{height: 5}} />
          <Text
            textBreakStrategy="simple"
            style={{
              ...Fonts.Medium2,
              fontSize: 11,
              color: '#4E4B51',
            }}>
            The beginning of puberty, including menstruation, may be delayed in
            certain girls due to a constitutional delay of growth, which finally
            catches up to normal development.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default NeverMenstruate;
