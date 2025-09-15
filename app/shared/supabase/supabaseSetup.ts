import { createClient } from '@supabase/supabase-js';
import { Database } from './dbTypes';

const supabaseUrl = 'https://ggbpzyvanxsbpypmmzrd.supabase.co';
const supabaseKey = 'sb_publishable_1l-5nlfUiYTXcq3DFVMv0w_D6YqwjJr';
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const storageBucket = supabase.storage.from('default');

export function getFileUrl(path: string): string {
	return storageBucket.getPublicUrl(path).data.publicUrl;
}
