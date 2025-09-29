import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {useSelector} from '../Modules';

interface CheckBoxProps {
  isChecked: boolean;
  style?: ViewStyle;
}

const CheckboxComponent: React.FC<CheckBoxProps> = ({isChecked, style}) => {
  const {Sizes, Colors, Fonts} = useSelector(state => state.app);

  return (
    <TouchableOpacity style={[styles.container, style]}>
      <View
        style={[
          {
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: Colors.Primary,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isChecked ? Colors.Primary : Colors.White,
          },
          {...style},
        ]}>
        {/* {isChecked && <Text style={styles.checkIcon}>✓</Text>} */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    marginBottom: 10,
  },

  checked: {
    backgroundColor: '#007bff',
  },
  checkIcon: {
    color: '#fff',
  },
  label: {
    marginLeft: 10,
  },
});

export default CheckboxComponent;
