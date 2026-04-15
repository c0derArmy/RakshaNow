import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

// Mock Government Alerts Data
const ALERTS_DATA = [
  {
    id: '1',
    agency: 'IMD India',
    title: 'Severe Rainfall Warning',
    desc: 'Red alert issued for coastal regions. Expect heavy to very heavy rainfall over the next 48 hours. Avoid waterlogged areas.',
    time: '2 HOURS AGO',
    type: 'SEVERE',
    icon: 'thunderstorm',
    color: '#d32f2f',
  },
  {
    id: '2',
    agency: 'NDMA',
    title: 'Earthquake Advisory',
    desc: 'Mild tremors felt in the northern belt. No tsunami threat. Check your structural surroundings and keep emergency kits ready.',
    time: '5 HOURS AGO',
    type: 'WARNING',
    icon: 'vibration',
    color: '#ffb3ac',
  },
  {
    id: '3',
    agency: 'Traffic Police',
    title: 'Highway Closure',
    desc: 'National Highway 44 blocked due to landslide clearance. Commuters are advised to take the alternate route via State Highway 12.',
    time: '1 DAY AGO',
    type: 'INFO',
    icon: 'traffic',
    color: '#76daa3',
  },
];

const AlertsScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#132030" translucent={true} />
      
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Govt. Alerts</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Icon name="done-all" size={24} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Render Alerts */}
        {ALERTS_DATA.map((alert) => (
          <View key={alert.id} style={styles.alertCard}>
            <View style={styles.cardHeader}>
              <View style={styles.agencyRow}>
                <Icon name="verified" size={16} color="#76daa3" />
                <Text style={styles.agencyText}>{alert.agency}</Text>
              </View>
              <Text style={styles.timeText}>{alert.time}</Text>
            </View>

            <View style={styles.cardBody}>
              <View style={[styles.iconContainer, { backgroundColor: `${alert.color}15` }]}>
                <Icon name={alert.icon} size={28} color={alert.color} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertDesc} numberOfLines={3}>{alert.desc}</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.endOfList}>
          <Text style={styles.endOfListText}>NO MORE ACTIVE ALERTS</Text>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={24} color="#64748b" />
          <Text style={styles.navText}>HOME</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MyReports')}>
          <Icon name="assignment" size={24} color="#64748b" />
          <Text style={styles.navText}>REPORTS</Text>
        </TouchableOpacity>

        {/* Active Tab */}
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Icon name="notifications" size={24} color="#ffb3ac" />
          <Text style={[styles.navText, styles.navTextActive]}>ALERTS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Icon name="account-circle" size={24} color="#64748b" />
          <Text style={styles.navText}>PROFILE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#061423' },
  header: { height: 52 + STATUSBAR_HEIGHT, paddingTop: STATUSBAR_HEIGHT, backgroundColor: '#132030', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, zIndex: 50 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#ffb3ac', letterSpacing: -0.5 },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 120 },
  alertCard: { backgroundColor: '#1A2744', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' },
  agencyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  agencyText: { fontSize: 12, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 },
  timeText: { fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: 1 },
  cardBody: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  iconContainer: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  textContainer: { flex: 1 },
  alertTitle: { fontSize: 16, fontWeight: '700', color: '#d6e4f9', marginBottom: 6 },
  alertDesc: { fontSize: 13, color: '#e4beba', lineHeight: 20 },
  endOfList: { alignItems: 'center', marginTop: 24, marginBottom: 24 },
  endOfListText: { fontSize: 11, fontWeight: '800', color: '#64748b', letterSpacing: 2 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, backgroundColor: '#132030', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 8, shadowColor: '#0d1b2a', shadowOffset: { width: 0, height: -12 }, shadowOpacity: 0.4, shadowRadius: 30, elevation: 20 },
  navItem: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 16 },
  navItemActive: { backgroundColor: '#1e2b3b' },
  navText: { fontSize: 10, fontWeight: '800', marginTop: 4, color: '#64748b', letterSpacing: 1 },
  navTextActive: { color: '#ffb3ac' },
});

export default AlertsScreen;