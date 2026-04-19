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
    dispatch(setIncidents(response.data));
  } catch (error) {
    console.error('Failed to fetch incidents:', error);
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

export const triggerTacticalSOS = (description: string, location?: any) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosClient.post('/sos/trigger', {
      description,
      location: location // Use provided location or let backend handle null
    });
    // The tactical SOS also stores an incident in the backend
    if (response.data.incident) {
      dispatch(addIncident(response.data.incident));
    }
    return response.data.incident;
  } catch (error) {
    console.error('Tactical SOS failed:', error);
    throw error;
  }
};