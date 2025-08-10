import { useEffect, useState } from 'react';
import { authStateListener, createUser, signIn } from '@/app/shared/firebase/auth';
import { User as FirebaseUser } from 'firebase/auth';
import User from '@/app/shared/models/User';

function useAuth() {
	const localStorageKey = 'user';
	const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined);

	async function login(email: string, password: string) {
		try {
			await signIn(email, password);
			return { success: true };
		} catch (error) {
			return { success: false, error };
		}
	}

	async function register(email: string, password: string) {
		try {
			await createUser(email, password);
			return { success: true };
		} catch (error) {
			return { success: false, error };
		}
	}

	useEffect(() => {
		const userStr = localStorage.getItem(localStorageKey);
		if (userStr !== null) {
			setCurrentUser(JSON.parse(userStr));
		} else {
			setCurrentUser(null);
		}

		const unsubscribe = authStateListener((firebaseUser: FirebaseUser, isDev: boolean) => {
			if (firebaseUser) {
				const user: User = {
					uid: firebaseUser.uid,
					email: firebaseUser.email!,
					displayName: firebaseUser.displayName!,
					isDev,
				};
				setCurrentUser(user);
				localStorage.setItem(localStorageKey, JSON.stringify(user));
			} else {
				setCurrentUser(null);
				localStorage.removeItem(localStorageKey);
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
