import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/shared/store/store';
import { loadInitState, logInAction, logOutAction } from '@/app/shared/store/slices/authSlice';
import { signUpSupabase, signInSupabase, signOutSupabase } from '@/app/shared/supabase/auth';
import User from '@/app/shared/models/User';

function useAuth() {
	const LOCAL_STORAGE_KEY = 'user';

	const currentUser = useSelector((state: RootState) => state.auth.authUser);
	const dispatch = useDispatch();

	useEffect(() => {
		const userStr = localStorage.getItem(LOCAL_STORAGE_KEY);
		const user = userStr === null ? null : (JSON.parse(userStr) as User);
		dispatch(loadInitState(user));
	}, [dispatch]);

	async function logIn(email: string, password: string) {
		const user = await signInSupabase(email, password);
		dispatch(logInAction(user));
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
	}

	async function register(email: string, password: string) {
		const user = await signUpSupabase(email, password);
		dispatch(logInAction(user));
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
	}

	async function logOut() {
		await signOutSupabase();
		dispatch(logOutAction());
		localStorage.removeItem(LOCAL_STORAGE_KEY);
	}

	return {
		currentUser,
		logIn,
		register,
		logOut,
	};
}

export default useAuth;
