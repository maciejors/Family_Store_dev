import User from '../models/User';

export function getAnonymousUser(): User {
	return {
		uid: null,
		email: null,
		displayName: null,
		isDev: false,
	};
}

export function isNotAuthenticated(user: User): boolean {
	return user.uid === null;
}

export function isLoggedInDeveloper(user: User): boolean {
	return !isNotAuthenticated(user) && user.isDev;
}

export function isLoggedInRegular(user: User): boolean {
	return !isNotAuthenticated(user) && !user.isDev;
}
