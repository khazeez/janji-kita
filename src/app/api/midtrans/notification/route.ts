import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import crypto from 'crypto';

function verifySignature(body: Record<string, any>, serverKey: string): boolean {
  const orderId = body.order_id;
  const statusCode = body.status_code;
  const grossAmount = body.gross_amount;
  const serverKeyBytes = crypto.createHash('sha512')
    .update(orderId + statusCode + grossAmount + serverKey)
    .digest('hex');
  return serverKeyBytes === body.signature_key;
}

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
  try {
    const body = await req.json();
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;

    if (!verifySignature(body, serverKey)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const orderId = body.order_id;
    const paymentStatus = resolvePaymentStatus(body.transaction_status, body.fraud_status);
    const paymentType = body.payment_type;
    const transactionId = body.transaction_id;

    const updateData: Record<string, any> = {
      PAYMENT_STATUS: paymentStatus,
      PAYMENT_METHOD: paymentType?.toUpperCase() || null,
      GATEWAY_TRANSACTION_ID: transactionId || null,
      UPDATED_AT: new Date().toISOString(),
    };
    if (paymentStatus === 'PAID') updateData.PAID_AT = new Date().toISOString();
    else if (paymentStatus === 'CANCELLED') updateData.CANCELLED_AT = new Date().toISOString();
    else if (paymentStatus === 'REFUNDED') updateData.REFUNDED_AT = new Date().toISOString();
    else if (paymentStatus === 'EXPIRED') updateData.EXPIRED_AT = new Date().toISOString();

    const { error } = await supabaseAdmin
      .from('TRANSACTIONS')
      .update(updateData)
      .eq('GATEWAY_ORDER_ID', orderId);

    if (error) {
      console.error('Error updating transaction:', error);
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Midtrans notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
