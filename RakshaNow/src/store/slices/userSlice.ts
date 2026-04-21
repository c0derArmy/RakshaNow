import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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

export const loginUser = (credentials: { phone: string; password: string }) => async (dispatch: AppDispatch) => {
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

export const registerUser = (userData: { name: string; phone: string; email: string; password: string; role: string }) => async (dispatch: AppDispatch) => {
  try {
    const payload = { ...userData, role: userData.role.toUpperCase() };
    const response = await axiosClient.post('/auth/register', payload);
    dispatch(setUser(response.data));
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
    await axiosClient.post('/auth/logout');
    dispatch(setUser(null));
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

export const fetchCurrentUser = () => async (dispatch: AppDispatch, getState: () => any) => {
  try {
    const currentState = getState().user.user;
    const token = currentState?.token;
    if (!token) throw new Error("No authentication token found");
    const response = await axiosClient.get('/users/me');
    dispatch(setUser({ token: token, user: response.data }));
    return response.data;
  } catch (error: any) {
    console.error('Fetch user error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateProfilePic = (imageData: any) => async (dispatch: AppDispatch, getState: () => any) => {
  try {
    const currentState = getState().user.user;
    const token = currentState?.token;
    if (!token) throw new Error("No authentication token found. Please log in again.");

    const formData = new FormData();
    formData.append('image', {
      uri: imageData.uri,
      type: imageData.type || 'image/jpeg',
      name: imageData.fileName || 'profile.jpg',
    } as any);

    const response = await axiosClient.put('/users/profile-pic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const { user } = response.data;
    if (currentState) {
      dispatch(setUser({ token: currentState.token, user: { ...currentState, profilePic: user.profilePic } }));
    }
    return response.data;
  } catch (error: any) {
    console.log('🔴 UPLOAD ERROR:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || 'Upload failed');
  }
};