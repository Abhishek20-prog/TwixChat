
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

// Create a new post
export const createPost = createAsyncThunk(
    "post/createPost",
    async ({ token, formData }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(
                "/api/post/add",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!data.success) {
                return rejectWithValue(
                    data.message || "Failed to create post."
                );
            }

            return data.post;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to create post."
            );
        }
    }
);

const initialState = {
    posts: [],
    loading: false,
    creating: false,
    error: null,
    success: false,
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        clearPostError: (state) => {
            state.error = null;
        },

        clearPostSuccess: (state) => {
            state.success = false;
        },

        addPostToFeed: (state, action) => {
            state.posts.unshift(action.payload);
        },

        setPosts: (state, action) => {
            state.posts = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPost.pending, (state) => {
                state.creating = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.creating = false;
                state.success = true;

                if (action.payload) {
                    state.posts.unshift(action.payload);
                }
            })
            .addCase(createPost.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const {
    clearPostError,
    clearPostSuccess,
    addPostToFeed,
    setPosts,
} = postSlice.actions;

export default postSlice.reducer;

