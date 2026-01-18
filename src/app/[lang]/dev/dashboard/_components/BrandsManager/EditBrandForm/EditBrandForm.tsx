import React, { FormEvent, useState } from 'react';
import Icon from '@mdi/react';
import { mdiCheck, mdiClose } from '@mdi/js';
import IconButton from '@/components/buttons/IconButton';
import TextInput from '@/components/inputs/TextInput';

export type EditBrandFormProps = {
	defaultBrandName: string;
	onConfirmEdit: { (newBrandName: string): void };
	onCancel: VoidFunction;
};

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
		<form onSubmit={handleConfirm} className="flex gap-2 items-center text-lg">
			<TextInput
				type="text"
				value={newNameInput}
				onChange={(e) => setNewNameInput(e.target.value)}
				placeholder="Nazwa marki"
				error={!isInputValid}
				compact
			/>
			<IconButton
				type="submit"
				icon={<Icon path={mdiCheck} size={1} />}
				aria-label="confirm"
			/>
			<IconButton
				type="button"
				onClick={handleCancel}
				icon={<Icon path={mdiClose} size={1} />}
				aria-label="cancel"
			/>
		</form>
	);
}
