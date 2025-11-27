import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import Login from './auth/Login';
import { Approved } from '../assets';
import { useSelector } from './Modules';
import Registration from './auth/Registration';
const Tab = createBottomTabNavigator();
const TabNavigation = () => {
  const { Colors, Sizes, Fonts } = useSelector(state => state.app);
  return (
    <Tab.Navigator
      sceneContainerStyle={{
        backgroundColor: 'white',
      }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.Black,
        ...Fonts.Bold1,
        tabBarInactiveTintColor: Colors.PrimaryText,
        tabBarStyle: {
          height: 70,
          alignItems: 'center',
          paddingBottom: Sizes.Padding,
          elevation: 20,
          backgroundColor: Colors.Primary2,
        },
      }}
      initialRouteName="Login">
      <Tab.Screen
        name="Login"
        component={Login}
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <View style={{ alignItems: 'center' }}>
              {focused && (
                <View
                  style={{
                    height: 2,
                    width: 70,
                    backgroundColor: Colors.Primary2,
                    marginTop: -10,
                    marginBottom: 5,
                  }}
                />
              )}
              <Approved
                color={focused ? Colors.Primary2 : Colors.PrimaryText}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Registration"
        component={Registration}
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <View style={{ alignItems: 'center' }}>
              {focused && (
                <View
                  style={{
                    height: 2,
                    width: 70,
                    backgroundColor: Colors.Primary2,
                    marginTop: -10,
                    marginBottom: 5,
                  }}
                />
              )}
              <Approved
                color={focused ? Colors.Primary2 : Colors.PrimaryText}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
