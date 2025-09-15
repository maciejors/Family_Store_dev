import User from '../models/User';

export function isLoggedInDeveloper(user: User | null): boolean {
	return user !== null && user!.isDev;
}

export function isLoggedInRegular(user: User | null): boolean {
	return user !== null && !user!.isDev;
}
