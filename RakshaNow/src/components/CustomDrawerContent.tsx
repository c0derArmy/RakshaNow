import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setUser } from '../store/slices/userSlice';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(setUser(null));
    // Navigation back to Login will be handled by App.tsx if it listens to user state
    // For now we navigate explicitly if needed, but usually App handles it.
  };

  const menuItems = [
    { label: 'HOME', icon: 'home', route: 'Home' },
    { label: 'REPORTS', icon: 'assignment', route: 'My Reports' },
    { label: 'ALERTS', icon: 'notifications', route: 'Alerts' },
    { label: 'PROFILE', icon: 'person', route: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <LinearGradient
        colors={['#132030', '#1e2b3b']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.profileContainer}
          onPress={() => props.navigation.navigate('Profile')}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: user?.profilePic || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' }}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
            <Text style={styles.userRole}>ACTIVE RESPONDER</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>

      {/* Navigation Items */}
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerItems}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => props.navigation.navigate(item.route)}
          >
            <View style={styles.menuIconContainer}>
              <Icon name={item.icon} size={22} color="#ffb3ac" />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </DrawerContentScrollView>

      {/* Footer / Logout */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#64748b" />
          <Text style={styles.logoutText}>LOGOUT SYSTEM</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>RAKSHA v1.0.4</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061423',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(211,47,47,0.2)',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ffb3ac',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  userRole: {
    color: '#76daa3',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 1,
  },
  drawerItems: {
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#132030',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuLabel: {
    color: '#d6e4f9',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  logoutText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 10,
    letterSpacing: 1,
  },
  versionText: {
    color: 'rgba(100,116,139,0.3)',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 15,
    letterSpacing: 2,
  },
});

export default CustomDrawerContent;
