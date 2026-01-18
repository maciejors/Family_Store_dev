'use client';

import useAuth from '@/hooks/useAuth';
import useAccess from '@/hooks/useAccess';
import Button from '@/components/buttons/Button';
import MessagePage from '@/components/MessagePage';
import { useTranslations } from 'next-intl';

export default function AccessDeniedPage() {
	const { logOut } = useAuth();
	const canViewPage = useAccess(['user']);
	const t = useTranslations('AccessDenied');

	return (
		canViewPage && (
			<MessagePage title={t('title')}>
				<p className="text-center">
					Ta część platformy jest dostępna jedynie dla użytkowników z kontem dewelopera.
				</p>
				<Button onClick={logOut}>Wyloguj się</Button>
			</MessagePage>
		)
	);
}
