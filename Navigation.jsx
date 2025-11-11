import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Collection from './Collection';
import User from './User';
import Settings from './Settings';
import SignIn from './SignIn';
import Result from './Result';
import Database from './Database';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen 
        name="Collection" 
        component={Collection}
        options={{
          title: 'Collections',
        }}
      />
      <Tab.Screen 
        name="User" 
        component={User}
        options={{
          title: 'User',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={Settings}
        options={{
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
        },
        headerTintColor: '#000',
      }}
    >
      <Stack.Screen 
        name="SignIn" 
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Main" 
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Result" 
        component={Result}
        options={{ 
          title: 'Recognition Result',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name="Database" 
        component={Database}
        options={{ 
          title: 'Database',
          headerBackTitle: 'Back'
        }}
      />
    </Stack.Navigator>
  );
}