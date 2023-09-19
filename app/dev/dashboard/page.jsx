import { getAppsForBrand, getBrandsForUser } from '../../db/database';
import AppList from './AppList';
import './dashboard.css';

async function getAppsByBrands(brands) {
	const result = new Map();
	for (let brand of brands) {
		const apps = await getAppsForBrand(brand.id);
		result.set(brand.id, apps);
	}
	return result;
}

export default async function Dashboard() {
	const brands = await getBrandsForUser('user1');
	const appsByBrands = await getAppsByBrands(brands);

	return (
		<div className="main-container">
			<header>
				<h2>Moje aplikacje</h2>
				<div className="header-buttons">
					<button className="btn btn-secondary">Zarządzaj markami</button>
					<button className="btn btn-primary">Dodaj aplikację</button>
				</div>
			</header>
			<main className="w-full">
				{brands.map((brand) => {
					const apps = appsByBrands.get(brand.id);
					return <AppList brandName={brand.name} apps={apps} key={brand.id} />;
				})}
			</main>
		</div>
	);
}
