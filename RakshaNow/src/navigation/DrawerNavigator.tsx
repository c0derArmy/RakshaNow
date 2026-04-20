import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import MyReportsScreen from '../screens/MyReportsScreen';
import AlertsScreen from '../screens/AlertsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ResponderDashboardScreen from '../screens/ResponderDashboardScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#061423',
          width: '80%',
        },
        swipeEnabled: false, // Default to disabled as per user request
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          swipeEnabled: true // Enable only on Home screen
        }}
      />
      <Drawer.Screen 
        name="My Reports" 
        component={MyReportsScreen} 
      />
      <Drawer.Screen 
        name="Alerts" 
        component={AlertsScreen} 
      />
      <Drawer.Screen 
        name="Responder Dashboard" 
        component={ResponderDashboardScreen} 
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen} 
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
