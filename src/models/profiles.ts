import { getAdminClient } from '@/lib/supabase/admin';
import type { Profile } from '@/types/interface';

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('PROFILE')
    .select('*')
    .eq('USER_ID', userId)
    .single();

  if (error) return null;
  return data;
}

export async function createProfile(userId: string, email: string, fullName: string) {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('PROFILE')
    .insert({
      USER_ID: userId,
      EMAIL: email,
      FULL_NAME: fullName,
      IS_ACTIVE: true,
      LOGIN_METHOD: 'google',
      CREATED_AT: new Date().toISOString(),
      UPDATED_AT: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
