import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosService from "@/utils/axiosService";
import { toast } from "react-toastify";
import { DELETE_ALL_NOTIFICATIONS, DELETE_SINGLE_NOTIFICATION, GET_ALL_NOTIFICATIONS, MARK_ALL_READ_NOTIFICATIONS } from "@/routes/serverEndpoint";

export const fetchNotifications = createAsyncThunk(
    "notifications/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosService.get(GET_ALL_NOTIFICATIONS, {
                withCredentials: true,
            });
            return res.data.notifications;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch notifications"
            );
        }
    }
);

export const markAllNotificationsRead = createAsyncThunk(
    "notifications/markAllRead",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosService.patch(MARK_ALL_READ_NOTIFICATIONS, {}, { withCredentials: true });
            console.log("Mark All Read Response:", response);

            if (response?.status === 200) {
                // toast.success(response.data.message || "All notifications marked as read");
                return true;
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to mark notifications as read");
            return rejectWithValue(error?.response?.data?.message || "Failed to mark notifications as read");
        }
    }
);

export const deleteNotification = createAsyncThunk(
    "notifications/deleteOne",
    async (notificationId, { rejectWithValue }) => {
        try {
            const res = await axiosService.delete(
                `${DELETE_SINGLE_NOTIFICATION}/${notificationId}`,
                { withCredentials: true }
            );
            if (res.status === 200) {
                toast.success(res.data.message || "Notification deleted successfully");
            }
            return notificationId;
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to delete notification"
            );
            return rejectWithValue(
                error?.response?.data?.message || "Failed to delete notification"
            );
        }
    }
);

export const clearAllNotifications = createAsyncThunk(
    "notifications/clearAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosService.delete(DELETE_ALL_NOTIFICATIONS, {
                withCredentials: true,
            });
            if (res.status === 200) {
                toast.success(res.data.message || "All notifications cleared");
            }
            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to clear notifications"
            );
            return rejectWithValue(
                error?.response?.data?.message || "Failed to clear notifications"
            );
        }
    }
);

const notificationSlice = createSlice({
    name: "notifications",
    initialState: {
        notifications: [],
        unreadCount: 0,
        loading: false,
        error: null,
    },
    reducers: {
        addNotification: (state, action) => {
            state.notifications.push(action.payload);
            state.unreadCount = state.notifications.filter((n) => !n.read).length;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter((n) => !n.read).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(markAllNotificationsRead.fulfilled, (state) => {
                state.notifications = state.notifications.map((n) => ({
                    ...n,
                    read: true,
                }));
                state.unreadCount = 0;
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.notifications = state.notifications.filter(
                    (n) => n._id !== action.payload
                );
                state.unreadCount = state.notifications.filter((n) => !n.read).length;
            })

            .addCase(clearAllNotifications.fulfilled, (state) => {
                state.notifications = [];
                state.unreadCount = 0;
            });
    },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
