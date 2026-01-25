'use client';

import MessagePage from '@/components/MessagePage';
import { useTranslations } from 'next-intl';

export default function DefaultErrorPage() {
	const t = useTranslations('Error');
	return <MessagePage title={t('title')} />;
}
