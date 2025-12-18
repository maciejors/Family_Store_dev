import React, { useEffect, useState } from 'react';
import {
	addBrand,
	deleteBrand,
	updateBrand,
	getBrandsForUser,
} from '@/lib/supabase/database/brands';
import EditableBrandTile from './EditableBrandTile';
import BrandAddingHandler from './BrandAddingHandler';
import Brand from '@/models/Brand';
import ConditionalSpinner from '@/components/loading/ConditionalSpinner';

export type BrandsManagerProps = {
	userUid: string;
};

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
		<ConditionalSpinner isLoading={!brandsData} spinnerSize={48} spinnerWidth={5}>
			<ul className="pt-2 flex flex-col gap-2">
				{brandsData &&
					brandsData.map((brand) => (
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
		</ConditionalSpinner>
	);
}
