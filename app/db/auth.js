import {
	getAuth,
	User,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut as signOutFirebase,
} from 'firebase/auth';
import { app } from './firebase-setup';

const auth = getAuth(app);

/**
 * This will raise an error when user's creation fails (user already exists or invalid password)
 * @param {string} email
 * @param {string} password
 */
export async function createUser(email, password) {
	// this line will throw an error when user's creation fails
	await createUserWithEmailAndPassword(auth, email, password);
}

/**
 * This will raise an error when sign-in fails (user does not exist or invalid password)
 * @param {string} email
 * @param {string} password
 */
export async function signIn(email, password) {
	// this line will throw an error when sign-in fails
	await signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
	await signOutFirebase(auth);
}

/**
 * @param {User} user
 * @returns {Promise<boolean>}
 */
async function isUserDeveloper(user) {
	const userClaims = await user.getIdTokenResult();
	return userClaims.claims.dev === true;
}

export function authStateListener(onChanged) {
	const unsubscribe = onAuthStateChanged(auth, async (user) => {
		const isDev = await isUserDeveloper(user);
		onChanged(user, isDev);
	});

	return unsubscribe;
}
