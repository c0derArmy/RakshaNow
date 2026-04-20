// import axios from "axios";
// import { Platform } from "react-native";

// const axiosClient = axios.create({
//   baseURL:
//     Platform.OS === "android"
//       ? "http://10.0.2.2:5000/api"   // Android emulator
//       : "http://localhost:5000/api", // iOS / web

//   withCredentials: true,

//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default axiosClient;


// import axios from "axios";

// const axiosClient = axios.create({

//   baseURL: "http://10.201.108.176:5000/api",   // <-- apna PC IP daalo

//   headers: {
//     "Content-Type": "application/json"
//   },

//   timeout: 10000

// });

// export default axiosClient;



import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Helper to inject token from Redux without causing circular imports
 */
export const setAuthToken = async (token: string | null) => {
  if (token) {
    await AsyncStorage.setItem('@raksha_token', token);
  } else {
    await AsyncStorage.removeItem('@raksha_token');
  }
};

const axiosClient = axios.create({
  baseURL: Platform.OS === "android" ? "http://10.115.15.129:5000/api" : "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

axiosClient.interceptors.request.use(
  async (config) => {
    // Always get fresh token from storage
    const token = await AsyncStorage.getItem('@raksha_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;