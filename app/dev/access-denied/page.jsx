'use client';

import { useRouter } from 'next/navigation';
import { signOut } from '@/app/db/auth';
import '../../globals.css';
import './styles.css';
import useAuth from '@/app/shared/useAuth';
import { useEffect } from 'react';
import { isLoggedInDeveloper, isLoggedInRegular, isNotAuthenticated } from '@/app/shared/user';

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
					<h2>Access denied</h2>
					<p>This part of the website is only accessible to users with a developer account.</p>
					<button className="btn btn-primary" onClick={logout}>
						Logout
					</button>
				</main>
			</div>
		)
	);
}
