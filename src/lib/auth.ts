import { getSupabaseBrowser } from './supabase-browser';

export async function signUp(email: string, password: string) {
  const supabase = getSupabaseBrowser();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseBrowser();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = getSupabaseBrowser();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const supabase = getSupabaseBrowser();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
