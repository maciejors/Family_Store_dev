import Image from 'next/image';
import Icon from '@mdi/react';
import { mdiDownload } from '@mdi/js';
import { getAppDetails } from '@/lib/supabase/database/apps';
import styles from './page.module.css';
import ImageViewer from './ImageViewer';
import LastUpdatedLabel from '@/components/LastUpdatedLabel';

export default async function AppDetails(props: { params: any }) {
	const params = await props.params;
	const app = await getAppDetails(params.id);

	return (
		<div className="main-container">
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
					<a
						href={app.downloadUrl}
						className={`btn btn-primary ${styles['download-btn']}`}
					>
						<p>Pobierz</p>
						<Icon path={mdiDownload} size={1} />
					</a>
					<span className={styles['last-updated-label']}>
						<LastUpdatedLabel
							lastUpdatedIso={app.lastUpdated}
							prefix="Ostatnia aktualizacja: "
						/>
					</span>
				</div>
			</header>
			<main className={styles['app-details']}>
				<p>{app.description}</p>
				<ImageViewer imagesUrls={app.pictureUrls} />
				{app.changelog !== undefined && app.changelog !== '' && (
					<div className="card bg-white py-2 px-4">
						<h6>Lista zmian:</h6>
						<p>{app.changelog}</p>
					</div>
				)}
			</main>
		</div>
	);
}
