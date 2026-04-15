import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const CONTACTS = [
  { id: '1', name: 'Priya Sharma', relation: 'Sister', phone: '+91 98765 11111' },
  { id: '2', name: 'Anil Kumar', relation: 'Father', phone: '+91 98765 22222' },
];

const EmergencyContactsScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#132030" translucent={true} />
      {/* <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Icon name="arrow-back" size={24} color="#ffb3ac" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emergency Contacts</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="add" size={28} color="#ffb3ac" />
        </TouchableOpacity>
      </View> */}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.infoText}>These contacts will be automatically notified when you trigger an SOS.</Text>
        
        {CONTACTS.map((contact) => (
          <View key={contact.id} style={styles.contactCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{contact.name.charAt(0)}</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactRelation}>{contact.relation} • {contact.phone}</Text>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Icon name="phone" size={20} color="#76daa3" />
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
  scrollContainer: { padding: 20 },
  infoText: { fontSize: 13, color: '#94a3b8', marginBottom: 24, lineHeight: 20 },
  contactCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A2744', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1e2b3b', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { fontSize: 20, fontWeight: '800', color: '#ffb3ac' },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: '700', color: '#d6e4f9', marginBottom: 4 },
  contactRelation: { fontSize: 12, color: '#94a3b8' },
  callButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(118, 218, 163, 0.1)', alignItems: 'center', justifyContent: 'center' },
});

export default EmergencyContactsScreen;