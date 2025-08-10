import {
	getAuth,
	User as FirebaseUser,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut as signOutFirebase,
	Unsubscribe,
} from 'firebase/auth';
import { app } from './firebase-setup';

const auth = getAuth(app);

export async function createUser(email: string, password: string) {
	// this line will throw an error when user's creation fails
	await createUserWithEmailAndPassword(auth, email, password);
}

export async function signIn(email: string, password: string) {
	// this line will throw an error when sign-in fails
	await signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
	await signOutFirebase(auth);
}

async function isUserDeveloper(user: FirebaseUser): Promise<boolean> {
	const userClaims = await user.getIdTokenResult();
	return userClaims.claims.dev === true;
}

export function authStateListener(onChanged: {
	(firebaseUser: FirebaseUser | null, isDev: boolean): void;
}): Unsubscribe {
	const unsubscribe = onAuthStateChanged(auth, async (user) => {
		const isDev = user ? await isUserDeveloper(user) : false;
		onChanged(user, isDev);
	});

	return unsubscribe;
}
