import { useEffect, useMemo } from 'react';
import { useRouter } from '@/i18n/navigation';
import useAuth from '../useAuth';
import Role from '@/models/Role';

type RoleKey = Role['key'] | 'anon';

export type RoleRedirect = {
	key: RoleKey;
	path: string;
};

const defaultRedirects: RoleRedirect[] = [
	{ key: 'anon', path: '/dev/auth' },
	{ key: 'user', path: '/dev/access-denied' },
	{ key: 'dev', path: '/dev/dashboard' },
];

export default function useAccess(
	allowed: RoleKey[],
	customRedirects: RoleRedirect[] = []
): boolean {
	const redirects = useMemo(
		() => [...customRedirects, ...defaultRedirects],
		[customRedirects]
	);
	const { push } = useRouter();
	const { currentUser } = useAuth();

	let userRole: RoleKey | undefined;
	if (currentUser === undefined) {
		userRole = undefined;
	} else if (currentUser === null) {
		userRole = 'anon';
	} else {
		userRole = currentUser.role.key;
	}

	const isAuthorised = userRole !== undefined && allowed.includes(userRole);

	useEffect(() => {
		if (isAuthorised || userRole === undefined) {
			return; // authorised or current user not loaded yet
		}
		const redirectPath = redirects.find((r) => r.key === userRole)!.path;
		push(redirectPath);
	}, [userRole, isAuthorised, push, redirects]);

	return isAuthorised;
}
