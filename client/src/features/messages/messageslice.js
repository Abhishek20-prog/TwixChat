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

export const deleteMessageForSender = createAsyncThunk(
    "message/deleteMessageForSender",
    async ({ token, messageId }, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(
                `/api/message/${messageId}/sender`,
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
                    "Failed to delete message"
            );
        }
    }
);

export const deleteMessageForReceiver = createAsyncThunk(
    "message/deleteMessageForReceiver",
    async ({ token, messageId }, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(
                `/api/message/${messageId}/receiver`,
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
                    "Failed to delete message"
            );
        }
    }
);

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

        builder
            .addCase(fetchConversation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchConversation.fulfilled, (state, action) => {
                state.loading = false;
                state.messages =
                    action.payload.messages || [];

                state.selectedUser =
                    action.payload.user || null;
            })

            .addCase(fetchConversation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

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

        builder
            .addCase(deleteMessageForSender.fulfilled, (state, action) => {
                const messageId = action.meta.arg.messageId;

                state.messages = state.messages.filter(
                    (message) => message._id !== messageId
                );
            })

            .addCase(deleteMessageForSender.rejected, (state, action) => {
                state.error = action.payload;
            });

        builder
            .addCase(deleteMessageForReceiver.fulfilled, (state, action) => {
                const messageId = action.meta.arg.messageId;

                state.messages = state.messages.filter(
                    (message) => message._id !== messageId
                );
            })

            .addCase(deleteMessageForReceiver.rejected, (state, action) => {
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