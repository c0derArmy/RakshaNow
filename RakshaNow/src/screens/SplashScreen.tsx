import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1B2A" />

      <View style={styles.container}>
        
        {/* Center Content */}
        <View style={styles.centerContent}>
          
          {/* LOGO (Shield Image) */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/RakshaNowLOGO-removebg-preview.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* App Name */}
          <Text style={styles.title}>RakshaNow</Text>

          {/* Tagline */}
          <Text style={styles.subtitle}>एक टैप, पूरी सुरक्षा</Text>
        </View>

        {/* Bottom Content */}
        <View style={styles.bottomContent}>
          <View style={styles.progressBarTrack}>
            <View style={styles.progressBarFill} />
          </View>
          <Text style={styles.loadingText}>
            Initializing Secure Core
          </Text>
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

  /* 🔴 LOGO STYLES */
  logoContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,

    // Glow Effect
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 25,
    elevation: 12,
  },

  logoImage: {
    width: '100%',
    height: '100%',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },

  subtitle: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  bottomContent: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 96,
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
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});

export default SplashScreen;