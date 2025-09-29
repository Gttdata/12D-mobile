import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackProps} from '../../../routes';
import {Header, Icon, TextButton, Toast} from '../../../Components';
import {apiPost, useSelector} from '../../../Modules';
import {RulerPicker} from 'react-native-ruler-picker';

import moment from 'moment';
import WeightScroll from './WeightScroll';
import HeightScroll from './HeightScroll';

type Props = StackProps<'BmiQuestions'>;
const LOWEST_WEIGHT: number = 30;
const HIGHEST_WEIGHT: number = 120;
const TOTAL_LENGTH = HIGHEST_WEIGHT - LOWEST_WEIGHT + 1;
const BmiQuestions = ({navigation}: Props): JSX.Element => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  const {member} = useSelector(state => state.member);
  const [tabIndex, setTabIndex] = useState(1);
  const [Selection, setSelection] = useState(1);

  const [BmiDetails, setBmiDetails] = useState({
    USER_ID: member?.ID,
    WEIGHT: 35,
    WEIGHT_UNIT: 'kg',
    HEIGHT: 5.5,
    HEIGHT_UNIT: 'cm',
    BMI: 0,
    CREATED_DATETIME: '',
  });

  const GetBmi = async () => {
    let res = await apiPost('api/userBmi/get', {
      filter: `AND USER_ID = ${member?.ID} `,
    });

    if (res.code == 200 && res.data.length > 0) {
      setBmiDetails(res.data[0]);
    }

    // console.log('BMI....', res);
  };

  const AddBmi = async () => {
    try {
      const bmi = calculateBMI(
        BmiDetails.WEIGHT,
        BmiDetails.HEIGHT,
        BmiDetails.HEIGHT_UNIT,
        BmiDetails.WEIGHT_UNIT,
        
      );

      const roundedBMI = bmi.toFixed(3);
  
      // Determine BMI category
      let category = '';
      if (bmi < 18.5) {
        category = 'Underweight';
      } else if (bmi >= 18.5 && bmi < 24.9) {
        category = 'Normal weight';
      } else if (bmi >= 25 && bmi < 29.9) {
        category = 'Overweight';
      } else if (bmi >= 30) {
        category = 'Obesity';
      }
    
      // console.log('bmi', bmi);
      setBmiDetails({...BmiDetails, BMI: bmi});
      let body = {
        ...BmiDetails,
        CREATED_DATETIME: moment().format('YYYY-MM-DD HH:mm:ss'),
        BMI: bmi,
        CLIENT_ID:1,
      };

      let res = await apiPost('api/userBmi/create', {...body});


      if (res.code == 200) {

        navigation.navigate('BmiCompeted',{BMI:roundedBMI +`You Are in ${category} category`})

      }

    } catch (error) {
      Toast(`${error}`)
    }
  };

  const calculateBMI = (weight:number, height:number, weightUnit:string, heightUnit:string) => {

    
    // Convert weight to kilograms if necessary
    if (weightUnit === 'lbs') {
      weight = weight * 0.453592; // Convert from pounds to kilograms
    }
  
    // Convert height to meters if necessary
    if (heightUnit === 'cm') {
      height = height / 100; // Convert from centimeters to meters
    } else if (heightUnit === 'ft') {
      height = height * 0.3048; // Convert from feet to meters
    }
  
    // Calculate BMI
    const bmi = weight / (height * height);
  
    // Return BMI rounded to two decimal places for precision
    return parseFloat(bmi.toFixed(2));
  };
  

  // useEffect(() => {
  //   const { WEIGHT, HEIGHT, HEIGHT_UNIT,WEIGHT_UNIT } = BmiDetails;
  //   const bmi = calculateBMI(WEIGHT, HEIGHT, HEIGHT_UNIT,WEIGHT_UNIT);
  //   console.log("bmi",bmi);
  //   setBmiDetails({...BmiDetails, BMI: parseInt(bmi)});
  // }, [BmiDetails.WEIGHT, BmiDetails.HEIGHT]);

  useEffect(() => {
    GetBmi();
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}>
        <Header onBack={()=>{navigation.goBack()}} label='BMI'/>
      <View style={{flex: 1}}>
        <Text
          style={{
            ...Fonts.Bold1,
            color: Colors.PrimaryText1,
            marginHorizontal: Sizes.Padding,
            marginTop: Sizes.Padding,
            marginBottom: Sizes.Base,
          }}>
          {`Your Current ${Selection == 1 ? 'Weight' : 'Height'} ?`}
        </Text>
        <Text
          style={{
            ...Fonts.Medium2,
            color: Colors.PrimaryText1,
            marginHorizontal: Sizes.Padding,
            marginVertical: Sizes.Base,
          }}>
          {`Select the ${
            Selection == 1 ? 'Weight' : 'Height'
          } For Calculating the BMI (Body Mass Index)`}
        </Text>

        {Selection == 1 ? (
          <View
            style={{
              alignItems: 'center',
              flex: 1,
            }}>
            <View
              style={{
                height: 25,
                marginHorizontal: Sizes.Padding,
                marginTop: Sizes.Padding,
                borderRadius: Sizes.Padding * 2,
                elevation: 6,
                shadowColor: Colors.Primary2,
                flexDirection: 'row',
                width: 100,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setTabIndex(1);
                }}
                style={{
                  width: '50%',
                  height: '100%',
                  borderTopLeftRadius: Sizes.Padding * 2,
                  borderBottomLeftRadius: Sizes.Padding * 2,
                  backgroundColor:
                    tabIndex == 1 ? Colors.Primary2 : Colors.White,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    ...Fonts.Medium2,
                    color: tabIndex == 1 ? Colors.White : Colors.Primary2,
                  }}>
                  kg
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={async () => {
                  setTabIndex(2);
                  // }
                }}
                style={{
                  width: '50%',
                  height: '100%',
                  borderTopRightRadius: Sizes.Padding * 2,
                  borderBottomRightRadius: Sizes.Padding * 2,
                  backgroundColor:
                    tabIndex == 2 ? Colors.Primary2 : Colors.White,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    ...Fonts.Medium2,
                    color: tabIndex == 2 ? Colors.White : Colors.Primary2,
                  }}>
                  lbs
                </Text>
              </TouchableOpacity>
            </View>

            <RulerPicker
              min={tabIndex == 1 ? 300 : 660}
              max={tabIndex == 1 ? 1200 : 2640}
              step={1}
              fractionDigits={0}
              initialValue={30}
              onValueChange={number => console.log('Changing Value', number)}
              onValueChangeEnd={number => console.log('LastValue', number)}
              unit={tabIndex == 1 ? 'kg' : 'lbs'}
              decelerationRate={'normal'}
            />
          </View>
        ) : (
          <View
            style={{
              alignItems: 'center',
              flex: 1,
            }}>
            <View
              style={{
                height: 25,
                margin: Sizes.Padding,
                borderRadius: Sizes.Padding * 2,
                elevation: 6,
                shadowColor: Colors.Primary2,
                flexDirection: 'row',
                backgroundColor: Colors.Background,
                width: 100,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setTabIndex(1);
                }}
                style={{
                  width: '50%',
                  height: '100%',
                  borderTopLeftRadius: Sizes.Padding * 2,
                  borderBottomLeftRadius: Sizes.Padding * 2,
                  backgroundColor:
                    tabIndex == 1 ? Colors.Primary2 : Colors.White,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    ...Fonts.Medium2,
                    color: tabIndex == 1 ? Colors.White : Colors.Primary2,
                  }}>
                  cm
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={async () => {
                  setTabIndex(2);
                  // }
                }}
                style={{
                  width: '50%',
                  height: '100%',
                  borderTopRightRadius: Sizes.Padding * 2,
                  borderBottomRightRadius: Sizes.Padding * 2,
                  backgroundColor:
                    tabIndex == 2 ? Colors.Primary2 : Colors.White,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    ...Fonts.Medium2,
                    color: tabIndex == 2 ? Colors.White : Colors.Primary2,
                  }}>
                  ft
                </Text>
              </TouchableOpacity>
            </View>

            {tabIndex==1 ?  <RulerPicker
            Selection={Selection}
              min={90}
              max={2440}
              step={1}
              fractionDigits={0}
              initialValue={30}
              onValueChange={number => console.log('Changing Value', number)}
              onValueChangeEnd={number => console.log('LastValue', number)}
              unit={'cm'}
              decelerationRate={'normal'}
            />
            :  <RulerPicker
            Selection={Selection}
              min={30}
              max={90}
              step={1}
              fractionDigits={0}
              initialValue={30}
              onValueChange={number => console.log('Changing Value', number)}
              onValueChangeEnd={number => console.log('LastValue', number)}
              unit={'ft'}
              decelerationRate={'normal'}
            />}

          
          </View>
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          padding: Sizes.Padding,
        }}>
        <TextButton
          label="Cancel"
          loading={false}
          onPress={() => {
            if (Selection == 2) {
              setSelection(1);
            } else {
              navigation.goBack();
            }
          }}
          style={{flex: 1}}
          isBorder
        />
        <View style={{width: Sizes.Base}} />
        <TextButton
          label="Next"
          loading={false}
          onPress={() => {
            console.log('Selection', Selection);

            if (Selection == 2) {
              AddBmi();
            } else {
              setSelection(2);
            }
          }}
          style={{flex: 1}}
        />
      </View>
    </View>
  );
};

export default BmiQuestions;
