import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState, AppDispatch } from '../../store';
import { fetchIncidents } from '../../store/slices/incidentSlice';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const IncidentHistoryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const incidents = useSelector((state: RootState) => state.incidents.incidents);

  useEffect(() => {
    dispatch(fetchIncidents());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#132030" translucent={true} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#ffb3ac" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Incident History</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {incidents.length > 0 ? (
          incidents.map((item: any, index: number) => (
            <View key={item._id || index.toString()} style={styles.historyCard}>
              <View style={styles.cardContent}>
                <Text style={styles.historyTitle}>{item.title || item.type || 'Emergency'}</Text>
                <Text style={styles.description}>{item.desc || item.transcript || 'No description'}</Text>
                <View style={styles.dateRow}>
                  <Icon name="location-on" size={14} color="#64748b" />
                  <Text style={styles.historyDate}>{item.landmark || item.location?.address || 'Unknown'}</Text>
                </View>
                <View style={styles.dateRow}>
                  <Icon name="event" size={14} color="#64748b" />
                  <Text style={styles.historyDate}>{item.reportedAt ? new Date(item.reportedAt).toLocaleString() : 'N/A'}</Text>
                </View>
              </View>
              <View style={[
                styles.statusBadge, 
                item.status === 'CRITICAL' && { backgroundColor: 'rgba(211,47,47,0.2)' }
              ]}>
                <Text style={[
                  styles.statusText,
                  item.status === 'CRITICAL' && { color: '#ffb3ac' }
                ]}>{item.status || 'ACTIVE'}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No incidents recorded</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#061423' },
  header: { height: 52 + STATUSBAR_HEIGHT, paddingTop: STATUSBAR_HEIGHT, backgroundColor: '#132030', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12 },
  iconButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#ffb3ac' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  cardContent: { flex: 1 },
  historyCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#1A2744', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(211, 47, 47, 0.1)' },
  historyTitle: { fontSize: 16, fontWeight: '700', color: '#d6e4f9', marginBottom: 6 },
  description: { fontSize: 13, color: '#94a3b8', marginBottom: 10, lineHeight: 18 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  historyDate: { fontSize: 12, color: '#94a3b8' },
  statusBadge: { backgroundColor: 'rgba(3, 128, 81, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginLeft: 8 },
  statusText: { fontSize: 10, fontWeight: '800', color: '#76daa3', letterSpacing: 1 },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 40,
  },
});

export default IncidentHistoryScreen;