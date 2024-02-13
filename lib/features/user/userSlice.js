import { getUserFromLocalStorage } from "@/lib/userLocalStorage";
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: getUserFromLocalStorage(),
  reducers: {
    setUser: (state, payload) => {
      state.uid = payload.uid;
      state.email = payload.email;
      state.displayName = payload.displayName;
    },
    cleanUser: (state) => {
      state.uid = null;
      state.email = null;
      state.displayName = null;
    }
  },
});

export const selectUser = state => state.user;
export const { setUser, cleanUser } = userSlice.actions;
export default userSlice.reducer;