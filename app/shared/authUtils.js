import { redirect } from 'next/navigation';

import { isUserDeveloper } from '../db/auth';

/**
 * @param {User} user
 */
export async function redirectIfNoPermissions(user) {
	if (user === null) {
		return redirect('/dev/');
	}
	const isDev = await isUserDeveloper(user);
	if (isDev) {
		// TODO: make a special page for non-developers
		return redirect('/dev/');
	}
}
