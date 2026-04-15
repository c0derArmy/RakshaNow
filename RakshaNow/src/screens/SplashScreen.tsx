import React from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1B2A" />
      
      <View style={styles.container}>
        {/* Center Content: Logo and Branding */}
        <View style={styles.centerContent}>
          {/* Outer ring for the glowing effect */}
          <View style={styles.logoRing}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>112</Text>
            </View>
          </View>
          
          <Text style={styles.title}>RakshaNow</Text>
          <Text style={styles.subtitle}>एक टैप, पूरी सुरक्षा</Text>
        </View>

        {/* Bottom Content: Progress Bar and Status */}
        <View style={styles.bottomContent}>
          <View style={styles.progressBarTrack}>
            <View style={styles.progressBarFill} />
          </View>
          <Text style={styles.loadingText}>Initializing Secure Core</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRing: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: 'rgba(211, 47, 47, 0.1)', // ring-8 ring-[#d32f2f]/10
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10, // For Android shadow
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1, // tracking-tighter
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5, // tracking-tight
    marginBottom: 8,
  },
  subtitle: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5, // tracking-wide
  },
  bottomContent: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 96, // bottom-24
  },
  progressBarTrack: {
    width: 200,
    height: 6,
    backgroundColor: '#2A3F6F',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    width: '45%',
    height: '100%',
    backgroundColor: '#D32F2F',
    borderRadius: 3,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  loadingText: {
    color: '#64748B', // slate-500 equivalent
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2, // tracking-[0.2em]
  },
});

export default SplashScreen;