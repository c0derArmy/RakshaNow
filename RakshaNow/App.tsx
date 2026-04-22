import React, { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

import DrawerNavigator from './src/navigation/DrawerNavigator';
import ReportSelectionScreen from './src/screens/ReportSelectionScreen';
import ReportEmergencyScreen from './src/screens/ReportEmergencyScreen';
import VoiceReportScreen from './src/screens/VoiceReportScreen';
import ConfirmationScreen from './src/screens/ConfirmationScreen';
import MyReportsScreen from './src/screens/MyReportsScreen';
import ResponderDashboardScreen from './src/screens/ResponderDashboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ProfileUpdateScreen from './src/screens/ProfileUpdateScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import EmergencyContactsScreen from './src/screens/Profile/EmergencyContectScreen';
import MedicalIDScreen from './src/screens/Profile/MedicalIDScreen';
import IncidentHistoryScreen from './src/screens/Profile/IncidentHistoryScreen';
import HowItWorksScreen from './src/screens/HowItWorksScreen';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider, useTheme } from './src/utils/theme';
import store, { persistor } from './src/store';



// Define our stack
const Stack = createNativeStackNavigator();


const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const userData = await AsyncStorage.getItem('@raksha_user');
        if (userData) {
          const parsed = JSON.parse(userData);
          if (parsed?.token) {
            setInitialRoute('Home');
          }
        }
      } catch (e) {
        console.log('Error checking login:', e);
      }
      setIsSplashVisible(false);
    };
    checkLogin();
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
<Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={initialRoute}
              screenOptions={{
              }}
            >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Home"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Report Selection"
            component={ReportSelectionScreen}
            options={{
              presentation: 'transparentModal', // <--- This makes the background transparent!
              animation: 'slide_from_bottom',   // <--- Slides up like a bottom sheet
            }}
          />
          <Stack.Screen
            name="Report Emergency"
            component={ReportEmergencyScreen}
            options={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Voice Report"
            component={VoiceReportScreen}
            options={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
            }}
          />

          <Stack.Screen
            name="Confirmation"
            component={ConfirmationScreen}
            options={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
            }}
          />

          {/* These screens are now handled by the DrawerNavigator */}
          {/* <Stack.Screen 
            name="My Reports" 
            ... 
          /> */}
          <Stack.Screen
            name="Responder Dashboard"
            component={ResponderDashboardScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Emergency Contacts"
            component={EmergencyContactsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Update Profile"
            component={ProfileUpdateScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MedicalID"
            component={MedicalIDScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Incident History"
            component={IncidentHistoryScreen}
            options={{
              headerShown: false,
            }}
          /> 
          <Stack.Screen
            name="How It Works"
            component={HowItWorksScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Alerts"
            component={AlertsScreen}
            options={{
              headerShown: false,
            }}
          />
        
        </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;


