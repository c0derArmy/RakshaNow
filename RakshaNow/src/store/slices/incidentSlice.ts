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
  incidents: [],
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