import Midtrans from 'midtrans-client';
import { NextResponse } from 'next/server';
import { getDataInvitationUserById } from '@/models/invitations';
import { createTransaction } from '@/models/transactions';
import { createClient } from '@/lib/supabase/server';

const snap = new Midtrans.Snap({
  isProduction: process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { invitationId } = await req.json();

    if (!invitationId) {
      return NextResponse.json(
        { message: 'invitationId is required' },
        { status: 400 }
      );
    }

    const data = await getDataInvitationUserById(invitationId);
    if (!data) {
      return NextResponse.json(
        { message: 'Invitation not found' },
        { status: 404 }
      );
    }

    if (data.userId !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    let userId = data?.userId;
    let productId = data?.product.productId;
    let amount = data?.product.basePriceWithPhoto;
    let finalAmount = data?.product.basePriceNoPhoto;

    const gatewayOrderId = `INV-${invitationId}-${Date.now()}`;

    const trx = await createTransaction({
      trx: {
        userId,
        invitationId,
        productId: productId,
        originalAmount: amount,
        discountAmount: 0,
        finalAmount: finalAmount,
        gatewayOrderId,
      },
    });

    const snapTransaction = await snap.createTransaction({
      transaction_details: {
        order_id: trx.TRANSACTION_ID,
        gross_amount: Number(trx.FINAL_AMOUNT),
      },
      item_details: [
        {
          id: productId,
          name: data?.product.productName,
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
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { message: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
