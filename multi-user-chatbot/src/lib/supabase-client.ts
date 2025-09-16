import { createClient } from '@supabase/supabase-js';

/**
 * Browser-safe client using anon key. RLS applies.
 * Do NOT import service role here.
 */
const url = process.env.DB_URL as string;
const anon = process.env.DB_KEY as string;

if (!url) throw new Error('Missing DB_URL');
if (!anon) throw new Error('Missing DB_KEY');

export const supabase = createClient(url, anon);
