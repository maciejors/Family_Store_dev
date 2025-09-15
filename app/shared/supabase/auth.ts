import { supabase } from './supabaseSetup';
import { AuthResponse } from '@supabase/supabase-js';
import User from '../models/User';

async function isDeveloper(userId: string): Promise<boolean> {
	type LocalQueryResult = {
		id: string;
		roles: { name: string };
	};

	const { data: userData } = await supabase
		.from('users')
		.select('id, roles (name)')
		.eq('id', userId)
		.single<LocalQueryResult>();

	if (userData) {
		return userData.roles.name === 'Dev';
	}
	return false;
}

async function handleAuthResponseWithUser(authResponse: AuthResponse): Promise<User> {
	if (authResponse.error) {
		throw authResponse.error;
	}
	const responseUser = authResponse.data.user!;
	const userId = responseUser.id;
	const isDev = await isDeveloper(userId);
	return {
		uid: userId,
		email: responseUser.email!,
		displayName: responseUser.email!.split('@')[0], // for now
		isDev,
	};
}

export async function signUpSupabase(email: string, password: string): Promise<User> {
	const response = await supabase.auth.signUp({ email, password });
	return handleAuthResponseWithUser(response);
}

export async function signInSupabase(email: string, password: string): Promise<User> {
	const response = await supabase.auth.signInWithPassword({ email, password });
	return handleAuthResponseWithUser(response);
}

export async function signOutSupabase() {
	await supabase.auth.signOut();
}
