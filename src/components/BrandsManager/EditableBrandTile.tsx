import React, { useState } from 'react';
import Icon from '@mdi/react';
import { mdiPencil, mdiDelete } from '@mdi/js';
import brandManagerStyles from './BrandsManager.module.css';
import '../AppForms/forms.css';
import EditBrandForm from './EditBrandForm';
import Brand from '@/models/Brand';
import IconButton from '../shared/buttons/IconButton';

interface EditableBrandTileProps {
	brandData: Brand;
	onConfirmEdit: { (brandId: number, newBrandName: string): Promise<void> };
	onDelete: { (brandId: number): void };
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
		await onConfirmEdit(brandData.id, newBrandName);
		hideEditor();
	}

	function handleDelete() {
		onDelete(brandData.id);
	}

	return (
		<>
			{isEditing ? (
				<EditBrandForm
					defaultBrandName={brandData.name}
					onConfirmEdit={handleConfirmEdit}
					onCancel={hideEditor}
				/>
			) : (
				<div className={brandManagerStyles['editable-brand-tile']}>
					<p className="text-xl">
						{brandData.name} ({brandData.appCount})
					</p>
					<IconButton onClick={showEditor} icon={<Icon path={mdiPencil} size={1} />} />
					{brandData.appCount == 0 && (
						<IconButton
							onClick={handleDelete}
							icon={<Icon path={mdiDelete} size={1} />}
						/>
					)}
				</div>
			)}
		</>
	);
}
