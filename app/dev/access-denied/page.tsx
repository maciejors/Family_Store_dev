'use client';

import { useRouter } from 'next/navigation';
import { signOut } from '@/app/shared/firebase/auth';
import '@/app/globals.css';
import './styles.css';
import useAuth from '@/app/shared/hooks/useAuth';
import { useEffect } from 'react';
import {
	isLoggedInDeveloper,
	isLoggedInRegular,
	isNotAuthenticated,
} from '@/app/shared/utils/userFunctions';

export default function AccessDeniedPage() {
	const { currentUser } = useAuth();
	const { push } = useRouter();

	async function logout() {
		await signOut();
		push('/dev');
	}

	useEffect(() => {
		if (currentUser !== null) {
			if (isNotAuthenticated(currentUser)) {
				push('/dev');
				return;
			}
			if (isLoggedInDeveloper(currentUser)) {
				push('/dev/dashboard');
				return;
			}
		}
	}, [currentUser]);

	return (
		currentUser &&
		isLoggedInRegular(currentUser) && (
			<div className="message-container">
				<main className="message">
					<h2>Odmowa dostępu</h2>
					<p>Ta część platformy jest dostępna jedynie dla użytkowników z kontem dewelopera.</p>
					<button className="btn btn-primary" onClick={logout}>
						Wyloguj się
					</button>
				</main>
			</div>
		)
	);
}
