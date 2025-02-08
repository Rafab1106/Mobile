import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from './HomeScreen';
import Graph from './views/Graph';
import Market from './views/Market';
import Depot from './Depot';
import Wallet from './views/Wallet';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Accueil') {
            iconName = 'home';
          } else if (route.name === 'Graph') {
            iconName = 'show-chart';
          } else if (route.name === 'Market') {
            iconName = 'swap-horiz';
          } else if (route.name === 'Depot') {
            iconName = 'attach-money';
          } else if (route.name === 'Wallet') {
            iconName = 'account-balance-wallet';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00ffcc',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopWidth: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Graph" component={Graph} />
      <Tab.Screen name="Market" component={Market} />
      <Tab.Screen name="Depot" component={Depot} />
      <Tab.Screen name="Wallet" component={Wallet} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;