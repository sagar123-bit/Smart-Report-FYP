import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosService from "@/utils/axiosService";
import { GET_AUTH_USER, LOGOUT } from "@/routes/serverEndpoint";
import { toast } from "react-toastify";

export const fetchAuthUser = createAsyncThunk(
  "auth/fetchAuthUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosService.get(GET_AUTH_USER, {
        withCredentials: true,
      });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosService.delete(LOGOUT, {
        withCredentials: true,
      });
      await dispatch(fetchAuthUser());
      toast.success(response?.data?.message || "Logged out successfully");

      return true;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Logout failed"
      );
    }
  }
);

const userSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchAuthUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
