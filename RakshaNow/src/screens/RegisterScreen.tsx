// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   ScrollView,
//   Platform,
//   Alert
// } from "react-native";

// import { SafeAreaView } from "react-native-safe-area-context";
// import LinearGradient from "react-native-linear-gradient";
// import Icon from "react-native-vector-icons/MaterialIcons";

// import axiosClient from "../utils/axiosClient";

// const RegisterScreen = ({ navigation }: any) => {

//   const [activeRole, setActiveRole] =
//     useState<"citizen" | "responder">("citizen");

//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({

//     name: "",
//     phone: "",
//     email: "",
//     password: "",
//     confirmPassword: ""

//   });



//  const handleRegister = async () => {

//   if (!formData.name || !formData.phone || !formData.email || !formData.password || !formData.confirmPassword) {

//     Alert.alert("Error", "Please fill all fields");
//     return;

//   }

//   if (formData.password !== formData.confirmPassword) {

//     Alert.alert("Error", "Passwords do not match");
//     return;

//   }


//   const cleanPhone = formData.phone.replace(/\D/g, "");


//   try {

//     const response = await axiosClient.post("/auth/register", {

//       name: formData.name,
//       phone: cleanPhone,
//       email: formData.email,
//       password: formData.password,
//       role: activeRole,

//     });


//     Alert.alert(
//       "Success",
//       "Register Successfully"
//     );


//     // small delay for alert render
//     setTimeout(() => {

//       navigation.navigate("Home");

//     }, 800);


//   } catch (error: any) {

//     console.log("REGISTER ERROR:", error?.response?.data);


//     Alert.alert(

//       "Register Failed",

//       error?.response?.data?.message ||

//       "User already exists"

//     );

//   }

// };



//   return (

//     <SafeAreaView style={styles.safeArea}>



//       <StatusBar

//         barStyle="light-content"

//         backgroundColor="#132030"

//       />



//       <View style={styles.header}>



//         <View style={styles.headerLeft}>



//           <TouchableOpacity

//             onPress={() => navigation.goBack()}

//             style={styles.backButton}

//           >

//             <Icon

//               name="arrow-back"

//               size={24}

//               color="#ffb3ac"

//             />

//           </TouchableOpacity>



//           <Text style={styles.headerTitle}>

//             RakshaNow

//           </Text>

//         </View>



//         <Text style={styles.stepText}>

//           Step 1 of 2

//         </Text>

//       </View>



//       <ScrollView contentContainerStyle={styles.scrollContainer}>



//         <View style={styles.card}>



//           <Text style={styles.title}>

//             Create Account

//           </Text>



//           <Text style={styles.subtitle}>

//             Join the network and stay protected.

//           </Text>



//           {/* role selector */}



//           <View style={styles.roleContainer}>



//             <TouchableOpacity

//               style={styles.roleButton}

//               onPress={() => setActiveRole("citizen")}

//             >

//               {

//                 activeRole === "citizen"

//                   ?

//                   <LinearGradient

//                     colors={["#ffb3ac", "#d32f2f"]}

//                     style={styles.activeRoleGradient}

//                   >

//                     <Text style={styles.activeRoleText}>

//                       CITIZEN

//                     </Text>

//                   </LinearGradient>

//                   :

//                   <Text style={styles.inactiveRoleText}>

//                     CITIZEN

//                   </Text>

//               }

//             </TouchableOpacity>



//             <TouchableOpacity

//               style={styles.roleButton}

//               onPress={() => setActiveRole("responder")}

//             >

//               {

//                 activeRole === "responder"

//                   ?

//                   <LinearGradient

//                     colors={["#ffb3ac", "#d32f2f"]}

//                     style={styles.activeRoleGradient}

//                   >

//                     <Text style={styles.activeRoleText}>

//                       RESPONDER

//                     </Text>

//                   </LinearGradient>

//                   :

//                   <Text style={styles.inactiveRoleText}>

//                     RESPONDER

//                   </Text>

//               }

//             </TouchableOpacity>



//           </View>



//           {/* inputs */}



//           <View style={styles.inputGroup}>

//             <Text style={styles.inputLabel}>

//               FULL NAME

//             </Text>



//             <View style={styles.inputWrapper}>

//               <Icon name="person" size={20} color="#64748b" />



//               <TextInput

//                 style={styles.textInput}

//                 placeholder="Enter name"

//                 placeholderTextColor="#475569"

//                 value={formData.name}

//                 onChangeText={(text) =>
//                   setFormData({ ...formData, name: text })
//                 }

//               />

//             </View>

//           </View>



//           <View style={styles.inputGroup}>

//             <Text style={styles.inputLabel}>

//               PHONE NUMBER

//             </Text>



//             <View style={styles.inputWrapper}>

//               <Icon name="call" size={20} color="#64748b" />



//               <TextInput

//                 style={styles.textInput}

//                 placeholder="Enter phone number"

//                 placeholderTextColor="#475569"

//                 keyboardType="phone-pad"

//                 value={formData.phone}

//                 onChangeText={(text) =>
//                   setFormData({ ...formData, phone: text })
//                 }

//               />

//             </View>

//           </View>



//           <View style={styles.inputGroup}>

//             <Text style={styles.inputLabel}>

//               EMAIL

//             </Text>



//             <View style={styles.inputWrapper}>

//               <Icon name="mail" size={20} color="#64748b" />



//               <TextInput

//                 style={styles.textInput}

//                 placeholder="Enter email"

//                 placeholderTextColor="#475569"

//                 value={formData.email}

//                 onChangeText={(text) =>
//                   setFormData({ ...formData, email: text })
//                 }

//               />

//             </View>

//           </View>



//           <View style={styles.inputGroup}>

//             <Text style={styles.inputLabel}>

//               PASSWORD

//             </Text>



//             <View style={styles.inputWrapper}>

//               <Icon name="lock" size={20} color="#64748b" />



//               <TextInput

//                 style={styles.textInput}

//                 placeholder="Enter password"

//                 placeholderTextColor="#475569"

//                 secureTextEntry

//                 value={formData.password}

//                 onChangeText={(text) =>
//                   setFormData({ ...formData, password: text })
//                 }

//               />

//             </View>

//           </View>



//           <View style={styles.inputGroup}>

//             <Text style={styles.inputLabel}>

//               CONFIRM PASSWORD

//             </Text>



//             <View style={styles.inputWrapper}>

//               <Icon name="verified-user" size={20} color="#64748b" />



//               <TextInput

//                 style={styles.textInput}

//                 placeholder="Confirm password"

//                 placeholderTextColor="#475569"

//                 secureTextEntry

//                 value={formData.confirmPassword}

//                 onChangeText={(text) =>
//                   setFormData({

//                     ...formData,

//                     confirmPassword: text

//                   })

//                 }

//               />

//             </View>

//           </View>



//           <TouchableOpacity

//             style={styles.submitButtonContainer}

//             onPress={handleRegister}

//             disabled={loading}

//           >

//             <LinearGradient

//               colors={["#ffb3ac", "#d32f2f"]}

//               style={styles.submitButton}

//             >

//               <Text style={styles.submitButtonText}>

//                 {

//                   loading

//                     ?

//                     "PLEASE WAIT..."

//                     :

//                     "REGISTER"

//                 }

//               </Text>

//             </LinearGradient>

//           </TouchableOpacity>



//           <View style={styles.footer}>

//             <Text style={styles.footerText}>

//               Already have account?

//             </Text>



//             <TouchableOpacity

//               onPress={() => navigation.navigate("Login")}

//             >

//               <Text style={styles.loginLink}>

//                 Login

//               </Text>

//             </TouchableOpacity>

//           </View>



//         </View>

//       </ScrollView>

//     </SafeAreaView>

//   );

// };



// const styles = StyleSheet.create({

// safeArea:{
// flex:1,
// backgroundColor:"#061423"
// },

// header:{
// height:

// Platform.OS==="android"

// ?52+(StatusBar.currentHeight||0)

// :52,

// paddingTop:

// Platform.OS==="android"

// ?StatusBar.currentHeight

// :0,

// backgroundColor:"#132030",

// flexDirection:"row",

// justifyContent:"space-between",

// alignItems:"center",

// paddingHorizontal:16
// },

// headerLeft:{
// flexDirection:"row",
// alignItems:"center"
// },

// backButton:{
// padding:8
// },

// headerTitle:{
// color:"#ffb3ac",
// fontSize:20,
// fontWeight:"800"
// },

// stepText:{
// color:"#94a3b8"
// },

// scrollContainer:{
// flexGrow:1,
// alignItems:"center",
// padding:20
// },

// card:{
// width:"100%",
// backgroundColor:"#132030",
// borderRadius:20,
// padding:20
// },

// title:{
// fontSize:24,
// color:"#fff",
// fontWeight:"700"
// },

// subtitle:{
// color:"#94a3b8",
// marginBottom:20
// },

// roleContainer:{
// flexDirection:"row",
// backgroundColor:"#020f1e",
// borderRadius:30,
// padding:6,
// marginBottom:25
// },

// roleButton:{
// flex:1,
// height:40,
// borderRadius:20,
// overflow:"hidden"
// },

// activeRoleGradient:{
// flex:1,
// justifyContent:"center",
// alignItems:"center"
// },

// activeRoleText:{
// color:"#fff",
// fontWeight:"700"
// },

// inactiveRoleText:{
// flex:1,
// textAlign:"center",
// textAlignVertical:"center",
// color:"#94a3b8"
// },

// inputGroup:{
// marginBottom:15
// },

// inputLabel:{
// fontSize:10,
// color:"#64748b",
// marginBottom:5
// },

// inputWrapper:{
// flexDirection:"row",
// alignItems:"center",
// backgroundColor:"#020f1e",
// borderRadius:10,
// paddingHorizontal:10,
// height:50
// },

// textInput:{
// flex:1,
// color:"#fff",
// marginLeft:10
// },

// submitButtonContainer:{
// marginTop:10
// },

// submitButton:{
// height:50,
// borderRadius:10,
// justifyContent:"center",
// alignItems:"center"
// },

// submitButtonText:{
// color:"#fff",
// fontWeight:"700"
// },

// footer:{
// flexDirection:"row",
// justifyContent:"center",
// marginTop:20
// },

// footerText:{
// color:"#94a3b8"
// },

// loginLink:{
// color:"#ffb3ac",
// marginLeft:5,
// fontWeight:"700"
// }

// });

// export default RegisterScreen;


import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Platform,
  Alert
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { registerUser } from '../store/slices/userSlice';

const RegisterScreen = ({ navigation }: any) => {

  const dispatch: AppDispatch = useDispatch();

  const [activeRole, setActiveRole] =
    useState<"citizen" | "responder">("citizen");

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleRegister = async () => {

    if (!formData.name || !formData.phone || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");

    setLoading(true);

    try {

      const result: any = await dispatch(

        registerUser({
          name: formData.name,
          phone: cleanPhone,
          email: formData.email,
          password: formData.password,
        })

      );

      setLoading(false);

      Alert.alert("Success", "Register Successfully");

      navigation.replace("Home");

    } catch (error: any) {

      setLoading(false);

      Alert.alert(
        "Register Failed",
        error?.response?.data?.details || error?.response?.data?.message ||
        "Registration failed. Please try again."
      );

      console.log("REGISTER ERROR:", error?.response?.data);

    }

  };

  return (

    <SafeAreaView style={styles.safeArea}>

      <StatusBar barStyle="light-content" backgroundColor="#132030" />

      <View style={styles.header}>

        <View style={styles.headerLeft}>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color="#ffb3ac" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            RakshaNow
          </Text>

        </View>

        <Text style={styles.stepText}>
          Step 1 of 2
        </Text>

      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.card}>

          <Text style={styles.title}>
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Join the network and stay protected.
          </Text>

          <View style={styles.roleContainer}>

            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => setActiveRole("citizen")}
            >
              {
                activeRole === "citizen"
                  ?
                  <LinearGradient
                    colors={["#ffb3ac", "#d32f2f"]}
                    style={styles.activeRoleGradient}
                  >
                    <Text style={styles.activeRoleText}>
                      CITIZEN
                    </Text>
                  </LinearGradient>
                  :
                  <Text style={styles.inactiveRoleText}>
                    CITIZEN
                  </Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => setActiveRole("responder")}
            >
              {
                activeRole === "responder"
                  ?
                  <LinearGradient
                    colors={["#ffb3ac", "#d32f2f"]}
                    style={styles.activeRoleGradient}
                  >
                    <Text style={styles.activeRoleText}>
                      RESPONDER
                    </Text>
                  </LinearGradient>
                  :
                  <Text style={styles.inactiveRoleText}>
                    RESPONDER
                  </Text>
              }
            </TouchableOpacity>

          </View>

          {/* inputs */}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>FULL NAME</Text>
            <View style={styles.inputWrapper}>
              <Icon name="person" size={20} color="#64748b" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter name"
                placeholderTextColor="#475569"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PHONE NUMBER</Text>
            <View style={styles.inputWrapper}>
              <Icon name="call" size={20} color="#64748b" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter phone number"
                placeholderTextColor="#475569"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData({ ...formData, phone: text })
                }
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL</Text>
            <View style={styles.inputWrapper}>
              <Icon name="mail" size={20} color="#64748b" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter email"
                placeholderTextColor="#475569"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <View style={styles.inputWrapper}>
              <Icon name="lock" size={20} color="#64748b" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter password"
                placeholderTextColor="#475569"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
            <View style={styles.inputWrapper}>
              <Icon name="verified-user" size={20} color="#64748b" />
              <TextInput
                style={styles.textInput}
                placeholder="Confirm password"
                placeholderTextColor="#475569"
                secureTextEntry
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData({ ...formData, confirmPassword: text })
                }
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButtonContainer}
            onPress={handleRegister}
            disabled={loading}
          >
            <LinearGradient
              colors={["#ffb3ac", "#d32f2f"]}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>
                {loading ? "PLEASE WAIT..." : "REGISTER"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginLink}>
                Login
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea:{ flex:1, backgroundColor:"#061423" },
  header:{
    height: Platform.OS==="android"?52+(StatusBar.currentHeight||0):52,
    paddingTop: Platform.OS==="android"?StatusBar.currentHeight:0,
    backgroundColor:"#132030",
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    paddingHorizontal:16
  },
  headerLeft:{ flexDirection:"row", alignItems:"center" },
  backButton:{ padding:8 },
  headerTitle:{ color:"#ffb3ac", fontSize:20, fontWeight:"800" },
  stepText:{ color:"#94a3b8" },
  scrollContainer:{ flexGrow:1, alignItems:"center", padding:20 },
  card:{ width:"100%", backgroundColor:"#132030", borderRadius:20, padding:20 },
  title:{ fontSize:24, color:"#fff", fontWeight:"700" },
  subtitle:{ color:"#94a3b8", marginBottom:20 },
  roleContainer:{ flexDirection:"row", backgroundColor:"#020f1e", borderRadius:30, padding:6, marginBottom:25 },
  roleButton:{ flex:1, height:40, borderRadius:20, overflow:"hidden" },
  activeRoleGradient:{ flex:1, justifyContent:"center", alignItems:"center" },
  activeRoleText:{ color:"#fff", fontWeight:"700" },
  inactiveRoleText:{ flex:1, textAlign:"center", textAlignVertical:"center", color:"#94a3b8" },
  inputGroup:{ marginBottom:15 },
  inputLabel:{ fontSize:10, color:"#64748b", marginBottom:5 },
  inputWrapper:{ flexDirection:"row", alignItems:"center", backgroundColor:"#020f1e", borderRadius:10, paddingHorizontal:10, height:50 },
  textInput:{ flex:1, color:"#fff", marginLeft:10 },
  submitButtonContainer:{ marginTop:10 },
  submitButton:{ height:50, borderRadius:10, justifyContent:"center", alignItems:"center" },
  submitButtonText:{ color:"#fff", fontWeight:"700" },
  footer:{ flexDirection:"row", justifyContent:"center", marginTop:20 },
  footerText:{ color:"#94a3b8" },
  loginLink:{ color:"#ffb3ac", marginLeft:5, fontWeight:"700" }
});

export default RegisterScreen;



