import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      user: userReducer,
    },
  });

  return store;
}