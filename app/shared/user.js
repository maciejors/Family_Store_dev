/**
 * @typedef User
 * @property {string} uid
 * @property {string} email
 * @property {string} displayName
 * @property {boolean} isDev
 */

/**
 * A User object representing unauthenticated user
 *
 * @returns {User}
 */
export function getAnonymousUser() {
	return {
		uid: null,
		email: null,
		displayName: null,
		isDev: false,
	};
}

/**
 * Checks whether a user is currently signed out
 *
 * @param {User} user
 * @returns {boolean}
 */
export function isNotAuthenticated(user) {
	return user.uid === null;
}

/**
 * Checks whether a user is currently logged in and is a developer
 *
 * @param {User} user
 * @returns {boolean}
 */
export function isLoggedInDeveloper(user) {
	return !isNotAuthenticated(user) && user.isDev;
}

/**
 * Checks whether a user is currently logged in, but has no developer access
 *
 * @param {User} user
 * @returns {boolean}
 */
export function isLoggedInRegular(user) {
	return !isNotAuthenticated(user) && !user.isDev;
}
