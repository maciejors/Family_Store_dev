'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAppsForBrand, getBrandsForUser } from '../../db/database';
import { signOut } from '@/app/db/auth';
import AppList from './AppList';
import './dashboard.css';
import useAuth from '@/app/shared/useAuth';
import { isLoggedInDeveloper, isLoggedInRegular, isNotAuthenticated } from '@/app/shared/user';
import NoAppsInfo from './NoAppsInfo';
import Spinner from '@/app/shared/Spinner';

async function getAppsByBrands(brands) {
	const result = new Map();
	for (let brand of brands) {
		const apps = await getAppsForBrand(brand.id);
		result.set(brand.id, apps);
	}
	return result;
}

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
			const fetchedBrands = await getBrandsForUser(currentUser.uid);
			const fetchedAppsByBrands = await getAppsByBrands(fetchedBrands);
			const appsDataToDisplay = fetchedBrands
				.map((brand) => {
					// get app list for each brand
					const apps = fetchedAppsByBrands.get(brand.id) ?? [];
					return { brand, apps };
				})
				.filter(({ apps }) => apps.length > 0); // skip brands with no apps;
			setAppsData(appsDataToDisplay);
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
						<button className="btn btn-primary">Zarządzaj markami</button>
						<button className="btn btn-primary">Dodaj aplikację</button>
						<button className="btn btn-secondary" onClick={logout}>
							Wyloguj się
						</button>
					</div>
				</header>
				<main className="w-full">
					{appsData &&
						appsData.length > 0 &&
						appsData.map(({ brand, apps }) => (
							<AppList brandName={brand.name} apps={apps} key={brand.id} />
						))}
					{appsData && appsData.length === 0 && <NoAppsInfo />}
					{appsData === null && (
						<div className="spinner-container">
							<Spinner size={64} width={6} />
						</div>
					)}
				</main>
			</div>
		)
	);
}
