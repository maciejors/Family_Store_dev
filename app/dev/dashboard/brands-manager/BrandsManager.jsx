import { useEffect, useState } from 'react';
import { addBrand, deleteBrand, getUserAppsByBrands, updateBrand } from '@/app/db/database';
import EditableBrandTile from './EditableBrandTile';
import BrandAddingHandler from './BrandAddingHandler';
import Spinner from '@/app/shared/Spinner';
import './brandsManager.css';

async function getBrandsDataToDisplay(userUid) {
	const fullBrandsData = await getUserAppsByBrands(userUid);
	// we need just app counts
	return fullBrandsData.map(({ brand, apps }) => ({ brand, appCount: apps.length }));
}

export default function BrandsManager({ userUid }) {
	// brands data: a list of objects { brand, appCount }
	const [brandsData, setBrandsData] = useState(null);

	async function fetchBrandsData() {
		setBrandsData(null);
		const fetchedData = await getBrandsDataToDisplay(userUid);
		setBrandsData(fetchedData);
	}

	useEffect(() => {
		fetchBrandsData();
	}, []);

	async function handleConfirmEditBrand(brandId, newBrandName) {
		await updateBrand(brandId, newBrandName);
		await fetchBrandsData();
	}

	async function handleDeleteBrand(brandId) {
		await deleteBrand(brandId);
		await fetchBrandsData();
	}

	async function handleConfirmAddBrand(brandName) {
		await addBrand(userUid, brandName);
		await fetchBrandsData();
	}

	return (
		<>
			{brandsData && (
				<ul className="brands-list">
					{brandsData.map((brandData) => (
						<li key={brandData.brand.id}>
							<EditableBrandTile
								brandData={brandData}
								onConfirmEdit={handleConfirmEditBrand}
								onDelete={handleDeleteBrand}
							/>
						</li>
					))}
					<li key="">
						<BrandAddingHandler onConfirmAddBrand={handleConfirmAddBrand} />
					</li>
				</ul>
			)}
			{!brandsData && (
				<div className="spinner-container py-4">
					<Spinner size={48} width={5} />
				</div>
			)}
		</>
	);
}
