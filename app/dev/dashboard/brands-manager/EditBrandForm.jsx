import { useState } from 'react';
import Icon from '@mdi/react';
import { mdiCheck, mdiClose } from '@mdi/js';

export default function EditBrandForm({ defaultBrandName, onConfirmEdit, onCancel }) {
	const [newNameInput, setNewNameInput] = useState(defaultBrandName);
	const [isInputValid, setIsInputValid] = useState(true);

	function validateInput() {
		const isValid = newNameInput !== '';
		setIsInputValid(isValid);
		return isValid;
	}

	function handleConfirm(e) {
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
		<form onSubmit={handleConfirm} className="editable-brand-tile">
			<input
				type="text"
				value={newNameInput}
				onChange={(e) => setNewNameInput(e.target.value)}
				placeholder="Nazwa marki"
				className={'text-input' + (isInputValid ? '' : ' text-input-invalid')}
			/>
			<button>
				<Icon className="option" path={mdiCheck} size={1} />
			</button>
			<div onClick={handleCancel} className="fake-button icon-button">
				<Icon className="option" path={mdiClose} size={1} />
			</div>
		</form>
	);
}
