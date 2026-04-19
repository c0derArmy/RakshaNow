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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIncidents } from '../store/slices/incidentSlice';
import { RootState, AppDispatch } from '../store';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const MyReportsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const incidents = useSelector((state: RootState) => state.incidents.incidents) || [];

  useEffect(() => {
    dispatch(fetchIncidents());
  }, [dispatch]);
  
  // Helper function to render different badge styles based on status
  const renderBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CRITICAL':
      case 'ACTIVE':
        return (
          <View style={[styles.badge, styles.badgeCritical]}>
            <Text style={[styles.badgeText, styles.badgeTextCritical]}>{status}</Text>
          </View>
        );
      case 'DISPATCHED':
        return (
          <View style={[styles.badge, styles.badgeDispatched]}>
            <Text style={[styles.badgeText, styles.badgeTextDispatched]}>{status}</Text>
          </View>
        );
      case 'RESOLVED':
        return (
          <View style={[styles.badge, styles.badgeResolved]}>
            <Text style={[styles.badgeText, styles.badgeTextResolved]}>{status}</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.badge, styles.badgeDispatched]}>
            <Text style={[styles.badgeText, styles.badgeTextDispatched]}>{status || 'UNKNOWN'}</Text>
          </View>
        );
    }
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#132030" translucent={true} />
      
      

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {incidents.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
               <Icon name="assignment" size={48} color="rgba(255, 179, 172, 0.2)" />
            </View>
            <Text style={styles.emptyTitle}>No Activity Yet</Text>
            <Text style={styles.emptySubtitle}>Your emergency reports and tracking history will appear here.</Text>
            <TouchableOpacity 
              style={styles.reportButton}
              onPress={() => navigation.navigate("Report Selection")}
            >
              <Text style={styles.reportButtonText}>REPORT EMERGENCY</Text>
            </TouchableOpacity>
          </View>
        ) : (
          incidents.map((report: any) => (
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

              <Text style={styles.cardDesc} numberOfLines={2}>
                {report.desc || report.transcript || 'No description provided.'}
              </Text>

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

        {incidents.length > 0 && (
          <View style={styles.listFooter}>
            <Text style={styles.listFooterText}>SHOWING {incidents.length} REPORTS</Text>
            <View style={styles.listFooterDivider} />
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <Icon name="home" size={24} color="#64748b" />
          <Text style={styles.navText}>HOME</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Icon name="assignment" size={24} color="#ffb3ac" />
          <Text style={[styles.navText, styles.navTextActive]}>REPORTS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Alerts")}>
          <Icon name="notifications" size={24} color="#64748b" />
          <Text style={styles.navText}>ALERTS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile")}>
          <Icon name="account-circle" size={24} color="#64748b" />
          <Text style={styles.navText}>PROFILE</Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#061423',
  },
  header: {
    height: 52 + STATUSBAR_HEIGHT,
    paddingTop: STATUSBAR_HEIGHT,
    backgroundColor: '#132030',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 50,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffb3ac',
    letterSpacing: -0.5,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#1A2744',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#d6e4f9',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94a3b8',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // CRITICAL Badge Style
  badgeCritical: {
    backgroundColor: '#93000a',
  },
  badgeTextCritical: {
    color: '#ffdad6',
  },
  // DISPATCHED Badge Style
  badgeDispatched: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 179, 172, 0.3)',
  },
  badgeTextDispatched: {
    color: '#ffb3ac',
  },
  // RESOLVED Badge Style
  badgeResolved: {
    backgroundColor: '#038051',
  },
  badgeTextResolved: {
    color: '#d2ffe0',
  },
  cardDesc: {
    fontSize: 14,
    color: '#e4beba',
    lineHeight: 22,
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffb3ac',
  },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyIconContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255, 179, 172, 0.05)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#d6e4f9', marginBottom: 12 },
  emptySubtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  reportButton: { backgroundColor: '#d32f2f', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, shadowColor: '#d32f2f', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  reportButtonText: { fontSize: 13, fontWeight: '800', color: '#fff', letterSpacing: 1.5 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, backgroundColor: '#132030', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  navItem: { alignItems: 'center', justifyContent: 'center', padding: 8 },
  navItemActive: { backgroundColor: '#1e2b3b', borderRadius: 12 },
  navText: { fontSize: 10, fontWeight: '800', marginTop: 4, color: '#64748b' },
  navTextActive: { color: '#ffb3ac' },
});

export default MyReportsScreen;