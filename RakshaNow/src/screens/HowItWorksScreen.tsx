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

// Step-by-step guide data
const GUIDE_STEPS = [
  {
    id: '1',
    title: 'Trigger SOS',
    desc: 'Tap the large red SOS button on the home screen. This immediately primes the app for an emergency broadcast.',
    icon: 'touch-app',
    color: '#d32f2f',
    bgColor: 'rgba(211, 47, 47, 0.15)',
  },
  {
    id: '2',
    title: 'Select Report Mode',
    desc: 'Choose between a Voice Report for fastest action or a Text Report to silently log detailed incident information.',
    icon: 'tune',
    color: '#ffb3ac',
    bgColor: 'rgba(255, 179, 172, 0.15)',
  },
  {
    id: '3',
    title: 'Live Location Sync',
    desc: 'RakshaNow automatically locks onto your GPS coordinates and begins transmitting your live location to responders.',
    icon: 'my-location',
    color: '#76daa3',
    bgColor: 'rgba(118, 218, 163, 0.15)',
  },
  {
    id: '4',
    title: 'AI Dispatch & Tracking',
    desc: 'Our AI analyzes your report and dispatches the exact required service (Police, Fire, Medical). Track their ETA live.',
    icon: 'smart-toy',
    color: '#94a3b8',
    bgColor: 'rgba(148, 163, 184, 0.15)',
  },
];

const HowItWorksScreen = ({ navigation }: any) => {
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
          <Text style={styles.headerTitle}>Safety Guide</Text>
        </View>
      </View> */}

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Intro Section */}
        <View style={styles.introSection}>
          <View style={styles.shieldIconContainer}>
            <Icon name="security" size={48} color="#76daa3" />
          </View>
          <Text style={styles.introHeading}>How RakshaNow Works</Text>
          <Text style={styles.introText}>
            Your personal tactical response unit. Here is exactly what happens when you press the SOS button in an emergency.
          </Text>
        </View>

        {/* Steps List */}
        <View style={styles.stepsContainer}>
          {GUIDE_STEPS.map((step, index) => (
            <View key={step.id} style={styles.stepCard}>
              
              {/* Vertical connecting line (hides on the last item) */}
              {index !== GUIDE_STEPS.length - 1 && (
                <View style={styles.connectingLine} />
              )}

              <View style={[styles.iconWrapper, { backgroundColor: step.bgColor }]}>
                <Icon name={step.icon} size={24} color={step.color} />
              </View>
              
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepNumber}>STEP 0{step.id}</Text>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom Help Box */}
        <View style={styles.helpBox}>
          <Icon name="info-outline" size={20} color="#94a3b8" />
          <Text style={styles.helpText}>
            Always ensure your GPS and Microphone permissions are enabled in your phone settings for RakshaNow to function correctly.
          </Text>
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
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
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
    paddingTop: 32,
    paddingBottom: 40,
  },
  introSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  shieldIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(118, 218, 163, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(118, 218, 163, 0.3)',
  },
  introHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#d6e4f9',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  introText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  stepsContainer: {
    paddingLeft: 8,
    marginBottom: 32,
  },
  stepCard: {
    flexDirection: 'row',
    marginBottom: 32,
    position: 'relative',
  },
  connectingLine: {
    position: 'absolute',
    left: 23, // Centers the line under the 48px icon
    top: 48,
    bottom: -32,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: -1,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  stepTextContainer: {
    flex: 1,
    paddingTop: 2,
  },
  stepNumber: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 2,
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#d6e4f9',
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 13,
    color: '#e4beba',
    lineHeight: 20,
  },
  helpBox: {
    flexDirection: 'row',
    backgroundColor: '#1A2744',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  helpText: {
    flex: 1,
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 18,
  },
});

export default HowItWorksScreen;