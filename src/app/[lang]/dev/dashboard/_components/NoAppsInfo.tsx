import { useTranslations } from 'next-intl';

export default function NoAppsInfo() {
	const t = useTranslations('NoAppsInfo');
	return (
		<div className="w-full py-16 flex flex-col gap-2 items-center text-center">
			<h3>{t('welcome')}</h3>
			<p>{t('noApps')}</p>
		</div>
	);
}
