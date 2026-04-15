import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, StatusBar, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { setMedicalID } from '../../store/slices/medicalIdSlice';
import { RootState } from '../../store';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const MedicalIDScreen = () => {
  const dispatch = useDispatch();
  const medicalID = useSelector((state: RootState) => state.medicalID);

  const [bloodType, setBloodType] = useState(medicalID.bloodType);
  const [allergies, setAllergies] = useState(medicalID.allergies.join(', '));
  const [medications, setMedications] = useState(medicalID.medications.join(', '));

  const handleSave = () => {
    const updatedMedicalID = {
      ...medicalID,
      bloodType,
      allergies: allergies.split(',').map((a: string): string => a.trim()),
      medications: medications.split(',').map((m: string): string => m.trim()),
    };

    dispatch(setMedicalID(updatedMedicalID));
    Alert.alert('Success', 'Medical ID updated successfully!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#132030" translucent={true} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="edit" size={24} color="#ffb3ac" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.bloodGroupCard}>
          <Icon name="bloodtype" size={40} color="#d32f2f" />
          <View style={styles.bloodGroupInfo}>
            <Text style={styles.label}>BLOOD GROUP</Text>
            <Text style={styles.valueLarge}>O Positive (O+)</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>ALLERGIES</Text>
            <Text style={styles.detailValue}>Penicillin, Peanuts</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>MEDICATIONS</Text>
            <Text style={styles.detailValue}>Inhaler (Albuterol) as needed</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>MEDICAL CONDITIONS</Text>
            <Text style={styles.detailValue}>Mild Asthma</Text>
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Blood Type</Text>
          <TextInput
            style={styles.input}
            value={bloodType}
            onChangeText={setBloodType}
            placeholder="Enter blood type"
          />

          <Text style={styles.label}>Allergies</Text>
          <TextInput
            style={styles.input}
            value={allergies}
            onChangeText={setAllergies}
            placeholder="Enter allergies (comma-separated)"
          />

          <Text style={styles.label}>Medications</Text>
          <TextInput
            style={styles.input}
            value={medications}
            onChangeText={setMedications}
            placeholder="Enter medications (comma-separated)"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#061423' },
  header: { height: 52 + STATUSBAR_HEIGHT, paddingTop: STATUSBAR_HEIGHT, backgroundColor: '#132030', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  iconButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#ffb3ac' },
  scrollContainer: { padding: 20 },
  bloodGroupCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A2744', padding: 24, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(211, 47, 47, 0.2)' },
  bloodGroupInfo: { marginLeft: 16 },
  label: { fontSize: 10, fontWeight: '800', color: '#94a3b8', letterSpacing: 1.5, marginBottom: 4 },
  valueLarge: { fontSize: 24, fontWeight: '800', color: '#d6e4f9' },
  detailsCard: { backgroundColor: '#1A2744', borderRadius: 16, padding: 20 },
  detailRow: { paddingVertical: 8 },
  detailLabel: { fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: 1.5, marginBottom: 8 },
  detailValue: { fontSize: 16, fontWeight: '600', color: '#e4beba' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 8 },
  inputSection: { padding: 20 },
  input: { height: 40, borderWidth: 1, borderColor: 'rgba(211, 47, 47, 0.2)', borderRadius: 8 },
  saveButton: { padding: 10, backgroundColor: '#d32f2f', borderRadius: 8 },
  saveButtonText: { fontSize: 16, fontWeight: '800', color: '#ffffff' },
});

export default MedicalIDScreen;