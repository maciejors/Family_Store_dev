import React, { useState } from 'react';
import Icon from '@mdi/react';
import { mdiPencil, mdiDelete } from '@mdi/js';
import './brandsManager.css';
import '../forms.css';
import EditBrandForm from './EditBrandForm';
import BrandData from '@/app/shared/models/BrandData';

interface EditableBrandTileProps {
	brandData: BrandData;
	onConfirmEdit: { (brandId: string, newBrandName: string): Promise<void> };
	onDelete: { (brandId: string): void };
}

export default function EditableBrandTile({
	brandData,
	onConfirmEdit,
	onDelete,
}: EditableBrandTileProps) {
	const [isEditing, setIsEditing] = useState(false);

	function showEditor() {
		setIsEditing(true);
	}

	function hideEditor() {
		setIsEditing(false);
	}

	async function handleConfirmEdit(newBrandName: string) {
		await onConfirmEdit(brandData.brand.id, newBrandName);
		hideEditor();
	}

	function handleDelete() {
		onDelete(brandData.brand.id);
	}

	return (
		<>
			{!isEditing && (
				<div className="editable-brand-tile">
					<p>
						{brandData.brand.name} ({brandData.appCount})
					</p>
					<button onClick={showEditor}>
						<Icon className="option" path={mdiPencil} size={1} />
					</button>
					{brandData.appCount == 0 && (
						<button onClick={handleDelete}>
							<Icon className="option" path={mdiDelete} size={1} />
						</button>
					)}
				</div>
			)}
			{isEditing && (
				<EditBrandForm
					defaultBrandName={brandData.brand.name}
					onConfirmEdit={handleConfirmEdit}
					onCancel={hideEditor}
				/>
			)}
		</>
	);
}
