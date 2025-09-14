import Image from 'next/image';
import Icon from '@mdi/react';
import { mdiDownload } from '@mdi/js';
import { getAppDetails, getBrandById } from '@/app/shared/firebase/database';
import './app-details.css';
import ImageViewer from './ImageViewer';
import LastUpdatedLabel from '@/app/shared/components/LastUpdatedLabel';

export default async function AppDetails(props) {
    const params = await props.params;
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
					<span className="last-updated-label">
						<LastUpdatedLabel
							lastUpdatedMillis={app.lastUpdated}
							prefix="Ostatnia aktualizacja: "
						/>
					</span>
				</div>
			</header>
			<main>
				<p>{app.description}</p>
				<ImageViewer imagesUrls={app.pictureUrls} />
				{app.changelog !== undefined && app.changelog !== '' && (
					<div className="card changelog">
						<h6>Lista zmian:</h6>
						<p>{app.changelog}</p>
					</div>
				)}
			</main>
		</div>
	);
}
