import { supabase } from '@/lib/supabaseClient';

//function untuk mengambil semua product
export async function getProductInvitation() {}

//function untuk mengambil data invitation user
export async function getDataInvitationUser(userId: string) {
  const { data, error } = await supabase
    .from('INVITATION')
    .select(
      `
      INVITATION_ID,
      USER_ID,
      INVITATION_URL,
      INVITATION_STATUS,
      CREATED_AT,
      GUEST_BOOK (*),
      INVITATION_DATA_USER (*),
      INVITATION_EVENT (*),
      INVITATION_GIFT (
        *,
        INVITATION_GIFT_BANK (*),
        INVITATION_GIFT_WALLET (*)
      )
    `
    )
    .eq('USER_ID', userId);

  if (error) throw error;
  return data;
}
