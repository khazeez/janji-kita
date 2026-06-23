import Midtrans from 'midtrans-client';
import { NextResponse } from 'next/server';
import { getDataInvitationUserById } from '@/models/invitations';
import { createTransaction } from '@/models/transactions';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';

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

    const gatewayOrderId = `INV-${Date.now()}`;

    // Cek apakah masih ada transaksi aktif (INITIATED/PENDING) untuk undangan ini
    const admin = getAdminClient();
    const { data: activeList, error: activeErr } = await admin
      .from('TRANSACTIONS')
      .select('TRANSACTION_ID, PAYMENT_STATUS')
      .eq('INVITATION_ID', invitationId)
      .or('PAYMENT_STATUS.eq.INITIATED,PAYMENT_STATUS.eq.PENDING')
      .limit(1);

    if (activeErr) {
      console.error('Error checking active transactions:', activeErr);
    }

    if (activeList && activeList.length > 0) {
      const activeTx = activeList[0];
      const label = activeTx.PAYMENT_STATUS === 'INITIATED' ? 'masih dalam proses' : 'menunggu pembayaran';
      return NextResponse.json(
        {
          message: `Undangan ini sudah memiliki transaksi yang ${label}. Selesaikan pembayaran terlebih dahulu.`,
          activeTransactionId: activeTx.TRANSACTION_ID,
          activeStatus: activeTx.PAYMENT_STATUS,
        },
        { status: 409 }
      );
    }

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

    const orderId = trx.TRANSACTION_ID;

    const snapTransaction = await getSnap().createTransaction({
      transaction_details: {
        order_id: orderId,
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
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { message: error?.message || 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
