import Image from 'next/image';
import LastUpdatedLabel from '../../LastUpdatedLabel';
import Icon from '@mdi/react';
import { mdiUpload, mdiPencil, mdiLaunch } from '@mdi/js';
import Dialog from './Dialog';
import UpdateAppForm from './forms/UpdateAppForm';

export default function AppCard({ app }) {
	return (
		<div className="card app-card">
			<main>
				<Image src={app.logoUrl} alt={`${app.name} logo`} width={100} height={100} />
				<div className="app-details">
					<h3>{app.name}</h3>
					<p className="version-label">Wersja: {app.version}</p>
					<span className="last-updated-label">
						<LastUpdatedLabel lastUpdatedMillis={app.lastUpdated} prefix="Aktual. " />
					</span>
				</div>
			</main>
			<footer>
				<a href={`/apps/${app.id}`} target="_blank">
					<Icon className="footer-btn" path={mdiLaunch} size={1} />
				</a>
				<Dialog
					openButton={<Icon className="footer-btn" path={mdiUpload} size={1} />}
					title="Dodaj aktualizację"
				>
					<UpdateAppForm appId={app.id} />
				</Dialog>
				<Dialog
					openButton={<Icon className="footer-btn" path={mdiPencil} size={1} />}
					title="Edytuj aplikację"
				>
					<span>TODO</span>
				</Dialog>
			</footer>
		</div>
	);
}
