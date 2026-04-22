import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');
const BASE_W = 375;

// Quick responsive helpers
const w = (p: number) => (W * p) / 100;
const h = (p: number) => (H * p) / 100;
const s = (v: number) => Math.round(v * (W / BASE_W));

// Responsive Scale
export const rs = StyleSheet.create({
  // Container
  container: { flex: 1, backgroundColor: '#061423' },
  safeArea: { flex: 1, backgroundColor: '#061423' },
  
  // Header
  header: { 
    height: s(52) + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0), 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    backgroundColor: '#132030', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: s(16), 
    zIndex: 50 
  },
  headerTitle: { fontSize: s(18), fontWeight: '800', color: '#ffb3ac', letterSpacing: s(-0.5) },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: s(12) },
  iconButton: { padding: s(4) },
  
  // Cards
  card: { 
    backgroundColor: '#1A2744', 
    borderRadius: s(16), 
    padding: s(16), 
    marginBottom: s(16), 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.05)' 
  },
  
  // Stats
  statsRow: { flexDirection: 'row', paddingHorizontal: s(20), paddingVertical: s(16), gap: s(12) },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: s(16), borderRadius: s(16), backgroundColor: '#1a2744', gap: s(4) },
  statNumber: { fontSize: s(24), fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: s(9), fontWeight: '800', color: '#94a3b8', letterSpacing: 1 },
  
  // Tabs
  tabContainer: { flexDirection: 'row', paddingHorizontal: s(20), gap: s(8), marginBottom: s(16) },
  tab: { flex: 1, paddingVertical: s(12), borderRadius: s(12), backgroundColor: '#132030', alignItems: 'center' },
  tabActive: { backgroundColor: '#d32f2f' },
  tabText: { fontSize: s(11), fontWeight: '700', color: '#64748b', letterSpacing: 1 },
  tabTextActive: { color: '#fff' },
  
  // Inputs
  input: { 
    backgroundColor: '#020f1e', 
    borderRadius: s(10), 
    paddingHorizontal: s(16), 
    paddingVertical: s(12), 
    color: '#fff', 
    fontSize: s(14) 
  },
  inputGroup: { marginBottom: s(16) },
  inputLabel: { fontSize: s(10), color: '#64748b', marginBottom: s(5) },
  
  // Buttons
  button: { 
    height: s(50), 
    borderRadius: s(10), 
    backgroundColor: '#d32f2f', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: s(14) },
  
  // Pagination
  paginationContainer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: s(16), 
    backgroundColor: '#132030', 
    gap: s(20) 
  },
  paginationButton: { width: s(44), height: s(44), borderRadius: s(22), backgroundColor: '#1e2b3b', alignItems: 'center', justifyContent: 'center' },
  paginationText: { fontSize: s(14), fontWeight: '700', color: '#94a3b8' },
  
  // Scroll
  scrollContainer: { paddingHorizontal: s(20), paddingTop: s(24), paddingBottom: s(100) },
  
  // Text
  text: { fontSize: s(14), color: '#d6e4f9' },
  textSm: { fontSize: s(12), color: '#94a3b8' },
  textLg: { fontSize: s(16), fontWeight: '700', color: '#fff' },
  
  // Empty
  emptyContainer: { alignItems: 'center', marginTop: s(60), gap: s(12) },
  emptyTitle: { fontSize: s(18), fontWeight: '800', color: '#76daa3', letterSpacing: 2 },
  emptySubtitle: { fontSize: s(13), color: '#64748b' },
  
  // Loading
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: s(16) },
  loadingText: { fontSize: s(12), fontWeight: '800', color: '#94a3b8', letterSpacing: 2 },
});

export default rs;
