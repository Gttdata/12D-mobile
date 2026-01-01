/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import { store } from './src/Modules';
import './src/i18n/i18n.config';
import messaging from '@react-native-firebase/messaging';
import { Notification } from './src/Modules/notifications';
import { SafeAreaView } from 'react-native-safe-area-context';

const Application = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    // console.log('Message handled in the background!', remoteMessage);
    const { notificationType, data1 } = remoteMessage?.data || {};
    // console.log('Background notification data:', notificationType, data1);
    const type = notificationType || data1;
    if (type === 'A' || type === 'DPT') {
      await Notification(remoteMessage, true);
    }
  });
  messaging().getInitialNotification(async remoteMessage => {
    console.log('Initial notification from quit state:', remoteMessage);
    if (remoteMessage) {
      await Notification(remoteMessage);
    }
  });
  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1 }}>
        <App />
      </SafeAreaView>
    </Provider>
  );
};
AppRegistry.registerComponent(appName, () => Application);
