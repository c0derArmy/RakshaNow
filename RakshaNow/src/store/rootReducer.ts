import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import medicalIdReducer from './slices/medicalIdSlice';
import incidentReducer from './slices/incidentSlice';

const rootReducer = combineReducers({
  user: userReducer,
  medicalId: medicalIdReducer,
  incidents: incidentReducer,
});

export default rootReducer;