import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '../../utils/axiosClient';
import { AppDispatch } from '../index';

export interface Incident {
  _id?: string;
  title?: string;
  type?: string;
  desc?: string;
  transcript?: string;
  location?: { lat: number; lng: number; address?: string };
  landmark?: string;
  status?: string;
  reportedAt?: string;
  userId?: string;
  userName?: string;
  userPhone?: string;
  assignedTo?: string;
  assignedResponderName?: string;
}

interface IncidentState {
  incidents: Incident[];
}

const initialState: IncidentState = {
  incidents: [],
};

const incidentSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    setIncidents(state: IncidentState, action: PayloadAction<Incident[]>) {
      state.incidents = action.payload;
    },
    addIncident(state: IncidentState, action: PayloadAction<Incident>) {
      state.incidents.unshift(action.payload); // Add to top
    },
    clearIncidents() {
      return initialState;
    },
  },
});

export const { setIncidents, addIncident, clearIncidents } = incidentSlice.actions;
export default incidentSlice.reducer;

export const fetchIncidents = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosClient.get('/incidents');
    console.log('API Response:', response.data);
    const incidentsData = Array.isArray(response.data) ? response.data : response.data.incidents || [];
    dispatch(setIncidents(incidentsData));
    return incidentsData;
  } catch (error: any) {
    console.error('Failed to fetch incidents:', error?.response?.data || error.message);
    throw error;
  }
};

export const fetchMyIncidents = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosClient.get('/incidents');
    const data = response.data?.incidents || response.data || [];
    dispatch(setIncidents(data));
  } catch (error) {
    console.error('Failed to fetch my incidents:', error);
  }
};

export const fetchResponderIncidents = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosClient.get('/incidents/all');
    dispatch(setIncidents(response.data));
  } catch (error) {
    console.error('Failed to fetch responder incidents:', error);
  }
};

export const addNewIncident = (incident: Incident) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosClient.post('/incidents', incident);
    dispatch(addIncident(response.data));
    return response.data;
  } catch (error) {
    console.error('Failed to add incident:', error);
    throw error;
  }
};

export const triggerTacticalSOS = (description: string, location?: any, userInfo?: any) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosClient.post('/sos/trigger', {
      description,
      location: location,
      userName: userInfo?.name || '',
      userPhone: userInfo?.phone || '',
      userEmail: userInfo?.email || '',
    });
    if (response.data.incident) {
      dispatch(addIncident(response.data.incident));
    }
    return response.data.incident;
  } catch (error) {
    console.error('Tactical SOS failed:', error);
    throw error;
  }
};