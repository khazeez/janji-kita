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

async function fetchMidtransStatus(orderId: string): Promise<any> {
  const isProduction = process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true';
  const baseUrl = isProduction
    ? 'https://api.midtrans.com/v2'
    : 'https://api.sandbox.midtrans.com/v2';
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const auth = Buffer.from(serverKey + ':').toString('base64');

  const res = await fetch(`${baseUrl}/${orderId}/status`, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Midtrans API error: ${res.status}`);
  }

  return res.json();
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
      .select('TRANSACTION_ID, GATEWAY_ORDER_ID, PAYMENT_STATUS, PAYMENT_PROOF_URL')
      .eq('TRANSACTION_ID', transactionId)
      .eq('USER_ID', user.id)
      .single();

    if (trxError || !trx) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Try TRANSACTION_ID first (normal flow), fallback to GATEWAY_ORDER_ID (retry flow)
    let statusResponse: any;
    try {
      statusResponse = await fetchMidtransStatus(trx.TRANSACTION_ID);
    } catch {
      statusResponse = await fetchMidtransStatus(trx.GATEWAY_ORDER_ID);
    }

    console.log('[MIDTRANS STATUS RAW]', JSON.stringify(statusResponse, null, 2));

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

    const paymentDetails: Record<string, any> = {};
    const pt = statusResponse.payment_type;

    // Log full response for debugging
    console.log('[MIDTRANS STATUS] Full response:', JSON.stringify({
      order_id: statusResponse.order_id,
      transaction_status: statusResponse.transaction_status,
      payment_type: pt,
      has_va_numbers: !!statusResponse.va_numbers,
      has_actions: !!statusResponse.actions,
      actions: statusResponse.actions,
      va_numbers: statusResponse.va_numbers,
      permata_va_number: statusResponse.permata_va_number,
      bill_key: statusResponse.bill_key,
      biller_code: statusResponse.biller_code,
      bank: statusResponse.bank,
      masked_card: statusResponse.masked_card,
    }));

    if (statusResponse.va_numbers && statusResponse.va_numbers.length > 0) {
      paymentDetails.type = 'bank_transfer';
      paymentDetails.vaNumbers = statusResponse.va_numbers;
    } else if (statusResponse.permata_va_number) {
      paymentDetails.type = 'bank_transfer';
      paymentDetails.vaNumbers = [{ bank: 'permata', va_number: statusResponse.permata_va_number }];
    } else if (statusResponse.bill_key) {
      paymentDetails.type = 'mandiri_bill';
      paymentDetails.billKey = statusResponse.bill_key;
      paymentDetails.billerCode = statusResponse.biller_code;
    } else if (statusResponse.actions && statusResponse.actions.length > 0) {
      if (pt === 'qris') paymentDetails.type = 'qris';
      else if (pt === 'gopay') paymentDetails.type = 'gopay';
      else paymentDetails.type = 'e_wallet';
      paymentDetails.actions = statusResponse.actions;
    } else if (pt === 'qris') {
      // Status API doesn't return actions for QRIS — construct QR code URL manually
      const isProduction = process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true';
      const baseUrl = isProduction ? 'https://api.midtrans.com/v2' : 'https://api.sandbox.midtrans.com/v2';
      // QR code URL uses transaction_id (Midtrans UUID), not order_id
      const qrId = statusResponse.transaction_id || trx.GATEWAY_ORDER_ID;
      const qrCodeUrl = `${baseUrl}/qris/${qrId}/qr-code`;
      paymentDetails.type = 'qris';
      paymentDetails.actions = [
        { name: 'generate-qr-code', url: qrCodeUrl, method: 'GET' },
      ];
    } else if (pt === 'credit_card') {
      paymentDetails.type = 'credit_card';
      paymentDetails.bank = statusResponse.bank;
      paymentDetails.maskedCard = statusResponse.masked_card;
    } else if (pt) {
      paymentDetails.type = 'other';
      paymentDetails.rawType = pt;
    }

    // Check stored payment details from notification
    let storedPaymentDetails: Record<string, any> | null = null;
    if (trx.PAYMENT_PROOF_URL) {
      try {
        storedPaymentDetails = JSON.parse(trx.PAYMENT_PROOF_URL);
      } catch {
        // Not valid JSON, ignore
      }
    }

    return NextResponse.json({
      transactionId: trx.TRANSACTION_ID,
      previousStatus: trx.PAYMENT_STATUS,
      currentStatus: paymentStatus,
      paymentMethod: pt || null,
      transactionTime: statusResponse.transaction_time || null,
      grossAmount: statusResponse.gross_amount || null,
      midtransStatus,
      paymentDetails: storedPaymentDetails || (Object.keys(paymentDetails).length > 0 ? paymentDetails : null),
      rawResponse: statusResponse,
      storedProofUrl: trx.PAYMENT_PROOF_URL,
    });
  } catch (error: any) {
    console.error('Midtrans status error:', error);
    const message = error?.message?.includes('Midtrans')
      ? error.message
      : 'Failed to check transaction status';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
