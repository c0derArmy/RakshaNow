import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { triggerTacticalSOS } from '../store/slices/incidentSlice';
import { Alert } from 'react-native';
import { LocationService } from '../utils/locationUtils';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  const handleQuickSOS = async () => {
    // 1. Fetch Location first
    let location = null;
    try {
      const hasPermission = await LocationService.requestPermission();
      if (hasPermission) {
        const coords = await LocationService.getCurrentPosition();
        const address = await LocationService.reverseGeocode(coords.latitude, coords.longitude);
        location = { ...coords, address };
      }
    } catch (e) {
      console.warn('Quick SOS location fetch failed:', e);
    }

    Alert.alert(
      'Quick SOS',
      'Triggering immediate tactical emergency alert. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'CONFIRM', 
          onPress: async () => {
            try {
              const incident = await dispatch(triggerTacticalSOS("QUICK SOS: IMMEDIATE ASSISTANCE REQUIRED", location));
              navigation.navigate('Confirmation', { incident });
            } catch (error) {
              Alert.alert('Error', 'Failed to trigger Quick SOS');
            }
          }
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#132030" translucent={true} />

      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.iconButton}
            onPress={() => navigation.openDrawer()}
          >
            <Icon name="menu" size={28} color="#ffb3ac" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>RakshaNow</Text>
        </View>
        {/* <TouchableOpacity activeOpacity={0.7} style={styles.iconButton}>
          <Icon name="search" size={28} color="#ffb3ac" />
        </TouchableOpacity> */}
      </View>

      {/* Main Content Area */}
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={true}>

        {/* Subtle Red Separator */}
        <View style={styles.separator} />

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <View style={styles.greetingTextContainer}>
            <Text style={styles.greetingText}>Good Morning, {user?.name || 'User'}</Text>
            <View style={styles.gpsContainer}>
              <View style={styles.gpsDot} />
              <Text style={styles.gpsText}>GPS ACTIVE</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.profileImageContainer}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Profile")}
          >
            <Image
              source={{ uri: user?.profilePic || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' }} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* SOS Button Section */}
        <View style={styles.sosSection}>
          {/* Concentric Static Rings mimicking the pulse */}
          <View style={[styles.pulseRing, { width: 300, height: 300, borderColor: 'rgba(211,47,47,0.1)' }]} />
          <View style={[styles.pulseRing, { width: 240, height: 240, borderColor: 'rgba(211,47,47,0.2)' }]} />
          <View style={[styles.pulseRing, { width: 190, height: 190, backgroundColor: 'rgba(211,47,47,0.05)', borderWidth: 0 }]} />

          <TouchableOpacity 
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Report Selection")}
            onLongPress={handleQuickSOS}
          >
            <LinearGradient
              colors={['#d32f2f', '#ba1a20']}
              style={styles.sosButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.sosText}>SOS</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.sosInstruction}>PRESS TO REPORT EMERGENCY</Text>
        </View>

        {/* Quick Actions Row */}
        <View style={styles.actionsRow}>
          {/* My Reports Card */}
          <TouchableOpacity activeOpacity={0.9} style={styles.actionCard}
            onPress={() => navigation.navigate("My Reports")}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: '#1e2b3b' }]}>
              <Icon name="assignment" size={24} color="#ffb3ac" />
            </View>
            <View>
              <Text style={styles.actionTitle}>My Reports</Text>
              <Text style={styles.actionSubtitle}>Track active cases</Text>
            </View>
          </TouchableOpacity>

          {/* How it works Card */}
          <TouchableOpacity activeOpacity={0.9} style={styles.actionCard}
          onPress={() => navigation.navigate("How It Works")}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: '#1e2b3b' }]}>
              <Icon name="help-outline" size={24} color="#76daa3" />
            </View>
            <View>
              <Text style={styles.actionTitle}>How it works</Text>
              <Text style={styles.actionSubtitle}>Safety guide</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Dynamic Safety Tip Card */}
        <TouchableOpacity activeOpacity={0.9} style={styles.safetyCardContainer}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' }}
            style={styles.safetyCardBackground}
            imageStyle={{ opacity: 0.3 }}
          >
            <LinearGradient
              colors={['rgba(19,32,48,0)', '#132030']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.safetyCardContent}>
              <Text style={styles.safetyTipLabel}>SAFETY TIP</Text>
              <Text style={styles.safetyTipTitle}>
                Keep emergency contacts updated for faster response.
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Icon name="home" size={24} color="#ffb3ac" />
          <Text style={[styles.navText, styles.navTextActive]}>HOME</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}
          onPress={() => navigation.navigate("My Reports")}
        >
          <Icon name="assignment" size={24} color="#64748b" />
          <Text style={styles.navText}>REPORTS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}
          onPress={() => navigation.navigate("Alerts")}
        >
          <View>
            <Icon name="notifications" size={24} color="#64748b" />
            <View style={styles.alertBadge} />
          </View>
          <Text style={styles.navText}>ALERTS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}
          onPress={() => navigation.navigate("Profile")}
        >
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
    zIndex: 60,
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
    fontFamily: 'PlusJakartaSans-ExtraBold', // Ensure font is linked, else fallback to system font
    fontSize: 20,
    fontWeight: '800',
    color: '#ffb3ac',
    letterSpacing: -0.5,
  },
  scrollContainer: {
    paddingTop: 0,
    paddingBottom: 40, // Space for bottom nav
    paddingHorizontal: 24,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(211, 47, 47, 0.3)',
    marginHorizontal: -24, // Break out of padding
    marginBottom: 32,
  },
  greetingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  greetingTextContainer: {
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#93000a', // Dark red as per the design
    marginBottom: 4,
  },
  gpsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gpsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#76daa3',
    shadowColor: '#76daa3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  gpsText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#76daa3',
    letterSpacing: 1.5,
  },
  profileImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1e2b3b',
    borderWidth: 1,
    borderColor: 'rgba(91, 64, 61, 0.2)',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  sosSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
  },
  sosButton: {
    width: 165,
    height: 165,
    borderRadius: 82.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#d32f2f',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 15,
  },
  sosText: {
    fontSize: 52,
    fontWeight: '800',
    color: '#fff2f0',
    letterSpacing: -2,
  },
  sosInstruction: {
    marginTop: 48,
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 179, 172, 0.8)',
    letterSpacing: 0.5,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 48,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#132030',
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#d6e4f9',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
  },
  safetyCardContainer: {
    marginTop: 24,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(91, 64, 61, 0.1)',
    backgroundColor: '#0f1c2c',
    height: 140,
  },
  safetyCardBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  safetyCardContent: {
    padding: 24,
    zIndex: 10,
  },
  safetyTipLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffb3ac',
    letterSpacing: 2,
    marginBottom: 4,
  },
  safetyTipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d6e4f9',
    lineHeight: 22,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#132030',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    shadowColor: '#0d1b2a',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  navItemActive: {
    backgroundColor: '#1e2b3b',
  },
  navText: {
    fontSize: 10,
    fontWeight: '800',
    marginTop: 4,
    color: '#64748b',
    letterSpacing: 1,
  },
  navTextActive: {
    color: '#ffb3ac',
  },
  alertBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    backgroundColor: '#d32f2f',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#132030',
  },
});

export default HomeScreen;