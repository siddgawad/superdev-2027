
import 'dotenv/config';             
import { createClient } from '@supabase/supabase-js';

const url = process.env.DB_URL as string;
const role = process.env.DB_ROLE_KEY as string;

if (!url) throw new Error('Missing DB_URL');
if (!/^https?:\/\//.test(url)) throw new Error(`DB_URL is not a valid http(s) URL: ${url}`);
if (!role) throw new Error('Missing DB_ROLE_KEY');

export const supabaseAdminNode = createClient(url, role);
