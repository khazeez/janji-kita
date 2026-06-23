import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { getTransactionsByUserId } from '@/models/transactions';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const transactions = await getTransactionsByUserId(user.id);

    // Attach product names
    const productIds = [...new Set(transactions.map(t => t.PRODUCT_ID).filter(Boolean))];
    const admin = getAdminClient();
    const { data: products } = await admin
      .from('PRODUCT')
      .select('PRODUCT_ID, PRODUCT_NAME')
      .in('PRODUCT_ID', productIds);

    const productMap = new Map((products || []).map(p => [p.PRODUCT_ID, p.PRODUCT_NAME]));

    const data = transactions.map(t => ({
      ...t,
      PRODUCT: t.PRODUCT_ID ? { PRODUCT_NAME: productMap.get(t.PRODUCT_ID) || null } : null,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch transactions'
    }, { status: 500 });
  }
}
