import { useEffect, useState } from 'react';
import { authStateListener, createUser, signIn } from '@/app/db/auth';
import { getAnonymousUser } from './user';

function useAuth() {
	const key = 'user';
	const [currentUser, setCurrentUser] = useState(null);

	async function login(email, password) {
		try {
			await signIn(email, password);
			return { success: true };
		} catch (error) {
			return { success: false, error };
		}
	}

	async function register(email, password) {
		try {
			await createUser(email, password);
			return { success: true };
		} catch (error) {
			return { success: false, error };
		}
	}

	useEffect(() => {
		setCurrentUser(JSON.parse(localStorage.getItem(key)) || getAnonymousUser());

		const unsubscribe = authStateListener((user, isDev) => {
			if (user) {
				const data = {
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
					isDev,
				};
				setCurrentUser(data);
				localStorage.setItem(key, JSON.stringify(data));
			} else {
				setCurrentUser(getAnonymousUser());
				localStorage.removeItem(key);
			}
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return {
		currentUser,
		login,
		register,
	};
}

export default useAuth;
