import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTransactionsByUserId } from '@/models/transactions';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const transactions = await getTransactionsByUserId(user.id);
    return NextResponse.json({ data: transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch transactions'
    }, { status: 500 });
  }
}
