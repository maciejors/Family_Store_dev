'use client';

import useAuth from '@/hooks/useAuth';
import useAccess from '@/hooks/useAccess';
import Button from '@/components/buttons/Button';
import MessagePage from '@/components/MessagePage';

export default function AccessDeniedPage() {
	const { logOut } = useAuth();
	const canViewPage = useAccess(['user']);

	return (
		canViewPage && (
			<MessagePage title="Odmowa dostępu">
				<p className="text-center">
					Ta część platformy jest dostępna jedynie dla użytkowników z kontem dewelopera.
				</p>
				<Button onClick={logOut}>Wyloguj się</Button>
			</MessagePage>
		)
	);
}
