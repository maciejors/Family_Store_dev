import { setupComponent } from '@/__test-utils__/rendering';
import useAuth from '@/hooks/useAuth';
import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import LoginForm from './LoginForm';

jest.mock('@/hooks/useAuth');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockLogIn = jest.fn();
const mockUseAuthReturnValue = {
	currentUser: null,
	logIn: mockLogIn,
	register: jest.fn(),
	logOut: jest.fn(),
};
mockUseAuth.mockReturnValue(mockUseAuthReturnValue);

function renderComponent() {
	return setupComponent(<LoginForm />)
		.applyLocale('pl')
		.render();
}

type FormData = {
	email?: string;
	password?: string;
};

const getLoginButton = () => screen.getByRole('button', { name: /zaloguj się/i });

async function fillForm(data: FormData) {
	if (data.email) {
		await user.type(screen.getByRole('textbox', { name: /email/i }), data.email);
	}
	if (data.password) {
		await user.type(screen.getByLabelText(/^hasło/i), data.password);
	}
}

test('Should render login form by default', async () => {
	renderComponent();
	expect(screen.getByRole('heading', { name: /logowanie/i })).toBeInTheDocument();
	expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
	expect(screen.getByLabelText(/^hasło/i)).toBeInTheDocument();
	expect(getLoginButton()).toBeInTheDocument();
});

test('Should allow to log in', async () => {
	renderComponent();

	const email = 'test@example.com';
	const password = 'Password@123';
	await fillForm({ email, password });
	await user.click(getLoginButton());

	expect(mockLogIn).toHaveBeenCalledWith(email, password);
});

test('Should require email', async () => {
	renderComponent();

	await fillForm({ password: '123' });
	await user.click(getLoginButton());

	expect(mockLogIn).not.toHaveBeenCalled();
	expect(screen.getByText(/adres e-mail jest nieprawidłowy/i)).toBeInTheDocument();
});

test('Should require password', async () => {
	renderComponent();

	await fillForm({ email: 'test@example.com' });
	await user.click(getLoginButton());

	expect(mockLogIn).not.toHaveBeenCalled();
	expect(screen.getByText(/proszę podać hasło/i)).toBeInTheDocument();
});
