import Image from 'next/image';
import Icon from '@mdi/react';
import { mdiDownload } from '@mdi/js';
import { getAppDetails, getBrandById } from '@/app/db/database';
import './app-details.css';

export default async function AppDetails({ params }) {
	const app = await getAppDetails(params.id);
	const brand = await getBrandById(app.authorId);

	return (
		<div className="main-container">
			<header>
				<div className="app-header">
					<div className="logo-container">
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
					<div className="app-base-info">
						<h2>{app.name}</h2>
						<p className="version-label">Wersja: {app.version}</p>
						<p className="author-label">Autor: {brand.name}</p>
					</div>
				</div>
				<div className="download">
					<a href={app.downloadUrl} className="btn btn-primary download">
						<p>Pobierz</p>
						<Icon path={mdiDownload} size={1} />
					</a>
					<div className="last-update-label">
						<p>Ostatnia aktualizacja:</p>
						<p>28 wrz 2021</p>
					</div>
				</div>
			</header>
			<main>
				<p>{app.description}</p>
				<div className="bg-yellow-300">Images go here</div>
				{app.changelog !== undefined && (
					<div className="card changelog">
						<h6>Lista zmian:</h6>
						<p>{app.changelog}</p>
					</div>
				)}
			</main>
		</div>
	);
}
