import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../api/axios.js";

const initialState = {
    recentChats: [],
    messages: [],
    selectedUser: null,
    loading: false,
    sending: false,
    error: null,
};

// ======================================================
// FETCH RECENT MESSAGES
// ======================================================

export const fetchRecentMessages = createAsyncThunk(
    "message/fetchRecentMessages",
    async (token, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/api/user/recent-messages", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch recent messages"
            );
        }
    }
);

// ======================================================
// FETCH CONVERSATION
// ======================================================

export const fetchConversation = createAsyncThunk(
    "message/fetchConversation",
    async ({ token, userId }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(
                `/api/message/conversation/${userId}`,
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
                "Failed to fetch conversation"
            );
        }
    }
);

// ======================================================
// SEND MESSAGE
// ======================================================

export const sendNewMessage = createAsyncThunk(
    "message/sendNewMessage",
    async ({ token, messageData }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(
                "/api/message/send",
                messageData,
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
                "Failed to send message"
            );
        }
    }
);

// ======================================================
// MARK MESSAGE AS READ
// ======================================================

export const markMessageAsRead = createAsyncThunk(
    "message/markMessageAsRead",
    async ({ token, messageId }, { rejectWithValue }) => {
        try {
            const { data } = await api.patch(
                `/api/message/${messageId}/read`,
                {},
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
                "Failed to mark message as read"
            );
        }
    }
);

// ======================================================
// MESSAGE SLICE
// ======================================================

const messageSlice = createSlice({
    name: "message",
    initialState,

    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },

        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },

        clearSelectedUser: (state) => {
            state.selectedUser = null;
            state.messages = [];
        },

        clearMessages: (state) => {
            state.messages = [];
        },

        clearMessageData: (state) => {
            state.recentChats = [];
            state.messages = [];
            state.selectedUser = null;
            state.error = null;
        },
    },

    extraReducers: (builder) => {

        // ======================================================
        // FETCH RECENT MESSAGES
        // ======================================================

        builder
            .addCase(fetchRecentMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchRecentMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.recentChats =
                    action.payload.recentChats || [];
            })

            .addCase(fetchRecentMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ======================================================
        // FETCH CONVERSATION
        // ======================================================

        builder
            .addCase(fetchConversation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchConversation.fulfilled, (state, action) => {
                state.loading = false;
                state.messages =
                    action.payload.messages || [];
            })

            .addCase(fetchConversation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ======================================================
        // SEND MESSAGE
        // ======================================================

        builder
            .addCase(sendNewMessage.pending, (state) => {
                state.sending = true;
                state.error = null;
            })

            .addCase(sendNewMessage.fulfilled, (state, action) => {
                state.sending = false;

                if (action.payload.message) {
                    state.messages.push(
                        action.payload.message
                    );
                }
            })

            .addCase(sendNewMessage.rejected, (state, action) => {
                state.sending = false;
                state.error = action.payload;
            });

        // ======================================================
        // MARK MESSAGE AS READ
        // ======================================================

        builder
            .addCase(markMessageAsRead.fulfilled, (state, action) => {
                const messageId = action.meta.arg.messageId;

                const message = state.messages.find(
                    (message) => message._id === messageId
                );

                if (message) {
                    message.read = true;
                }
            })

            .addCase(markMessageAsRead.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const {
    addMessage,
    setSelectedUser,
    clearSelectedUser,
    clearMessages,
    clearMessageData,
} = messageSlice.actions;

export default messageSlice.reducer;