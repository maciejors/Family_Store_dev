import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ggbpzyvanxsbpypmmzrd.supabase.co';
const supabaseKey = 'sb_publishable_1l-5nlfUiYTXcq3DFVMv0w_D6YqwjJr';
export const supabase = createClient(supabaseUrl, supabaseKey!);
