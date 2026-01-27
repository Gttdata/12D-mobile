import {
  StatusBar,
  SafeAreaView,
} from 'react-native';
import React, { useEffect } from 'react';
import Routes from './src/routes';
import { Permissions, useSelector } from './src/Modules';
import SplashScreen from './src/screens/SplashScreen';
import AuthRoutes from './src/auth/AuthRoutes';
import messaging from '@react-native-firebase/messaging';
import { Notification } from './src/Modules/notifications';

const App = () => {
  const { showSplashScreen } = useSelector(state => state.app);
  const { member } = useSelector(state => state.member);
  console.log("member data in app.tsx: ", member);
  //  useEffect(() => {
  //   try { AlarmModule.scheduleAlarm(5000); } 
  //   catch (e) { console.warn(e); }
  // }, []);
  useEffect(() => {
    checkPermission();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Notification(remoteMessage, false);
    });

    return unsubscribe;
  }, []);

  const checkPermission = async () => {
    Permissions.requestAll();
  };



  if (showSplashScreen) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#00BCD4"
          hidden={true}
        />
        <SplashScreen />
      </SafeAreaView>
    );
  } else {
    if (member) {
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#00BCD4"
        hidden={false}
      />;

      return <Routes />;
    } else {
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#00BCD4"
        hidden={false}
      />;
      return <AuthRoutes />;
    }
  }
};

export default App;
