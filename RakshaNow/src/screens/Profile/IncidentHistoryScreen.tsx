import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState } from '../../store';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const IncidentHistoryScreen = () => {
  const incidents = useSelector((state: RootState) => state.incidents);

  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor="#132030" translucent={true} />
      <ScrollView>
        {incidents.map((item: { id: string; name: string; timestamp: string }) => (
          <View key={item.id} style={styles.historyCard}>
            <View>
              <Text style={styles.historyTitle}>{item.name}</Text>
              <View style={styles.dateRow}>
                <Icon name="event" size={14} color="#64748b" />
                <Text style={styles.historyDate}>{item.timestamp}</Text>
              </View>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>RESOLVED</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#061423' },
  header: { height: 52 + STATUSBAR_HEIGHT, paddingTop: STATUSBAR_HEIGHT, backgroundColor: '#132030', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#ffb3ac' },
  scrollContainer: { padding: 20 },
  historyCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1A2744', padding: 16, borderRadius: 16, marginBottom: 12 },
  historyTitle: { fontSize: 16, fontWeight: '700', color: '#d6e4f9', marginBottom: 6 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  historyDate: { fontSize: 12, color: '#94a3b8' },
  statusBadge: { backgroundColor: 'rgba(3, 128, 81, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '800', color: '#76daa3', letterSpacing: 1 },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa',
    marginTop: 32,
  },
});

export default IncidentHistoryScreen;