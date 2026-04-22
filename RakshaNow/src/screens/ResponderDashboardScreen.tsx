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
  Alert,
  RefreshControl,
  Animated,
  Dimensions,
  Linking,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { getLiveLocation } from '../store/slices/userSlice';
import axiosClient from '../utils/axiosClient';
import { useTheme } from '../utils/theme';

// Responsive utilities
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DESIGN_WIDTH = 375;
const scale = SCREEN_WIDTH / DESIGN_WIDTH;
const wp = (p: number) => (SCREEN_WIDTH * p) / 100;
const sp = (s: number) => Math.round(s * scale);

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

// Shimmer Component
const ShimmerView = ({ width, height, borderRadius = 8, style }: { width?: number | string, height?: number, borderRadius?: number, style?: any }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width: width || '100%',
          height: height || 20,
          borderRadius,
          backgroundColor: '#1e2b3b',
        },
        { opacity },
        style,
      ]}
    />
  );
};

interface CitizenIncident {
  _id: string;
  title?: string;
  type?: string;
  desc?: string;
  transcript?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  landmark?: string;
  status?: string;
  reportedAt?: string;
  userName?: string;
  userPhone?: string;
  userId?: string;
}

const getStatusColor = (status?: string) => {
  switch (status?.toUpperCase()) {
    case 'CRITICAL':
      return '#d32f2f';
    case 'PENDING':
      return '#ffb3ac';
    case 'DISPATCHED':
      return '#fbbf24';
    case 'RESOLVED':
      return '#76daa3';
    case 'GOOD':
    case 'NORMAL':
    case 'SAFE':
      return '#038051';
    default:
      return '#94a3b8';
  }
};

const getStatusLabel = (status?: string) => {
  switch (status?.toUpperCase()) {
    case 'CRITICAL':
      return 'CRITICAL';
    case 'PENDING':
      return 'PENDING';
    case 'DISPATCHED':
      return 'DISPATCHED';
    case 'RESOLVED':
      return 'RESOLVED';
    case 'GOOD':
    case 'NORMAL':
    case 'SAFE':
      return 'ALL CLEAR';
    default:
      return 'UNKNOWN';
  }
};

const getStatusIcon = (status?: string) => {
  switch (status?.toUpperCase()) {
    case 'CRITICAL':
      return 'dangerous';
    case 'PENDING':
      return 'pending';
    case 'RESOLVED':
      return 'check-circle';
    case 'ASSIGNED':
      return 'assignment-ind';
    default:
      return 'report-problem';
  }
};

const getTypeIcon = (type?: string) => {
  switch (type?.toUpperCase()) {
    case 'FIRE':
      return 'fire-truck';
    case 'MEDICAL':
      return 'medical-services';
    case 'POLICE':
    case 'CRIME':
      return 'local-police';
    case 'ACCIDENT':
      return 'directions-car';
    default:
      return 'emergency';
  }
};

const formatTime = (dateString?: string) => {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
};

const ResponderDashboardScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const { theme, isDark } = useTheme();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'critical' | 'active' | 'all'>('critical');
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [allIncidents, setAllIncidents] = useState<any[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const limit = 10;

  useEffect(() => {
    loadIncidents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get(`/incidents?page=${page}&limit=${limit}`, { timeout: 10000 });
      
      let data: CitizenIncident[] = [];
      if (response.data?.incidents) {
        data = response.data.incidents;
        setTotalCount(response.data.pagination?.total || 0);
      } else if (Array.isArray(response.data)) {
        data = response.data;
      }
      
      // Store in local state
      setAllIncidents(data);
      setLoading(false);
      setRefreshing(false);
    } catch (err: any) {
      setError('Server connection failed');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const goToNextPage = () => {
    setPage(page + 1);
  };

  const goToPrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadIncidents();
  };

  const handleRefresh = () => {
    onRefresh();
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace('Home');
    }
  };

  const handleNavigate = async (incident: CitizenIncident) => {
    let lat = incident.location?.lat;
    let lng = incident.location?.lng;
    
    if (incident.userId) {
      try {
        const locationData: any = await dispatch(getLiveLocation(incident.userId));
        if (locationData?.lat && locationData?.lng) {
          lat = locationData.lat;
          lng = locationData.lng;
        }
      } catch (error) {
        console.log('Could not fetch live location, using static:', error);
      }
    }
    
    if (!lat || !lng) {
      const address = incident.location?.address || incident.landmark || '';
      if (address) {
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
      } else {
        Alert.alert('No Location', 'No location data available for this incident.');
      }
      return;
    }
    
    Linking.openURL(`google.navigation:q=${lat},${lng}&mode=d`).catch(() => {
      Linking.openURL(`https://www.google.com/maps/dir/${lat},${lng}`);
    });
  };

  const handleRespond = async (incident: CitizenIncident) => {
    Alert.alert(
      'Respond to Emergency',
      `Accept assignment for this ${incident.type || 'emergency'} case at ${incident.location?.address || incident.landmark || 'Unknown location'}?`,
      [
        { text: 'Decline', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              const response = await axiosClient.put(`/incidents/${incident._id}`, { 
                status: 'DISPATCHED' 
              });
              
              if (response.data) {
                await axiosClient.post(`/incidents/${incident._id}/notify`);
              }
              
              Alert.alert('Assigned', 'You have accepted this case. The reporter has been notified.');
              loadIncidents();
            } catch (error: any) {
              console.error('Respond error:', error);
              const errorMsg = error?.response?.data?.message || error?.response?.data?.error || 'Failed to accept case';
              Alert.alert('Error', errorMsg);
            }
          },
        },
      ]
    );
  };

  const handleResolve = async (incident: CitizenIncident) => {
    Alert.alert(
      'Resolve Incident',
      'Mark this incident as resolved?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resolve',
          onPress: async () => {
            try {
              console.log('Resolving incident:', incident._id, 'status: RESOLVED');
              const response = await axiosClient.put(`/incidents/${incident._id}`, { status: 'RESOLVED' });
              console.log('Resolve response:', response.data);
              Alert.alert('Resolved', 'Incident marked as resolved.');
              loadIncidents();
            } catch (error: any) {
              console.error('Resolve error:', error.response?.data || error.message);
              Alert.alert('Error', error.response?.data?.message || 'Failed to resolve incident. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Use allIncidents for display
  const filteredIncidents = allIncidents.filter((i: any) => {
    const s = i.status?.toUpperCase();
    if (activeTab === 'critical') return s === 'CRITICAL' || s === 'PENDING' || s === 'DISPATCHED';
    if (activeTab === 'active') return s !== 'RESOLVED'; // all except resolved
    return s === 'RESOLVED'; // 'all' tab - show only resolved
  });

  // Count by status
  const criticalCount = allIncidents.filter((i: any) => 
    i.status?.toUpperCase() === 'CRITICAL'
  ).length;

  const pendingCount = allIncidents.filter((i: any) => 
    i.status?.toUpperCase() === 'PENDING' || i.status?.toUpperCase() === 'DISPATCHED'
  ).length;

  const resolvedCount = allIncidents.filter(
    (i: any) => i.status?.toUpperCase() === 'RESOLVED'
  ).length;

  if (loading) {
    return (
<SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <StatusBar barStyle="light-content" backgroundColor="#132030" translucent={true} />
        
        {/* Header Skeleton */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconButton}><ShimmerView width={24} height={24} borderRadius={12} /></View>
            <ShimmerView width={160} height={24} />
          </View>
        </View>

        {/* Stats Skeleton */}
        <View style={styles.statsRow}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: '#1a2744' }]}>
              <ShimmerView width={24} height={24} borderRadius={12} />
              <ShimmerView width={30} height={28} style={{ marginTop: 8 }} />
              <ShimmerView width={50} height={12} style={{ marginTop: 4 }} />
            </View>
          ))}
        </View>

        {/* Tabs Skeleton */}
        <View style={styles.tabContainer}>
          <ShimmerView width={'45%'} height={44} borderRadius={12} />
          <ShimmerView width={'45%'} height={44} borderRadius={12} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Cards Skeleton */}
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.incidentCard}>
              <View style={styles.cardHeader}>
                <ShimmerView width={80} height={24} borderRadius={6} />
                <ShimmerView width={60} height={16} />
              </View>
              <View style={styles.cardBody}>
                <ShimmerView width={64} height={64} borderRadius={16} />
                <View style={{ flex: 1 }}>
                  <ShimmerView width={'80%'} height={18} style={{ marginBottom: 8 }} />
                  <ShimmerView width={'100%'} height={14} style={{ marginBottom: 8 }} />
                  <ShimmerView width={'60%'} height={14} />
                </View>
              </View>
              <View style={styles.cardActions}>
                <ShimmerView width={'30%'} height={40} borderRadius={10} />
                <ShimmerView width={'30%'} height={40} borderRadius={10} />
                <ShimmerView width={'30%'} height={40} borderRadius={10} />
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Pagination Skeleton */}
        <View style={styles.paginationContainer}>
          <ShimmerView width={44} height={44} borderRadius={22} />
          <ShimmerView width={60} height={20} />
          <ShimmerView width={44} height={44} borderRadius={22} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
        translucent={true}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#ffb3ac" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>COMMAND CENTER</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={handleRefresh}
          >
            <Icon name="refresh" size={24} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#1a2744' }]}>
          <Icon name="warning" size={24} color="#d32f2f" />
          <Text style={styles.statNumber}>{criticalCount}</Text>
          <Text style={styles.statLabel}>CRITICAL</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#1a2744' }]}>
          <Icon name="pending" size={24} color="#ffb3ac" />
          <Text style={styles.statNumber}>{pendingCount}</Text>
          <Text style={styles.statLabel}>PENDING</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#1a2744' }]}>
          <Icon name="check-circle" size={24} color="#76daa3" />
          <Text style={styles.statNumber}>{resolvedCount || 0}</Text>
          <Text style={styles.statLabel}>RESOLVED</Text>
        </View>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Icon name="error-outline" size={16} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'critical' && styles.tabActive]}
          onPress={() => setActiveTab('critical')}
        >
          <Text style={[styles.tabText, activeTab === 'critical' && styles.tabTextActive]}>
            CRITICAL
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
            ACTIVE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            RESOLVED
          </Text>
        </TouchableOpacity>
      </View>

      {/* Incidents List */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffb3ac"
            colors={['#ffb3ac']}
          />
        }
      >
        {filteredIncidents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name={activeTab === 'all' ? 'check-circle' : 'verified'} size={64} color={activeTab === 'all' ? '#76daa3' : 'rgba(118, 218, 163, 0.2)'} />
            <Text style={styles.emptyTitle}>{getStatusLabel(activeTab === 'critical' ? 'CRITICAL' : activeTab === 'active' ? 'ACTIVE' : 'RESOLVED')}</Text>
            <Text style={styles.emptySubtitle}>
              {loading ? 'Loading incidents...' : 
               activeTab === 'critical' ? 'No critical emergency cases.' :
               activeTab === 'active' ? 'No active cases.' :
               'No resolved cases yet.'}
            </Text>
          </View>
        ) : (
          filteredIncidents.map((incident: any) => {
            const statusColor = getStatusColor(incident.status);
            const statusIcon = getStatusIcon(incident.status);
            const typeIcon = getTypeIcon(incident.type);

            return (
              <View key={incident._id} style={styles.incidentCard}>
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: `${statusColor}20` },
                      ]}
                    >
                      <Icon name={statusIcon} size={14} color={statusColor} />
                      <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                        {getStatusLabel(incident.status)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.cardTime}>
                    {formatTime(incident.reportedAt)}
                  </Text>
                </View>

                {/* Location & Details */}
                <View style={styles.cardBody}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${statusColor}15` },
                    ]}
                  >
                    <Icon name={typeIcon} size={32} color={statusColor} />
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.locationRow}>
                      <Icon
                        name="location-on"
                        size={16}
                        color="#ffb3ac"
                      />
                      <Text style={styles.locationText} numberOfLines={1}>
                        {incident.location?.address ||
                          incident.landmark ||
                          'Unknown Location'}
                      </Text>
                    </View>

                    {incident.location && (
                      <Text style={styles.coordsText}>
                        {incident.location.lat?.toFixed(6)},{' '}
                        {incident.location.lng?.toFixed(6)}
                      </Text>
                    )}

                    <Text style={styles.descriptionText} numberOfLines={2}>
                      {incident.desc ||
                        incident.transcript ||
                        'No description available'}
                    </Text>

                    <View style={styles.metaRow}>
                      {incident.type && (
                        <View style={styles.metaTag}>
                          <Text style={styles.metaTagText}>
                            {incident.type.toUpperCase()}
                          </Text>
                        </View>
                      )}
                      {incident.userPhone && (
                        <View style={styles.metaTag}>
                          <Icon name="phone" size={12} color="#94a3b8" />
                          <Text style={styles.metaTagText}>
                            {incident.userPhone}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.navigateButton]}
                    onPress={() => handleNavigate(incident)}
                  >
                    <Icon name="navigation" size={18} color="#fff" />
                    <Text style={styles.actionButtonText}>NAVIGATE</Text>
                  </TouchableOpacity>

                  {incident.status?.toUpperCase() !== 'RESOLVED' && (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.respondButton]}
                        onPress={() => handleRespond(incident)}
                      >
                        <Icon
                          name="assignment-ind"
                          size={18}
                          color="#fff"
                        />
                        <Text style={styles.actionButtonText}>RESPOND</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionButton, styles.resolveButton]}
                        onPress={() => handleResolve(incident)}
                      >
                        <Icon name="check" size={18} color="#fff" />
                        <Text style={styles.actionButtonText}>RESOLVE</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            );
          })
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* Pagination - outside ScrollView */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={styles.paginationButton}
          onPress={goToPrevPage}
          disabled={page === 1 || loading}
        >
          <Icon name="chevron-left" size={24} color={page === 1 ? '#475569' : '#ffb3ac'} />
        </TouchableOpacity>
        
        <Text style={styles.paginationText}>Page {page}</Text>
        
        <TouchableOpacity 
          style={styles.paginationButton}
          onPress={goToNextPage}
          disabled={loading}
        >
          <Icon name="chevron-right" size={24} color="#ffb3ac" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 2,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffb3ac',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#132030',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#d32f2f',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1,
  },
  tabTextActive: {
    color: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#76daa3',
    letterSpacing: 2,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  incidentCard: {
    backgroundColor: '#1a2744',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardTime: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#d6e4f9',
    flex: 1,
  },
  coordsText: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: '#e4beba',
    lineHeight: 18,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  metaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#132030',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  metaTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  navigateButton: {
    backgroundColor: '#ffb3ac',
  },
  respondButton: {
    backgroundColor: '#fbbf24',
  },
  resolveButton: {
    backgroundColor: '#76daa3',
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 8,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#ff6b6b',
  },
  bottomPadding: {
    height: 40,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#132030',
    gap: 20,
  },
  paginationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1e2b3b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationButtonDisabled: {
    backgroundColor: '#0f1c2c',
  },
  paginationText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94a3b8',
  },
  mapModalContainer: {
    flex: 1,
    backgroundColor: '#061423',
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#132030',
    zIndex: 10,
  },
  mapHeaderTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  mapView: {
    flex: 1,
  },
});

export default ResponderDashboardScreen;
