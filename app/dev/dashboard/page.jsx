'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAppsForBrand, getBrandsForUser } from '../../db/database';
import { signOut } from '@/app/db/auth';
import AppList from './AppList';
import './dashboard.css';
import useAuth from '@/app/shared/useAuth';
import { isLoggedInDeveloper, isLoggedInRegular, isNotAuthenticated } from '@/app/shared/user';

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
	const [brands, setBrands] = useState([]);
	const [appsByBrands, setAppsByBrands] = useState(null);

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
			setBrands(fetchedBrands);
			setAppsByBrands(fetchedAppsByBrands);
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
					{brands.map((brand) => {
						const apps = appsByBrands.get(brand.id) ?? [];
						return <AppList brandName={brand.name} apps={apps} key={brand.id} />;
					})}
				</main>
			</div>
		)
	);
}
