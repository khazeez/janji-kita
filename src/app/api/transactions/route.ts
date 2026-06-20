import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const transactions = await supabaseAdmin
      .from('TRANSACTIONS')
      .select(`
        TRANSACTION_ID,
        USER_ID,
        INVITATION_ID,
        PRODUCT_ID,
        PROMO_ID,
        ORIGINAL_AMOUNT,
        DISCOUNT_AMOUNT,
        FINAL_AMOUNT,
        PAYMENT_STATUS,
        PAYMENT_METHOD,
        GATEWAY_ORDER_ID,
        GATEWAY_TRANSACTION_ID,
        PAYMENT_PROOF_URL,
        PAID_AT,
        CANCELLED_AT,
        REFUNDED_AT,
        EXPIRED_AT,
        CREATED_AT,
        UPDATED_AT,
        PRODUCT!TRANSACTIONS_PRODUCT_ID_fkey(
          PRODUCT_NAME,
          COVER_IMAGE,
          TIER
        )
      `)
      .eq('USER_ID', user.id)
      .order('CREATED_AT', { ascending: false });

    if (transactions.error) {
      console.error('Error fetching transactions:', transactions.error);
      return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }

    return NextResponse.json({ data: transactions.data });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
