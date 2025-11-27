import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Dimensions,
  TextStyle,
} from 'react-native';

import AnimatedSlider from './AnimatedSlider';
import { apiPost, apiPut, useSelector } from '../../../Modules';
import { Header, TextButton, Toast } from '../../../Components';
import { StackProps } from '../../../routes';
import moment from 'moment';
import { RESULTS } from 'react-native-permissions';
import { BMI_DATA_INTERFACE } from '../../../Modules/interface';
import SliderBMI from './SliderBMI';
import LinearGradient from 'react-native-linear-gradient';
import TypeSlider from './TypeSlider';
import { Dropdown } from 'react-native-element-dropdown';
const Colors = {
  primary: '#007AFF',
  secondary: '#F4F4F4',
  success: '#2ECC71',
  danger: '#E74C3C',
  warning: '#F1C40F',
  info: '#3498DB',
  light: '#ECF0F1',
  dark: '#2C3E50',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};
const Sizes = {
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width,
  field: 44,
  padding: 12,
  base: 6,
  radius: 25,
};
const Fonts: {
  header: TextStyle;
  subHeading: TextStyle;
  description: TextStyle;
} = {
  header: {
    fontSize: 30,
    fontWeight: '800',
    textAlignVertical: 'center',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  subHeading: {
    fontSize: 25,
    fontWeight: '500',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  description: {
    fontSize: 20,
  },
};

type dataProps = {
  height: number | null;
  weight: number | null;
  bmi: number | null;
};
type dimension = {
  label: 'KG' | 'LB' | 'CM' | 'FT';
  title: string;
  minimumValue: number;
  maximumValue: number;
  steps: number;
  ratio: number;
};
const WEIGHT: { KG: dimension; LB: dimension } = {
  KG: {
    label: 'KG',
    title: 'Kilograms',
    minimumValue: 0,
    maximumValue: 200,
    steps: 10,
    ratio: 1,
  },
  LB: {
    label: 'LB',
    title: 'Pounds',
    minimumValue: 0,
    maximumValue: 200,
    steps: 10,
    ratio: 2.205,
  },
};
const HEIGHT: { CM: dimension; FT: dimension } = {
  CM: {
    label: 'CM',
    title: 'CM',
    minimumValue: 50,
    maximumValue: 250,
    steps: 10,
    ratio: 1,
  },
  FT: {
    label: 'FT',
    title: 'Feet',
    minimumValue: 0,
    maximumValue: 200,
    steps: 10,
    ratio: 0.0328084,
  },
};
const FOOT_DATA = [
  { value: '0' },
  { value: '1' },
  { value: '2' },
  { value: '3' },
  { value: '4' },
  { value: '5' },
  { value: '6' },
  { value: '7' },
  { value: '8' },
  { value: '9' },
  { value: '10' },
];
const INCH_DATA = [
  { value: '0' },
  { value: '1' },
  { value: '2' },
  { value: '3' },
  { value: '4' },
  { value: '5' },
  { value: '6' },
  { value: '7' },
  { value: '8' },
  { value: '9' },
  { value: '10' },
  { value: '11' },
];
const convertToCM: (foot: number, inch: number) => number = (foot, inch) => {
  //calculate the height in CM
  const heightInCM = foot * 30.48 + inch * 2.54;
  // console.log(heightInCM);
  return heightInCM;
};
const CalculateBMI = (weight: number, height: number) => {
  console.log(height);
  const heightInMeters = height / 100;

  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
  return bmi;
};
const getLabelByBMI = (bmi: number) => {
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi < 25) {
    return 'Normal';
  } else if (bmi < 30) {
    return 'Overweight';
  } else {
    return 'Obese';
  }
};
type Props = StackProps<'BMI_CALCULATOR'>;
const BMI_CALCULATOR = ({ navigation }: Props): JSX.Element => {
  const { Sizes, Colors, Fonts } = useSelector(state => state.app);
  const { member } = useSelector(state => state.member);
  const basicScrollView = useRef<ScrollView>(null);
  const [loader, setLoader] = useState({
    loading: false,
  });
  const [data, setData] = useState<dataProps>({
    height: null,
    weight: null,
    bmi: null,
  });
  const [bmiData, setBmiData] = useState<BMI_DATA_INTERFACE | null>(null);

  const [weight, setWeight] = useState<{
    selectedWeight: 'KG' | 'LB';
    value: number;
  }>({
    selectedWeight: 'KG',
    value: 0,
  });
  const [height, setHeight] = useState<{
    selectedHeight: 'CM' | 'FT';
    value: number;
    foot: number;
    inch: number;
  }>({
    selectedHeight: 'CM',
    value: 0,
    foot: 0,
    inch: 0,
  });
  const [updateBmi, setUpdateBmi] = useState({
    loading: false,
    update: false,
  });

  useEffect(() => {
    // getData();
  }, []);
  const getData = async () => {
    setLoader({ loading: true });
    try {
      let res = await apiPost('api/userBmi/get', {
        filter: ` AND USER_ID = ${member?.ID} `,
      });
      if (res && res.code == 200) {
        if (res.data && res.data.length) {
          setData({
            height: res.data[0].HEIGHT,
            weight: res.data[0].WEIGHT,
            bmi: res.data[0].BMI,
          });
          setBmiData(res.data[0]);
          setLoader({ loading: false });
        } else {
          setLoader({ loading: false });
        }
      } else {
        setLoader({ loading: false });
      }
    } catch (error) {
      setLoader({ loading: false });
      navigation.goBack();
      Toast('Unable to open BMI Calculator, \nPlease try again later');
    }
  };
  const createData = async () => {
    setLoader({ loading: true });
    let heightValue = 0;
    let heightLabel = '';
    if (height.selectedHeight === 'CM') {
      heightValue = height.value;
      heightLabel = String(height.value);
    } else if (height.selectedHeight === 'FT') {
      heightValue = convertToCM(height.foot, height.inch);
      heightLabel = String(heightValue);
    } else {
      heightValue = 0;
      heightLabel = "0";
    }
    try {
      let BMI = CalculateBMI(weight.value, heightValue);
      let res = await apiPost('api/userBmi/create', {
        USER_ID: member?.ID,
        HEIGHT: heightLabel,
        WEIGHT: weight.value,
        WEIGHT_UNIT: 'KG',
        HEIGHT_UNIT:
          height.selectedHeight == 'CM'
            ? 'CM'
            : height.selectedHeight == 'FT'
              ? 'FT'
              : '',
        BMI: BMI,
        CLIENT_ID: 1,
        CREATED_DATETIME: moment().format('YYYY-MM-DD HH:mm:ss'),
      });
      if (res && res.code == 200) {
        getData();
      } else {
        Toast('Unable to open BMI Calculator, \nPlease try again later');
        setLoader({ loading: false });
      }
    } catch (error) {
      setLoader({ loading: false });
    }
  };


  const updateData = async () => {
    setLoader({ loading: true });
    try {
      let BMI = CalculateBMI(weight.value, height.value);
      const body = {
        USER_ID: member?.ID,
        HEIGHT: height.value,
        WEIGHT: weight.value,
        WEIGHT_UNIT: 'KG',
        HEIGHT_UNIT: 'CM',
        BMI: BMI,
        ID: bmiData?.ID,
        CLIENT_ID: 1,
        CREATED_DATETIME: moment().format('YYYY-MM-DD HH:mm:ss'),
      };
      const res = await apiPut('api/userBmi/update', body);
      if (res && res.code == 200) {
        Toast('Successfully BMI updated');
        getData();
      } else {
        Toast('Unable to open BMI Calculator, \nPlease try again later');
        setLoader({ loading: false });
      }
    } catch (error) {
      setLoader({ loading: true });
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Header label="BMI CALCULATOR" onBack={() => navigation.goBack()} />
      {loader.loading ? (
        <Loader />
      ) : data.bmi ? (
        <View style={{ flex: 1 }}>
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <SliderBMI
              colors={[
                '#ADD8E6',
                '#00FF00',
                '#FFFF00',
                '#FFA500',
                '#FF8C00',
                '#FF0000',
              ]}
              maxWidth={Sizes.Width * 0.8}
              value={parseFloat(data.bmi.toFixed(2))}
            />

            <Text
              style={{
                ...Fonts.Bold1,
                color: Colors.Primary,
                marginTop: 20,
              }}>
              {'BMI - ' + data.bmi.toFixed(2)}
            </Text>
            <Text
              style={{
                ...Fonts.Medium2,
                color: Colors.Primary,
                textAlign: 'center',
                textAlignVertical: 'center',
                flexWrap: 'wrap',
                paddingHorizontal: 30,
                marginTop: 10,
              }}>
              {`BMI (Body Mass Index) is a simple calculation based on your height and weight. It provides a general estimate of body fat and can help assess your risk for certain health conditions.`}
            </Text>
            <Text
              style={{
                ...Fonts.Bold1,
                color: Colors.Primary,
                fontSize: 25,
                marginTop: 35,
                paddingHorizontal: 40,
                textAlign: 'center',
              }}>
              {`You are considered ${getLabelByBMI(
                data.bmi,
              )} based on your BMI.`}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              margin: Sizes.ScreenPadding,
              alignSelf: 'flex-end',
            }}>
            <TextButton
              label="Update"
              loading={updateBmi.loading}
              onPress={async () => {
                setUpdateBmi({ loading: true, update: true });
                setData({ bmi: null, height: null, weight: null });
                setUpdateBmi({ loading: false, update: true });
              }}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      ) : (
        <ScrollView
          ref={basicScrollView}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          bounces={false}>
          <View style={{ width: Sizes.Width, overflow: 'hidden' }}>
            <Text
              style={{
                ...Fonts.Bold1,
                color: Colors.Primary,
                textAlign: 'center',
                margin: Sizes.ScreenPadding,
              }}>
              {'Select Weight'}
            </Text>
            <Text
              style={{
                ...Fonts.Medium2,
                color: Colors.Primary,
                textAlign: 'center',
                textAlignVertical: 'center',
                flexWrap: 'wrap',
                paddingHorizontal: 30,
                marginTop: 10,
              }}>
              {
                'Accurately enter your weight in the appropriate units to calculate your Body Mass Index (BMI).'
              }
            </Text>
            {/* <View style={{flex: 1, justifyContent: 'center'}}>
              <Slider
                value={weight.value}
                lowerLimit={WEIGHT[weight.selectedWeight].minimumValue}
                upperLimit={WEIGHT[weight.selectedWeight].maximumValue}
                maximumValue={WEIGHT[weight.selectedWeight].maximumValue}
                minimumValue={WEIGHT[weight.selectedWeight].minimumValue}
              />
            </View> */}
            <AnimatedSlider
              value={weight.value}
              label={WEIGHT[weight.selectedWeight].label}
              onChange={value => setWeight({ ...weight, value })}
              start={WEIGHT[weight.selectedWeight].minimumValue}
              end={WEIGHT[weight.selectedWeight].maximumValue}
              step={WEIGHT[weight.selectedWeight].steps}
            />

            <View style={{ margin: Sizes.ScreenPadding }}>
              <TextButton
                label="Next"
                loading={false}
                onPress={() =>
                  basicScrollView.current?.scrollTo({ x: Sizes.Width })
                }
              />
            </View>
          </View>
          <View style={{ width: Sizes.Width, overflow: 'hidden' }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  ...Fonts.Bold1,
                  color: Colors.Primary,
                  margin: Sizes.ScreenPadding,
                }}>
                {'Select Height'}
              </Text>
              <Text
                style={{
                  ...Fonts.Medium2,
                  color: Colors.Primary,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  flexWrap: 'wrap',
                  paddingHorizontal: 30,
                  marginTop: 10,
                }}>
                {
                  'Accurately enter your height in the appropriate units to calculate your Body Mass Index (BMI).'
                }
              </Text>
              <TypeSlider
                data={HEIGHT}
                value={height.selectedHeight}
                onChange={value =>
                  setHeight({ ...height, selectedHeight: value })
                }
              />
              {height.selectedHeight == 'CM' ? (
                <AnimatedSlider
                  value={height.value}
                  label={HEIGHT[height.selectedHeight].label}
                  onChange={value => setHeight({ ...height, value })}
                  start={HEIGHT[height.selectedHeight].minimumValue}
                  end={HEIGHT[height.selectedHeight].maximumValue}
                  step={HEIGHT[height.selectedHeight].steps}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    // alignItems: 'center',
                    padding: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 40,
                    }}>
                    <View style={{ flex: 1 }}>
                      <Dropdown
                        // @ts-ignore
                        labelField={'value'}
                        // @ts-ignore
                        valueField={'value'}
                        style={{
                          borderBottomWidth: 3,
                          // flex: 1,
                          borderColor: Colors.Primary,
                        }}
                        selectedTextStyle={{
                          ...Fonts.Bold1,
                          color: Colors.Primary,
                          textAlign: 'center',
                          textAlignVertical: 'center',
                        }}
                        //@ts-ignore
                        data={FOOT_DATA}
                        onChange={(item: any) => {
                          const footValue = parseInt(item.value);
                          if (!isNaN(footValue)) {
                            setHeight({
                              ...height,
                              foot: footValue,
                            });
                          }
                        }}
                        placeholder={'Foot'}
                        value={'' + height.foot}
                        dropdownPosition={'bottom'}
                        autoScroll={false}
                      />
                    </View>
                    <Text
                      style={{
                        ...Fonts.Bold1,
                        color: Colors.Primary,
                        fontSize: 50,
                      }}>
                      <Text
                        style={{ fontSize: 40, textDecorationLine: undefined }}>
                        {` Foot`}
                      </Text>
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 40,
                      marginTop: 20,
                    }}>
                    <View style={{ flex: 1 }}>
                      <Dropdown
                        // @ts-ignore
                        labelField={'value'}
                        // @ts-ignore
                        valueField={'value'}
                        style={{
                          borderBottomWidth: 3,
                          borderColor: Colors.Primary,
                        }}
                        selectedTextStyle={{
                          ...Fonts.Bold1,
                          color: Colors.Primary,
                          textAlign: 'center',
                          textAlignVertical: 'center',
                        }}
                        //@ts-ignore
                        data={INCH_DATA}
                        onChange={(item: any) => {
                          const inchValue = parseInt(item.value);
                          if (!isNaN(inchValue)) {
                            setHeight({
                              ...height,
                              inch: inchValue,
                            });
                          }
                        }}
                        placeholder={'00'}
                        value={'' + height.inch}
                        dropdownPosition={'bottom'}
                        autoScroll={false}
                      />
                    </View>
                    <Text
                      style={{
                        ...Fonts.Bold1,
                        color: Colors.Primary,
                        fontSize: 50,
                      }}>
                      <Text
                        style={{ fontSize: 40, textDecorationLine: undefined }}>
                        {` Inch`}
                      </Text>
                    </Text>
                  </View>
                </View>
              )}
              <View
                style={{
                  margin: Sizes.ScreenPadding,
                  flexDirection: 'row',
                }}>
                <View style={{ flex: 1 }}>
                  <TextButton
                    label="Back"
                    loading={false}
                    onPress={() => basicScrollView.current?.scrollTo({ x: 0 })}
                  />
                </View>
                <View style={{ width: Sizes.ScreenPadding }} />
                <View style={{ flex: 1 }}>
                  <TextButton
                    label="Next"
                    loading={false}
                    onPress={createData}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};
export default BMI_CALCULATOR;

type LoaderProps = { onClose?: () => void; label?: string };
const Loader: React.FC<LoaderProps> = ({ onClose, label = 'Loading' }) => {
  return (
    <Modal visible onRequestClose={onClose ? onClose : () => null} transparent>
      <View style={styles2.backdrop}>
        <View
          style={{
            backgroundColor: Colors.white,
            padding: 40,
            borderRadius: 25,
          }}>
          <ActivityIndicator size={'large'} color={Colors.primary} />
          <Text style={styles2.label}>{label}</Text>
        </View>
      </View>
    </Modal>
  );
};
const styles2 = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 23,
    color: Colors.primary,
    marginTop: 20,
    fontWeight: 'bold',
  },
});
