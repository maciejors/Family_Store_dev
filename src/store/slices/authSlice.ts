import { createSlice } from '@reduxjs/toolkit';
import User from '@/models/User';

export interface AuthState {
	isLoadedState: boolean;
	authUser?: User | null;
}

const initialState: AuthState = {
	isLoadedState: false,
};

const authSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		loadInitState: (state, action) => {
			const userData: User | null = action.payload;
			state.authUser = userData;
			state.isLoadedState = true;
		},
		logInAction: (state, action) => {
			const userData: User = action.payload;
			state.authUser = userData;
		},
		logOutAction: (state) => {
			state.authUser = null;
		},
	},
});

export const { loadInitState, logInAction, logOutAction } = authSlice.actions;
export default authSlice.reducer;
