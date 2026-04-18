import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import axiosClient, { setAuthToken } from '../../utils/axiosClient';
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
    setUser(state: UserState, action: PayloadAction<any | null>) {
      if (action.payload === null) {
        state.user = null;
        setAuthToken(null);
      } else {
        // Merge token into user object so interceptor can access state.user.user.token
        const { token, user } = action.payload;
        state.user = user ? { ...user, token } : null;
        setAuthToken(token);
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

export const updateProfilePic =
  (imageData: any) => async (dispatch: AppDispatch, getState: () => any) => {
    try {
      const currentState = getState().user.user;
      const token = currentState?.token;

      if (!token) throw new Error("No authentication token found");

      const formData = new FormData();
      
      // Android URI handling: Use the uri directly as provided by the picker
      const uri = imageData.uri;

      formData.append('image', {
        uri: uri,
        type: imageData.type || 'image/jpeg',
        name: imageData.fileName || `profile_${Date.now()}.jpg`,
      } as any);

      // We use fetch here because Axios sometimes has issues with FormData on Android
      const response = await fetch("http://localhost:5000/api/users/profile-pic", {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          // Note: Do NOT set Content-Type header when sending FormData with fetch
        },
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update profile picture');
      }

      const { user } = responseData;

      // Update local state with new profile pic, keeping the token
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
      console.log(
        'PROFILE PIC UPDATE ERROR:',
        error.message
      );
      throw error;
    }
  };