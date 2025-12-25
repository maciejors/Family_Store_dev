import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import useAuth from '@/hooks/useAuth';
import AccessDeniedPage from './page';
import User from '@/models/User';
import { push } from '@/__mocks__/next/navigation';

jest.mock('next/navigation');
jest.mock('@/hooks/useAuth');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const MOCK_USER_DATA: User = {
	uid: '123',
	email: 'test@example.com',
	displayName: 'Frank Lampard',
	isDev: false,
};

function renderComponent(mockUser: User | null = MOCK_USER_DATA) {
	const mockLogout = jest.fn();

	mockUseAuth.mockReturnValue({
		currentUser: mockUser,
		logOut: mockLogout,
		logIn: jest.fn(),
		register: jest.fn(),
	});

	return {
		mockUser,
		mockLogout,
		renderResult: render(<AccessDeniedPage />),
	};
}

test('Should render info on access denied and a button to log out', () => {
	renderComponent();
	expect(screen.getByRole('heading', { name: /odmowa dostępu/i })).toBeInTheDocument();
	expect(screen.getByRole('button', { name: /wyloguj/i })).toBeInTheDocument();
});

test('Should log out when clicked on the button', async () => {
	const { mockLogout } = renderComponent();
	await user.click(screen.getByRole('button', { name: /wyloguj/i }));
	expect(mockLogout).toHaveBeenCalled();
});

test('Should redirect developers to dashboard', async () => {
	renderComponent({ ...MOCK_USER_DATA, isDev: true });
	await waitFor(() => {
		expect(push).toHaveBeenCalledWith('/dev/dashboard');
	});
});

test('Should redirect anonymous users to auth page', async () => {
	renderComponent(null);
	await waitFor(() => {
		expect(push).toHaveBeenCalledWith('/dev/auth');
	});
});
