import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socketSlice",
  initialState: {
    onlineUsers: [],
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      // get all current onlineUsers
      if (action.payload.onlineUsers) {
        return {
          ...state,
          onlineUsers: action.payload.onlineUsers,
        };
      }

      // add online user
      if (!state.onlineUsers.includes(action.payload.id.toString()))
        return {
          ...state,
          onlineUsers: [...state.onlineUsers, action.payload.id],
        };

      // logout
      if (action.payload?.logout) {
        return {
          ...state,
          onlineUsers: state.onlineUsers.filter(
            (each) => each != action.payload.id.toString()
          ),
        };
      }
    },
  },
});
export const { setOnlineUsers } = socketSlice.actions;
export default socketSlice.reducer;
