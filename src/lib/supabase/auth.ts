import { supabase } from './supabaseSetup';
import { AuthResponse } from '@supabase/supabase-js';
import User from '@/models/User';
import Role from '@/models/Role';

async function getRole(userId: string): Promise<Role> {
	type LocalQueryResult = {
		id: string;
		roles: Role;
	};

	const { data: userData, error } = await supabase
		.from('users')
		.select('id, roles (key, name)')
		.eq('id', userId)
		.single<LocalQueryResult>();

	if (error) throw error;

	return userData!.roles;
}

async function handleAuthResponseWithUser(authResponse: AuthResponse): Promise<User> {
	if (authResponse.error) {
		throw authResponse.error;
	}
	const responseUser = authResponse.data.user!;
	const userId = responseUser.id;
	return {
		uid: userId,
		email: responseUser.email!,
		displayName: responseUser.email!.split('@')[0], // for now
		role: await getRole(userId),
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
