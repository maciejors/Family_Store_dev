import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import EditableBrandTile, { EditableBrandTileProps } from './EditableBrandTile';
import Brand from '@/models/Brand';

function renderComponent(propsOverrides: Partial<EditableBrandTileProps> = {}) {
	const mockBrand: Brand = { id: 1, name: 'SuperBrand', appCount: 0 };
	const props: EditableBrandTileProps = {
		brandData: mockBrand,
		onConfirmEdit: jest.fn(),
		onDelete: jest.fn(),
		...propsOverrides,
	};
	return {
		brand: mockBrand,
		renderResult: render(<EditableBrandTile {...props} />),
	};
}

test('Should display brand name and buttons to edit/delete when brand has 0 apps', () => {
	const { brand } = renderComponent();

	expect(screen.getByText(`${brand.name} (${brand.appCount})`)).toBeInTheDocument();
	expect(screen.getAllByRole('button')).toHaveLength(2);
	expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
	expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
	expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});

test('Should not display delete button when brand has some apps', () => {
	const brandWithManyApps: Brand = {
		id: 1,
		name: 'SuperBrand',
		appCount: 1,
	};
	renderComponent({ brandData: brandWithManyApps });

	expect(screen.getAllByRole('button')).toHaveLength(1);
	expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
	expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
});

test('Should allow to edit brand name', async () => {
	const onConfirmEdit = jest.fn();
	const { brand } = renderComponent({ onConfirmEdit });

	await user.click(screen.getByRole('button', { name: /edit/i }));

	const textbox = screen.getByRole('textbox');
	expect(textbox).toHaveValue(brand.name);
	await user.clear(textbox);
	const newBrandName = 'New brand';
	await user.type(screen.getByRole('textbox'), newBrandName);

	const confirmButton = screen.getByRole('button', { name: /confirm/i });
	await user.click(confirmButton);

	expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
	expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
	expect(onConfirmEdit).toHaveBeenCalledWith(brand.id, newBrandName);
});

test('Should allow to cancel editing brand name', async () => {
	const onConfirmEdit = jest.fn();
	renderComponent({ onConfirmEdit });

	await user.click(screen.getByRole('button', { name: /edit/i }));

	expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
	expect(screen.getByRole('textbox')).toBeInTheDocument();

	const cancelButton = screen.getByRole('button', { name: /cancel/i });
	await user.click(cancelButton);

	expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
	expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
	expect(onConfirmEdit).not.toHaveBeenCalled();
});

test('Should allow to delete a brand with no apps', async () => {
	const onDelete = jest.fn();
	const { brand } = renderComponent({ onDelete });

	await user.click(screen.getByRole('button', { name: /delete/i }));
	expect(onDelete).toHaveBeenCalledWith(brand.id);
});
