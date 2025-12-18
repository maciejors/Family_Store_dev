'use client';

import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';
import { isLoggedInDeveloper, isLoggedInRegular } from '@/lib/utils/userFunctions';
import Button from '@/components/buttons/Button';
import MessagePage from '@/components/MessagePage';

export default function AccessDeniedPage() {
	const { currentUser, logOut } = useAuth();
	const { push } = useRouter();

	useEffect(() => {
		if (currentUser !== undefined) {
			if (currentUser === null) {
				push('/dev/auth');
				return;
			}
			if (isLoggedInDeveloper(currentUser)) {
				push('/dev/dashboard');
				return;
			}
		}
	}, [currentUser, push]);

	return (
		currentUser &&
		isLoggedInRegular(currentUser) && (
			<MessagePage title="Odmowa dostępu">
				<p className="text-center">
					Ta część platformy jest dostępna jedynie dla użytkowników z kontem dewelopera.
				</p>
				<Button onClick={logOut}>Wyloguj się</Button>
			</MessagePage>
		)
	);
}
