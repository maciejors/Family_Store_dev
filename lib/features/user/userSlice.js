import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: {
    uid: '',
    email: '',
    displayName: '', 
  },
  reducers: {
    setUser: (state, payload) => {
      state.uid = payload.uid;
      state.email = payload.email;
      state.displayName = payload.displayName;
    },
  },
});

export const selectUser = state => state.user;
export const { setUser } = userSlice.actions;
export default userSlice.reducer;