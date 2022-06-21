import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import conversationReducer from "./reducers/conversations";
import socketReducer from "./reducers/socket";
export default configureStore({
  reducer: {
    socket: socketReducer,
    auth: authReducer,
    conversations: conversationReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: false,
  //   }),
});
