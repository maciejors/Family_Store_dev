import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { loadInitState, logInAction, logOutAction } from '@/store/slices/authSlice';
import { signUpSupabase, signInSupabase, signOutSupabase } from '@/lib/supabase/auth';
import User from '@/models/User';

function useAuth() {
	const LOCAL_STORAGE_KEY = 'user';

	const currentUser = useSelector((state: RootState) => state.auth.authUser);
	const dispatch = useDispatch();

	function validateUserObj(user: Object | null): boolean {
		if (!user) {
			// we treat nulls as valid users
			return true;
		}
		// Important check after `isDev` was changed to `role`
		return Object.keys(user).includes('role');
	}

	useEffect(() => {
		const userStr = localStorage.getItem(LOCAL_STORAGE_KEY);
		const user = userStr === null ? null : JSON.parse(userStr);
		if (!validateUserObj(user)) {
			localStorage.clear();
			return;
		}
		dispatch(loadInitState(user as User));
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
