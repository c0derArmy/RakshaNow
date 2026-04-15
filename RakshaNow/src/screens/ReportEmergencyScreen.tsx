import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const ReportEmergencyScreen = ({ navigation }: any) => {
  const [incidentText, setIncidentText] = useState('');
  const [landmark, setLandmark] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#061423" translucent={true} />
      
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
          <Text style={styles.headerTitle}>Report Emergency</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Icon name="more-vert" size={24} color="#ffb3ac" />
        </TouchableOpacity>
      </View> */}

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* GPS Status Bar */}
          <View style={styles.gpsBar}>
            <View style={styles.gpsIndicatorContainer}>
              <View style={styles.gpsDot} />
              <View style={styles.gpsDotPulse} />
            </View>
            <Text style={styles.gpsText}>Location captured</Text>
            <Text style={styles.gpsStatusText}>GPS ACTIVE</Text>
          </View>

          {/* Heading */}
          <View style={styles.headingContainer}>
            <Text style={styles.mainHeading}>Tell us what's happening</Text>
            <Text style={styles.subHeading}>
              Your report will be shared with the rapid response team immediately.
            </Text>
          </View>

          {/* Multiline Text Input */}
          <View style={styles.textAreaContainer}>
            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                multiline={true}
                placeholder="अपनी समस्या यहाँ लिखें... Describe the situation here... ਆਪਣੀ ਸਥਿਤੀ ਬਾਰੇ ਦੱਸੋ..."
                placeholderTextColor="#64748b"
                value={incidentText}
                onChangeText={setIncidentText}
                maxLength={500}
                textAlignVertical="top"
              />
              <View style={styles.charCounter}>
                <Text style={styles.charCounterText}>{incidentText.length} / 500</Text>
              </View>
            </View>
            
            <View style={styles.textAreaFooter}>
              <Text style={styles.labelText}>INCIDENT DETAILS</Text>
              <TouchableOpacity style={styles.voiceInputButton} activeOpacity={0.7}>
                <Icon name="mic" size={14} color="#ffb3ac" />
                <Text style={styles.voiceInputText}>VOICE INPUT</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Landmark Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.labelTextSecondary}>NEARBY LANDMARK (OPTIONAL)</Text>
            <View style={styles.inputWrapper}>
              <Icon name="location-on" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Near Metro Pillar 142"
                placeholderTextColor="#64748b"
                value={landmark}
                onChangeText={setLandmark}
              />
            </View>
          </View>

          {/* Editorial / Feature Cards */}
          <View style={styles.cardsRow}>
            <View style={styles.featureCard}>
              <Icon name="shield" size={24} color="#ffb3ac" style={styles.cardIcon} />
              <Text style={styles.featureCardText}>Encrypted Data Transmission</Text>
            </View>
            <View style={styles.featureCard}>
              <Icon name="podcasts" size={24} color="#76daa3" style={styles.cardIcon} />
              <Text style={styles.featureCardText}>Auto-Broadcasting Activated</Text>
            </View>
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Bottom Action Button */}
      <View style={styles.bottomActionArea}>
        {/* Simulates the gradient fade from the HTML */}
        <LinearGradient
          colors={['rgba(6, 20, 35, 0)', 'rgba(6, 20, 35, 0.9)', '#061423']}
          style={styles.bottomGradient}
        />
        <TouchableOpacity 
          style={styles.submitButtonContainer} 
          activeOpacity={0.8}
          onPress={() => navigation.replace('Confirmation')}
        >
          <LinearGradient
            colors={['#ffb3ac', '#d32f2f']}
            style={styles.submitButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.submitButtonText}>Submit Report</Text>
            <Icon name="arrow-forward" size={20} color="#fff2f0" />
          </LinearGradient>
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
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    height: 52 + STATUSBAR_HEIGHT,
    paddingTop: STATUSBAR_HEIGHT,
    backgroundColor: '#061423',
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120, // Extra padding so scroll clears the fixed bottom button
  },
  gpsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#132030',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(91, 64, 61, 0.2)',
  },
  gpsIndicatorContainer: {
    position: 'relative',
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gpsDot: {
    width: 12,
    height: 12,
    backgroundColor: '#76daa3',
    borderRadius: 6,
    zIndex: 2,
  },
  gpsDotPulse: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#76daa3',
    borderRadius: 6,
    opacity: 0.6,
  },
  gpsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#76daa3',
    letterSpacing: 0.5,
  },
  gpsStatusText: {
    marginLeft: 'auto',
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  headingContainer: {
    marginBottom: 24,
    gap: 4,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#d6e4f9',
    letterSpacing: -0.5,
  },
  subHeading: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 22,
  },
  textAreaContainer: {
    marginBottom: 32,
  },
  textAreaWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  textArea: {
    height: 160,
    backgroundColor: '#111D35',
    borderWidth: 1,
    borderColor: '#2A3F6F',
    borderRadius: 16,
    padding: 16,
    color: '#d6e4f9',
    fontSize: 15,
    lineHeight: 22,
  },
  charCounter: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(40, 54, 70, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  charCounterText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1.5,
  },
  textAreaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  voiceInputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  voiceInputText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffb3ac',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  inputContainer: {
    marginBottom: 40,
    gap: 16,
  },
  labelTextSecondary: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 2,
    paddingLeft: 4,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#020f1e',
    borderRadius: 12,
    height: 52,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: '#d6e4f9',
    fontSize: 15,
    paddingLeft: 48,
    paddingRight: 16,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#1e2b3b', 
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  cardIcon: {
    marginBottom: 4,
  },
  featureCardText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#d6e4f9',
    lineHeight: 16,
  },
  bottomActionArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    paddingTop: 40,
  },
  bottomGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  submitButtonContainer: {
    shadowColor: '#d32f2f',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  submitButton: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  submitButtonText: {
    color: '#fff2f0',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});

export default ReportEmergencyScreen;