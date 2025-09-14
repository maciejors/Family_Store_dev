import { supabase } from '../supabaseSetup';

export async function getCurrentAppVersion(appId: string): Promise<string | null> {
	const { data: app, error } = await supabase
		.from('apps')
		.select('version')
		.eq('id', appId)
		.single();

	if (error) {
		console.error(error);
		throw new Error(error.message);
	}

	if (app) {
		return app.version;
	}
	return null;
}
