import Image from 'next/image';
import LastUpdatedLabel from '../LastUpdatedLabel';

export default function AppCard({ app }) {
	return (
		<a href={`/apps/${app.id}`} className="card app-card">
			<Image src={app.logoUrl} alt={`${app.name} logo`} width={100} height={100} />
			<div className="app-details">
				<h3>{app.name}</h3>
				<p className="version-label">Wersja: {app.version}</p>
				<LastUpdatedLabel lastUpdatedMillis={app.lastUpdated} prefix="Aktual. " />
			</div>
		</a>
	);
}
