import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import EditBrandForm, { EditBrandFormProps } from './EditBrandForm';

function renderComponent(propsOverrides: Partial<EditBrandFormProps> = {}) {
	const props: EditBrandFormProps = {
		defaultBrandName: '',
		onConfirmEdit: jest.fn(),
		onCancel: jest.fn(),
		...propsOverrides,
	};
	render(<EditBrandForm {...props} />);
}

test('Should display a textbox and buttons to confirm/cancel', () => {
	renderComponent();
	expect(screen.getByRole('textbox')).toBeInTheDocument();
	expect(screen.getByRole('button', { name: /confirm/i }));
	expect(screen.getByRole('button', { name: /cancel/i }));
});

test('Should display a textbox with the default value when provided', () => {
	const defaultBrandName = 'SuperBrand';
	renderComponent({ defaultBrandName });
	expect(screen.getByRole('textbox')).toHaveValue(defaultBrandName);
});

test('Should fire a relevant callback when confirming an edit', async () => {
	const onConfirmEdit = jest.fn();
	const onCancel = jest.fn();
	renderComponent({ onConfirmEdit, onCancel });

	const userInput = 'SuperBrand';
	await user.type(screen.getByRole('textbox'), userInput);

	await user.click(screen.getByRole('button', { name: /confirm/i }));
	expect(onConfirmEdit).toHaveBeenCalledWith(userInput);
	expect(onCancel).not.toHaveBeenCalled();
});

test('Should fire a relevant callback when cancelling', async () => {
	const onConfirmEdit = jest.fn();
	const onCancel = jest.fn();
	renderComponent({ onConfirmEdit, onCancel });

	const userInput = 'SuperBrand';
	await user.type(screen.getByRole('textbox'), userInput);

	await user.click(screen.getByRole('button', { name: /cancel/i }));
	expect(onConfirmEdit).not.toHaveBeenCalled();
	expect(onCancel).toHaveBeenCalled();
});
