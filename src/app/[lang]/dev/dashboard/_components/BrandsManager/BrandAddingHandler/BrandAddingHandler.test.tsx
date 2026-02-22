import { setupComponent } from '@/__test-utils__/rendering';
import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import BrandAddingHandler, { BrandAddingHandlerProps } from './BrandAddingHandler';

function renderComponent(propsOverrides: Partial<BrandAddingHandlerProps> = {}) {
	const props: BrandAddingHandlerProps = {
		onConfirmAddBrand: jest.fn(),
		...propsOverrides,
	};
	setupComponent(<BrandAddingHandler {...props} />)
		.applyLocale()
		.render();
}

test('Should only display a button to add the brand by default', () => {
	renderComponent();
	expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
	expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});

test('Should show the textbox and be able to cancel it', async () => {
	const onConfirmAddBrand = jest.fn();
	renderComponent({ onConfirmAddBrand });

	await user.click(screen.getByRole('button', { name: /add/i }));

	expect(screen.queryByRole('button', { name: /add/i })).not.toBeInTheDocument();
	expect(screen.getByRole('textbox')).toBeInTheDocument();

	const cancelButton = screen.getByRole('button', { name: /cancel/i });
	await user.click(cancelButton);

	expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
	expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
	expect(onConfirmAddBrand).not.toHaveBeenCalled();
});

test('Should submit the new brand name when confirmed', async () => {
	const onConfirmAddBrand = jest.fn();
	renderComponent({ onConfirmAddBrand });

	await user.click(screen.getByRole('button', { name: /add/i }));
	const newBrandName = 'New brand';
	await user.type(screen.getByRole('textbox'), newBrandName);

	const confirmButton = screen.getByRole('button', { name: /confirm/i });
	await user.click(confirmButton);

	expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
	expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
	expect(onConfirmAddBrand).toHaveBeenCalledWith(newBrandName);
});
