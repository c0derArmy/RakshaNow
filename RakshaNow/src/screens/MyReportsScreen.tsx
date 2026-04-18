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

// Data array to render the reports dynamically
const REPORT_DATA = [
  {
    id: '1',
    title: 'Residential Fire Alert',
    location: 'Bandra West, Mumbai',
    status: 'CRITICAL',
    desc: 'Smoke detected on 4th floor. Emergency sensors triggered at 14:05.',
    timeAgo: '12 MIN AGO',
    actionText: 'View Details',
  },
  {
    id: '2',
    title: 'Medical Emergency',
    location: 'Cyber Hub, Gurugram',
    status: 'DISPATCHED',
    desc: 'Cardiac distress reported by passerby. First responder unit 4B is en route.',
    timeAgo: '45 MIN AGO',
    actionText: 'View Details',
  },
  {
    id: '3',
    title: 'Traffic Incident',
    location: 'Ring Road, Delhi',
    status: 'RESOLVED',
    desc: 'Minor collision cleared. Towing services completed. Area marked as safe.',
    timeAgo: '3 HOURS AGO',
    actionText: 'View History',
  },
];

const MyReportsScreen = ({ navigation }: any) => {
  
  // Helper function to render different badge styles based on status
  const renderBadge = (status: string) => {
    switch (status) {
      case 'CRITICAL':
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
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#132030" translucent={true} />
      
      {/* Top Header */}
      {/* <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#ffb3ac" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Reports</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}
        >
          <Icon name="filter-list" size={24} color="#94a3b8" />
        </TouchableOpacity>
      </View> */}

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Render Report Cards */}
        {REPORT_DATA.map((report) => (
          <TouchableOpacity key={report.id} activeOpacity={0.9} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.titleContainer}>
                <Text style={styles.cardTitle}>{report.title}</Text>
                <View style={styles.locationRow}>
                  <Icon name="location-on" size={14} color="#94a3b8" />
                  <Text style={styles.locationText}>{report.location}</Text>
                </View>
              </View>
              {renderBadge(report.status)}
            </View>

            <Text style={styles.cardDesc} numberOfLines={2}>
              {report.desc}
            </Text>

            <View style={styles.cardFooter}>
              <Text style={styles.timeText}>{report.timeAgo}</Text>
              <View style={styles.actionRow}>
                <Text style={styles.actionText}>{report.actionText}</Text>
                <Icon name="chevron-right" size={16} color="#ffb3ac" />
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Footer Stats */}
        <View style={styles.listFooter}>
          <Text style={styles.listFooterText}>SHOWING 3 OF 3 REPORTS</Text>
          <View style={styles.listFooterDivider} />
        </View>

      </ScrollView>
      
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
  listFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  listFooterText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  listFooterDivider: {
    width: 48,
    height: 4,
    backgroundColor: '#283646',
    borderRadius: 2,
  },
});

export default MyReportsScreen;