import {NavigationContainer} from '@react-navigation/native';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Login from './Login';
import OtpScreen from './OtpScreen';
import Registration from './Registration';
import SchoolRegistration from './SchoolRegistration/SchoolRegistration';
import {APP_USER_INTERFACE, STUDENT_DATA_INTERFACE} from '../Modules/interface';
import AppRegistrationScreen from './AppRegistration/AppRegistrationScreen';
import TeacherStudentRegistration from './AppRegistration/TeacherStudentRegistration';

export type StackParams = {
  Login: undefined;
  SchoolRegistration: undefined;
  OtpScreen: {
    mobile: any;
  };
  Registration: {
    item: STUDENT_DATA_INTERFACE;
  };
  AppRegistrationScreen: {
    item: APP_USER_INTERFACE;
    mobile: '';
    IS_NEW_USER: number;
  };
  TeacherStudentRegistration: {
    mobile: string;
  };
};
const stack = createSharedElementStackNavigator<StackParams>();

export type StackAuthProps<ScreenName extends keyof StackParams> =
  NativeStackScreenProps<StackParams, ScreenName>;

const AuthRoutes = (): JSX.Element => {
  return (
    <NavigationContainer>
      <stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <stack.Screen name="Login" component={Login} />
        <stack.Screen name="OtpScreen" component={OtpScreen} />
        <stack.Screen name="Registration" component={Registration} />
        <stack.Screen
          name="AppRegistrationScreen"
          component={AppRegistrationScreen}
        />
        <stack.Screen
          name="TeacherStudentRegistration"
          component={TeacherStudentRegistration}
        />
      </stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthRoutes;
