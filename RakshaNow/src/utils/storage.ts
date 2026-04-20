import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@raksha_user';
const TOKEN_KEY = '@raksha_token';

export const StorageService = {
  // Save user data
  async setUser(userData: any) {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.log('Error saving user:', error);
    }
  },

  // Get saved user data
  async getUser() {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.log('Error getting user:', error);
      return null;
    }
  },

  // Clear user data (logout)
  async clearUser() {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.log('Error clearing user:', error);
    }
  },

  // Check if user is logged in
  async isLoggedIn() {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData !== null;
    } catch (error) {
      return false;
    }
  },
};

export default StorageService;