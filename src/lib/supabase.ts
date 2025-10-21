import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { validateSupabaseUrl, validateSupabaseKey } from './validation';

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Access environment variables directly (works on both client and server)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Validate they exist
  if (!supabaseUrl || supabaseUrl.trim() === '') {
    throw new Error(
      'Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL. ' +
        'Please check your .env.local file.'
    );
  }

  if (!supabaseAnonKey || supabaseAnonKey.trim() === '') {
    throw new Error(
      'Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
        'Please check your .env.local file.'
    );
  }

  // Validate the values
  validateSupabaseUrl(supabaseUrl);
  validateSupabaseKey(supabaseAnonKey);

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

// Export a getter that initializes lazily
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = getSupabaseClient();
    return (client as any)[prop];
  }
});

export type Todo = {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

export type User = {
  id: string;
  email: string;
};
