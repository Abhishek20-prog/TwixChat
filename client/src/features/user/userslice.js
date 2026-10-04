import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

// ======================================================
// FETCH CURRENT USER
// ======================================================

export const fetchCurrentUser = createAsyncThunk(
    "user/fetchCurrentUser",
    async (token, { rejectWithValue }) => {
        try {
            console.log("FETCH USER TOKEN:", !!token);

            const { data } = await api.get(
                "/api/user/data",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("CURRENT USER RESPONSE:", data);

            if (!data.success || !data.user) {
                return rejectWithValue(
                    data.message || "User data not found"
                );
            }

            return {
                user: data.user,
                authenticated: true,
            };
        } catch (error) {
            console.error(
                "FETCH CURRENT USER ERROR:",
                error.response?.data || error
            );

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch current user"
            );
        }
    }
);

// ======================================================
// UPDATE CURRENT USER
// ======================================================

export const updateCurrentUser = createAsyncThunk(
    "user/updateCurrentUser",
    async ({ token, userData }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(
                "/api/user/update",
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("UPDATED USER RESPONSE:", data);

            if (!data.success) {
                return rejectWithValue(
                    data.message || "Failed to update profile"
                );
            }

            return data;
        } catch (error) {
            console.error(
                "UPDATE USER ERROR:",
                error.response?.data || error
            );

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update profile"
            );
        }
    }
);

// ======================================================
// USER SLICE
// ======================================================

const userSlice = createSlice({
    name: "user",
    initialState,

    reducers: {
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        // ==================================================
        // FETCH CURRENT USER
        // ==================================================

        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated =
                    action.payload.authenticated;
                state.error = null;
            })

            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload;
            });

        // ==================================================
        // UPDATE CURRENT USER
        // ==================================================

        builder
            .addCase(updateCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updateCurrentUser.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.user) {
                    state.user = action.payload.user;
                }

                state.error = null;
            })

            .addCase(updateCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearUser,
} = userSlice.actions;

export default userSlice.reducer;