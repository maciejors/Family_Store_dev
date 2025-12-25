import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import useAuth from '@/hooks/useAuth';
import AuthPage from './page';
import { push } from '@/__mocks__/next/navigation';

jest.mock('next/router');
jest.mock('@/hooks/useAuth');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockLogIn = jest.fn();
const mockRegister = jest.fn();
const mockUseAuthReturnValue = {
	currentUser: null,
	logIn: mockLogIn,
	register: mockRegister,
	logOut: jest.fn(),
};
mockUseAuth.mockReturnValue(mockUseAuthReturnValue);

function renderComponent() {
	return render(<AuthPage />);
}

type FormData = {
	email?: string;
	password?: string;
	repeatPassword?: string;
};

async function fillForm(data: FormData) {
	if (data.email) {
		await user.type(screen.getByRole('textbox', { name: /email/i }), data.email);
	}
	if (data.password) {
		await user.type(screen.getByLabelText(/^hasło/i), data.password);
	}
	if (data.repeatPassword) {
		await user.type(screen.getByLabelText(/powtórz hasło/i), data.repeatPassword);
	}
}

describe('General', () => {
	test('Should allow to switch back and forth between login and register', async () => {
		renderComponent();
		await user.click(await screen.findByRole('button', { name: /nie mam konta/i }));
		expect(screen.getByRole('heading', { name: /rejestracja/i })).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: /mam już konto/i }));
		expect(screen.getByRole('heading', { name: /logowanie/i })).toBeInTheDocument();
	});

	test('Should redirect authenticated non-developers to access denied page', async () => {
		mockUseAuth.mockReturnValueOnce({
			...mockUseAuthReturnValue,
			currentUser: {
				email: 'test@example.com',
				uid: '123',
				displayName: 'Frank',
				isDev: false,
			},
		});
		renderComponent();
		await waitFor(() => {
			expect(push).toHaveBeenCalledWith('/dev/access-denied');
		});
	});

	test('Should redirect authenticated developes to dashboard page', async () => {
		mockUseAuth.mockReturnValueOnce({
			...mockUseAuthReturnValue,
			currentUser: {
				email: 'test@example.com',
				uid: '123',
				displayName: 'Frank',
				isDev: true,
			},
		});
		renderComponent();
		await waitFor(() => {
			expect(push).toHaveBeenCalledWith('/dev/dashboard');
		});
	});
});

describe('Login form', () => {
	test('Should render login form by default', async () => {
		renderComponent();
		expect(
			await screen.findByRole('heading', { name: /logowanie/i })
		).toBeInTheDocument();
		expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
		expect(screen.getByLabelText(/^hasło/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /zaloguj się/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /nie mam konta/i })).toBeInTheDocument();
	});

	test('Should allow to log in', async () => {
		renderComponent();
		await screen.findByRole('heading', { name: /logowanie/i });

		const email = 'test@example.com';
		const password = 'Password@123';
		await fillForm({ email, password });
		await user.click(screen.getByRole('button', { name: /zaloguj się/i }));

		expect(mockLogIn).toHaveBeenCalledWith(email, password);
	});

	test.skip('Should require email', async () => {
		renderComponent();
		await screen.findByRole('heading', { name: /logowanie/i });

		await fillForm({ password: '123' });
		await user.click(screen.getByRole('button', { name: /zaloguj się/i }));

		expect(mockLogIn).not.toHaveBeenCalled();
		expect(screen.getByText(/wypełnij wszystkie pola/i)).toBeInTheDocument();
	});

	test.skip('Should require password', async () => {
		renderComponent();
		await screen.findByRole('heading', { name: /logowanie/i });

		await fillForm({ email: 'test@example.com' });
		await user.click(screen.getByRole('button', { name: /zaloguj się/i }));

		expect(mockLogIn).not.toHaveBeenCalled();
		expect(screen.getByText(/wypełnij wszystkie pola/i)).toBeInTheDocument();
	});
});

describe('Register form', () => {
	test('Should render register form when switched to it', async () => {
		renderComponent();
		await user.click(await screen.findByRole('button', { name: /nie mam konta/i }));

		expect(screen.getByRole('heading', { name: /rejestracja/i })).toBeInTheDocument();
		expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
		expect(screen.getByLabelText(/^hasło/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/powtórz hasło/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /utwórz konto/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /mam już konto/i })).toBeInTheDocument();
	});

	test('Should allow to register', async () => {
		renderComponent();
		await user.click(await screen.findByRole('button', { name: /nie mam konta/i }));

		const email = 'test@example.com';
		const password = 'Password@123';
		await fillForm({ email, password, repeatPassword: password });

		await user.click(screen.getByRole('button', { name: /utwórz konto/i }));
		expect(mockRegister).toHaveBeenCalledWith(email, password);
	});

	test('Should require email', async () => {
		renderComponent();
		await user.click(await screen.findByRole('button', { name: /nie mam konta/i }));

		const password = 'Password@123';
		await fillForm({ password, repeatPassword: password });
		await user.click(screen.getByRole('button', { name: /utwórz konto/i }));

		expect(mockLogIn).not.toHaveBeenCalled();
		expect(screen.getByText(/wypełnij wszystkie pola/i)).toBeInTheDocument();
	});

	test('Should require password', async () => {
		renderComponent();
		await user.click(await screen.findByRole('button', { name: /nie mam konta/i }));

		await fillForm({ email: 'test@example.com', repeatPassword: 'Password@123' });
		await user.click(screen.getByRole('button', { name: /utwórz konto/i }));

		expect(mockLogIn).not.toHaveBeenCalled();
		expect(screen.getByText(/wypełnij wszystkie pola/i)).toBeInTheDocument();
	});

	test('Should require repeat password', async () => {
		renderComponent();
		await user.click(await screen.findByRole('button', { name: /nie mam konta/i }));

		await fillForm({ email: 'test@example.com', password: 'Password@123' });
		await user.click(screen.getByRole('button', { name: /utwórz konto/i }));

		expect(mockLogIn).not.toHaveBeenCalled();
		expect(screen.getByText(/wypełnij wszystkie pola/i)).toBeInTheDocument();
	});

	test('Should validate repeat password', async () => {
		renderComponent();
		await user.click(await screen.findByRole('button', { name: /nie mam konta/i }));

		await fillForm({
			email: 'test@example.com',
			password: 'Password@123',
			repeatPassword: 'DifferentPassword',
		});
		await user.click(screen.getByRole('button', { name: /utwórz konto/i }));

		expect(mockLogIn).not.toHaveBeenCalled();
		expect(screen.getByText(/hasła nie są takie same/i)).toBeInTheDocument();
	});

	test('Should validate password strength', async () => {
		renderComponent();
		await user.click(await screen.findByRole('button', { name: /nie mam konta/i }));

		await fillForm({
			email: 'test@example.com',
			password: '123',
			repeatPassword: '123',
		});
		await user.click(screen.getByRole('button', { name: /utwórz konto/i }));

		expect(mockLogIn).not.toHaveBeenCalled();
		expect(
			screen.getByText(/twoje hasło jest zbyt słabe, wymyśl coś trudniejszego/i)
		).toBeInTheDocument();
	});
});
