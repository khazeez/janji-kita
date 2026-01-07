import Midtrans from 'midtrans-client';
import { NextResponse } from 'next/server';
import { getDataInvitationUserById } from '@/models/invitations';
import { createTransaction } from '@/models/transactions';

const snap = new Midtrans.Snap({
  isProduction: process.env.IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

export async function POST(req: Request) {
  try {
    const { invitationId } = await req.json();

    if (!invitationId) {
      return NextResponse.json(
        { message: 'invitationId is required' },
        { status: 400 }
      );
    }

    const data = await getDataInvitationUserById(invitationId);
    let userId = data?.userId;
    let productId = data?.product.productId;
    let amount = data?.product.basePriceWithPhoto;
    let finalAmount = data?.product.basePriceNoPhoto;

    const gatewayOrderId = `INV-${invitationId}-${Date.now()}`;

    // 1️⃣ create transaction di DB
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

    console.log(trx);
    

    // 2️⃣ create snap token
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
        email: 'user@gmail.com',
      },
    } as any); // ⬅️ penting (type midtrans cacat)

    return NextResponse.json({
      snapToken: snapTransaction.token,
      redirectUrl: snapTransaction.redirect_url,
    });
  } catch (error) {
    console.error('❌ Checkout error:', error);
    return NextResponse.json(
      { message: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
