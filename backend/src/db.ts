import { createClient } from "@supabase/supabase-js";
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables first
config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL and SUPABASE_KEY must be set');
}

export const supabase = createClient(supabaseUrl, supabaseKey);