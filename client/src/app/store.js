import {configureStore} from "@reduxjs/toolkit";
import userReducer from "../features/user/userslice";
import messageReducer from "../features/messages/messageslice";
import connectionReducer from "../features/connections/connectionslice";
import postReducer from "../features/posts/postslice.js";
export const store = configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer,
    connection: connectionReducer,
    post: postReducer,
  },
});