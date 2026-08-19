import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const admin = getAdminClient();

    // Count favorites
    const { count: favoriteCount, error: favError } = await admin
      .from('USER_FAVORITES')
      .select('*', { count: 'exact', head: true })
      .eq('USER_ID', user.id);

    if (favError) throw favError;

    // Count transactions (non-deleted / all)
    const { count: transactionCount, error: trxError } = await admin
      .from('TRANSACTIONS')
      .select('*', { count: 'exact', head: true })
      .eq('USER_ID', user.id);

    if (trxError) throw trxError;

    return NextResponse.json({
      favoriteCount: favoriteCount ?? 0,
      transactionCount: transactionCount ?? 0,
    });
  } catch (error) {
    console.error('Error fetching counts:', error);
    return NextResponse.json({ error: 'Failed to fetch counts' }, { status: 500 });
  }
}
