import { supabase } from '../supabaseSetup';

export async function getCurrentAppVersion(appId: string): Promise<string | null> {
	const { data: apps, error } = await supabase.from('apps').select('version').eq('id', appId);

	if (error) {
		console.error(error);
		throw new Error(error.message);
	}

	if (apps && apps.length > 0) {
		return apps[0].version;
	}
	return null;
}
