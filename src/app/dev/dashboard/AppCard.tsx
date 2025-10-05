import React, { useState } from 'react';
import Image from 'next/image';
import LastUpdatedLabel from '@/components/LastUpdatedLabel';
import Icon from '@mdi/react';
import { mdiUpload, mdiPencil, mdiLaunch } from '@mdi/js';
import Dialog from '@/components/Dialog';
import UpdateAppForm from '@/components/AppForms/UpdateAppForm';
import EditAppForm from '@/components/AppForms/EditAppForm';
import AppPreview from '@/models/AppPreview';
import Link from 'next/link';
import IconButton from '@/components/buttons/IconButton';
import Card from '@/components/Card';

export interface AppCardProps {
	app: AppPreview;
}

export default function AppCard({ app }: AppCardProps) {
	const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	return (
		<Card className="p-4 text-lg flex flex-col justify-between">
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
				<Link href={`/apps/${app.id}`} target="_blank">
					<IconButton icon={<Icon path={mdiLaunch} size={1} />} />
				</Link>
				<>
					<IconButton
						icon={<Icon path={mdiUpload} size={1} />}
						onClick={() => setIsUpdateDialogOpen(true)}
					/>
					<Dialog
						open={isUpdateDialogOpen}
						handleClose={() => setIsUpdateDialogOpen(false)}
						title="Dodaj aktualizację"
					>
						<UpdateAppForm appId={app.id} />
					</Dialog>
				</>
				<>
					<IconButton
						icon={<Icon path={mdiPencil} size={1} />}
						onClick={() => setIsEditDialogOpen(true)}
					/>
					<Dialog
						open={isEditDialogOpen}
						handleClose={() => setIsEditDialogOpen(false)}
						title="Edytuj aplikację"
					>
						<EditAppForm appId={app.id} />
					</Dialog>
				</>
			</footer>
		</Card>
	);
}
