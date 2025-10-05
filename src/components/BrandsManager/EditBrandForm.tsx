import React, { FormEvent, useState } from 'react';
import Icon from '@mdi/react';
import { mdiCheck, mdiClose } from '@mdi/js';
import '../AppForms/forms.css';
import brandManagerStyles from './BrandsManager.module.css';
import IconButton from '../buttons/IconButton';

interface EditBrandFormProps {
	defaultBrandName: string;
	onConfirmEdit: { (newBrandName: string): void };
	onCancel: VoidFunction;
}

export default function EditBrandForm({
	defaultBrandName,
	onConfirmEdit,
	onCancel,
}: EditBrandFormProps) {
	const [newNameInput, setNewNameInput] = useState(defaultBrandName);
	const [isInputValid, setIsInputValid] = useState(true);

	function validateInput() {
		const isValid = newNameInput !== '';
		setIsInputValid(isValid);
		return isValid;
	}

	function handleConfirm(e: FormEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (validateInput()) {
			onConfirmEdit(newNameInput);
		}
	}

	function handleCancel() {
		onCancel();
	}

	return (
		<form onSubmit={handleConfirm} className={brandManagerStyles['editable-brand-tile']}>
			<input
				type="text"
				value={newNameInput}
				onChange={(e) => setNewNameInput(e.target.value)}
				placeholder="Nazwa marki"
				className={'text-input' + (isInputValid ? '' : ' text-input-invalid')}
			/>
			<IconButton type="submit" icon={<Icon path={mdiCheck} size={1} />} />
			<IconButton
				type="button"
				onClick={handleCancel}
				icon={<Icon path={mdiClose} size={1} />}
			/>
		</form>
	);
}
