import Midtrans from 'midtrans-client';
import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

function resolvePaymentStatus(transactionStatus: string, fraudStatus?: string): string {
  if (transactionStatus === 'capture') {
    if (fraudStatus === 'accept') return 'PAID';
    if (fraudStatus === 'deny') return 'FAILED';
    return 'PENDING';
  }
  if (transactionStatus === 'settlement') return 'PAID';
  if (transactionStatus === 'pending') return 'PENDING';
  if (transactionStatus === 'deny' || transactionStatus === 'cancel') return 'CANCELLED';
  if (transactionStatus === 'expire') return 'EXPIRED';
  if (transactionStatus === 'refund' || transactionStatus === 'partial_refund') return 'REFUNDED';
  return 'FAILED';
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { transactionId } = await req.json();
    if (!transactionId) {
      return NextResponse.json({ error: 'transactionId is required' }, { status: 400 });
    }

    const admin = getAdminClient();
    const { data: trx, error: trxError } = await admin
      .from('TRANSACTIONS')
      .select('TRANSACTION_ID, GATEWAY_ORDER_ID, PAYMENT_STATUS')
      .eq('TRANSACTION_ID', transactionId)
      .eq('USER_ID', user.id)
      .single();

    if (trxError || !trx) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const coreApi = new Midtrans.CoreApi({
      isProduction: process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.MIDTRANS_CLIENT_KEY!,
    });

    // Try TRANSACTION_ID first (normal flow), fallback to GATEWAY_ORDER_ID (retry flow)
    let statusResponse;
    try {
      statusResponse = await (coreApi as any).transaction.status(trx.TRANSACTION_ID);
    } catch {
      statusResponse = await (coreApi as any).transaction.status(trx.GATEWAY_ORDER_ID);
    }

    const midtransStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const paymentStatus = resolvePaymentStatus(midtransStatus, fraudStatus);

    if (paymentStatus !== trx.PAYMENT_STATUS) {
      const updateData: Record<string, any> = {
        PAYMENT_STATUS: paymentStatus,
        UPDATED_AT: new Date().toISOString(),
      };
      if (paymentStatus === 'PAID') updateData.PAID_AT = new Date().toISOString();
      else if (paymentStatus === 'CANCELLED') updateData.CANCELLED_AT = new Date().toISOString();
      else if (paymentStatus === 'REFUNDED') updateData.REFUNDED_AT = new Date().toISOString();
      else if (paymentStatus === 'EXPIRED') updateData.EXPIRED_AT = new Date().toISOString();

      await admin.from('TRANSACTIONS').update(updateData).eq('TRANSACTION_ID', transactionId);

      if (paymentStatus === 'PAID') {
        const { data: invTrx } = await admin
          .from('TRANSACTIONS')
          .select('INVITATION_ID')
          .eq('TRANSACTION_ID', transactionId)
          .single();

        if (invTrx?.INVITATION_ID) {
          const expiredAt = new Date();
          expiredAt.setMonth(expiredAt.getMonth() + 6);
          await admin
            .from('INVITATION')
            .update({
              INVITATION_STATUS: 'published',
              PUBLISHED_AT: new Date().toISOString(),
              EXPIRED_AT: expiredAt.toISOString(),
              UPDATED_AT: new Date().toISOString(),
            })
            .eq('INVITATION_ID', invTrx.INVITATION_ID);
        }
      }
    }

    return NextResponse.json({
      transactionId: trx.TRANSACTION_ID,
      previousStatus: trx.PAYMENT_STATUS,
      currentStatus: paymentStatus,
      paymentMethod: statusResponse.payment_type || null,
      transactionTime: statusResponse.transaction_time || null,
      grossAmount: statusResponse.gross_amount || null,
      midtransStatus,
    });
  } catch (error: any) {
    console.error('Midtrans status error:', error);
    const message = error?.message?.includes('Midtrans')
      ? error.message
      : 'Failed to check transaction status';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
