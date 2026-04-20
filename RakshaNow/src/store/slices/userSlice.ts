import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient, { setAuthToken } from '../../utils/axiosClient';
import { AppDispatch } from '../index';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  user: any | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state: UserState, action: PayloadAction<any | null>) {
      if (action.payload === null) {
        state.user = null;
        setAuthToken(null);
        AsyncStorage.removeItem('@raksha_user');
        AsyncStorage.removeItem('@raksha_token');
      } else {
        const { token, user } = action.payload;
        const userWithToken = user ? { ...user, token } : null;
        state.user = userWithToken;
        setAuthToken(token);
        AsyncStorage.setItem('@raksha_user', JSON.stringify(userWithToken));
        if (token) AsyncStorage.setItem('@raksha_token', token);
      }
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;

// Added loginUser action to handle user login
export const loginUser = (credentials: {
  phone: string;
  password: string;
}) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosClient.post("/auth/login", credentials);

    dispatch(setUser(response.data));

    return response.data;
  } catch (error: any) {
    console.log("LOGIN ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const googleLogin = (idToken: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosClient.post('/auth/google-login', { idToken });
    dispatch(setUser(response.data));
    return response.data;
  } catch (error: any) {
    console.log('GOOGLE LOGIN ERROR:', error.response?.data || error.message);
    throw error;
  }
};

// Added registerUser action to handle user registration
export const registerUser = (userData: {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: string;
}) => async (dispatch: AppDispatch) => {
  try {
    // Ensure role is uppercase for backend validation
    const payload = {
      ...userData,
      role: userData.role.toUpperCase()
    };
    const response = await axiosClient.post('/auth/register', payload);
    dispatch(setUser(response.data));
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Added logoutUser action to handle user logout
export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
    await axiosClient.post('/auth/logout');
    dispatch(setUser(null));
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Fetch fresh user data from backend
export const fetchCurrentUser = () => async (dispatch: AppDispatch, getState: () => any) => {
  try {
    const currentState = getState().user.user;
    const token = currentState?.token;
    
    if (!token) throw new Error("No authentication token found");
    
    const response = await axiosClient.get('/users/me');
    
    dispatch(
      setUser({
        token: token,
        user: response.data
      })
    );
    
    return response.data;
  } catch (error: any) {
    console.error('Fetch user error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateProfilePic =
  (imageData: any) => async (dispatch: AppDispatch, getState: () => any) => {
    try {
      const currentState = getState().user.user;
      const token = currentState?.token;

      console.log("Image data:", JSON.stringify(imageData));
      console.log("Token exists:", !!token);
      console.log("Token value:", token ? token.substring(0, 20) + "..." : "NO TOKEN");
      console.log("User state:", JSON.stringify(currentState));

      if (!token) throw new Error("No authentication token found. Please log in again.");

      const formData = new FormData();
      
      // Standard structure for React Native Android multi-part
      formData.append('image', {
        uri: imageData.uri,
        type: imageData.type || 'image/jpeg',
        name: imageData.fileName || `profile_${Date.now()}.jpg`,
      } as any);

      console.log("FormData created. Image URI:", imageData.uri);

      // Use the same baseURL pattern as axiosClient
      const axiosInstance = axios.create({
        baseURL: 'http://10.115.15.129:5000/api',
        timeout: 30000,
      });

      axiosInstance.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      });

      console.log(`🚀 UPLOADING TO: http://10.115.15.129:5000/api/users/profile-pic`);

      // First test connectivity
      console.log('🧪 Testing connectivity...');
      try {
        await axiosInstance.get('/users/test', { timeout: 5000 });
        console.log('✅ Connectivity test passed');
      } catch (testErr: any) {
        console.log('⚠️ Connectivity test result:', testErr?.message || 'failed');
      }

      console.log('📤 Starting upload...');
      const response = await axiosInstance.put('/users/profile-pic', formData);

      const responseData = response.data;

      console.log('✅ UPLOAD SUCCESSFUL!');
      const { user } = responseData;

      if (currentState) {
        dispatch(
          setUser({
            token: currentState.token,
            user: { ...currentState, profilePic: user.profilePic },
          })
        );
      }

      return responseData;
    } catch (error: any) {
      console.log('🔴 UPLOAD ERROR:', error);
      console.log('🔴 Error name:', error?.name);
      console.log('🔴 Error message:', error?.message);
      console.log('🔴 Error response:', error?.response?.data);
      console.log('🔴 Error code:', error?.code);
      throw error;
    }
  };