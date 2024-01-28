import {
	getAuth,
	User,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { app } from './firebase-setup';

const auth = getAuth(app);

/**
 * This will raise an error when user's creation fails (user already exists or invalid password)
 * @param {string} email
 * @param {string} password
 * @returns {User}
 */
export async function createUser(email, password) {
	// this line will throw an error when user's creation fails
	const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
	return userCredentials.user;
}

/**
 * This will raise an error when sign-in fails (user does not exist or invalid password)
 * @param {string} email
 * @param {string} password
 * @returns {User}
 */
export async function signIn(email, password) {
	// this line will throw an error when sign-in fails
	const userCredentials = await signInWithEmailAndPassword(auth, email, password);
	return userCredentials.user;
}

/**
 * @param {User} user
 * @returns {Promise<boolean>}
 */
export async function isUserDeveloper(user) {
	return false;
}
