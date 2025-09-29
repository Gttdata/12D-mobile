/**
 * @format
 */

import {AppRegistry, Alert, NativeModules} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from './src/Modules';
import './src/i18n/i18n.config';
import messaging from '@react-native-firebase/messaging';
import {Notification} from './src/Modules/notifications';
// const {BackgroundServiceCheck, CheckUsedApp, BatteryRestrictions, DeviceAdmin} =
//   NativeModules;
const Application = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    // BackgroundServiceCheck.startBackgroundReminder(['data1', 'data2'])
    //   .then(result => {
    //     console.log(result); // Success message from the native module
    //   })
    //   .catch(error => {
    //     console.error(error); // Error message from the native module
    //   });
    Notification(remoteMessage);
  });
  messaging().getInitialNotification(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    Notification(remoteMessage);
  });
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
AppRegistry.registerComponent(appName, () => Application);
