import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { invitationId } = body;

    if (!invitationId) {
      return NextResponse.json({ error: 'invitationId is required' }, { status: 400 });
    }

    const supabase = getAdminClient();
    const now = new Date();
    const expiredAt = new Date(now);
    expiredAt.setMonth(expiredAt.getMonth() + 6);

    // Cari semua transaksi INITIATED untuk undangan ini, update semuanya ke PAID
    const { data: trxList, error: trxError } = await supabase
      .from('TRANSACTIONS')
      .select('TRANSACTION_ID')
      .eq('INVITATION_ID', invitationId)
      .eq('PAYMENT_STATUS', 'INITIATED')
      .order('CREATED_AT', { ascending: false });

    if (trxError) {
      console.error('Error finding transactions:', trxError);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }

    if (trxList && trxList.length > 0) {
      const txIds = trxList.map(t => t.TRANSACTION_ID);
      const { error: updateTrxError } = await supabase
        .from('TRANSACTIONS')
        .update({
          PAYMENT_STATUS: 'PAID',
          PAID_AT: now.toISOString(),
          UPDATED_AT: now.toISOString(),
        })
        .in('TRANSACTION_ID', txIds);

      if (updateTrxError) {
        console.error('Error updating transactions:', updateTrxError);
      }
    }

    const { error: invError } = await supabase
      .from('INVITATION')
      .update({
        INVITATION_STATUS: 'published',
        PUBLISHED_AT: now.toISOString(),
        EXPIRED_AT: expiredAt.toISOString(),
        UPDATED_AT: now.toISOString(),
      })
      .eq('INVITATION_ID', invitationId);

    if (invError) {
      console.error('Error publishing invitation:', invError);
      return NextResponse.json({ error: 'Failed to publish' }, { status: 500 });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Success handler error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
