import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '../../utils/axiosClient';
import { AppDispatch } from '../index';

interface MedicalID {
  userId: string;
}

interface MedicalIDState {
  medicalID: MedicalID | null;
}

const initialState: MedicalIDState = {
  medicalID: null,
};

const medicalIdSlice = createSlice({
  name: 'medicalID',
  initialState,
  reducers: {
    setMedicalID(state: MedicalIDState, action: PayloadAction<MedicalID>) {
      state.medicalID = action.payload;
    },
  },
});

export const { setMedicalID } = medicalIdSlice.actions;
export default medicalIdSlice.reducer;

export const fetchMedicalID = (userId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosClient.get(`/medical-id/${userId}`);
    dispatch(setMedicalID(response.data));
  } catch (error) {
    console.error('Failed to fetch Medical ID:', error);
  }
};

export const updateMedicalID = (medicalID: MedicalID, dispatch: AppDispatch) => async () => {
  try {
    await axiosClient.put(`/medical-id/${medicalID.userId}`, medicalID);
    dispatch(setMedicalID(medicalID));
  } catch (error) {
    console.error('Failed to update Medical ID:', error);
  }
};