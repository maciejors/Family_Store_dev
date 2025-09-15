import React from 'react';
import AppCard from './AppCard';
import './dashboard.css';
import AppPreview from '@/app/shared/models/AppPreview';

export interface AppListProps {
	brandName: string;
	apps: AppPreview[];
}

export default function AppList({ brandName, apps }: AppListProps) {
	return (
		<div className="apps-list">
			<h5>{brandName}</h5>
			<div className="apps-grid">
				{apps.map((app) => (
					<AppCard app={app} key={app.id} />
				))}
			</div>
		</div>
	);
}
