import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Svg, { Path } from 'react-native-svg';

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { loginUser, googleLogin } from '../store/slices/userSlice';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAuth, GoogleAuthProvider, signInWithCredential, getIdToken } from '@react-native-firebase/auth';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../utils/theme';

const LoginScreen = ({ navigation }: any) => {

  const dispatch: AppDispatch = useDispatch();
  const { theme, isDark } = useTheme();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '227878993539-fpivliue8ovviehd1qof28oqp95mj7dp.apps.googleusercontent.com',
      offlineAccess: true,
      scopes: ['profile', 'email'],
    });
  }, []);



  const handleLogin = async () => {

    if (!phoneNumber || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }


    // clean phone number
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const cleanPassword = password.trim();


    setLoading(true);

    try {

      const result: any = await dispatch(

        loginUser({
          phone: cleanPhone,
          password: cleanPassword,
        })

      );


      setLoading(false);

      Alert.alert("Success", "Login Successfully");

      const userRole = result?.user?.role?.toUpperCase();
      if (userRole === 'RESPONDER') {
        navigation.replace("Responder Dashboard");
      } else {
        navigation.replace("Home");
      }


    } catch (error: any) {
      setLoading(false);
      
      const errorMessage = error?.response?.data?.details || 
                          error?.response?.data?.message || 
                          (error.message === "Network Error" 
                            ? "Network Error: Please ensure backend is running and ADB reverse is configured." 
                            : "Invalid phone or password");

      Alert.alert("Login Failed", errorMessage);
      console.log("LOGIN ERROR:", error?.response?.data || error.message);
    }

  };



const signInWithGoogle = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.type !== 'success') {
        throw new Error('Google sign-in cancelled or failed');
      }

      let idToken = response.data?.idToken;
      if (!idToken) {
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens.idToken;
      }

      if (!idToken) {
        throw new Error('Google ID token not found');
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(getAuth(), googleCredential);

      const user = getAuth().currentUser;
      const firebaseToken = user ? await getIdToken(user, true) : null;
      if (!firebaseToken) {
        throw new Error('Firebase auth token not found');
      }

      const googleResult: any = await dispatch(googleLogin(firebaseToken));

      setLoading(false);

      Alert.alert('Success', 'Google login successful');

      const userRole = googleResult?.payload?.user?.role?.toUpperCase();
      if (userRole === 'RESPONDER') {
        navigation.replace("Responder Dashboard");
      } else {
        navigation.replace("Home");
      }

    } catch (e: any) {
      setLoading(false);
      console.log('Google Sign-In error:', e);
      Alert.alert('Sign-In Error', e?.response?.data?.message || e.message || 'Something went wrong');
    }
  };



  return (

    <SafeAreaProvider>

      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>

        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />


        <ScrollView contentContainerStyle={styles.scrollContainer}>


          <View style={styles.header}>


            <View style={styles.logoOuterRing}>

              <LinearGradient

                colors={['#d32f2f', '#ffb3ac']}

                style={styles.logoInnerCircle}

              >

                <Icon name="shield" size={28} color="#fff" />

              </LinearGradient>

            </View>


            <Text style={styles.appTitle}>

              RakshaNow

            </Text>


            <Text style={styles.appSubtitle}>

              TACTICAL RESPONSE UNIT

            </Text>


          </View>



          <View style={styles.card}>


            <Text style={styles.welcomeTitle}>

              Welcome Back

            </Text>


            <Text style={styles.welcomeSubtitle}>

              Login to your command dashboard

            </Text>



            <View style={styles.inputGroup}>


              <Text style={styles.inputLabel}>

                CONTACT NUMBER

              </Text>


              <View style={styles.inputWrapper}>

                <Icon

                  name="call"

                  size={20}

                  color="rgba(255,179,172,0.6)"

                  style={styles.inputIcon}

                />


                <TextInput

                  placeholder="Enter phone number"

                  placeholderTextColor="#475569"

                  keyboardType="phone-pad"

                  value={phoneNumber}

                  onChangeText={setPhoneNumber}

                  style={styles.textInput}

                />

              </View>


            </View>



            <View style={styles.inputGroup}>


              <View style={styles.labelRow}>

                <Text style={styles.inputLabel}>

                  ACCESS KEY

                </Text>


              </View>



              <View style={styles.inputWrapper}>


                <Icon

                  name="lock"

                  size={20}

                  color="rgba(255,179,172,0.6)"

                  style={styles.inputIcon}

                />


                <TextInput

                  placeholder="Enter password"

                  placeholderTextColor="#475569"

                  secureTextEntry={!passwordVisible}

                  value={password}

                  onChangeText={setPassword}

                  style={styles.textInput}

                />


                <TouchableOpacity

                  style={styles.visibilityIcon}

                  onPress={() =>

                    setPasswordVisible(!passwordVisible)

                  }

                >

                  <Icon

                    name={

                      passwordVisible
                        ? 'visibility'
                        : 'visibility-off'

                    }

                    size={20}

                    color="#475569"

                  />

                </TouchableOpacity>


              </View>


            </View>



            <TouchableOpacity

              style={styles.submitButtonContainer}

              onPress={handleLogin}

              disabled={loading}

            >

              <LinearGradient

                colors={['#d32f2f', '#ffb3ac']}

                style={styles.submitButton}

              >

                <Text style={styles.submitButtonText}>

                  {loading ? "PLEASE WAIT..." : "LOGIN"}

                </Text>

              </LinearGradient>

            </TouchableOpacity>



            <View style={styles.registerRow}>

              <Text style={styles.registerText}>

                New User?

              </Text>


              <TouchableOpacity

                onPress={() => navigation.navigate('Register')}

              >

                <Text style={styles.registerLink}>

                  Register here

                </Text>

              </TouchableOpacity>

            </View>



            <TouchableOpacity

              style={styles.googleBtn}

              onPress={signInWithGoogle}

            >


              <Svg width="22" height="22" viewBox="0 0 48 48">

                <Path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.61l6.85-6.85C35.86 2.7 30.33 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.73 13.04 17.89 9.5 24 9.5z"/>

                <Path fill="#4285F4" d="M46.5 24.5c0-1.56-.14-3.06-.4-4.5H24v9h12.7c-.55 2.96-2.23 5.47-4.75 7.15l7.33 5.7C43.89 37.48 46.5 31.54 46.5 24.5z"/>

                <Path fill="#FBBC05" d="M10.67 28.64A14.5 14.5 0 0 1 9.5 24c0-1.61.28-3.16.77-4.64l-7.98-6.2A23.97 23.97 0 0 0 0 24c0 3.86.92 7.51 2.69 10.56l7.98-6.2z"/>

                <Path fill="#34A853" d="M24 48c6.33 0 11.65-2.09 15.53-5.67l-7.33-5.7c-2.04 1.37-4.65 2.17-8.2 2.17-6.11 0-11.27-3.54-13.33-8.64l-7.98 6.2C6.73 42.52 14.82 48 24 48z"/>

              </Svg>


              <Text style={styles.googleText}>

                Sign in with Google

              </Text>

            </TouchableOpacity>



          </View>


        </ScrollView>


      </SafeAreaView>

    </SafeAreaProvider>

  );

};



const styles = StyleSheet.create({

safeArea:{
flex:1,
},

scrollContainer:{
flexGrow:1,
justifyContent:'center',
alignItems:'center',
padding:24
},

header:{
alignItems:'center',
marginBottom:40
},

logoOuterRing:{
width:80,
height:80,
borderRadius:40,
backgroundColor:'#132030',
justifyContent:'center',
alignItems:'center',
marginBottom:20
},

logoInnerCircle:{
width:50,
height:50,
borderRadius:25,
justifyContent:'center',
alignItems:'center'
},

appTitle:{
fontSize:26,
fontWeight:'800',
color:'#ffb3ac'
},

appSubtitle:{
fontSize:10,
color:'#94a3b8',
letterSpacing:2
},

card:{
width:'100%',
backgroundColor:'#132030',
borderRadius:20,
padding:25
},

welcomeTitle:{
fontSize:22,
fontWeight:'700',
color:'#fff'
},

welcomeSubtitle:{
color:'#94a3b8',
marginBottom:20
},

inputGroup:{
marginBottom:20
},

inputLabel:{
fontSize:10,
color:'#64748b',
marginBottom:5
},

labelRow:{
flexDirection:'row',
justifyContent:'space-between'
},

inputWrapper:{
flexDirection:'row',
alignItems:'center',
backgroundColor:'#020f1e',
borderRadius:10,
height:50
},

inputIcon:{
marginLeft:15
},

textInput:{
flex:1,
color:'#fff',
paddingLeft:10
},

visibilityIcon:{
marginRight:15
},

submitButtonContainer:{
marginTop:10
},

submitButton:{
height:50,
borderRadius:10,
justifyContent:'center',
alignItems:'center'
},

submitButtonText:{
color:'#fff',
fontWeight:'700'
},

registerRow:{
flexDirection:'row',
marginTop:20
},

registerText:{
color:'#94a3b8'
},

registerLink:{
color:'#ffb3ac',
marginLeft:5,
fontWeight:'700'
},

googleBtn:{
marginTop:20,
height:50,
backgroundColor:'#1e2b3b',
borderRadius:10,
flexDirection:'row',
justifyContent:'center',
alignItems:'center'
},

googleText:{
  color:'#fff',
  fontWeight:'600',
  marginLeft:10
}

});

export default LoginScreen;