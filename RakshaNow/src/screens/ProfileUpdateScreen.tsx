import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { updateProfile } from "../store/slices/userSlice";
import { useTheme } from "../utils/theme";

const STATUSBAR_HEIGHT =
  Platform.OS === "android"
    ? StatusBar.currentHeight || 0
    : 0;

const ProfileUpdateScreen = ({ navigation }: any) => {
  const { theme, isDark } = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    if (!formData.phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    setLoading(true);

    try {
      const result: any = await dispatch(updateProfile({
        name: formData.name.trim(),
        phone: cleanPhone,
        email: formData.email.trim().toLowerCase(),
      }));

      console.log("Profile update result:", result);
      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error: any) {
      console.error("Profile update error:", error);
      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        "Failed to update profile. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#132030"
        translucent={true}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <Icon name="arrow-back" size={24} color="#ffb3ac" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Profile</Text>
        <View style={styles.iconButton} />
      </View>

      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Edit Profile</Text>
          <Text style={styles.subtitle}>Update your information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>FULL NAME</Text>
            <View style={styles.inputWrapper}>
              <Icon name="person" size={20} color="#64748b" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter name"
                placeholderTextColor="#475569"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
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
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
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
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButtonContainer}
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.submitButton}>
                <ActivityIndicator color="#fff" />
              </View>
            ) : (
              <LinearGradient colors={["#ffb3ac", "#d32f2f"]} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>UPDATE</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#132030",
  },
  header: {
    height: 56 + STATUSBAR_HEIGHT,
    paddingTop: STATUSBAR_HEIGHT,
    backgroundColor: "#132030",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  iconButton: {
    padding: 8,
    width: 48,
  },
  headerTitle: {
    color: "#ffb3ac",
    fontSize: 20,
    fontWeight: "800",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#132030",
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 6,
    fontWeight: "700",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#020f1e",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  textInput: {
    flex: 1,
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
  },
  submitButtonContainer: {
    marginTop: 10,
  },
  submitButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default ProfileUpdateScreen;