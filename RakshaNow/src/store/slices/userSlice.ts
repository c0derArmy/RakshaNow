import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '../../utils/axiosClient';
import { AppDispatch } from '../index';

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
    setUser(state: UserState, action: PayloadAction<UserState | null>) {
      state.user = action.payload?.user || null;
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
}) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosClient.post('/auth/register', userData);
    dispatch(setUser(response.data));
    return response.data; // ✅ Add this to return the response data
  } catch (error) {
    console.error('Registration failed:', error);
    throw error; // ✅ Re-throw error so it can be caught in the component
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