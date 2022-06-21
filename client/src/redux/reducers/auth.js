import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      //   if error
      if (action?.payload?.error != null) {
        return { error: action.payload.error };
      }
      //   if logout
      if (action?.payload == null)
        return {
          error: null,
        };
      return {
        ...state,
        ...action.payload,
      };
    },
    changePhotoUrl: (state, action) => {
      return {
        ...state,
        photoUrl: action.payload,
      };
    },
    changeUsername: (state, action) => {
      return {
        ...state,
        username: action.payload,
      };
    },
    changePassword: (state, action) => {
      return {
        ...state,
        password: action.payload,
      };
    },
  },
});

export const { setUser, changePhotoUrl, changeUsername, changePassword } =
  authSlice.actions;
export default authSlice.reducer;
