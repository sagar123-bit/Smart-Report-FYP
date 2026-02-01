import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosService from "@/utils/axiosService";
import { toast } from "react-toastify";
import { GET_ALL_USERS } from "@/routes/serverEndpoint";

export const fetchAllUsers = createAsyncThunk(
  "allUsers/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosService.get(GET_ALL_USERS, {
        withCredentials: true,
      });
    //   console.log("allusersdata",response)
      return response.data.users;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

const allUsersSlice = createSlice({
  name: "allUsers",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.users = [];
        toast.error(action.payload);
      });
  },
});

export default allUsersSlice.reducer;
