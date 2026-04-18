import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchIncidents } from '../store/slices/incidentSlice';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const getStatusColor = (status?: string) => {
  switch (status?.toUpperCase()) {
    case 'CRITICAL': return '#d32f2f';
    case 'PENDING': return '#ffb3ac';
    case 'RESOLVED': return '#76daa3';
    default: return '#94a3b8';
  }
};

const getTypeIcon = (type?: string) => {
  switch (type?.toUpperCase()) {
    case 'FIRE': return 'fire-truck';
    case 'MEDICAL': return 'medical-services';
    case 'POLICE': return 'local-police';
    default: return 'report-problem';
  }
};

const AlertsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { incidents } = useSelector((state: RootState) => state.incidents);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const load = async () => {
      await dispatch(fetchIncidents());
      setLoading(false);
    };
    load();
  }, [dispatch]);
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
        {loading ? (
          <ActivityIndicator size="large" color="#ffb3ac" style={{ marginTop: 40 }} />
        ) : incidents.length === 0 ? (
          <View style={styles.endOfList}>
            <Icon name="check-circle" size={48} color="rgba(118, 218, 163, 0.2)" />
            <Text style={[styles.endOfListText, { marginTop: 12 }]}>ALL CLEAR. NO ACTIVE ALERTS.</Text>
          </View>
        ) : (
          incidents.map((incident: any) => {
            const color = getStatusColor(incident.status);
            const icon = getTypeIcon(incident.type);
            
            return (
              <View key={incident._id} style={styles.alertCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.agencyRow}>
                    <Icon name="verified" size={16} color="#76daa3" />
                    <Text style={styles.agencyText}>{incident.type || 'EMERGENCY'} REPORT</Text>
                  </View>
                  <Text style={styles.timeText}>JUST NOW</Text>
                </View>

                <View style={styles.cardBody}>
                  <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
                    <Icon name={icon} size={28} color={color} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.alertTitle}>Emergency at {incident.landmark || 'Location'}</Text>
                    <Text style={styles.alertDesc} numberOfLines={3}>{incident.desc || incident.transcript}</Text>
                    <View style={[styles.statusBadge, { borderColor: color }]}>
                       <Text style={[styles.statusText, { color }]}>{incident.status}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        )}

        {!loading && incidents.length > 0 && (
          <View style={styles.endOfList}>
            <Text style={styles.endOfListText}>NO MORE ACTIVE ALERTS</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#061423' },
  header: { height: 52 + STATUSBAR_HEIGHT, paddingTop: STATUSBAR_HEIGHT, backgroundColor: '#132030', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, zIndex: 50 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#ffb3ac', letterSpacing: -0.5 },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  alertCard: { backgroundColor: '#1A2744', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' },
  agencyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  agencyText: { fontSize: 12, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 },
  timeText: { fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: 1 },
  cardBody: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  iconContainer: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  textContainer: { flex: 1 },
  alertTitle: { fontSize: 16, fontWeight: '700', color: '#d6e4f9', marginBottom: 6 },
  alertDesc: { fontSize: 13, color: '#e4beba', lineHeight: 20, marginBottom: 8 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, borderWidth: 1, marginTop: 4 },
  statusText: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  endOfList: { alignItems: 'center', marginTop: 24, marginBottom: 24, gap: 8 },
  endOfListText: { fontSize: 11, fontWeight: '800', color: '#64748b', letterSpacing: 2 },
});

export default AlertsScreen;