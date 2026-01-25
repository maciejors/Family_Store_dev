import Button from '@/components/buttons/Button';
import Card from '@/components/wrappers/Card';
import MainContainer from '@/components/wrappers/MainContainer';
import AppDetails from '@/models/AppDetails';
import { mdiDownload } from '@mdi/js';
import Icon from '@mdi/react';
import { DateTimeFormatOptions, useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import ImageViewer from '../ImageViewer';
import styles from './AppView.module.css';

export type AppViewProps = {
	app: AppDetails;
};

export default function AppView({ app }: AppViewProps) {
	const t = useTranslations('AppPage');
	const format = useFormatter();
	const dateFormattingOptions: DateTimeFormatOptions = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	};

	return (
		<MainContainer>
			<header className={styles['app-header']}>
				<div className={styles['app-banner']}>
					<div className={styles['logo-container']}>
						<Image
							src={app.logoUrl}
							alt={t('logo', { appName: app.name })}
							sizes="100vw"
							priority={true}
							style={{
								width: '100%',
								height: 'auto',
								maxHeight: '120px',
								maxWidth: '120px',
							}}
							width={200}
							height={200}
						/>
					</div>
					<div className="col-span-4 flex flex-col">
						<h2 className="text-2xl sm:text-4xl">{app.name}</h2>
						<p className="text-gray-600 sm:text-lg text-sm">
							{t('version', { version: app.version })}
						</p>
						<p className="text-gray-600 sm:text-xl text-base">
							{t('author', { brandName: app.brandName })}
						</p>
					</div>
				</div>
				<div className={styles['download-container']}>
					<a download href={app.downloadUrl} className="contents">
						<Button component="span" className={styles['download-btn']}>
							<p>{t('download')}</p>
							<Icon path={mdiDownload} size={1} />
						</Button>
					</a>
					<p className={styles['formatted-date-label']}>
						{t('lastUpdatedDate', {
							date: format.dateTime(app.lastUpdated, dateFormattingOptions),
						})}
					</p>
					<p className={styles['formatted-date-label']}>
						{t('publishedDate', {
							date: format.dateTime(app.createdAt, dateFormattingOptions),
						})}
					</p>
				</div>
			</header>
			<main className={styles['app-details']}>
				<p>{app.description}</p>
				<ImageViewer imagesUrls={app.pictures.map((p) => p.url)} />
				{app.changelog && (
					<Card className="py-2 px-4">
						<h6>{t('changelog')}</h6>
						<p>{app.changelog}</p>
					</Card>
				)}
			</main>
		</MainContainer>
	);
}
