import MessagePage from '@/components/MessagePage';
import { useTranslations } from 'next-intl';

export default function AppNotFoundPage() {
	const t = useTranslations('NotFound');
	return <MessagePage title={t('titleApp')} />;
}
