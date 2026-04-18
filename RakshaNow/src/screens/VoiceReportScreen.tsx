import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { triggerTacticalSOS } from '../store/slices/incidentSlice';
import { AppDispatch } from '../store';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import { NativeModules } from 'react-native';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const VoiceReportScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isRecording, setIsRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [partialResults, setPartialResults] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Setup Voice listeners
    Voice.onSpeechStart = () => setIsRecording(true);
    Voice.onSpeechEnd = () => setIsRecording(false);
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value) setResults(e.value);
    };
    Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
      if (e.value) setPartialResults(e.value);
    };
    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      console.error('Speech Recognition Error:', e.error);
      setIsRecording(false);
      stopTimer();
    };

    return () => {
      if (Voice) {
        Voice.destroy().then(Voice.removeAllListeners);
      }
      stopTimer();
    };
  }, []);

  const startsRecording = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Microphone access is required for voice reports.');
          return;
        }
      }

      // Small delay to ensure Native bridge is synchronized in Hybrid mode
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setResults([]);
      setPartialResults([]);
      setSeconds(0);
      
      if (!Voice || (!Voice.start && !NativeModules.Voice && !NativeModules.RCTVoice)) {
        Alert.alert(
          'Voice Engine Issue', 
          'The speech recognition service is still initializing or not available on this device. Please wait a moment or restart the app.'
        );
        return;
      }
      
      await Voice.start('en-US');
      startTimer();
    } catch (e) {
      console.error(e);
    }
  };

  const stopsRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
      stopTimer();
    } catch (e) {
      console.error(e);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSubmit = async () => {
    const finalTranscript = results[0] || partialResults[0] || "";
    if (!finalTranscript) {
      Alert.alert('No Audio', 'Please record your report before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const resultAction = await dispatch(triggerTacticalSOS(finalTranscript));
      const incident = resultAction.payload;
      navigation.replace('Confirmation', { incident });
    } catch (error) {
      Alert.alert('Error', 'Failed to submit voice report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
            <Text style={styles.timerText}>{formatTime(seconds)}</Text>
            <View style={[styles.statusBadge, !isRecording && { borderColor: '#64748b' }]}>
              <View style={[styles.statusDot, !isRecording && { backgroundColor: '#64748b' }]} />
              <Text style={[styles.statusText, !isRecording && { color: '#64748b' }]}>
                {isRecording ? 'RECORDING...' : 'READY TO RECORD'}
              </Text>
            </View>
          </View>

          {/* Mic Button with Rings */}
          <View style={styles.micButtonContainer}>
            {/* Outer Rings */}
            {isRecording && (
              <>
                <View style={[styles.pulseRing, { width: 220, height: 220, borderColor: 'rgba(255, 179, 172, 0.1)' }]} />
                <View style={[styles.pulseRing, { width: 190, height: 190, borderColor: 'rgba(255, 179, 172, 0.2)' }]} />
              </>
            )}
            
            <TouchableOpacity 
              activeOpacity={0.9} 
              style={styles.micButtonShadow}
              onPress={isRecording ? stopsRecording : startsRecording}
            >
              <LinearGradient
                colors={isRecording ? ['#ba1a20', '#d32f2f'] : ['#ffb3ac', '#ba1a20']}
                style={styles.micGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.micInnerCircle}>
                  <Icon name={isRecording ? "stop" : "mic"} size={48} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Waveform */}
          <View style={styles.waveformContainer}>
            {[16, 32, 48, 24, 40, 56, 32, 16, 48, 64, 40, 56, 24, 48, 32, 16, 40, 24].map((h, i) => (
              <View 
                key={i} 
                style={[
                  styles.waveformBar, 
                  { 
                    height: isRecording ? Math.max(10, Math.random() * h) : 4,
                    opacity: isRecording ? 1 : 0.3
                  },
                  i === 9 && styles.waveformBarActive
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
              {partialResults[0] || results[0] ? `"${partialResults[0] || results[0]}"` : '"Awaiting voice input..."'}
            </Text>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>{isRecording ? 'AI TRANSCRIBING' : 'READY'}</Text>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity activeOpacity={0.8} style={styles.submitContainer}
        onPress={handleSubmit}
        disabled={submitting || isRecording}
        >
          <LinearGradient
            colors={submitting || isRecording ? ['#1e2b3b', '#132030'] : ['#ffb3ac', '#d32f2f']}
            style={styles.submitButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Icon name="send" size={20} color={isRecording ? '#64748b' : "#FFFFFF"} />
                <Text style={[styles.submitText, isRecording && { color: '#64748b' }]}>SUBMIT VOICE REPORT</Text>
              </>
            )}
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