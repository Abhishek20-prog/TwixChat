import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../api/axios.js";

const initialState = {
    connections: [],
    requests: [],
    followers: [],
    following: [],
    loading: false,
    error: null,
};

// ======================================================
// FETCH CONNECTION DATA
// ======================================================

export const fetchConnections = createAsyncThunk(
    "connection/fetchConnections",
    async (token, { rejectWithValue }) => {
        try {
            const { data } = await api.get(
                "/api/user/connections",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch connections"
            );
        }
    }
);

// ======================================================
// SEND CONNECTION REQUEST
// ======================================================

export const sendConnectionRequest = createAsyncThunk(
    "connection/sendConnectionRequest",
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(
                "/api/user/connect",
                { id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to send connection request"
            );
        }
    }
);

// ======================================================
// ACCEPT CONNECTION REQUEST
// ======================================================

export const acceptConnectionRequest = createAsyncThunk(
    "connection/acceptConnectionRequest",
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(
                "/api/user/accept",
                { id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to accept connection request"
            );
        }
    }
);

// ======================================================
// FOLLOW USER
// ======================================================

export const followUser = createAsyncThunk(
    "connection/followUser",
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(
                "/api/user/follow",
                { id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to follow user"
            );
        }
    }
);

// ======================================================
// UNFOLLOW USER
// ======================================================

export const unfollowUser = createAsyncThunk(
    "connection/unfollowUser",
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(
                "/api/user/unfollow",
                { id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to unfollow user"
            );
        }
    }
);

// ======================================================
// CONNECTION SLICE
// ======================================================

const connectionSlice = createSlice({
    name: "connection",
    initialState,

    reducers: {
        clearConnections: (state) => {
            state.connections = [];
            state.requests = [];
            state.followers = [];
            state.following = [];
            state.error = null;
        },
    },

    extraReducers: (builder) => {

        // ======================================================
        // FETCH CONNECTIONS
        // ======================================================

        builder
            .addCase(fetchConnections.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchConnections.fulfilled, (state, action) => {
                state.loading = false;

                const data = action.payload.data || {};

                state.connections =
                    data.connections || [];

                state.followers =
                    data.followers || [];

                state.following =
                    data.following || [];

                state.requests =
                    data.pendingConnections || [];
            })

            .addCase(fetchConnections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ======================================================
        // SEND CONNECTION REQUEST
        // ======================================================

        builder
            .addCase(sendConnectionRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(sendConnectionRequest.fulfilled, (state) => {
                state.loading = false;
            })

            .addCase(sendConnectionRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ======================================================
        // ACCEPT CONNECTION REQUEST
        // ======================================================

        builder
            .addCase(acceptConnectionRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(acceptConnectionRequest.fulfilled, (state) => {
                state.loading = false;
            })

            .addCase(acceptConnectionRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ======================================================
        // FOLLOW USER
        // ======================================================

        builder
            .addCase(followUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(followUser.fulfilled, (state) => {
                state.loading = false;
            })

            .addCase(followUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ======================================================
        // UNFOLLOW USER
        // ======================================================

        builder
            .addCase(unfollowUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(unfollowUser.fulfilled, (state) => {
                state.loading = false;
            })

            .addCase(unfollowUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearConnections,
} = connectionSlice.actions;

export default connectionSlice.reducer;