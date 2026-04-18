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
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

// Hardcoded heights to simulate the waveform from your HTML
const WAVEFORM_HEIGHTS = [16, 32, 48, 24, 40, 56, 32, 16, 48, 64, 40, 56, 24, 48, 32, 16, 40, 24];

const VoiceReportScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#132030" translucent={true} />
      
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#ffb3ac" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Voice Report</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* GPS Bar */}
        <View style={styles.gpsBar}>
          <View style={styles.gpsIconWrapper}>
            <Icon name="location-on" size={16} color="#76daa3" />
          </View>
          <View style={styles.gpsTextContainer}>
            <Text style={styles.gpsLabel}>Live GPS Location</Text>
            <Text style={styles.gpsValue}>Sector 42, Gurgaon • Near Cyber Hub</Text>
          </View>
          <View style={styles.gpsDot} />
        </View>

        {/* Central Recording Area */}
        <View style={styles.recordingArea}>
          
          {/* Timer & Status */}
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>0:12</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>RECORDING...</Text>
            </View>
          </View>

          {/* Mic Button with Rings */}
          <View style={styles.micButtonContainer}>
            {/* Outer Rings */}
            <View style={[styles.pulseRing, { width: 220, height: 220, borderColor: 'rgba(255, 179, 172, 0.1)' }]} />
            <View style={[styles.pulseRing, { width: 190, height: 190, borderColor: 'rgba(255, 179, 172, 0.2)' }]} />
            
            <TouchableOpacity activeOpacity={0.9} style={styles.micButtonShadow}>
              <LinearGradient
                colors={['#ffb3ac', '#d32f2f']}
                style={styles.micGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.micInnerCircle}>
                  <Icon name="mic" size={48} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Waveform */}
          <View style={styles.waveformContainer}>
            {WAVEFORM_HEIGHTS.map((height, index) => (
              <View 
                key={index} 
                style={[
                  styles.waveformBar, 
                  { height },
                  index === 9 && styles.waveformBarActive // Highlight center bar
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Transcription Card */}
        <View style={styles.contextCard}>
          <Text style={styles.contextHeader}>VOICE CONTEXT ANALYSIS</Text>
          <View style={styles.contextBody}>
            <Text style={styles.contextText}>
              "There is a crowd gathering near the west entrance of the station. Some people look agitated..."
            </Text>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>AI TRANSCRIBING</Text>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity activeOpacity={0.8} style={styles.submitContainer}
        onPress={() => navigation.replace('Confirmation')}
        >
          <LinearGradient
            colors={['#ffb3ac', '#d32f2f']}
            style={styles.submitButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon name="send" size={20} color="#FFFFFF" />
            <Text style={styles.submitText}>SUBMIT VOICE REPORT</Text>
          </LinearGradient>
        </TouchableOpacity>

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
    fontSize: 18,
    fontWeight: '800',
    color: '#ffb3ac',
    letterSpacing: -0.5,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40, // Room for bottom nav
  },
  gpsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 43, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 179, 172, 0.1)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 48,
  },
  gpsIconWrapper: {
    backgroundColor: 'rgba(3, 128, 81, 0.2)', // secondary-container/20
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  gpsTextContainer: {
    flex: 1,
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 2,
  },
  gpsValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d6e4f9',
  },
  gpsDot: {
    width: 8,
    height: 8,
    backgroundColor: '#76daa3',
    borderRadius: 4,
    shadowColor: '#76daa3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  recordingArea: {
    alignItems: 'center',
    marginBottom: 48,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 56,
    fontWeight: '900',
    color: '#d6e4f9',
    letterSpacing: -2,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: '#ffb3ac',
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffb3ac',
    letterSpacing: 2,
  },
  micButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
    position: 'relative',
    height: 220,
    width: 220,
  },
  pulseRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
  },
  micButtonShadow: {
    shadowColor: '#d32f2f',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 15,
  },
  micGradient: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micInnerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    gap: 4,
    width: '100%',
  },
  waveformBar: {
    width: 4,
    backgroundColor: '#ffb3ac',
    borderRadius: 2,
    opacity: 0.8,
  },
  waveformBarActive: {
    backgroundColor: '#ffdad6', // Brighter center line
    opacity: 1,
  },
  contextCard: {
    backgroundColor: '#132030',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 32,
  },
  contextHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 2,
    marginBottom: 16,
  },
  contextBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  contextText: {
    flex: 1,
    fontSize: 14,
    color: '#e4beba',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  aiBadge: {
    backgroundColor: '#1e2b3b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 179, 172, 0.2)',
  },
  aiBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ffb3ac',
    letterSpacing: 0.5,
  },
  submitContainer: {
    shadowColor: '#d32f2f',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
});

export default VoiceReportScreen;