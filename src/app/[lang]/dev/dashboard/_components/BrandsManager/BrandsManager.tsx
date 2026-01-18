import React from 'react';
import {
	addBrand,
	deleteBrand,
	updateBrand,
	getBrandsForUser,
} from '@/lib/supabase/database/brands';
import EditableBrandTile from './EditableBrandTile';
import BrandAddingHandler from './BrandAddingHandler';
import ConditionalSpinner from '@/components/loading/ConditionalSpinner';
import { useQuery } from '@tanstack/react-query';

export type BrandsManagerProps = {
	userUid: string;
};

export default function BrandsManager({ userUid }) {
	const {
		data: brandsData,
		isFetching: areBrandsFetching,
		refetch: fetchBrandsData,
	} = useQuery({
		queryKey: ['brands', userUid],
		queryFn: () => getBrandsForUser(userUid),
	});

	async function handleConfirmEditBrand(brandId: number, newBrandName: string) {
		await updateBrand(brandId, newBrandName);
		await fetchBrandsData();
	}

	async function handleDeleteBrand(brandId: number) {
		await deleteBrand(brandId);
		await fetchBrandsData();
	}

	async function handleConfirmAddBrand(brandName: string) {
		await addBrand(userUid, brandName);
		await fetchBrandsData();
	}

	return (
		<ConditionalSpinner isLoading={areBrandsFetching} spinnerSize={48} spinnerWidth={5}>
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
