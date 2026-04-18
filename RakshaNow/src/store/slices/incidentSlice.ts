import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '../../utils/axiosClient';
import { AppDispatch } from '../index';

interface Incident {
  id: string;
  type: string;
  description: string;
  location: string;
  timestamp: string;
}

interface IncidentState {
  incidents: Incident[];
}

const initialState: IncidentState = {
  incidents: [
    {
      id: '1',
      type: 'Medical Emergency',
      description: 'Heart attack symptoms, difficulty breathing',
      location: '123 Main St, Springfield',
      timestamp: '2024-04-15 14:30:00',
    },
    {
      id: '2',
      type: 'Accident',
      description: 'Car collision on highway, 2 vehicles involved',
      location: 'Highway 101, Mile Marker 45',
      timestamp: '2024-04-14 09:15:00',
    },
    {
      id: '3',
      type: 'Fall',
      description: 'Elderly person fell at home, possible fracture',
      location: '456 Oak Ave, Springfield',
      timestamp: '2024-04-13 16:45:00',
    },
    {
      id: '4',
      type: 'Unconscious',
      description: 'Person found unconscious in public area',
      location: 'City Park, Main Entrance',
      timestamp: '2024-04-12 11:20:00',
    },
    {
      id: '5',
      type: 'Severe Allergic Reaction',
      description: 'Anaphylaxis, breathing difficulty',
      location: '789 Pine Rd, Springfield',
      timestamp: '2024-04-11 13:05:00',
    },
  ],
};

const incidentSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    addIncident(state: IncidentState, action: PayloadAction<Incident>) {
      state.incidents.push(action.payload);
    },
    clearIncidents() {
      return initialState;
    },
  },
});

export const { addIncident, clearIncidents } = incidentSlice.actions;
export default incidentSlice.reducer;

export const fetchIncidents = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosClient.get('/incidents');
    response.data.forEach((incident: Incident) => {
      dispatch(addIncident(incident));
    });
  } catch (error) {
    console.error('Failed to fetch incidents:', error);
  }
};

export const addNewIncident = (incident: Incident) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosClient.post('/incidents', incident);
    dispatch(addIncident(response.data));
  } catch (error) {
    console.error('Failed to add incident:', error);
  }
};