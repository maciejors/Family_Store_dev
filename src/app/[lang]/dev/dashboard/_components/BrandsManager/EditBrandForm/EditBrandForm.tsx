import IconButton from '@/components/buttons/IconButton';
import TextInput from '@/components/inputs/TextInput';
import { mdiCheck, mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import { useTranslations } from 'next-intl';
import { FormEvent, useState } from 'react';

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

	const t = useTranslations('BrandsManager');

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
				placeholder={t('brandName')}
				error={!isInputValid}
				compact
			/>
			<IconButton
				type="submit"
				icon={<Icon path={mdiCheck} size={1} />}
				aria-label={t('confirm')}
			/>
			<IconButton
				type="button"
				onClick={handleCancel}
				icon={<Icon path={mdiClose} size={1} />}
				aria-label={t('cancel')}
			/>
		</form>
	);
}
