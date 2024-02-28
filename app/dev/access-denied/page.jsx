'use client';

import { useRouter } from 'next/navigation';
import { signOut } from '@/app/db/auth';
import '../../globals.css';
import './styles.css';
import useAuth from '@/app/shared/useAuth';
import { useEffect } from 'react';

export default function page() {
	const { currentUser } = useAuth();
	const { push } = useRouter();

	async function logout() {
		await signOut();
		push('/dev');
	}

	useEffect(() => {
		if (currentUser === null) {
			return;
		}
		if (currentUser.isDev) {
			// logged in and developer
			push('/dev/dashboard');
		} else if (currentUser.uid === null) {
			// not logged in
			push('/dev');
		}
	}, [currentUser]);

	return (
		currentUser &&
		currentUser.uid &&
		!currentUser.isDev && (
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
