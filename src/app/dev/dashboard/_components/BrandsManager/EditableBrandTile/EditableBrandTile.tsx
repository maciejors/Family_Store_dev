import React, { useState } from 'react';
import Icon from '@mdi/react';
import { mdiPencil, mdiDelete } from '@mdi/js';
import '../../AppForms/forms.css';
import EditBrandForm from '../EditBrandForm';
import Brand from '@/models/Brand';
import IconButton from '@/components/buttons/IconButton';

export type EditableBrandTileProps = {
	brandData: Brand;
	onConfirmEdit: { (brandId: number, newBrandName: string): Promise<void> };
	onDelete: { (brandId: number): void };
};

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
				<div className="flex gap-2 items-center">
					<p className="text-xl">
						{brandData.name} ({brandData.appCount})
					</p>
					<IconButton
						onClick={showEditor}
						icon={<Icon path={mdiPencil} size={1} />}
						aria-label="edit"
					/>
					{brandData.appCount == 0 && (
						<IconButton
							onClick={handleDelete}
							icon={<Icon path={mdiDelete} size={1} />}
							aria-label="delete"
						/>
					)}
				</div>
			)}
		</>
	);
}
