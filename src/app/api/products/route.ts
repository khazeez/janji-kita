import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { transformKeys } from '@/lib/utils';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const segment = searchParams.get('segment') || undefined;
  const search = searchParams.get('search') || undefined;

  const admin = getAdminClient();
  let query = admin
    .from('PRODUCT')
    .select(`
      PRODUCT_ID,
      PRODUCT_NAME,
      COVER_IMAGE,
      SEGMENTATION,
      TIER,
      BASE_PRICE_NO_PHOTO,
      BASE_PRICE_WITH_PHOTO,
      PROMO_PRICE_NO_PHOTO,
      PROMO_PRICE_WITH_PHOTO,
      PRODUCT_TYPE,
      IS_PROMO,
      IS_NEW,
      IS_ACTIVE,
      CREATED_AT,
      UPDATED_AT
    `);

  if (segment && segment.toLowerCase() !== 'all') {
    query = query.eq('SEGMENTATION', segment);
  }

  if (search && search.trim()) {
    const q = search.trim();
    // ILIKE via Postgres (to be safe with case-insensitive search)
    query = query.or(
      `PRODUCT_NAME.ilike.%${q}%,SEGMENTATION.ilike.%${q}%,PRODUCT_TYPE.ilike.%${q}%`
    );
  }

  const { data, error } = await query.order('CREATED_AT', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }

  // transformKeys untuk konsistensi camelCase
  const result = data ? transformKeys(data) : [];
  return NextResponse.json({ data: result });
}
