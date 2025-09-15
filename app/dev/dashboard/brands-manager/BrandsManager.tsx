import React, { useEffect, useState } from 'react';
import {
	addBrand,
	deleteBrand,
	updateBrand,
} from '@/app/shared/supabase/database/brands';
import './brandsManager.css';
import EditableBrandTile from './EditableBrandTile';
import BrandAddingHandler from './BrandAddingHandler';
import Spinner from '@/app/shared/components/Spinner';
import Brand from '@/app/shared/models/Brand';
import { getBrandsForUser } from '@/app/shared/supabase/database/brands';

export default function BrandsManager({ userUid }) {
	const [brandsData, setBrandsData] = useState<Brand[] | null>(null);

	async function fetchBrandsData() {
		const fetchedData = await getBrandsForUser(userUid);
		setBrandsData(fetchedData);
	}

	useEffect(() => {
		fetchBrandsData();
	}, []);

	async function handleConfirmEditBrand(brandId: number, newBrandName: string) {
		setBrandsData(null);
		await updateBrand(brandId, newBrandName);
		await fetchBrandsData();
	}

	async function handleDeleteBrand(brandId: number) {
		setBrandsData(null);
		await deleteBrand(brandId);
		await fetchBrandsData();
	}

	async function handleConfirmAddBrand(brandName: string) {
		setBrandsData(null);
		await addBrand(userUid, brandName);
		await fetchBrandsData();
	}

	return (
		<>
			{brandsData && (
				<ul className="brands-list">
					{brandsData.map((brand) => (
						<li key={brand.id}>
							<EditableBrandTile
								brandData={brand}
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
