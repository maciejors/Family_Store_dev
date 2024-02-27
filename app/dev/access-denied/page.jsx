'use client';

import { useRouter } from 'next/navigation';
import { signOut } from '@/app/db/auth';
import '../../globals.css';
import './styles.css';

export default function page() {
	const { push } = useRouter();

	async function logout() {
		await signOut();
		push('/dev');
	}

	return (
		<div className="message-container">
			<main className="message">
				<h2>Access denied</h2>
				<p>This part of the website is only accessible to users with a developer account.</p>
				<button className="btn btn-primary" onClick={logout}>
					Logout
				</button>
			</main>
		</div>
	);
}
