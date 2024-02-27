import { useEffect, useState } from 'react';
import { authStateListener, createUser, signIn } from '@/app/db/auth';

function useAuth() {
	const key = 'user';
	const [currentUser, setCurrentUser] = useState(null);

	async function login(email, password) {
		await signIn(email, password);
	}

	async function register(email, password) {
		await createUser(email, password);
	}

	useEffect(() => {
		setCurrentUser(
			JSON.parse(localStorage.getItem(key)) || {
				uid: null,
				email: null,
				displayName: null,
			}
		);

		const unsubscribe = authStateListener((user) => {
			if (user) {
				const data = {
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
				};
				setCurrentUser(data);
				localStorage.setItem(key, JSON.stringify(data));
			} else {
				setCurrentUser({
					uid: null,
					email: null,
					displayName: null,
				});
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
