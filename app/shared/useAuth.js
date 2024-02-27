import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authStateListener, createUser, signIn } from '@/app/db/auth';

function useAuth() {
	const { push } = useRouter();

	function redirectToDashboard() {
		push('/dev/dashboard');
	}

	const key = 'user';
	const [currentUser, setCurrentUser] = useState(null);

	async function login(email, password) {
		await signIn(email, password);
		redirectToDashboard();
	}

	async function register(email, password) {
		await createUser(email, password);
		redirectToDashboard();
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
