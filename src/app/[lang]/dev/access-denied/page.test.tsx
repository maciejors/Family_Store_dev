import { setupComponent } from '@/__test-utils__/rendering';
import { ROLE_DEV, ROLE_USER } from '@/__test-utils__/roles';
import useAuth from '@/hooks/useAuth';
import { useRouter } from '@/i18n/navigation';
import User from '@/models/User';
import { screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import AccessDeniedPage from './page';

jest.mock('@/i18n/navigation');
jest.mock('@/hooks/useAuth');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush });

const MOCK_USER_DATA: User = {
	uid: '123',
	email: 'test@example.com',
	displayName: 'Frank Lampard',
	role: ROLE_USER,
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
		renderResult: setupComponent(<AccessDeniedPage />)
			.applyLocale('pl')
			.render(),
	};
}

test('Should render info on access denied and a button to log out', async () => {
	renderComponent();
	expect(
		await screen.findByRole('heading', { name: /odmowa dostępu/i })
	).toBeInTheDocument();
	expect(screen.getByRole('button', { name: /wyloguj/i })).toBeInTheDocument();
});

test('Should log out when clicked on the button', async () => {
	const { mockLogout } = renderComponent();
	await user.click(await screen.findByRole('button', { name: /wyloguj/i }));
	expect(mockLogout).toHaveBeenCalled();
});

test('Should redirect developers to dashboard', async () => {
	renderComponent({ ...MOCK_USER_DATA, role: ROLE_DEV });
	await waitFor(() => {
		expect(mockPush).toHaveBeenCalledWith('/dev/dashboard');
	});
});

test('Should redirect anonymous users to auth page', async () => {
	renderComponent(null);
	await waitFor(() => {
		expect(mockPush).toHaveBeenCalledWith('/dev/auth');
	});
});
