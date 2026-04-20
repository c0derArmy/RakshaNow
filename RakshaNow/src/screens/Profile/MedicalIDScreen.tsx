import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, StatusBar, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchMedicalID, updateMedicalID } from '../../store/slices/medicalIdSlice';
import { RootState, AppDispatch } from '../../store';
import { useTheme } from '../../utils/theme';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const MedicalIDScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme, isDark } = useTheme();
  const medicalIDState = useSelector((state: RootState) => state.medicalId);
  const user = useSelector((state: RootState) => state.user.user);
  const medicalID = medicalIDState.medicalID;

  const [isEditing, setIsEditing] = useState(false);
  const [bloodType, setBloodType] = useState(medicalID?.bloodGroup || '');
  const [allergies, setAllergies] = useState(medicalID?.allergies?.join(', ') || '');
  const [medications, setMedications] = useState(medicalID?.medications?.join(', ') || '');

  // Fetch from server on mount
  useEffect(() => {
    if (user?.id || user?._id) {
      dispatch(fetchMedicalID(user.id || user._id));
    }
  }, [dispatch, user]);

  // Sync state when redux updates
  useEffect(() => {
    if (medicalID) {
      setBloodType(medicalID.bloodGroup || '');
      setAllergies(medicalID.allergies?.join(', ') || '');
      setMedications(medicalID.medications?.join(', ') || '');
    }
  }, [medicalID]);

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'User ID not found');
      return;
    }

    const updatedMedicalID = {
      userId: user.id || user._id,
      bloodGroup: bloodType,
      allergies: allergies.split(',').map((a: string): string => a.trim()).filter(Boolean),
      medications: medications.split(',').map((m: string): string => m.trim()).filter(Boolean),
    };

    try {
      await dispatch(updateMedicalID(updatedMedicalID, dispatch));
      setIsEditing(false);
      Alert.alert('Success', 'Medical ID updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update Medical ID');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#132030" translucent={true} />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Icon name="arrow-back" size={24} color="#ffb3ac" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Medical ID</Text>
        </View>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => setIsEditing(!isEditing)}
        >
          <Icon name={isEditing ? "close" : "edit"} size={24} color="#ffb3ac" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {!isEditing ? (
          <>
            <View style={styles.bloodGroupCard}>
              <Icon name="bloodtype" size={40} color="#d32f2f" />
              <View style={styles.bloodGroupInfo}>
                <Text style={styles.label}>BLOOD GROUP</Text>
                <Text style={styles.valueLarge}>{medicalID?.bloodGroup || 'Unknown'}</Text>
              </View>
            </View>

            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ALLERGIES</Text>
                <Text style={styles.detailValue}>{medicalID?.allergies?.join(', ') || 'None reported'}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>MEDICATIONS</Text>
                <Text style={styles.detailValue}>{medicalID?.medications?.join(', ') || 'None reported'}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>MEDICAL CONDITIONS</Text>
                <Text style={styles.detailValue}>None reported</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.inputSection}>
            <Text style={styles.editTitle}>Update Profile</Text>
            
            <Text style={styles.label}>BLOOD TYPE</Text>
            <TextInput
              style={styles.input}
              value={bloodType}
              onChangeText={setBloodType}
              placeholder="e.g. O+ Positive"
              placeholderTextColor="#475569"
            />

            <Text style={styles.label}>ALLERGIES (COMMA SEPARATED)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={allergies}
              onChangeText={setAllergies}
              placeholder="e.g. Peanuts, Penicillin"
              placeholderTextColor="#475569"
              multiline
            />

            <Text style={styles.label}>MEDICATIONS (COMMA SEPARATED)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={medications}
              onChangeText={setMedications}
              placeholder="e.g. Advil, Aspirin"
              placeholderTextColor="#475569"
              multiline
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>SAVE UPDATES</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { height: 52 + STATUSBAR_HEIGHT, paddingTop: STATUSBAR_HEIGHT, backgroundColor: '#132030', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#ffb3ac' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  bloodGroupCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A2744', padding: 24, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(211, 47, 47, 0.2)' },
  bloodGroupInfo: { marginLeft: 16 },
  label: { fontSize: 10, fontWeight: '800', color: '#94a3b8', letterSpacing: 1.5, marginBottom: 8 },
  valueLarge: { fontSize: 24, fontWeight: '800', color: '#d6e4f9' },
  detailsCard: { backgroundColor: '#1A2744', borderRadius: 16, padding: 20 },
  detailRow: { paddingVertical: 8 },
  detailLabel: { fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: 1.5, marginBottom: 8 },
  detailValue: { fontSize: 16, fontWeight: '600', color: '#e4beba' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 8 },
  inputSection: { backgroundColor: '#132030', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  editTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 24 },
  input: { backgroundColor: '#1A2744', borderRadius: 12, padding: 16, color: '#fff', fontSize: 15, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  textArea: { height: 80, textAlignVertical: 'top' },
  saveButton: { height: 54, backgroundColor: '#d32f2f', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 10, shadowColor: '#d32f2f', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  saveButtonText: { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: 1.5 },
});

export default MedicalIDScreen;



