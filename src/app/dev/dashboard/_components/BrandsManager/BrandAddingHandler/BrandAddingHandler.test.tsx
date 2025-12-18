import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import BrandAddingHandler, { BrandAddingHandlerProps } from './BrandAddingHandler';

function renderComponent(propsOverrides: Partial<BrandAddingHandlerProps> = {}) {
	const props: BrandAddingHandlerProps = {
		onConfirmAddBrand: jest.fn(),
		...propsOverrides,
	};
	render(<BrandAddingHandler {...props} />);
}

test('Should only display a button to add the brand by default', () => {
	renderComponent();
	expect(screen.getByRole('button', { name: /dodaj/i })).toBeInTheDocument();
	expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});

test('Should show the textbox and be able to cancel it', async () => {
	const onConfirmAddBrand = jest.fn();
	renderComponent({ onConfirmAddBrand });

	await user.click(screen.getByRole('button', { name: /dodaj/i }));

	expect(screen.queryByRole('button', { name: /dodaj/i })).not.toBeInTheDocument();
	expect(screen.getByRole('textbox')).toBeInTheDocument();

	const cancelButton = screen.getByRole('button', { name: /cancel/i });
	await user.click(cancelButton);

	expect(screen.getByRole('button', { name: /dodaj/i })).toBeInTheDocument();
	expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
	expect(onConfirmAddBrand).not.toHaveBeenCalled();
});

test('Should submit the new brand name when confirmed', async () => {
	const onConfirmAddBrand = jest.fn();
	renderComponent({ onConfirmAddBrand });

	await user.click(screen.getByRole('button', { name: /dodaj/i }));
	const newBrandName = 'New brand';
	await user.type(screen.getByRole('textbox'), newBrandName);

	const confirmButton = screen.getByRole('button', { name: /confirm/i });
	await user.click(confirmButton);

	expect(screen.getByRole('button', { name: /dodaj/i })).toBeInTheDocument();
	expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
	expect(onConfirmAddBrand).toHaveBeenCalledWith(newBrandName);
});
