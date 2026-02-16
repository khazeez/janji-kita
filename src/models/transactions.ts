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

export async function getTransactionsByUserId(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('TRANSACTIONS')
    .select(`
      TRANSACTION_ID,
      USER_ID,
      INVITATION_ID,
      PRODUCT_ID,
      PROMO_ID,
      ORIGINAL_AMOUNT,
      DISCOUNT_AMOUNT,
      FINAL_AMOUNT,
      PAYMENT_STATUS,
      PAYMENT_METHOD,
      GATEWAY_ORDER_ID,
      GATEWAY_TRANSACTION_ID,
      PAYMENT_PROOF_URL,
      PAID_AT,
      CANCELLED_AT,
      REFUNDED_AT,
      EXPIRED_AT,
      CREATED_AT,
      UPDATED_AT,
      PRODUCT!TRANSACTIONS_PRODUCT_ID_fkey(
        PRODUCT_NAME,
        COVER_IMAGE,
        TIER
      )
    `)
    .eq('USER_ID', userId)
    .order('CREATED_AT', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    return null;
  }

  return data;
}
