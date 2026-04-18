import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Platform, TextInput, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchMedicalID, updateMedicalID } from '../../store/slices/medicalIdSlice';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const EmergencyContactsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const medicalID = useSelector((state: RootState) => state.medicalId.medicalID);
  const contacts = medicalID?.emergencyContacts || [];

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user?.id || user?._id) {
      dispatch(fetchMedicalID(user.id || user._id));
    }
  }, [dispatch, user]);

  const handleUpdate = async (updatedContacts: any[]) => {
    if (!user) return;
    setBusy(true);
    try {
      const payload = {
        ...medicalID,
        userId: user.id || user._id,
        emergencyContacts: updatedContacts
      };
      await dispatch(updateMedicalID(payload, dispatch));
      setIsAdding(false);
      setNewName('');
      setNewPhone('');
    } catch (error) {
      Alert.alert('Error', 'Failed to update contacts');
    } finally {
      setBusy(false);
    }
  };

  const handleAdd = () => {
    if (!newName || !newPhone) {
      Alert.alert('Error', 'Please enter both name and phone');
      return;
    }
    const updated = [...contacts, { name: newName, phone: newPhone }];
    handleUpdate(updated);
  };

  const handleDelete = (index: number) => {
    Alert.alert('Confirm', 'Are you sure you want to remove this contact?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: () => {
          const updated = contacts.filter((_, i) => i !== index);
          handleUpdate(updated);
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#132030" translucent={true} />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Icon name="arrow-back" size={24} color="#ffb3ac" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emergency Contacts</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => setIsAdding(!isAdding)}>
          <Icon name={isAdding ? "close" : "person-add"} size={24} color="#ffb3ac" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {isAdding && (
          <View style={styles.addSection}>
            <Text style={styles.addTitle}>Add New Contact</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#475569"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#475569"
              keyboardType="phone-pad"
              value={newPhone}
              onChangeText={setNewPhone}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAdd} disabled={busy}>
              {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.addButtonText}>ADD CONTACT</Text>}
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.infoText}>These contacts will be automatically notified when you trigger an SOS.</Text>
        
        {contacts.length === 0 && !isAdding ? (
          <View style={{ alignItems: 'center', marginTop: 32 }}>
            <Icon name="contact-phone" size={48} color="#1e2b3b" />
            <Text style={{ color: '#64748b', marginTop: 12, fontSize: 14 }}>No emergency contacts added yet.</Text>
            <Text style={{ color: '#94a3b8', marginTop: 4, fontSize: 12 }}>Click the + icon to add one.</Text>
          </View>
        ) : null}

        {contacts.map((contact: any, index: number) => (
          <View key={index.toString()} style={styles.contactCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{contact.name?.charAt(0) || '?'}</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactText}>{contact.phone}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(index)}>
              <Icon name="delete-outline" size={22} color="#ffb3ac" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#061423' },
  header: { height: 52 + STATUSBAR_HEIGHT, paddingTop: STATUSBAR_HEIGHT, backgroundColor: '#132030', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#ffb3ac' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  infoText: { fontSize: 13, color: '#94a3b8', marginBottom: 24, lineHeight: 20 },
  addSection: { backgroundColor: '#132030', padding: 20, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  addTitle: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 16 },
  input: { backgroundColor: '#1A2744', borderRadius: 10, padding: 12, color: '#fff', marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  addButton: { height: 48, backgroundColor: '#76daa3', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { fontSize: 13, fontWeight: '800', color: '#061423', letterSpacing: 1 },
  contactCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A2744', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1e2b3b', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#ffb3ac' },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: '700', color: '#d6e4f9', marginBottom: 2 },
  contactText: { fontSize: 12, color: '#94a3b8' },
  deleteButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});

export default EmergencyContactsScreen;