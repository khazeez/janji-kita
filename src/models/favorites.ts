import { getAdminClient } from '@/lib/supabase/admin';

export async function getFavoritesByUserId(userId: string) {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('USER_FAVORITES')
    .select(`
      FAVORITE_ID,
      CREATED_AT,
      PRODUCT!USER_FAVORITES_PRODUCT_ID_fkey(
        PRODUCT_ID,
        PRODUCT_NAME,
        COVER_IMAGE,
        SEGMENTATION,
        TIER,
        BASE_PRICE_NO_PHOTO,
        PRODUCT_TYPE,
        IS_PROMO,
        PROMO_PRICE_NO_PHOTO
      )
    `)
    .eq('USER_ID', userId)
    .order('CREATED_AT', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addFavorite(userId: string, productId: string) {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('USER_FAVORITES')
    .insert({ USER_ID: userId, PRODUCT_ID: productId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function removeFavorite(userId: string, productId: string) {
  const admin = getAdminClient();
  const { error } = await admin
    .from('USER_FAVORITES')
    .delete()
    .eq('USER_ID', userId)
    .eq('PRODUCT_ID', productId);

  if (error) throw new Error(error.message);
}
