import { setupComponent } from '@/__test-utils__/rendering';
import { screen, within } from '@testing-library/react';
import user from '@testing-library/user-event';
import AppFormTemplate, { AppFormTemplateProps } from './AppFormTemplate';

function renderComponent(
	propsOverrides: Partial<Pick<AppFormTemplateProps, 'onSubmit' | 'isLoading'>> = {}
) {
	const childrenTestId = 'children';
	const props: Omit<AppFormTemplateProps, 'children'> = {
		name: 'Form',
		submitBtnText: 'Submit',
		isLoading: false,
		...propsOverrides,
		onSubmit: async (e) => {
			e.preventDefault();
			await propsOverrides.onSubmit?.(e);
		},
	};
	return {
		renderResult: setupComponent(
			<AppFormTemplate {...props}>
				<div data-testid={childrenTestId}></div>
			</AppFormTemplate>
		)
			.applyLocale('pl')
			.render(),
		childrenTestId,
		...props,
	};
}

test('Should render form when not loading', () => {
	const { childrenTestId, name, submitBtnText } = renderComponent();

	expect(screen.getByRole('form', { name })).toBeInTheDocument();
	expect(screen.getByTestId(childrenTestId)).toBeInTheDocument();
	expect(screen.getByText(/\* pole wymagane/i)).toBeInTheDocument();
	expect(screen.getByRole('button', { name: submitBtnText })).toBeInTheDocument();
});

test('Should not render form when not loading and show a spinner instead', () => {
	const { childrenTestId, name, submitBtnText } = renderComponent({ isLoading: true });

	expect(screen.queryByRole('form', { name })).not.toBeInTheDocument();
	expect(screen.queryByTestId(childrenTestId)).not.toBeInTheDocument();
	expect(screen.queryByText(/\* pole wymagane/i)).not.toBeInTheDocument();
	expect(screen.queryByRole('button', { name: submitBtnText })).not.toBeInTheDocument();

	expect(screen.getByRole('status')).toBeInTheDocument();
});

test('Should display spinner in the submit button when loading after submitting', async () => {
	const onSubmit = jest.fn(() => new Promise(() => {}));
	const { submitBtnText } = renderComponent({ onSubmit });

	await user.click(screen.getByRole('button', { name: submitBtnText }));
	expect(onSubmit).toHaveBeenCalled();
	const submitBtn = screen.getByRole('button');
	expect(within(submitBtn).getByRole('status')).toBeInTheDocument();
});

test('Should display success message on successful submit and hide the submit button', async () => {
	const onSubmit = jest.fn(() => Promise.resolve());
	const { submitBtnText } = renderComponent({ onSubmit });

	await user.click(screen.getByRole('button', { name: submitBtnText }));
	expect(onSubmit).toHaveBeenCalled();
	expect(screen.getByText(/sukces/i)).toBeInTheDocument();
	expect(screen.queryByRole('button', { name: submitBtnText })).not.toBeInTheDocument();
});

test('Should display failure message on failed submit', async () => {
	jest.spyOn(console, 'error').mockImplementation(() => {});

	const onSubmit = jest.fn(() => Promise.reject());
	const { submitBtnText } = renderComponent({ onSubmit });

	await user.click(screen.getByRole('button', { name: submitBtnText }));
	expect(onSubmit).toHaveBeenCalled();
	expect(console.error).toHaveBeenCalled();
	expect(screen.getByText(/wystąpił błąd/i)).toBeInTheDocument();
	expect(screen.queryByRole('button', { name: submitBtnText })).toBeInTheDocument();

	(console.error as jest.Mock).mockRestore();
});
