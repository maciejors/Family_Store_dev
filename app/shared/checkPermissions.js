export default async function checkPermissions(user, onUserNotAuthenticated, onUserNotDeveloper) {
	if (user.uid === null) {
		onUserNotAuthenticated();
		return;
	}
	if (!user.isDev) {
		onUserNotDeveloper();
	}
}
