import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axiosClient from '../utils/axiosClient';
import { useTheme } from '../utils/theme';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

// Shimmer Component
const ShimmerView = ({ width, height, borderRadius = 8, style }: { width?: number | string, height?: number, borderRadius?: number, style?: any }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return <Animated.View style={[{ width: width || '100%', height: height || 20, borderRadius, backgroundColor: '#1e2b3b' }, { opacity }, style]} />;
};

const getStatusColor = (status?: string) => {
  switch (status?.toUpperCase()) {
    case 'CRITICAL': return '#d32f2f';
    case 'PENDING': return '#ffb3ac';
    case 'DISPATCHED': return '#fbbf24';
    case 'ACTIVE': return '#94a3b8';
    case 'RESOLVED': return '#76daa3';
    case 'GOOD':
    case 'NORMAL':
    case 'SAFE': return '#038051';
    default: return '#94a3b8';
  }
};

const getStatusLabel = (status?: string) => {
  switch (status?.toUpperCase()) {
    case 'CRITICAL': return 'CRITICAL';
    case 'PENDING': return 'PENDING';
    case 'DISPATCHED': return 'DISPATCHED';
    case 'ACTIVE': return 'ACTIVE';
    case 'RESOLVED': return 'ALL CLEAR';
    case 'GOOD':
    case 'NORMAL':
    case 'SAFE': return 'SAFE';
    default: return 'UNKNOWN';
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
  const { theme, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    loadIncidents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/incidents?page=${page}&limit=${limit}`, { timeout: 10000 });
      let data: any[] = [];
      if (response.data?.incidents) {
        data = response.data.incidents;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      }
      setIncidents(data);
    } catch (error) {
      console.log('Error loading incidents:', error);
    }
    setLoading(false);
  };

  const goToNextPage = () => setPage(page + 1);
  const goToPrevPage = () => { if (page > 1) setPage(page - 1); };

  if (loading) {
    return (
<SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <StatusBar barStyle="light-content" backgroundColor="#132030" translucent={true} />
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconButton}><ShimmerView width={24} height={24} borderRadius={12} /></View>
            <ShimmerView width={120} height={24} />
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.alertCard}>
              <View style={styles.cardHeader}>
                <ShimmerView width={100} height={20} />
                <ShimmerView width={60} height={16} />
              </View>
              <View style={styles.cardBody}>
                <ShimmerView width={56} height={56} borderRadius={16} />
                <View style={{ flex: 1 }}>
                  <ShimmerView width={'80%'} height={18} style={{ marginBottom: 8 }} />
                  <ShimmerView width={'100%'} height={40} style={{ marginBottom: 8 }} />
                  <ShimmerView width={80} height={24} borderRadius={6} />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} translucent={true} />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton} activeOpacity={0.7}>
            <Icon name="arrow-back" size={24} color="#ffb3ac" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Govt. Alerts</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Icon name="done-all" size={24} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {incidents.length === 0 ? (
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
                    <Text style={styles.alertTitle}>
                      {incident.location?.address || incident.landmark || 'Unknown Location'}
                    </Text>
                    <Text style={styles.alertDesc} numberOfLines={3}>{incident.desc || incident.transcript}</Text>
                    <View style={[styles.statusBadge, { borderColor: color }]}>
                       <Text style={[styles.statusText, { color }]}>{getStatusLabel(incident.status)}</Text>
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

      {/* Pagination */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity style={styles.paginationButton} onPress={goToPrevPage} disabled={page === 1 || loading}>
          <Icon name="chevron-left" size={24} color={page === 1 ? '#475569' : '#ffb3ac'} />
        </TouchableOpacity>
        <Text style={styles.paginationText}>Page {page}</Text>
        <TouchableOpacity style={styles.paginationButton} onPress={goToNextPage} disabled={loading}>
          <Icon name="chevron-right" size={24} color="#ffb3ac" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { height: 52 + STATUSBAR_HEIGHT, paddingTop: STATUSBAR_HEIGHT, backgroundColor: '#132030', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, zIndex: 50 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#ffb3ac', letterSpacing: -0.5 },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 100 },
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
  paginationContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, backgroundColor: '#132030', gap: 20 },
  paginationButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1e2b3b', alignItems: 'center', justifyContent: 'center' },
  paginationText: { fontSize: 14, fontWeight: '700', color: '#94a3b8' },
});

export default AlertsScreen;