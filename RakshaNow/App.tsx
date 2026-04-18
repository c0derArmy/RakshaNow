import React, { useState, useEffect } from 'react';
//import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ReportSelectionScreen from './src/screens/ReportSelectionScreen';
import ReportEmergencyScreen from './src/screens/ReportEmergencyScreen';
import VoiceReportScreen from './src/screens/VoiceReportScreen';
import ConfirmationScreen from './src/screens/ConfirmationScreen';
import MyReportsScreen from './src/screens/MyReportsScreen';
import ResponderDashboardScreen from './src/screens/ResponderDashboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import EmergencyContactsScreen from './src/screens/Profile/EmergencyContectScreen';
import MedicalIDScreen from './src/screens/Profile/MedicalIDScreen';
import IncidentHistoryScreen from './src/screens/Profile/IncidentHistoryScreen';
import HowItWorksScreen from './src/screens/HowItWorksScreen';
import { Provider } from 'react-redux';
import store from './src/store';



// Define our stack
const Stack = createNativeStackNavigator();


const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    // 3-second Splash Screen timer
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#132030',
            },
            headerTintColor: '#ffb3ac',
            headerTitleStyle: {
              fontWeight: '800',
              fontSize: 20,
            },
            // Android status bar handled in individual screens
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
            component={HomeScreen}
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

          <Stack.Screen
            name="My Reports"
            component={MyReportsScreen}
            options={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
            }}
          />

          <Stack.Screen
            name="Responder Dashboard"
            component={ResponderDashboardScreen}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
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
         <Stack.Screen
            name="Emergency Contacts"
            component={EmergencyContactsScreen}
            options={{
              headerShown: false,
            }}
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
       
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
