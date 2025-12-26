// supabaseClient.ts
import { createBrowserClient } from '@supabase/ssr';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!url || !key) {
  throw new Error('Supabase environment variables are not set');
}

const supabase = createBrowserClient(url, key);

export default supabase;
