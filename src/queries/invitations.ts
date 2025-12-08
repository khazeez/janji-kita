import { supabase } from '@/lib/supabaseClient';

//function untuk mengambil semua product
export async function getProductInvitation() {
  const { data, error } = await supabase.from('PRODUCT').select(`*`);

  if (error) {
    console.error('Error fetching data product:', error);
    return [];
  }
}

export async function getSlug() {
  const { data, error } = await supabase
    .from('INVITATION')
    .select(`INVITATION_URL`);

  if (error) {
    console.error('Error fetching slug:', error);
    return []; // jika error, kembalikan array kosong
  }

  // Pastikan data tidak null dan ubah ke array string
  const urls = data
    ?.map((item: { INVITATION_URL: string }) =>
      item.INVITATION_URL?.toLowerCase()
    )
    .filter(Boolean) as string[];

  return urls;
}

//function untuk mengambil data invitation user
export async function getDataInvitationUser(slug: string) {
  const { data, error } = await supabase
    .from('INVITATION')
    .select(
      `
    INVITATION_ID,
    USER_ID,
    PRODUCT_ID,
    INVITATION_URL,
    INVITATION_STATUS,
    CREATED_AT,
    PRODUCT:PRODUCT_ID (
      PRODUCT_NAME,
      COVER_IMAGE
    ),
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
    .eq('INVITATION_URL', slug)
    .single();

  if (error) throw error;
  return data;
}
