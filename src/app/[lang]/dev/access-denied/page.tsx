'use client';

import Button from '@/components/buttons/Button';
import MessagePage from '@/components/MessagePage';
import useAccess from '@/hooks/useAccess';
import useAuth from '@/hooks/useAuth';
import { useTranslations } from 'next-intl';

export default function AccessDeniedPage() {
	const { logOut } = useAuth();
	const canViewPage = useAccess(['user']);
	const t = useTranslations('AccessDenied');

	return (
		canViewPage && (
			<MessagePage title={t('title')}>
				<p className="text-center">{t('description')}</p>
				<Button onClick={logOut}>{t('logOut')}</Button>
			</MessagePage>
		)
	);
}
