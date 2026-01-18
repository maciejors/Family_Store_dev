import React, { useState } from 'react';
import EditBrandForm from '../EditBrandForm';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import TextButton from '@/components/buttons/TextButton';

export type BrandAddingHandlerProps = {
	onConfirmAddBrand: (brandName: string) => Promise<any>;
};

export default function BrandAddingHandler({
	onConfirmAddBrand,
}: BrandAddingHandlerProps) {
	const [isAddingBrand, setIsAddingBrand] = useState(false);

	function showEditor() {
		setIsAddingBrand(true);
	}

	function hideEditor() {
		setIsAddingBrand(false);
	}

	async function handleConfirmAddBrand(brandName: string) {
		await onConfirmAddBrand(brandName);
		hideEditor();
	}

	function handleCancelAddBrand() {
		hideEditor();
	}

	return (
		<>
			{!isAddingBrand && (
				<TextButton onClick={showEditor} startIcon={<Icon path={mdiPlus} size={1} />}>
					Dodaj
				</TextButton>
			)}
			{isAddingBrand && (
				<div className="mb-1">
					<EditBrandForm
						defaultBrandName=""
						onConfirmEdit={handleConfirmAddBrand}
						onCancel={handleCancelAddBrand}
					/>
				</div>
			)}
		</>
	);
}
