import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Header from '../components/Header'; // Assure-toi d'importer ton header
import Depot from '../components/Depot';         // Page avec les boutons
import DepotPage from '../components/views/DepotPage'; // Page de dépôt
import RetraitPage from '../components/views/RetraitPage'; // Page de retrait
import BottomTabNavigator from '../components/BottomTabNavigator';
import Graph from '../components/views/Graph';
import ProfileScreen from '../components/ProfileScreen';
import LoginScreen from '../components/LoginScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Profile">
      {/* Ajoutez ici la sidebar avec les options */}
      <Drawer.Screen name="Profile" component={ProfileSidebar} />
      <Drawer.Screen name="ModifyPhoto" component={ModifyPhoto} />
      <Drawer.Screen name="ModifyName" component={ModifyName} />
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          header: () => <Header />,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Accueil"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Depot"
          component={Depot}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="DepotPage"
          component={DepotPage}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="RetraitPage"
          component={RetraitPage}
          options={{ headerShown: true }}
        />

        <Stack.Screen 
          name="Graph" 
          component={Graph} 
          options={{ headerShown: true }} 
        />

        <Stack.Screen
          name="ProfileSidebar"
          component={DrawerNavigator}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Profile" 
          component={ProfileScreen} 
          options={{ headerShown: true }} 
        />

      </Stack.Navigator>
  );
}

// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { NavigationContainer } from '@react-navigation/native';
// import Header from '../components/Header'; // Assure-toi d'importer ton header
// import Depot from '../components/Depot';         // Page avec les boutons
// import DepotPage from '../components/DepotPage'; // Page de dépôt
// import RetraitPage from '../components/RetraitPage'; // Page de retrait
// import BottomTabNavigator from '../components/BottomTabNavigator';
// import Graph from '../components/Graph';
// import ProfileScreen from '../components/ProfileScreen';
// import LoginScreen from '../components/LoginScreen'

// const Stack = createStackNavigator();
// const Drawer = createDrawerNavigator();

// const DrawerNavigator = () => {
//   return (
//     <Drawer.Navigator initialRouteName="Profile">
//       {/* Ajoutez ici la sidebar avec les options */}
//       <Drawer.Screen name="Profile" component={ProfileSidebar} />
//       <Drawer.Screen name="ModifyPhoto" component={ModifyPhoto} />
//       <Drawer.Screen name="ModifyName" component={ModifyName} />
//     </Drawer.Navigator>
//   );
// };

// export default function App() {
//   return (
//       <Stack.Navigator
//         initialRouteName="LoginScreen"
//         screenOptions={{
//           header: () => <Header />,
//         }}
//       >
//         <Stack.Screen
//           name="LoginScreen"
//           component={LoginScreen}
//           options={{ headerShown: true }}
//         />
//         <Stack.Screen
//           name="Accueil"
//           component={BottomTabNavigator}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Depot"
//           component={Depot}
//           options={{ headerShown: true }}
//         />
//         <Stack.Screen
//           name="DepotPage"
//           component={DepotPage}
//           options={{ headerShown: true }}
//         />
//         <Stack.Screen
//           name="RetraitPage"
//           component={RetraitPage}
//           options={{ headerShown: true }}
//         />

//         <Stack.Screen 
//           name="Graph" 
//           component={Graph} 
//           options={{ headerShown: true }} 
//         />

//         <Stack.Screen
//           name="ProfileSidebar"
//           component={DrawerNavigator}
//           options={{
//             headerShown: false,
//           }}
//         />

//         <Stack.Screen
//           name="Profile" 
//           component={ProfileScreen} 
//           options={{ headerShown: true }} 
//         />

//       </Stack.Navigator>
//   );
// }