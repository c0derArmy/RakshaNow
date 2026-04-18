// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   ScrollView,
//   Image,
//   Platform,
//   Alert
// } from "react-native";

// import { SafeAreaView } from "react-native-safe-area-context";

// import Icon from "react-native-vector-icons/MaterialIcons";

// import { useDispatch } from "react-redux";

// import type { AppDispatch } from "../store";

// import { logoutUser } from "../store/slices/userSlice";

// const STATUSBAR_HEIGHT =
//   Platform.OS === "android"
//     ? StatusBar.currentHeight || 0
//     : 0;



// const ProfileScreen = ({ navigation }: any) => {

//   const dispatch: AppDispatch = useDispatch();



//   const handleLogout = () => {

//     Alert.alert(

//       "Confirm Logout",

//       "Are you sure you want to logout?",

//       [

//         {
//           text: "Cancel",
//           style: "cancel"
//         },

//         {

//           text: "Logout",

//           onPress: async () => {

//             try {

//               await dispatch(logoutUser());

//             } catch (e) {

//               console.log("Logout API error");

//             }



//             navigation.reset({

//               index: 0,

//               routes: [

//                 { name: "Login" }

//               ]

//             });

//           }

//         }

//       ]

//     );

//   };



//   return (

//     <SafeAreaView style={styles.safeArea}>



//       <StatusBar

//         barStyle="light-content"

//         backgroundColor="#132030"

//         translucent={true}

//       />



//       <ScrollView

//         contentContainerStyle={styles.scrollContainer}

//         showsVerticalScrollIndicator={false}

//       >



//         {/* user info */}

//         <View style={styles.profileHeader}>



//           <View style={styles.avatarContainer}>



//             <Image

//               source={{

//                 uri:

//                   "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"

//               }}

//               style={styles.avatarImage}

//             />



//             <View style={styles.editBadge}>

//               <Icon

//                 name="edit"

//                 size={14}

//                 color="#061423"

//               />

//             </View>



//           </View>



//           <Text style={styles.userName}>

//             User Name

//           </Text>



//           <Text style={styles.userPhone}>

//             +91 XXXXX XXXXX

//           </Text>



//           <View style={styles.statusBadge}>



//             <Icon

//               name="verified-user"

//               size={14}

//               color="#76daa3"

//             />



//             <Text style={styles.statusText}>

//               VERIFIED USER

//             </Text>



//           </View>

//         </View>



//         {/* menu */}

//         <View style={styles.menuSection}>



//           <Text style={styles.sectionTitle}>

//             ACCOUNT SETTINGS

//           </Text>



//           <TouchableOpacity

//             style={styles.menuItem}

//             onPress={() =>

//               navigation.navigate("Emergency Contacts")

//             }

//           >



//             <View style={styles.menuIconWrapper}>



//               <Icon

//                 name="contact-phone"

//                 size={20}

//                 color="#ffb3ac"

//               />



//             </View>



//             <View style={styles.menuTextContainer}>



//               <Text style={styles.menuTitle}>

//                 Emergency Contacts

//               </Text>



//               <Text style={styles.menuSubtitle}>

//                 Manage trusted numbers

//               </Text>



//             </View>



//             <Icon

//               name="chevron-right"

//               size={24}

//               color="#64748b"

//             />



//           </TouchableOpacity>



//           <TouchableOpacity

//             style={styles.menuItem}

//             onPress={() =>

//               navigation.navigate("MedicalID")

//             }

//           >



//             <View style={styles.menuIconWrapper}>



//               <Icon

//                 name="medical-information"

//                 size={20}

//                 color="#76daa3"

//               />



//             </View>



//             <View style={styles.menuTextContainer}>



//               <Text style={styles.menuTitle}>

//                 Medical ID

//               </Text>



//               <Text style={styles.menuSubtitle}>

//                 Blood group, allergies

//               </Text>



//             </View>



//             <Icon

//               name="chevron-right"

//               size={24}

//               color="#64748b"

//             />



//           </TouchableOpacity>



//           <TouchableOpacity

//             style={styles.menuItem}

//             onPress={() =>

//               navigation.navigate("Incident History")

//             }

//           >



//             <View style={styles.menuIconWrapper}>



//               <Icon

//                 name="history"

//                 size={20}

//                 color="#94a3b8"

//               />



//             </View>



//             <View style={styles.menuTextContainer}>



//               <Text style={styles.menuTitle}>

//                 Incident History

//               </Text>



//               <Text style={styles.menuSubtitle}>

//                 View past reports

//               </Text>



//             </View>



//             <Icon

//               name="chevron-right"

//               size={24}

//               color="#64748b"

//             />



//           </TouchableOpacity>



//         </View>



//         {/* logout button */}



//         <TouchableOpacity

//           style={styles.logoutContainer}

//           onPress={handleLogout}

//         >



//           <View style={styles.logoutButton}>



//             <Icon

//               name="logout"

//               size={20}

//               color="#ffb3ac"

//             />



//             <Text style={styles.logoutText}>

//               SECURE LOGOUT

//             </Text>



//           </View>



//         </TouchableOpacity>



//       </ScrollView>



//       {/* bottom nav */}



//       <View style={styles.bottomNav}>



//         <TouchableOpacity

//           style={styles.navItem}

//           onPress={() => navigation.navigate("Home")}

//         >



//           <Icon

//             name="home"

//             size={24}

//             color="#64748b"

//           />



//           <Text style={styles.navText}>

//             HOME

//           </Text>



//         </TouchableOpacity>



//         <TouchableOpacity

//           style={styles.navItem}

//           onPress={() => navigation.navigate("MyReports")}

//         >



//           <Icon

//             name="assignment"

//             size={24}

//             color="#64748b"

//           />



//           <Text style={styles.navText}>

//             REPORTS

//           </Text>



//         </TouchableOpacity>



//         <TouchableOpacity

//           style={styles.navItem}

//           onPress={() => navigation.navigate("Alerts")}

//         >



//           <Icon

//             name="notifications"

//             size={24}

//             color="#64748b"

//           />



//           <Text style={styles.navText}>

//             ALERTS

//           </Text>



//         </TouchableOpacity>



//         <TouchableOpacity

//           style={[

//             styles.navItem,

//             styles.navItemActive

//           ]}

//         >



//           <Icon

//             name="account-circle"

//             size={24}

//             color="#ffb3ac"

//           />



//           <Text

//             style={[

//               styles.navText,

//               styles.navTextActive

//             ]}

//           >

//             PROFILE

//           </Text>



//         </TouchableOpacity>



//       </View>



//     </SafeAreaView>

//   );

// };



// const styles = StyleSheet.create({

// safeArea:{
// flex:1,
// backgroundColor:"#061423"
// },

// scrollContainer:{
// paddingHorizontal:20,
// paddingTop:24,
// paddingBottom:120
// },

// profileHeader:{
// alignItems:"center",
// marginBottom:32
// },

// avatarContainer:{
// position:"relative",
// marginBottom:16
// },

// avatarImage:{
// width:100,
// height:100,
// borderRadius:50,
// borderWidth:3,
// borderColor:"#1e2b3b"
// },

// editBadge:{
// position:"absolute",
// bottom:0,
// right:0,
// backgroundColor:"#ffb3ac",
// width:32,
// height:32,
// borderRadius:16,
// alignItems:"center",
// justifyContent:"center",
// borderWidth:3,
// borderColor:"#061423"
// },

// userName:{
// fontSize:24,
// fontWeight:"800",
// color:"#d6e4f9",
// marginBottom:4
// },

// userPhone:{
// fontSize:14,
// color:"#94a3b8",
// marginBottom:12
// },

// statusBadge:{
// flexDirection:"row",
// alignItems:"center",
// backgroundColor:"rgba(3,128,81,0.1)",
// paddingHorizontal:12,
// paddingVertical:6,
// borderRadius:16,
// gap:6
// },

// statusText:{
// fontSize:10,
// fontWeight:"800",
// color:"#76daa3"
// },

// menuSection:{
// marginBottom:32
// },

// sectionTitle:{
// fontSize:12,
// fontWeight:"800",
// color:"#64748b",
// marginBottom:16
// },

// menuItem:{
// flexDirection:"row",
// alignItems:"center",
// backgroundColor:"#132030",
// padding:16,
// borderRadius:16,
// marginBottom:12
// },

// menuIconWrapper:{
// width:40,
// height:40,
// borderRadius:12,
// backgroundColor:"#1e2b3b",
// alignItems:"center",
// justifyContent:"center",
// marginRight:16
// },

// menuTextContainer:{
// flex:1
// },

// menuTitle:{
// fontSize:16,
// fontWeight:"700",
// color:"#d6e4f9"
// },

// menuSubtitle:{
// fontSize:12,
// color:"#94a3b8"
// },

// logoutContainer:{
// marginTop:16
// },

// logoutButton:{
// flexDirection:"row",
// alignItems:"center",
// justifyContent:"center",
// padding:16,
// borderRadius:16,
// borderWidth:1,
// borderColor:"rgba(211,47,47,0.4)",
// backgroundColor:"rgba(211,47,47,0.05)",
// gap:8
// },

// logoutText:{
// color:"#ffb3ac",
// fontSize:14,
// fontWeight:"800"
// },

// bottomNav:{
// position:"absolute",
// bottom:0,
// left:0,
// right:0,
// height:70,
// backgroundColor:"#132030",
// flexDirection:"row",
// justifyContent:"space-around",
// alignItems:"center"
// },

// navItem:{
// alignItems:"center"
// },

// navItemActive:{
// backgroundColor:"#1e2b3b",
// padding:8,
// borderRadius:12
// },

// navText:{
// fontSize:10,
// fontWeight:"800",
// marginTop:4,
// color:"#64748b"
// },

// navTextActive:{
// color:"#ffb3ac"
// }

// });

// export default ProfileScreen;




import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  Platform,
  Alert
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

const STATUSBAR_HEIGHT =
  Platform.OS === "android"
    ? StatusBar.currentHeight || 0
    : 0;

const ProfileScreen = ({ navigation }: any) => {

  // ✅ Backend hata diya — simple logout
  const handleLogout = () => {

    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => {

            // 👉 Direct navigation reset (NO API / Redux)
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }]
            });

          }
        }
      ]
    );

  };

  return (

    <SafeAreaView style={styles.safeArea}>

      <StatusBar
        barStyle="light-content"
        backgroundColor="#132030"
        translucent={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        {/* user info */}
        <View style={styles.profileHeader}>

          <View style={styles.avatarContainer}>

            <Image
              source={{
                uri:
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
              }}
              style={styles.avatarImage}
            />

            <View style={styles.editBadge}>
              <Icon
                name="edit"
                size={14}
                color="#061423"
              />
            </View>

          </View>

          <Text style={styles.userName}>
            User Name
          </Text>

          <Text style={styles.userPhone}>
            +91 XXXXX XXXXX
          </Text>

          <View style={styles.statusBadge}>

            <Icon
              name="verified-user"
              size={14}
              color="#76daa3"
            />

            <Text style={styles.statusText}>
              VERIFIED USER
            </Text>

          </View>

        </View>

        {/* menu */}
        <View style={styles.menuSection}>

          <Text style={styles.sectionTitle}>
            ACCOUNT SETTINGS
          </Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigation.navigate("Emergency Contacts")
            }
          >

            <View style={styles.menuIconWrapper}>
              <Icon
                name="contact-phone"
                size={20}
                color="#ffb3ac"
              />
            </View>

            <View style={styles.menuTextContainer}>

              <Text style={styles.menuTitle}>
                Emergency Contacts
              </Text>

              <Text style={styles.menuSubtitle}>
                Manage trusted numbers
              </Text>

            </View>

            <Icon
              name="chevron-right"
              size={24}
              color="#64748b"
            />

          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigation.navigate("MedicalID")
            }
          >

            <View style={styles.menuIconWrapper}>
              <Icon
                name="medical-information"
                size={20}
                color="#76daa3"
              />
            </View>

            <View style={styles.menuTextContainer}>

              <Text style={styles.menuTitle}>
                Medical ID
              </Text>

              <Text style={styles.menuSubtitle}>
                Blood group, allergies
              </Text>

            </View>

            <Icon
              name="chevron-right"
              size={24}
              color="#64748b"
            />

          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigation.navigate("Incident History")
            }
          >

            <View style={styles.menuIconWrapper}>
              <Icon
                name="history"
                size={20}
                color="#94a3b8"
              />
            </View>

            <View style={styles.menuTextContainer}>

              <Text style={styles.menuTitle}>
                Incident History
              </Text>

              <Text style={styles.menuSubtitle}>
                View past reports
              </Text>

            </View>

            <Icon
              name="chevron-right"
              size={24}
              color="#64748b"
            />

          </TouchableOpacity>

        </View>

        {/* logout button */}
        <TouchableOpacity
          style={styles.logoutContainer}
          onPress={handleLogout}
        >

          <View style={styles.logoutButton}>

            <Icon
              name="logout"
              size={20}
              color="#ffb3ac"
            />

            <Text style={styles.logoutText}>
              SECURE LOGOUT
            </Text>

          </View>

        </TouchableOpacity>

      </ScrollView>

      {/* bottom nav */}
      <View style={styles.bottomNav}>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Icon name="home" size={24} color="#64748b" />
          <Text style={styles.navText}>HOME</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("MyReports")}
        >
          <Icon name="assignment" size={24} color="#64748b" />
          <Text style={styles.navText}>REPORTS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Alerts")}
        >
          <Icon name="notifications" size={24} color="#64748b" />
          <Text style={styles.navText}>ALERTS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, styles.navItemActive]}
        >
          <Icon name="account-circle" size={24} color="#ffb3ac" />
          <Text style={[styles.navText, styles.navTextActive]}>
            PROFILE
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea:{ flex:1, backgroundColor:"#061423" },
  scrollContainer:{ paddingHorizontal:20, paddingTop:24, paddingBottom:40 },
  profileHeader:{ alignItems:"center", marginBottom:32 },
  avatarContainer:{ position:"relative", marginBottom:16 },
  avatarImage:{ width:100, height:100, borderRadius:50, borderWidth:3, borderColor:"#1e2b3b" },
  editBadge:{ position:"absolute", bottom:0, right:0, backgroundColor:"#ffb3ac", width:32, height:32, borderRadius:16, alignItems:"center", justifyContent:"center", borderWidth:3, borderColor:"#061423" },
  userName:{ fontSize:24, fontWeight:"800", color:"#d6e4f9", marginBottom:4 },
  userPhone:{ fontSize:14, color:"#94a3b8", marginBottom:12 },
  statusBadge:{ flexDirection:"row", alignItems:"center", backgroundColor:"rgba(3,128,81,0.1)", paddingHorizontal:12, paddingVertical:6, borderRadius:16, gap:6 },
  statusText:{ fontSize:10, fontWeight:"800", color:"#76daa3" },
  menuSection:{ marginBottom:32 },
  sectionTitle:{ fontSize:12, fontWeight:"800", color:"#64748b", marginBottom:16 },
  menuItem:{ flexDirection:"row", alignItems:"center", backgroundColor:"#132030", padding:16, borderRadius:16, marginBottom:12 },
  menuIconWrapper:{ width:40, height:40, borderRadius:12, backgroundColor:"#1e2b3b", alignItems:"center", justifyContent:"center", marginRight:16 },
  menuTextContainer:{ flex:1 },
  menuTitle:{ fontSize:16, fontWeight:"700", color:"#d6e4f9" },
  menuSubtitle:{ fontSize:12, color:"#94a3b8" },
  logoutContainer:{ marginTop:16 },
  logoutButton:{ flexDirection:"row", alignItems:"center", justifyContent:"center", padding:16, borderRadius:16, borderWidth:1, borderColor:"rgba(211,47,47,0.4)", backgroundColor:"rgba(211,47,47,0.05)", gap:8 },
  logoutText:{ color:"#ffb3ac", fontSize:14, fontWeight:"800" },
  bottomNav:{ position:"absolute", bottom:0, left:0, right:0, height:70, backgroundColor:"#132030", flexDirection:"row", justifyContent:"space-around", alignItems:"center" },
  navItem:{ alignItems:"center" },
  navItemActive:{ backgroundColor:"#1e2b3b", padding:8, borderRadius:12 },
  navText:{ fontSize:10, fontWeight:"800", marginTop:4, color:"#64748b" },
  navTextActive:{ color:"#ffb3ac" }
});

export default ProfileScreen;