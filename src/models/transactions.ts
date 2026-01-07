// models/transactions.ts
import { supabaseAdmin } from '@/lib/supabase/admin'; // ⬅️ Use admin client

interface CreateTransactionPayload {
  trx: {
    userId: string | undefined;
    invitationId: string | undefined;
    productId: string | undefined;
    promoId?: string | undefined;
    originalAmount: number | undefined;
    discountAmount: number | undefined;
    finalAmount: number | undefined;
    gatewayOrderId: string | undefined;
  };
}

export async function createTransaction({ trx }: CreateTransactionPayload) {
  const { data, error } = await supabaseAdmin // ⬅️ Changed from supabase to supabaseAdmin
    .from('TRANSACTIONS')
    .insert({
      USER_ID: trx.userId,
      INVITATION_ID: trx.invitationId,
      PRODUCT_ID: trx.productId,
      PROMO_ID: trx.promoId ?? null,
      ORIGINAL_AMOUNT: trx.originalAmount,
      DISCOUNT_AMOUNT: trx.discountAmount,
      FINAL_AMOUNT: trx.finalAmount,
      GATEWAY_ORDER_ID: trx.gatewayOrderId,
      PAYMENT_STATUS: 'INITIATED',
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  console.log(data);
  

  return data;
}
