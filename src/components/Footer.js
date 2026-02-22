import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import InicioScreen from '../screens/InicioScreen';
import { theme } from '../core/theme'
import HorariosScreen from '../screens/HorariosScreen';
import CompraScreen from '../screens/CompraScreen';
import MisClasesScreen from '../screens/MisClasesScreen';
import PerfilScreen from '../screens/PerfilScreen';
import CoachesScreen from '../screens/CoachesScreen';
import logo from '../assets/hoop.jpg'; 
import { Image, TouchableOpacity, Linking, View } from 'react-native';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator 
      screenOptions={({ route, navigation }) => ({
        tabBarActiveTintColor: theme.colors.cuarto,
        headerTitle: '',
        headerRight: () => (
          <View  style={{flexDirection:'row',alignItems:'center' }}>
          <TouchableOpacity onPress={() => {
            Linking.openURL('https://hoopcr.com/');
          }} >
            <Image resizeMode="contain"
              style={{ width: 60, height: 40, marginRight: 10 }}
              source={logo}
            />
          </TouchableOpacity>
           <TouchableOpacity onPress={() => {
           navigation.navigate('LoginScreen');
          }} >
            <MaterialCommunityIcons
              name="power"
              color="white"
              size={24}
              style={{ marginLeft: 20 }}
            />
          </TouchableOpacity>
          </View>
        ),

        headerStyle: { backgroundColor: theme.colors.header, },
        headerTitleAlign: 'center',
        headerLeft: () => (
          <TouchableOpacity  onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="home"
              color="white"
              size={24}
              style={{ marginLeft: 20 }}
            />
          </TouchableOpacity>
        ),
      })}>

      <Tab.Screen
        name="Inicio"
        component={InicioScreen}
        options={{ 
          tabBarShowLabel: false,
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendario"
        component={HorariosScreen}
        options={{
          tabBarShowLabel: false,
          tabBarLabel: 'Calendario',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Horarios"
        component={MisClasesScreen}
        options={{
          tabBarShowLabel: false,
          tabBarLabel: 'Horarios',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clock" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Reservacion"
        component={CompraScreen}
        options={{
          tabBarShowLabel: false,
          tabBarLabel: 'Reservacion',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shopping" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={PerfilScreen}
        options={{
          tabBarShowLabel: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Coaches"
        component={CoachesScreen}
        options={{
          tabBarShowLabel: false,
          tabBarLabel: 'Coaches',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <MyTabs />
  );
}
