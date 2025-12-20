import Image from 'next/image';
import Icon from '@mdi/react';
import { mdiDownload } from '@mdi/js';
import { getAppDetails } from '@/lib/supabase/database/apps';
import styles from './page.module.css';
import ImageViewer from './_components/ImageViewer';
import FormattedDateLabel from '@/components/FormattedDateLabel';
import Button from '@/components/buttons/Button';
import MainContainer from '@/components/wrappers/MainContainer';
import Card from '@/components/wrappers/Card';
import AppDetails from '@/models/AppDetails';
import { notFound } from 'next/navigation';

export default async function AppDetailsPage(props: { params: any }) {
	const params = await props.params;
	let app: AppDetails | undefined = undefined;
	try {
		app = await getAppDetails(params.id);
	} catch (err: any) {
		notFound();
	}

	return (
		app && (
			<MainContainer>
				<header className={styles['app-header']}>
					<div className={styles['app-banner']}>
						<div className={styles['logo-container']}>
							<Image
								src={app.logoUrl}
								alt={`${app.name} logo`}
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
							<p className="text-gray-600 sm:text-lg text-sm">Wersja: {app.version}</p>
							<p className="text-gray-600 sm:text-xl text-base">Autor: {app.brandName}</p>
						</div>
					</div>
					<div className={styles['download-container']}>
						<a download href={app.downloadUrl} className="contents">
							<Button component="span" className={styles['download-btn']}>
								<p>Pobierz</p>
								<Icon path={mdiDownload} size={1} />
							</Button>
						</a>
						<span className={styles['formatted-date-label']}>
							<FormattedDateLabel
								lastUpdatedIso={app.lastUpdated}
								prefix="Ostatnia aktualizacja: "
							/>
						</span>
						<span className={styles['formatted-date-label']}>
							<FormattedDateLabel
								lastUpdatedIso={app.createdAt}
								prefix="Opublikowano: "
							/>
						</span>
					</div>
				</header>
				<main className={styles['app-details']}>
					<p>{app.description}</p>
					<ImageViewer imagesUrls={app.pictureUrls} />
					{app.changelog && (
						<Card className="py-2 px-4">
							<h6>Lista zmian:</h6>
							<p>{app.changelog}</p>
						</Card>
					)}
				</main>
			</MainContainer>
		)
	);
}
