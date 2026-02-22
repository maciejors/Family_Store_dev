import AppPreview from '@/models/AppPreview';
import AppCard from '../AppCard';

export type AppListProps = {
	brandName: string;
	apps: AppPreview[];
};

export default function AppList({ brandName, apps }: AppListProps) {
	return (
		<div className="w-full">
			<h5 className="w-full border-b border-secondary text-secondary dark:border-secondary-dark dark:text-secondary-dark">
				{brandName}
			</h5>
			<div className="grid grid-flow-row gap-8 py-6 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
				{apps.map((app) => (
					<AppCard app={app} key={app.id} />
				))}
			</div>
		</div>
	);
}
