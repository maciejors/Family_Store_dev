'use client';

import { useRouter } from 'next/navigation';
import '@/app/globals.css';
import './styles.css';
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';
import { isLoggedInDeveloper, isLoggedInRegular } from '@/lib/utils/userFunctions';

export default function AccessDeniedPage() {
	const { currentUser, logOut } = useAuth();
	const { push } = useRouter();

	useEffect(() => {
		if (currentUser !== undefined) {
			if (currentUser === null) {
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
					<p>
						Ta część platformy jest dostępna jedynie dla użytkowników z kontem dewelopera.
					</p>
					<button className="btn btn-primary" onClick={logOut}>
						Wyloguj się
					</button>
				</main>
			</div>
		)
	);
}
