import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

/**
 * Service to handle device location and reverse geocoding
 */
export const LocationService = {
  /**
   * Request location permissions for Android
   */
  async requestPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'RakshaNow needs access to your location to assist emergency responders.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  },

  /**
   * Get current coordinates from the device GPS
   */
  getCurrentPosition(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  },

  /**
   * Convert coordinates to a human-readable address using OSM Nominatim (Free)
   */
  async reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
      // User-Agent is required by Nominatim policy
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'RakshaNow-Emergency-App',
          },
        }
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        // Return a cleaner version of the address
        const parts = data.display_name.split(',');
        return parts.slice(0, 3).join(',').trim();
      }
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    } catch (error) {
      console.error('Reverse Geocoding Failed:', error);
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  },
};
