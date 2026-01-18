import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import useAuth from '@/hooks/useAuth';
import AuthPage from './page';
import { useRouter } from '@/i18n/navigation';
import { ROLE_DEV, ROLE_USER } from '@/__test-utils__/roles';

jest.mock('@/i18n/navigation');
jest.mock('@/hooks/useAuth');

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush });

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

test('Should allow to switch back and forth between login and register', async () => {
	renderComponent();
	expect(await screen.findByRole('heading', { name: /logowanie/i })).toBeInTheDocument();

	const goToRegisterBtn = await screen.findByRole('button', { name: /nie mam konta/i });
	expect(goToRegisterBtn).toBeInTheDocument();
	await user.click(goToRegisterBtn);
	expect(screen.getByRole('heading', { name: /rejestracja/i })).toBeInTheDocument();

	const goToLoginBtn = await screen.findByRole('button', { name: /mam już konto/i });
	expect(goToLoginBtn).toBeInTheDocument();
	await user.click(goToLoginBtn);
	expect(screen.getByRole('heading', { name: /logowanie/i })).toBeInTheDocument();
});

test('Should redirect authenticated non-developers to access denied page', async () => {
	mockUseAuth.mockReturnValueOnce({
		...mockUseAuthReturnValue,
		currentUser: {
			email: 'test@example.com',
			uid: '123',
			displayName: 'Frank',
			role: ROLE_USER,
		},
	});
	renderComponent();
	await waitFor(() => {
		expect(mockPush).toHaveBeenCalledWith('/dev/access-denied');
	});
});

test('Should redirect authenticated developes to dashboard page', async () => {
	mockUseAuth.mockReturnValueOnce({
		...mockUseAuthReturnValue,
		currentUser: {
			email: 'test@example.com',
			uid: '123',
			displayName: 'Frank',
			role: ROLE_DEV,
		},
	});
	renderComponent();
	await waitFor(() => {
		expect(mockPush).toHaveBeenCalledWith('/dev/dashboard');
	});
});
