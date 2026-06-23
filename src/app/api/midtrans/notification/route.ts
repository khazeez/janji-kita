import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
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

    // Log full notification for debugging
    console.log('[MIDTRANS NOTIFICATION]', JSON.stringify({
      order_id: orderId,
      transaction_status: body.transaction_status,
      payment_type: paymentType,
      transaction_id: transactionId,
      has_actions: !!body.actions,
      actions: body.actions,
      has_va_numbers: !!body.va_numbers,
      va_numbers: body.va_numbers,
    }));

    const supabase = getAdminClient();

    // Find the transaction by TRANSACTION_ID (normal) or GATEWAY_ORDER_ID (retry)
    const { data: trxRecord } = await supabase
      .from('TRANSACTIONS')
      .select('TRANSACTION_ID')
      .or(`TRANSACTION_ID.eq.${orderId},GATEWAY_ORDER_ID.eq.${orderId}`)
      .maybeSingle();

    if (!trxRecord) {
      console.error('Transaction not found for order_id:', orderId);
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const updateData: Record<string, any> = {
      PAYMENT_STATUS: paymentStatus,
      PAYMENT_METHOD: paymentType?.toUpperCase() || null,
      GATEWAY_TRANSACTION_ID: transactionId || null,
      UPDATED_AT: new Date().toISOString(),
    };

    // Store payment details (VA numbers, QR actions, etc.) from notification
    const paymentDetailFields: Record<string, any> = {};
    if (body.va_numbers?.length > 0) {
      paymentDetailFields.type = 'bank_transfer';
      paymentDetailFields.vaNumbers = body.va_numbers;
    } else if (body.permata_va_number) {
      paymentDetailFields.type = 'bank_transfer';
      paymentDetailFields.vaNumbers = [{ bank: 'permata', va_number: body.permata_va_number }];
    } else if (body.bill_key) {
      paymentDetailFields.type = 'mandiri_bill';
      paymentDetailFields.billKey = body.bill_key;
      paymentDetailFields.billerCode = body.biller_code;
    } else if (body.actions?.length > 0) {
      const pt = (paymentType || '').toLowerCase();
      if (pt === 'qris') paymentDetailFields.type = 'qris';
      else if (pt === 'gopay') paymentDetailFields.type = 'gopay';
      else paymentDetailFields.type = 'e_wallet';
      paymentDetailFields.actions = body.actions;
    }
    if (Object.keys(paymentDetailFields).length > 0) {
      updateData.PAYMENT_PROOF_URL = JSON.stringify(paymentDetailFields);
    }
    if (paymentStatus === 'PAID') updateData.PAID_AT = new Date().toISOString();
    else if (paymentStatus === 'CANCELLED') updateData.CANCELLED_AT = new Date().toISOString();
    else if (paymentStatus === 'REFUNDED') updateData.REFUNDED_AT = new Date().toISOString();
    else if (paymentStatus === 'EXPIRED') updateData.EXPIRED_AT = new Date().toISOString();

    const { error } = await supabase
      .from('TRANSACTIONS')
      .update(updateData)
      .eq('TRANSACTION_ID', trxRecord.TRANSACTION_ID);

    if (error) {
      console.error('Error updating transaction:', error);
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }

    // When payment is PAID, also update the invitation status to 'published'
    if (paymentStatus === 'PAID') {
      const { data: trx } = await supabase
        .from('TRANSACTIONS')
        .select('INVITATION_ID')
        .eq('TRANSACTION_ID', trxRecord.TRANSACTION_ID)
        .single();

      if (trx?.INVITATION_ID) {
        const now = new Date();
        const expiredAt = new Date(now);
        expiredAt.setMonth(expiredAt.getMonth() + 6);

        const { error: invError } = await supabase
          .from('INVITATION')
          .update({
            INVITATION_STATUS: 'published',
            PUBLISHED_AT: now.toISOString(),
            EXPIRED_AT: expiredAt.toISOString(),
            UPDATED_AT: now.toISOString(),
          })
          .eq('INVITATION_ID', trx.INVITATION_ID);

        if (invError) {
          console.error('Error updating invitation status:', invError);
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Midtrans notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
