import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import SetupScreen from './src/screens/SetupScreen';
import TimerScreen from './src/screens/TimerScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Setup"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Setup" component={SetupScreen} />
        <Stack.Screen name="Timer" component={TimerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}