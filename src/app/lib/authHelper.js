import { supabase } from '../supabase/supabaseClient';

export async function getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return { user: session?.user || null, session };
}

export async function isAuthenticated() {
    const { session } = await getCurrentUser();
    return !!session;
}

export async function signOut() {
    await supabase.auth.signOut();
}