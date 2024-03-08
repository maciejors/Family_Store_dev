'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserAppsByBrands } from '../../db/database';
import { signOut } from '@/app/db/auth';
import AppList from './AppList';
import Dialog from './Dialog';
import './dashboard.css';
import useAuth from '@/app/shared/useAuth';
import { isLoggedInDeveloper, isLoggedInRegular, isNotAuthenticated } from '@/app/shared/user';
import NoAppsInfo from './NoAppsInfo';
import BrandsManager from './brands-manager/BrandsManager';
import ReplaceWithSpinnerIf from './ReplaceWithSpinnerIf';
import AddAppForm from './app-forms/AddAppForm';

export default function Dashboard() {
	const { push } = useRouter();
	let { currentUser } = useAuth();
	// appsDataToDisplay: a list of objects { brand, apps } where app count > 0
	const [appsData, setAppsData] = useState(null);

	async function logout() {
		await signOut();
	}

	async function onUserChanged() {
		if (currentUser !== null) {
			if (isNotAuthenticated(currentUser)) {
				push('/dev');
				return;
			}
			if (isLoggedInRegular(currentUser)) {
				push('/dev/access-denied');
				return;
			}
			const fetchedData = await getUserAppsByBrands(currentUser.uid);
			const dataToDisplay = fetchedData.filter(({ apps }) => apps.length > 0); // skip brands with no apps;
			setAppsData(dataToDisplay);
		}
	}

	useEffect(() => {
		onUserChanged();
	}, [currentUser]);

	return (
		currentUser &&
		isLoggedInDeveloper(currentUser) && (
			<div className="main-container">
				<header className="dashboard-header">
					<h2>Moje aplikacje</h2>
					<div className="header-buttons">
						<Dialog
							openButton={<div className="btn btn-primary">Zarządzaj markami</div>}
							title="Zarządzanie markami"
						>
							<BrandsManager userUid={currentUser.uid} />
						</Dialog>
						<Dialog
							openButton={<div className="btn btn-primary">Dodaj aplikację</div>}
							title="Dodaj aplikację"
						>
							<AddAppForm userUid={currentUser.uid} />
						</Dialog>
						<button className="btn btn-secondary" onClick={logout}>
							Wyloguj się
						</button>
					</div>
				</header>
				<main className="w-full">
					<ReplaceWithSpinnerIf condition={appsData === null} extraSpinnerWrapperClasses="pt-16">
						{appsData &&
							appsData.length > 0 &&
							appsData.map(({ brand, apps }) => (
								<AppList brandName={brand.name} apps={apps} key={brand.id} />
							))}
						{appsData && appsData.length === 0 && <NoAppsInfo />}
					</ReplaceWithSpinnerIf>
				</main>
			</div>
		)
	);
}
