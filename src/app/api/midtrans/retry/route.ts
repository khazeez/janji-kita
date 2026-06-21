import Midtrans from 'midtrans-client';
import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

let _snap: Midtrans.Snap | null = null;

function getSnap() {
  if (!_snap) {
    _snap = new Midtrans.Snap({
      isProduction: process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.MIDTRANS_CLIENT_KEY!,
    });
  }
  return _snap;
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json({ message: 'transactionId is required' }, { status: 400 });
    }

    const admin = getAdminClient();

    // Find the existing INITIATED transaction
    const { data: trx, error: trxError } = await admin
      .from('TRANSACTIONS')
      .select('TRANSACTION_ID, INVITATION_ID, FINAL_AMOUNT, PAYMENT_STATUS')
      .eq('TRANSACTION_ID', transactionId)
      .eq('USER_ID', user.id)
      .single();

    if (trxError || !trx) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    if (trx.PAYMENT_STATUS !== 'INITIATED') {
      return NextResponse.json({ message: 'Transaction is not pending' }, { status: 400 });
    }

    // Generate new GATEWAY_ORDER_ID and use it as Midtrans order_id
    // (INV-{timestamp} is ~17 chars, within Midtrans 50-char limit)
    const newGatewayOrderId = `INV-${Date.now()}`;

    // Update the existing transaction with new gateway order id
    await admin
      .from('TRANSACTIONS')
      .update({
        GATEWAY_ORDER_ID: newGatewayOrderId,
        UPDATED_AT: new Date().toISOString(),
      })
      .eq('TRANSACTION_ID', trx.TRANSACTION_ID);

    // Create Midtrans Snap token using GATEWAY_ORDER_ID as order_id
    const snapTransaction = await getSnap().createTransaction({
      transaction_details: {
        order_id: newGatewayOrderId,
        gross_amount: Number(trx.FINAL_AMOUNT),
      },
      item_details: [
        {
          id: trx.TRANSACTION_ID,
          name: 'Undangan Digital',
          price: Number(trx.FINAL_AMOUNT),
          quantity: 1,
        },
      ],
      customer_details: {
        email: user.email || '',
      },
    } as any);

    return NextResponse.json({
      snapToken: snapTransaction.token,
      redirectUrl: snapTransaction.redirect_url,
      invitationId: trx.INVITATION_ID,
    });
  } catch (error: any) {
    console.error('Retry error:', error);
    return NextResponse.json(
      { message: error?.message || 'Failed to retry payment' },
      { status: 500 }
    );
  }
}
