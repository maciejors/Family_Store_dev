import IconButton from '@/components/buttons/IconButton';
import Card from '@/components/wrappers/Card';
import Dialog from '@/components/wrappers/Dialog';
import { Link } from '@/i18n/navigation';
import AppPreview from '@/models/AppPreview';
import { mdiLaunch, mdiPencil, mdiUpload } from '@mdi/js';
import Icon from '@mdi/react';
import { DateTimeFormatOptions, useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import EditAppForm from '../AppForms/EditAppForm';
import UpdateAppForm from '../AppForms/UpdateAppForm';

export type AppCardProps = {
	app: AppPreview;
};

export default function AppCard({ app }: AppCardProps) {
	const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	const t = useTranslations('AppCard');
	const format = useFormatter();
	const dateFormattingOptions: DateTimeFormatOptions = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	};

	return (
		<Card className="p-4 text-lg flex flex-col justify-between">
			<main className="flex flex-row justify-start gap-6">
				<Image
					src={app.logoUrl}
					alt={t('logo', { appName: app.name })}
					width={100}
					height={100}
					priority={true}
				/>
				<div className="app-details">
					<h3>{app.name}</h3>
					<p className="text-base text-gray-600">
						{t('version', { version: app.version })}
					</p>
					<span className="text-base text-gray-600">
						{t('lastUpdatedDate', {
							date: format.dateTime(app.lastUpdated, dateFormattingOptions),
						})}
					</span>
				</div>
			</main>
			<footer className="flex flex-row justify-end gap-4">
				<Link
					href={`/apps/${app.id}`}
					target="_blank"
					className="contents"
					aria-label={t('linkToApp', { appName: app.name })}
				>
					<IconButton component="span" icon={<Icon path={mdiLaunch} size={1} />} />
				</Link>
				<>
					<IconButton
						icon={<Icon path={mdiUpload} size={1} />}
						onClick={() => setIsUpdateDialogOpen(true)}
						aria-label={t('updateApp', { appName: app.name })}
					/>
					<Dialog
						open={isUpdateDialogOpen}
						handleClose={() => setIsUpdateDialogOpen(false)}
						title={t('updateApp', { appName: app.name })}
					>
						<UpdateAppForm appId={app.id} />
					</Dialog>
				</>
				<>
					<IconButton
						icon={<Icon path={mdiPencil} size={1} />}
						onClick={() => setIsEditDialogOpen(true)}
						aria-label={t('editApp', { appName: app.name })}
					/>
					<Dialog
						open={isEditDialogOpen}
						handleClose={() => setIsEditDialogOpen(false)}
						title={t('editApp', { appName: app.name })}
					>
						<EditAppForm appId={app.id} />
					</Dialog>
				</>
			</footer>
		</Card>
	);
}
