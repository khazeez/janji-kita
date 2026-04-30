import supabase from '@/lib/supabase/client';
import { Product } from '@/types/interface';

export interface FavoriteProduct extends Product {
  isFavorite: boolean;
}

export async function getFavoriteProducts(userId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('FAVORITE')
    .select(`
      PRODUCT_ID,
      PRODUCT!FAVORITE_PRODUCT_ID_fkey(
        PRODUCT_ID,
        DESIGN_ID,
        PRODUCT_NAME,
        COVER_IMAGE,
        SEGMENTATION,
        TIER,
        BASE_PRICE_NO_PHOTO,
        BASE_PRICE_WITH_PHOTO,
        PROMO_PRICE_NO_PHOTO,
        PROMO_PRICE_WITH_PHOTO,
        FEATURES,
        IS_PROMO,
        PRODUCT_TYPE,
        DESCRIPTION,
        IS_NEW,
        IS_ACTIVE,
        IS_DELETED,
        CREATED_AT,
        UPDATED_AT,
        DELETED_AT
      )
    `)
    .eq('USER_ID', userId)
    .order('CREATED_AT', { ascending: false });

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }

  return (data || [])
    .map((item: any) => item.PRODUCT)
    .filter(Boolean);
}

export async function toggleFavorite(userId: string, productId: string): Promise<{ success: boolean; isFavorite: boolean }> {
  const { data: existing, error: fetchError } = await supabase
    .from('FAVORITE')
    .select('FAVORITE_ID')
    .eq('USER_ID', userId)
    .eq('PRODUCT_ID', productId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error checking favorite:', fetchError);
    return { success: false, isFavorite: false };
  }

  if (existing) {
    const { error } = await supabase
      .from('FAVORITE')
      .delete()
      .eq('USER_ID', userId)
      .eq('PRODUCT_ID', productId);

    if (error) {
      console.error('Error removing favorite:', error);
      return { success: false, isFavorite: true };
    }

    return { success: true, isFavorite: false };
  } else {
    const { error } = await supabase
      .from('FAVORITE')
      .insert({
        USER_ID: userId,
        PRODUCT_ID: productId,
      });

    if (error) {
      console.error('Error adding favorite:', error);
      return { success: false, isFavorite: false };
    }

    return { success: true, isFavorite: true };
  }
}

export async function isProductFavorite(userId: string, productId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('FAVORITE')
    .select('FAVORITE_ID')
    .eq('USER_ID', userId)
    .eq('PRODUCT_ID', productId)
    .single();

  if (error || !data) return false;
  return true;
}

export async function getFavoriteProductIds(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('FAVORITE')
    .select('PRODUCT_ID')
    .eq('USER_ID', userId);

  if (error) {
    console.error('Error fetching favorite IDs:', error);
    return new Set();
  }

  return new Set((data || []).map((item: any) => item.PRODUCT_ID));
}
