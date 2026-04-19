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

let authToken: string | null = null;

/**
 * Dedicated helper to inject token from Redux without causing circular imports
 */
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const axiosClient = axios.create({
  // Use localhost for both iOS and Android (requires adb reverse on Android)
  // Use PC IP for Android (Physical Device) and localhost/10.0.2.2 for Emulator
  // Use PC IP for Android (Physical Device) to reach the server over Wi-Fi
  baseURL: Platform.OS === "android" ? "http://10.253.37.129:5000/api" : "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

axiosClient.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;