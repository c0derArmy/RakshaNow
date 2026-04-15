import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Accept navigation prop to close the modal
const ReportSelectionScreen = ({ navigation }: any) => {
  return (
    <View style={styles.overlayContainer}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.7)" translucent={true} />
      
      {/* This TouchableOpacity acts as the darkened background.
        Clicking outside the bottom sheet will go back/close the modal.
      */}
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={() => navigation.goBack()} 
      />

      {/* Bottom Sheet Content */}
      <View style={styles.bottomSheet}>
        {/* Drag Handle */}
        <View style={styles.dragHandle} />

        {/* Title */}
        <Text style={styles.title}>How do you want to report?</Text>

        {/* Options Grid */}
        <View style={styles.gridContainer}>
          
          {/* Voice Report Card (Active State) */}
          <TouchableOpacity activeOpacity={0.8} style={[styles.card, styles.voiceCard]}
          onPress={() => navigation.replace('Voice Report')}
          >
            <View style={[styles.iconWrapper, styles.voiceIconWrapper]}>
              <Icon name="mic" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.cardTitle}>Voice Report</Text>
            <Text style={styles.voiceSubtitle}>FASTEST ACTION</Text>
          </TouchableOpacity>

          {/* Text Report Card (Inactive State) */}
          <TouchableOpacity activeOpacity={0.8} style={[styles.card, styles.textCard]}
          onPress={() => navigation.replace('Report Emergency')}
          >
            <View style={[styles.iconWrapper, styles.textIconWrapper]}>
              <Icon name="keyboard" size={32} color="#ffb3ac" />
            </View>
            <Text style={styles.cardTitle}>Text Report</Text>
            <Text style={styles.textSubtitle}>DETAILED LOG</Text>
          </TouchableOpacity>

        </View>

        {/* Cancel Action */}
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darkens the screen behind it
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  bottomSheet: {
    backgroundColor: '#1A2744',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 32,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  dragHandle: {
    width: 48,
    height: 6,
    backgroundColor: 'rgba(100, 116, 139, 0.3)', // slate-500/30
    borderRadius: 3,
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#d6e4f9',
    marginBottom: 32,
    letterSpacing: -0.5,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
    marginBottom: 40,
  },
  card: {
    flex: 1,
    aspectRatio: 1, // Keeps the cards perfectly square
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  voiceCard: {
    backgroundColor: 'rgba(211, 47, 47, 0.1)', // primary-container/10
    borderColor: '#d32f2f', // primary-container
  },
  textCard: {
    backgroundColor: '#1e2b3b', // surface-container-high
    borderColor: 'rgba(211, 47, 47, 0.2)', // faint primary border
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  voiceIconWrapper: {
    backgroundColor: '#d32f2f',
  },
  textIconWrapper: {
    backgroundColor: '#283646', // surface-container-highest
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#d6e4f9',
    marginBottom: 4,
  },
  voiceSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 179, 172, 0.8)', // primary/80
    letterSpacing: 1.5,
  },
  textSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b', // slate-400
    letterSpacing: 1.5,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  cancelText: {
    color: '#ffb3ac',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ReportSelectionScreen;