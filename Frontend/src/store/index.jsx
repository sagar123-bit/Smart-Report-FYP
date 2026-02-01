import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/userSlice';
import allUsersSlice from './slices/getAllUsers';
import allReportsSlice from './slices/getAllReports';

export const store = configureStore({
  reducer: {
    user: userSlice,
    allUsers: allUsersSlice,
    allReports: allReportsSlice
  },
})