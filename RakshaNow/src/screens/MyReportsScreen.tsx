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
  ActivityIndicator,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axiosClient from '../utils/axiosClient';

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

const MyReportsScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [myIncidents, setMyIncidents] = useState<any[]>([]);
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
      setMyIncidents(data);
    } catch (error) {
      console.log('Error loading incidents:', error);
    }
    setLoading(false);
  };

  const goToNextPage = () => setPage(page + 1);
  const goToPrevPage = () => { if (page > 1) setPage(page - 1); };

  const renderBadge = (status: string) => {
    const s = status?.toUpperCase();
    const color = s === 'CRITICAL' ? '#d32f2f' : s === 'PENDING' || s === 'DISPATCHED' ? '#ffb3ac' : s === 'RESOLVED' ? '#76daa3' : '#94a3b8';
    const label = s === 'CRITICAL' ? 'CRITICAL' : s === 'PENDING' ? 'PENDING' : s === 'DISPATCHED' ? 'DISPATCHED' : s === 'RESOLVED' ? 'ALL CLEAR' : s === 'ACTIVE' ? 'ACTIVE' : 'UNKNOWN';
    return <View style={[styles.badge, { backgroundColor: color + '20', borderColor: color }]}><Text style={[styles.badgeText, { color }]}>{label}</Text></View>;
  };

  const getTimeAgo = (dateStr?: string) => {
    if (!dateStr) return 'JUST NOW';
    const reportDate = new Date(dateStr);
    const diffMin = Math.round((new Date().getTime() - reportDate.getTime()) / 60000);
    if (diffMin < 60) return `${diffMin} MIN AGO`;
    const diffHours = Math.round(diffMin / 60);
    if (diffHours < 24) return `${diffHours} HOURS AGO`;
    return `${Math.round(diffHours / 24)} DAYS AGO`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#132030" translucent={true} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#ffb3ac" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MY REPORTS</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.card}>
              <View style={styles.cardHeader}>
                <View><ShimmerView width={120} height={20} style={{ marginBottom: 8 }} /><ShimmerView width={80} height={14} /></View>
                <ShimmerView width={70} height={24} borderRadius={12} />
              </View>
              <ShimmerView width={'100%'} height={40} style={{ marginVertical: 12 }} />
              <View style={styles.cardFooter}><ShimmerView width={80} height={14} /><ShimmerView width={80} height={14} /></View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#132030" translucent={true} />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}><Icon name="arrow-back" size={24} color="#ffb3ac" /></TouchableOpacity>
          <Text style={styles.headerTitle}>MY REPORTS</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {myIncidents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="assignment-turned-in" size={48} color="rgba(118, 218, 163, 0.2)" />
            <Text style={styles.emptyTitle}>NO REPORTS FOUND</Text>
            <Text style={styles.emptyDesc}>Your emergency reports will appear here.</Text>
          </View>
        ) : (
          myIncidents.map((report: any) => (
            <TouchableOpacity key={report._id} activeOpacity={0.9} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.titleContainer}>
                  <Text style={styles.cardTitle}>{report.title || report.type || 'Emergency Alert'}</Text>
                  <View style={styles.locationRow}>
                    <Icon name="location-on" size={14} color="#94a3b8" />
                    <Text style={styles.locationText}>{report.landmark || report.location?.address || 'Unknown Location'}</Text>
                  </View>
                </View>
                {renderBadge(report.status || 'ACTIVE')}
              </View>
              <Text style={styles.cardDesc} numberOfLines={2}>{report.desc || report.transcript || 'No description provided.'}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.timeText}>{getTimeAgo(report.reportedAt)}</Text>
                <View style={styles.actionRow}>
                  <Text style={styles.actionText}>View Details</Text>
                  <Icon name="chevron-right" size={16} color="#ffb3ac" />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
        {myIncidents.length > 0 && (
          <View style={styles.listFooter}><Text style={styles.listFooterText}>SHOWING {myIncidents.length} REPORTS</Text></View>
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
  safeArea: { flex: 1, backgroundColor: '#061423' },
  header: { height: 52 + STATUSBAR_HEIGHT, paddingTop: STATUSBAR_HEIGHT, backgroundColor: '#132030', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, zIndex: 50 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { padding: 4 },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#ffb3ac' },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#94a3b8', marginTop: 16 },
  emptyDesc: { fontSize: 14, color: '#64748b', marginTop: 8 },
  card: { backgroundColor: '#132030', borderRadius: 16, padding: 16, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  titleContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 12, fontWeight: '500', color: '#94a3b8' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  badgeCritical: { backgroundColor: '#93000a' },
  badgeTextCritical: { color: '#ffdad6' },
  badgeDispatched: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255, 179, 172, 0.3)' },
  badgeTextDispatched: { color: '#ffb3ac' },
  badgeResolved: { backgroundColor: '#038051' },
  badgeTextResolved: { color: '#d2ffe0' },
  cardDesc: { fontSize: 14, color: '#e4beba', lineHeight: 22 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)' },
  timeText: { fontSize: 12, color: '#64748b' },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  actionText: { fontSize: 12, fontWeight: '600', color: '#ffb3ac' },
  listFooter: { alignItems: 'center', marginTop: 16 },
  listFooterText: { fontSize: 11, fontWeight: '800', color: '#64748b', letterSpacing: 2 },
  paginationContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, backgroundColor: '#132030', gap: 20 },
  paginationButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1e2b3b', alignItems: 'center', justifyContent: 'center' },
  paginationText: { fontSize: 14, fontWeight: '700', color: '#94a3b8' },
});

export default MyReportsScreen;