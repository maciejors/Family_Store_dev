import { ROLE_DEV, ROLE_USER } from '@/__test-utils__/roles';
import { useRouter } from '@/i18n/navigation';
import User from '@/models/User';
import { renderHook } from '@testing-library/react';
import useAuth from '../useAuth';
import useAccess, { RoleRedirect } from './useAccess';

jest.mock('@/i18n/navigation');
jest.mock('@/hooks/useAuth');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush });

const _SHARED_USER_DATA = {
	uid: '123',
	email: 'test@example.com',
	displayName: 'Frank Lampard',
};

const USER_ANON = null;

const USER_BASE: User = {
	..._SHARED_USER_DATA,
	role: ROLE_USER,
};

const USER_DEV: User = {
	..._SHARED_USER_DATA,
	role: ROLE_DEV,
};

const renderUseAccess = (
	currentUser: User | null | undefined,
	allowed: string[],
	customRedirects: RoleRedirect[] = []
) => {
	mockUseAuth.mockReturnValue({
		currentUser,
		logOut: jest.fn(),
		logIn: jest.fn(),
		register: jest.fn(),
	});

	return renderHook(() => useAccess(allowed as any, customRedirects));
};

test('Should do nothing when currentUser is undefined', () => {
	const { result } = renderUseAccess(undefined, ['user']);

	expect(result.current).toBe(false);
	expect(mockPush).not.toHaveBeenCalled();
});

test('Should allow access when anon is included in allowed roles', () => {
	const { result } = renderUseAccess(USER_ANON, ['anon', 'user']);

	expect(result.current).toBe(true);
	expect(mockPush).not.toHaveBeenCalled();
});

test('Should redirect anon when anon is not allowed', () => {
	const { result } = renderUseAccess(USER_ANON, ['user', 'dev']);

	expect(result.current).toBe(false);
	expect(mockPush).toHaveBeenCalledWith('/dev/auth');
});

test('Should allow access when user role is included in allowed roles', () => {
	const { result } = renderUseAccess(USER_DEV, ['user', 'dev']);

	expect(result.current).toBe(true);
	expect(mockPush).not.toHaveBeenCalled();
});

test('Should redirect user when their role is not in allowed roles', () => {
	const { result } = renderUseAccess(USER_BASE, ['dev', 'anon']);

	expect(result.current).toBe(false);
	expect(mockPush).toHaveBeenCalledWith('/dev/access-denied');
});

test('Should use custom redirects instead of default if specified', () => {
	const customRedirect: RoleRedirect = {
		key: 'anon',
		path: '/custom/login',
	};

	const { result } = renderUseAccess(USER_ANON, ['user'], [customRedirect]);

	expect(result.current).toBe(false);
	expect(mockPush).toHaveBeenCalledWith(customRedirect.path);
});
