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

// Using localhost for all environments.
// For Physical Android devices via USB, ADB Reverse covers localhost natively.
const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api", // Resolves via ADB reverse on Android

  headers: {
    "Content-Type": "application/json",
  },
  
  timeout: 10000,
});

export default axiosClient;