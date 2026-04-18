import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ImageBackground,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const ConfirmationScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#061423" translucent={true} />
      
      {/* Background Map Image (Faded) */}
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=3000&auto=format&fit=crop' }} 
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.05 }} // Subtle background map texture
      />

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
          <Text style={styles.headerTitle}>RakshaNow</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Icon name="help-outline" size={24} color="#64748b" />
        </TouchableOpacity>
      </View> */}

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Success Animation Area */}
        <View style={styles.successArea}>
          <View style={styles.iconContainer}>
            {/* Outer Rings */}
            <View style={[styles.pulseRing, { width: 140, height: 140, backgroundColor: 'rgba(3, 128, 81, 0.15)' }]} />
            <View style={[styles.pulseRing, { width: 110, height: 110, backgroundColor: 'rgba(3, 128, 81, 0.25)' }]} />
            
            {/* Main Circle */}
            <View style={styles.mainCircle}>
              <Icon name="check-circle" size={40} color="#76daa3" />
            </View>
          </View>

          <Text style={styles.mainHeading}>Emergency Reported!</Text>
          <Text style={styles.subHeading}>
            Your request has been dispatched to the nearest command center.
          </Text>
        </View>

        {/* AI Diagnosis Bento Card */}
        <View style={styles.aiCard}>
          <View style={styles.aiCardHeader}>
            <View>
              <Text style={styles.aiLabel}>AI DIAGNOSIS</Text>
              <View style={styles.tagsContainer}>
                <View style={styles.fireTag}>
                  <Icon name="local-fire-department" size={14} color="#fff2f0" />
                  <Text style={styles.fireTagText}>🔥 FIRE</Text>
                </View>
                <View style={styles.criticalTag}>
                  <Text style={styles.criticalTagText}>CRITICAL</Text>
                </View>
              </View>
            </View>
            <View style={styles.incidentIdContainer}>
              <Text style={styles.incidentLabel}>INCIDENT ID</Text>
              <Text style={styles.incidentValue}>#RN2025001</Text>
            </View>
          </View>

          <View style={styles.recommendedServiceContainer}>
            <Text style={styles.serviceLabel}>RECOMMENDED SERVICE</Text>
            <View style={styles.serviceRow}>
              <View style={styles.serviceIconWrapper}>
                <Icon name="fire-truck" size={24} color="#ffb3ac" />
              </View>
              <Text style={styles.serviceName}>🚒 Fire Brigade</Text>
            </View>
          </View>

          {/* Progress / ETA Strip */}
          <View style={styles.progressRow}>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: '66%' }]} />
            </View>
            <Text style={styles.etaText}>ETA: 4 MINS</Text>
          </View>
        </View>

        {/* Safety Info Strip */}
        <View style={styles.infoStrip}>
          <View style={styles.infoIconWrapper}>
            <Icon name="verified-user" size={18} color="#76daa3" />
          </View>
          <Text style={styles.infoText}>
            Stay in a safe location. Your live coordinates are being shared with the responders.
          </Text>
        </View>

      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActionArea}>
        <TouchableOpacity 
          style={styles.primaryButtonContainer} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Home')}
        >
          <LinearGradient
            colors={['#ffb3ac', '#d32f2f']}
            style={styles.primaryButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.primaryButtonText}>GO TO HOME</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>REPORT ANOTHER</Text>
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
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: -1,
  },
  header: {
    height: 52 + STATUSBAR_HEIGHT,
    paddingTop: STATUSBAR_HEIGHT,
    backgroundColor: 'transparent',
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40, 
  },
  successArea: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 140,
    width: 140,
    marginBottom: 24,
  },
  pulseRing: {
    position: 'absolute',
    borderRadius: 999,
  },
  mainCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#76daa3',
    backgroundColor: '#020f1e',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#038051',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  mainHeading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#d6e4f9',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subHeading: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  aiCard: {
    backgroundColor: '#1A2744',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  aiCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  aiLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 179, 172, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  fireTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d32f2f',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  fireTagText: {
    color: '#fff2f0',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  criticalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(211, 47, 47, 0.2)',
    borderWidth: 1,
    borderColor: '#d32f2f',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  criticalTagText: {
    color: '#ffb3ac',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  incidentIdContainer: {
    alignItems: 'flex-end',
  },
  incidentLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 4,
  },
  incidentValue: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#cbd5e1',
  },
  recommendedServiceContainer: {
    backgroundColor: 'rgba(6, 20, 35, 0.4)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 20,
  },
  serviceLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  serviceIconWrapper: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 179, 172, 0.15)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#d6e4f9',
    letterSpacing: -0.5,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 4,
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(3, 128, 81, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#76daa3',
    borderRadius: 3,
  },
  etaText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#76daa3',
    letterSpacing: 1.5,
  },
  infoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(3, 128, 81, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(118, 218, 163, 0.2)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  infoIconWrapper: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(118, 218, 163, 0.15)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#76daa3',
    lineHeight: 18,
  },
  bottomActionArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    paddingTop: 16,
    backgroundColor: '#061423', // Matches background to cover scroll
  },
  primaryButtonContainer: {
    shadowColor: '#d32f2f',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 16,
  },
  primaryButton: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#680008', // Dark text on light red button for contrast
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  secondaryButton: {
    height: 54,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(91, 64, 61, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#d6e4f9',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});

export default ConfirmationScreen;