import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosService from "@/utils/axiosService";
import { toast } from "react-toastify";
import { GET_ALL_CRIME_REPORTS } from "@/routes/serverEndpoint";

export const fetchAllCrimeReports = createAsyncThunk(
  "crimeReports/fetchAllCrimeReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosService.get(GET_ALL_CRIME_REPORTS, {
        withCredentials: true,
      });
      return response.data.reports;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch crime reports"
      );
    }
  }
);

const crimeReportsSlice = createSlice({
  name: "crimeReports",
  initialState: {
    reports: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCrimeReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCrimeReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchAllCrimeReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.reports = [];
        toast.error(action.payload);
      });
  },
});

export default crimeReportsSlice.reducer;
