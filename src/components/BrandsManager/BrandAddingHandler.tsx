import React, { useState } from 'react';
import EditBrandForm from './EditBrandForm';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';

export default function BrandAddingHandler({ onConfirmAddBrand }) {
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
				<button className="text-primary flex flex-row items-center" onClick={showEditor}>
					<Icon path={mdiPlus} size={1} />
					<p className="text-lg">Dodaj</p>
				</button>
			)}
			{isAddingBrand && (
				<EditBrandForm
					defaultBrandName=""
					onConfirmEdit={handleConfirmAddBrand}
					onCancel={handleCancelAddBrand}
				/>
			)}
		</>
	);
}
