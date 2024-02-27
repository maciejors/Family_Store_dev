import { isUserDeveloper } from '../db/auth';

export default async function checkPermissions(user, onUserNotAuthenticated, onUserNotDeveloper) {
	if (user.uid === null) {
		onUserNotAuthenticated();
		return;
	}
	const isDev = await isUserDeveloper(user);
	if (!isDev) {
		onUserNotDeveloper();
	}
}
