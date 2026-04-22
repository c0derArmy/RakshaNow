import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, Platform, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState, AppDispatch } from '../../store';
import axiosClient from '../../utils/axiosClient';
import { useTheme } from '../../utils/theme';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

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

const IncidentHistoryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { theme, isDark } = useTheme();
  const user = useSelector((state: RootState) => state.user.user);

  const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    loadIncidents();
  }, [page]);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/incidents?page=${page}&limit=${limit}`);
      if (response.data?.incidents) {
        setIncidents(response.data.incidents);
        setTotal(response.data.pagination?.total || 0);
      } else if (Array.isArray(response.data)) {
        setIncidents(response.data);
        setTotal(response.data.length);
      }
    } catch (error) {
      console.log('Error loading incidents:', error);
    }
    setLoading(false);
  };

  const goToNextPage = () => setPage(page + 1);
  const goToPrevPage = () => { if (page > 1) setPage(page - 1); };

  const totalPages = Math.ceil(total / limit) || 1;

  const renderBadge = (status: string) => {
    const s = status?.toUpperCase();
    const color = s === 'CRITICAL' ? '#d32f2f' : s === 'PENDING' || s === 'DISPATCHED' ? '#ffb3ac' : s === 'RESOLVED' ? '#76daa3' : '#94a3b8';
    return (
      <View style={[styles.statusBadge, { backgroundColor: color + '20' }]}>
        <Text style={[styles.statusText, { color }]}>{s || 'ACTIVE'}</Text>
      </View>
    );
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
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <StatusBar barStyle="light-content" backgroundColor="#132030" translucent={true} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#ffb3ac" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Incident History</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.historyCard}>
              <View style={styles.cardContent}>
                <ShimmerView width={120} height={20} style={{ marginBottom: 8 }} />
                <ShimmerView width={'80%'} height={14} style={{ marginBottom: 8 }} />
                <ShimmerView width={60} height={14} />
              </View>
              <ShimmerView width={70} height={24} borderRadius={12} />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
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
                <Text style={styles.description} numberOfLines={2}>{item.desc || item.transcript || 'No description'}</Text>
                <View style={styles.dateRow}>
                  <Icon name="location-on" size={14} color="#64748b" />
                  <Text style={styles.historyDate}>{item.landmark || item.location?.address || 'Unknown'}</Text>
                </View>
                <View style={styles.dateRow}>
                  <Icon name="event" size={14} color="#64748b" />
                  <Text style={styles.historyDate}>{getTimeAgo(item.reportedAt)}</Text>
                </View>
              </View>
              {renderBadge(item.status)}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="history" size={48} color="rgba(118, 218, 163, 0.2)" />
            <Text style={styles.emptyText}>No incidents recorded</Text>
          </View>
        )}
      </ScrollView>

      {incidents.length > 0 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity 
            style={styles.paginationButton} 
            onPress={goToPrevPage} 
            disabled={page === 1 || loading}
          >
            <Icon name="chevron-left" size={24} color={page === 1 ? '#475569' : '#ffb3ac'} />
          </TouchableOpacity>
          <Text style={styles.paginationText}>Page {page} of {totalPages}</Text>
          <TouchableOpacity 
            style={styles.paginationButton} 
            onPress={goToNextPage} 
            disabled={page >= totalPages || loading}
          >
            <Icon name="chevron-right" size={24} color={page >= totalPages ? '#475569' : '#ffb3ac'} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { height: 52 + STATUSBAR_HEIGHT, paddingTop: STATUSBAR_HEIGHT, backgroundColor: '#132030', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12, zIndex: 50 },
  iconButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#ffb3ac' },
  scrollContainer: { padding: 20, paddingBottom: 100 },
  cardContent: { flex: 1 },
  historyCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#1A2744', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(211, 47, 47, 0.1)' },
  historyTitle: { fontSize: 16, fontWeight: '700', color: '#d6e4f9', marginBottom: 6 },
  description: { fontSize: 13, color: '#94a3b8', marginBottom: 10, lineHeight: 18 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  historyDate: { fontSize: 12, color: '#94a3b8' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginLeft: 8 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: '#94a3b8', marginTop: 16 },
  paginationContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, backgroundColor: '#132030', gap: 20 },
  paginationButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1e2b3b', alignItems: 'center', justifyContent: 'center' },
  paginationText: { fontSize: 14, fontWeight: '700', color: '#94a3b8' },
});

export default IncidentHistoryScreen;