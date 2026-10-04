import {configureStore} from "@reduxjs/toolkit";
import userReducer from "../features/user/userslice";
import messageReducer from "../features/messages/messageslice";
import connectionReducer from "../features/connections/connectionslice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer,
    connection: connectionReducer,
  },
});