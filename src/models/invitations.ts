import supabase from '@/lib/supabase/client';
import {
  transformInvitationResponse,
  transformDataInvitationResponse,
  transformKeys,
} from '@/lib/utils';

export async function getProductInvitation() {
  const { data, error } = await supabase.from('PRODUCT').select(`*`);

  if (error) {
    console.error('Error fetching data product:', error);
    return [];
  }

  const transformedData = transformKeys(data);

  return transformedData;
}

export async function getSlug() {
  const { data, error } = await supabase
    .from('INVITATION')
    .select(`INVITATION_URL`);

  if (error) {
    console.error('Error fetching slug:', error);
    return []; // jika error, kembalikan array kosong
  }

  // Pastikan data tidak null dan ubah ke array string
  const urls = data
    ?.map((item: { INVITATION_URL: string }) =>
      item.INVITATION_URL?.toLowerCase()
    )
    .filter(Boolean) as string[];

  return urls;
}

//function untuk mengambil data invitation user
export async function getDataInvitationUser(slug: string) {
  const { data, error } = await supabase
    .from('INVITATION')
    .select(
      `
      INVITATION_ID,
      USER_ID,
      PRODUCT_ID,
      INVITATION_URL,
      INVITATION_STATUS,
      PUBLISHED_AT,
      EXPIRED_AT,
      VIEW_COUNT,
      IS_DELETED,
      CREATED_AT,
      UPDATED_AT,
      DELETED_AT,
      PRODUCT!INVITATION_PRODUCT_ID_fkey(
        PRODUCT_ID,
        PRODUCT_NAME,
        COVER_IMAGE,
        SEGMENTATION,
        TIER,
        BASE_PRICE_NO_PHOTO,
        BASE_PRICE_WITH_PHOTO,
        PROMO_PRICE_NO_PHOTO,
        PROMO_PRICE_WITH_PHOTO,
        FEATURES,
        IS_PROMO,
        IS_NEW,
        IS_ACTIVE
      ),
      INVITATION_DATA_USER!INVITATION_DATA_USER_INVITATION_ID_fkey(
        DATA_ID,
        INVITATION_ID,
        GROOM_FULL_NAME,
        GROOM_NICK_NAME,
        GROOM_PARENT_NAME,
        GROOM_INSTAGRAM,
        GROOM_PHOTO_URL,
        BRIDE_FULL_NAME,
        BRIDE_NICK_NAME,
        BRIDE_PARENT_NAME,
        BRIDE_INSTAGRAM,
        BRIDE_PHOTO_URL,
        GALLERY_PHOTOS,
        LOVE_STORY
      ),
      INVITATION_EVENT!INVITATION_EVENT_INVITATION_ID_fkey(
        EVENT_ID,
        INVITATION_ID,
        EVENT_TYPE,
        LOCATION,
        LOCATION_DETAIL,
        MAPS_URL,
        START_TIME,
        END_TIME
      ),
      INVITATION_GIFT!INVITATION_GIFT_INVITATION_ID_fkey(
        GIFT_ID,
        INVITATION_ID,
        ADDRESS,
        INVITATION_GIFT_BANK!INVITATION_GIFT_BANK_GIFT_ID_fkey(
          GIFT_BANK_ID,
          GIFT_ID,
          ACCOUNT,
          OWNER
        ),
        INVITATION_GIFT_WALLET!INVITATION_GIFT_WALLET_GIFT_ID_fkey(
          GIFT_WALLET_ID,
          GIFT_ID,
          ADDRESS,
          OWNER
        )
      ),
      GUEST_BOOK!GUEST_BOOK_INVITATION_ID_fkey(
        GUEST_ID,
        INVITATION_ID,
        GUEST_NAME,
        ATTENDANCE_STATUS,
        GUEST_COUNT,
        MESSAGE,
        IP_ADDRESS,
        CREATED_AT
      )
    `
    )
    .eq('INVITATION_URL', slug)
    .eq('IS_DELETED', false)
    .single();

  if (error) {
    console.error('Error fetching invitation:', error);
    return null;
  }

  const dataCamelCase = transformDataInvitationResponse(data);
  console.log('DB RESPONSE: ', dataCamelCase);

  return dataCamelCase;
}

export async function getDataInvitationUserById(id: string) {
  const { data, error } = await supabase
    .from('INVITATION')
    .select(
      `
      INVITATION_ID,
      USER_ID,
      PRODUCT_ID,
      INVITATION_URL,
      INVITATION_STATUS,
      PUBLISHED_AT,
      EXPIRED_AT,
      VIEW_COUNT,
      IS_DELETED,
      CREATED_AT,
      UPDATED_AT,
      DELETED_AT,
      PRODUCT!INVITATION_PRODUCT_ID_fkey(
        PRODUCT_ID,
        PRODUCT_NAME,
        COVER_IMAGE,
        SEGMENTATION,
        TIER,
        BASE_PRICE_NO_PHOTO,
        BASE_PRICE_WITH_PHOTO,
        PROMO_PRICE_NO_PHOTO,
        PROMO_PRICE_WITH_PHOTO,
        FEATURES,
        IS_PROMO,
        IS_NEW,
        IS_ACTIVE
      ),
      INVITATION_DATA_USER!INVITATION_DATA_USER_INVITATION_ID_fkey(
        DATA_ID,
        INVITATION_ID,
        GROOM_FULL_NAME,
        GROOM_NICK_NAME,
        GROOM_PARENT_NAME,
        GROOM_INSTAGRAM,
        GROOM_PHOTO_URL,
        BRIDE_FULL_NAME,
        BRIDE_NICK_NAME,
        BRIDE_PARENT_NAME,
        BRIDE_INSTAGRAM,
        BRIDE_PHOTO_URL,
        GALLERY_PHOTOS,
        LOVE_STORY
      ),
      INVITATION_EVENT!INVITATION_EVENT_INVITATION_ID_fkey(
        EVENT_ID,
        INVITATION_ID,
        EVENT_TYPE,
        LOCATION,
        LOCATION_DETAIL,
        MAPS_URL,
        START_TIME,
        END_TIME
      ),
      INVITATION_GIFT!INVITATION_GIFT_INVITATION_ID_fkey(
        GIFT_ID,
        INVITATION_ID,
        ADDRESS,
        INVITATION_GIFT_BANK!INVITATION_GIFT_BANK_GIFT_ID_fkey(
          GIFT_BANK_ID,
          GIFT_ID,
          ACCOUNT,
          OWNER
        ),
        INVITATION_GIFT_WALLET!INVITATION_GIFT_WALLET_GIFT_ID_fkey(
          GIFT_WALLET_ID,
          GIFT_ID,
          ADDRESS,
          OWNER
        )
      ),
      GUEST_BOOK!GUEST_BOOK_INVITATION_ID_fkey(
        GUEST_ID,
        INVITATION_ID,
        GUEST_NAME,
        ATTENDANCE_STATUS,
        GUEST_COUNT,
        MESSAGE,
        IP_ADDRESS,
        CREATED_AT
      )
    `
    )
    .eq('INVITATION_ID', id)
    .eq('IS_DELETED', false)
    .single();

  if (error) {
    console.error('Error fetching invitation:', error);
    return null;
  }
  

  const dataCamelCase = transformDataInvitationResponse(data);
  console.log('DB RESPONSE: ', dataCamelCase);

  return dataCamelCase;
}

export async function getDataInvitationUserByUserId(userId: string) {
  const { data, error } = await supabase
    .from('INVITATION')
    .select(
      `
      INVITATION_ID,
      USER_ID,
      PRODUCT_ID,
      INVITATION_URL,
      INVITATION_STATUS,
      PUBLISHED_AT,
      EXPIRED_AT,
      VIEW_COUNT,
      IS_DELETED,
      CREATED_AT,
      UPDATED_AT,
      DELETED_AT,
      PRODUCT!INVITATION_PRODUCT_ID_fkey(
        PRODUCT_ID,
        PRODUCT_NAME,
        COVER_IMAGE,
        SEGMENTATION,
        TIER,
        BASE_PRICE_NO_PHOTO,
        BASE_PRICE_WITH_PHOTO,
        PROMO_PRICE_NO_PHOTO,
        PROMO_PRICE_WITH_PHOTO,
        FEATURES,
        IS_PROMO,
        IS_NEW,
        IS_ACTIVE
      ),
      INVITATION_DATA_USER!INVITATION_DATA_USER_INVITATION_ID_fkey(
        DATA_ID,
        INVITATION_ID,
        GROOM_FULL_NAME,
        GROOM_NICK_NAME,
        GROOM_PARENT_NAME,
        GROOM_INSTAGRAM,
        GROOM_PHOTO_URL,
        BRIDE_FULL_NAME,
        BRIDE_NICK_NAME,
        BRIDE_PARENT_NAME,
        BRIDE_INSTAGRAM,
        BRIDE_PHOTO_URL,
        GALLERY_PHOTOS,
        LOVE_STORY
      ),
      INVITATION_EVENT!INVITATION_EVENT_INVITATION_ID_fkey(
        EVENT_ID,
        INVITATION_ID,
        EVENT_TYPE,
        LOCATION,
        LOCATION_DETAIL,
        MAPS_URL,
        START_TIME,
        END_TIME
      ),
      INVITATION_GIFT!INVITATION_GIFT_INVITATION_ID_fkey(
        GIFT_ID,
        INVITATION_ID,
        ADDRESS,
        INVITATION_GIFT_BANK!INVITATION_GIFT_BANK_GIFT_ID_fkey(
          GIFT_BANK_ID,
          GIFT_ID,
          ACCOUNT,
          OWNER
        ),
        INVITATION_GIFT_WALLET!INVITATION_GIFT_WALLET_GIFT_ID_fkey(
          GIFT_WALLET_ID,
          GIFT_ID,
          ADDRESS,
          OWNER
        )
      ),
      GUEST_BOOK!GUEST_BOOK_INVITATION_ID_fkey(
        GUEST_ID,
        INVITATION_ID,
        GUEST_NAME,
        ATTENDANCE_STATUS,
        GUEST_COUNT,
        MESSAGE,
        IP_ADDRESS,
        CREATED_AT
      )
    `
    )
    .eq('USER_ID', userId)
    .eq('IS_DELETED', false)

  if (error) {
    console.error('Error fetching invitation:', error);
    return null;
  }

  const dataCamelCase = transformDataInvitationResponse(data ?? []);
  console.log('DB RESPONSE: ', dataCamelCase);

  return dataCamelCase;
}

// ============================================
// INSERT MESSAGES
// ============================================

export async function insertMessages(data: {
  invitationId: string;
  guestName: string;
  attendanceStatus: 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE';
  guestCount: number;
  message?: string;
  ipAddress?: string;
}) {
  try {
    // Validasi input
    if (!data.invitationId || !data.guestName.trim()) {
      return {
        success: false,
        error: 'Invitation ID dan nama tamu wajib diisi',
      };
    }

    // Insert ke database
    const { data: result, error } = await supabase
      .from('GUEST_BOOK')
      .insert([
        {
          INVITATION_ID: data.invitationId,
          GUEST_NAME: data.guestName.trim(),
          ATTENDANCE_STATUS: data.attendanceStatus,
          GUEST_COUNT: data.guestCount,
          MESSAGE: data.message?.trim() || null,
          IP_ADDRESS: data.ipAddress || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Error inserting guest book:', error);
      return {
        success: false,
        error: error.message || 'Gagal menyimpan data',
      };
    }

    // Transform ke camelCase
    const transformedData = transformKeys(result);

    return {
      success: true,
      data: transformedData,
    };
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return {
      success: false,
      error: 'Terjadi kesalahan yang tidak terduga',
    };
  }
}

// ============================================
// GET GUEST BOOK
// ============================================

export async function getGuestBook(invitationId: string) {
  try {
    if (!invitationId) {
      return {
        success: false,
        error: 'Invitation ID wajib diisi',
      };
    }

    // Query database
    const { data, error } = await supabase
      .from('GUEST_BOOK')
      .select('*')
      .eq('INVITATION_ID', invitationId)
      .order('CREATED_AT', { ascending: true });

    if (error) {
      console.error('❌ Error fetching guest book:', error);
      return {
        success: false,
        error: error.message || 'Gagal mengambil data',
      };
    }

    // Transform ke camelCase
    const transformedData = transformKeys(data);

    return {
      success: true,
      data: transformedData,
    };
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return {
      success: false,
      error: 'Terjadi kesalahan yang tidak terduga',
    };
  }
}

export async function getProductByName(productName: string) {
  const decodedName = decodeURIComponent(productName);
  const { data, error } = await supabase
    .from('PRODUCT')
    .select('*')
    .eq('PRODUCT_NAME', decodedName)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return { data: null, error };
  }

  const transformedData = transformKeys(data);

  return { data: transformedData, error: null };
}

export async function getInvitation(userId: string) {
  if (!userId) {
    throw new Error('getInvitation requires userId');
  }

  const { data, error } = await supabase
    .from('INVITATION')
    .select('*')
    .eq('USER_ID', userId);

  if (error) {
    throw new Error(error.message);
  }

  return transformInvitationResponse(data ?? []);
}

export async function getInvitationById(invitationId: string) {
  if (!invitationId) {
    throw new Error('getInvitation requires userId');
  }

  const { data, error } = await supabase
    .from('INVITATION')
    .select('*')
    .eq('USER_ID', invitationId);

  if (error) {
    throw new Error(error.message);
  }

  return transformInvitationResponse(data ?? []);
}
