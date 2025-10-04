import React from 'react';
import Image from 'next/image';
import LastUpdatedLabel from '@/components/LastUpdatedLabel';
import Icon from '@mdi/react';
import { mdiUpload, mdiPencil, mdiLaunch } from '@mdi/js';
import Dialog from './Dialog';
import UpdateAppForm from './app-forms/UpdateAppForm';
import EditAppForm from './app-forms/EditAppForm';
import AppPreview from '@/models/AppPreview';

export interface AppCardProps {
	app: AppPreview;
}

export default function AppCard({ app }: AppCardProps) {
	return (
		<div className="card p-4 text-lg transition-colors bg-white flex flex-col justify-between">
			<main className="flex flex-row justify-start gap-6">
				<Image
					src={app.logoUrl}
					alt={`${app.name} logo`}
					width={100}
					height={100}
					priority={true}
				/>
				<div className="app-details">
					<h3>{app.name}</h3>
					<p className="text-base text-gray-600">Wersja: {app.version}</p>
					<span className="text-base text-gray-600">
						<LastUpdatedLabel lastUpdatedIso={app.lastUpdated} prefix="Aktual. " />
					</span>
				</div>
			</main>
			<footer className="flex flex-row justify-end gap-4">
				<a href={`/apps/${app.id}`} target="_blank">
					<Icon className="footer-btn" path={mdiLaunch} size={1} />
				</a>
				<Dialog
					openButton={<Icon className="icon-button" path={mdiUpload} size={1} />}
					title="Dodaj aktualizację"
				>
					<UpdateAppForm appId={app.id} />
				</Dialog>
				<Dialog
					openButton={<Icon className="icon-button" path={mdiPencil} size={1} />}
					title="Edytuj aplikację"
				>
					<EditAppForm appId={app.id} />
				</Dialog>
			</footer>
		</div>
	);
}
