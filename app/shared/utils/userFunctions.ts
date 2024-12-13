import User from '../models/User';

export function isNotAuthenticated(user: User | null): boolean {
	return user === null;
}

export function isLoggedInDeveloper(user: User | null): boolean {
	return !isNotAuthenticated(user) && user!.isDev;
}

export function isLoggedInRegular(user: User | null): boolean {
	return !isNotAuthenticated(user) && !user!.isDev;
}
