import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from '../../../Modules';
type dimension = {
  label: 'KG' | 'LB' | 'CM' | 'FT';
  title: string;
  minimumValue: number;
  maximumValue: number;
  steps: number;
  ratio: number;
};
interface TypeSliderProps {
  data: {CM: dimension; FT: dimension};
  value: 'CM' | 'FT';
  onChange: (value: 'CM' | 'FT') => void;
}
const MAX_HEIGHT = 40;
const TypeSlider: React.FC<TypeSliderProps> = ({data, onChange, value}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);
  return (
    <View
      style={{
        marginTop: 10,
        padding: 2,
        width: Sizes.Width * 0.3,
        height: MAX_HEIGHT,
        backgroundColor: Colors.White,
        borderRadius: MAX_HEIGHT / 2,
        flexDirection: 'row',
        borderWidth: 2,
        alignSelf: 'center',
        borderColor: Colors.Primary,
        overflow: 'hidden',
      }}>
      <Text
        style={{
          ...Fonts.Medium2,
          flex: 1,
          borderRadius: MAX_HEIGHT / 2,
          textAlign: 'center',
          textAlignVertical: 'center',
          color: value == 'CM' ? Colors.White : Colors.Primary,
          backgroundColor: value == 'CM' ? Colors.Primary : Colors.White,
        }}
        onPress={() => onChange('CM')}>
        {data.CM.label}
      </Text>
      <Text
        style={{
          ...Fonts.Medium2,
          flex: 1,
          borderRadius: MAX_HEIGHT / 2,
          textAlign: 'center',
          textAlignVertical: 'center',
          color: value == 'FT' ? Colors.White : Colors.Primary,
          backgroundColor: value == 'FT' ? Colors.Primary : Colors.White,
        }}
        onPress={() => onChange('FT')}>
        {data.FT.title}
      </Text>
    </View>
  );
};
export default TypeSlider;
const styles = StyleSheet.create({});
