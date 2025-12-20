import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import Dialog, { DialogProps } from './Dialog';

function renderComponent(propsOverrides: Partial<DialogProps> = {}) {
	const props = {
		open: true,
		handleClose: jest.fn(),
		title: '',
		...propsOverrides,
	};
	return render(<Dialog {...props} />);
}

test('Should display the dialog content when open', () => {
	const dialogTitle = 'Dialog title';
	const dialogContentTestId = 'dialog-content';

	renderComponent({
		title: dialogTitle,
		children: <p data-testid={dialogContentTestId}>Dummy content</p>,
	});

	expect(screen.getByRole('heading', { name: dialogTitle })).toBeInTheDocument();
	expect(screen.getByTestId(dialogContentTestId)).toBeInTheDocument();
	expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
});

test('Should not display the content when hidden', () => {
	const dialogTitle = 'Dialog title';
	const dialogContentTestId = 'dialog-content';

	renderComponent({
		title: dialogTitle,
		children: <p data-testid={dialogContentTestId}>Dummy content</p>,
		open: false,
	});

	expect(screen.queryByRole('heading', { name: dialogTitle })).not.toBeInTheDocument();
	expect(screen.queryByTestId(dialogContentTestId)).not.toBeInTheDocument();
	expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
});

test('Should fire a callback when clicking on the close button', async () => {
	const dialogTitle = 'Dialog title';
	const mockHandleClose = jest.fn();

	renderComponent({
		title: dialogTitle,
		handleClose: mockHandleClose,
	});
	expect(mockHandleClose).not.toHaveBeenCalled();

	const closeBtn = screen.getByRole('button', { name: /close/i });
	await user.click(closeBtn);

	expect(mockHandleClose).toHaveBeenCalledTimes(1);
});
