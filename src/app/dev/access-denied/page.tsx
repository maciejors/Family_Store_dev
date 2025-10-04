'use client';

import { useRouter } from 'next/navigation';
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
			<div className="flex flex-col items-center justify-center h-screen">
				<main className="p-10 shadow-md rounded-sm bg-white mx-8 max-w-md flex flex-col gap-4 items-center">
					<h2 className="text-center">Odmowa dostępu</h2>
					<p className="text-center">
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
