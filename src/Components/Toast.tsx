import {Alert, Platform, ToastAndroid} from 'react-native';

const Toast = (text: string) => {
  //check device os
  if (Platform.OS === 'ios') {
    Alert.prompt(text);
  } else {
    ToastAndroid.show(text, ToastAndroid.BOTTOM);
  }
};

export default Toast;
