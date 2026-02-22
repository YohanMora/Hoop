import React, { useEffect } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import * as Font from "expo-font";
import { Avatar, Button, TextInput } from 'react-native-paper';
import { IconoHeader } from './src/components/IconoHeader'

import { Image, TouchableOpacity, Linking } from 'react-native';
import logo from './src/assets/hoop.jpg';
import { initializePushNotifications } from './src/services/pushNotifications'

import {
  HorariosScreen, 
  PerfilScreen,
  LoginScreen,
  CompraScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
  MisClasesScreen,
  CoachesScreen 
} from './src/screens'

const Stack = createStackNavigator()
const options = {
  headerTitle: false,
  headerRight: () => ( 
    <TouchableOpacity  onPress={() => { 
      Linking.openURL('https://hoopcr.com/');
    }} >
    <Image resizeMode="contain"
      style={{ width: 60, height: 40, marginRight: 10 }}
      source={logo}
    />
    </TouchableOpacity>
  ),
  
  headerStyle: { backgroundColor: theme.colors.header, }, 
  headerTitleAlign: 'center',
  headerBackTitle: 'Salir',

}
export default function App({ navigation }) {

  useEffect(() => {
    let unsubscribeNotifications;

    const setupPushNotifications = async () => {
      unsubscribeNotifications = await initializePushNotifications();
    };

    setupPushNotifications();

    return () => {
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
      }
    };
  }, []);

  Font.loadAsync({
    'open-sans-light': require('./assets/fonts/open-sans-light.ttf'),
  })
  Font.loadAsync({
    'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),
  })
  

  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="LoginScreen"
          screenOptions={{
            headerTintColor:'white'
          }}
        >
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{
            headerShown: false

          }} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{
            headerShown: false
          }} />
          <Stack.Screen name="HorariosScreen" component={HorariosScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} options={{
            headerShown: false}} />
          <Stack.Screen options={{
            headerShown: false}}
            name="ResetPasswordScreen"
            
            component={ResetPasswordScreen}
          />
          <Stack.Screen
            name="CompraScreen"
            component={CompraScreen}
          />
          <Stack.Screen
            name="PerfilScreen"
            component={PerfilScreen}
          />
          <Stack.Screen
            name="MisClasesScreen"
            component={MisClasesScreen}
          />
           <Stack.Screen
            name="CoachesScreen"
            component={CoachesScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}