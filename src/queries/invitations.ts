import { supabase } from '@/lib/supabaseClient';
import { transformInvitationResponse, transformKeys } from '@/lib/utils';
//function untuk mengambil semua product
export async function getProductInvitation() {
  const { data, error } = await supabase.from('PRODUCT').select(`*`);

  if (error) {
    console.error('Error fetching data product:', error);
    return [];
  }

  return data;
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

  const dataCamelCase = transformInvitationResponse(data);
  console.log('DB RESPONSE: ', dataCamelCase);

  return dataCamelCase;
}



// ============================================
// INSERT MESSAGES
// ============================================

/**
 * Insert single guest book message
 * @param data - Guest book data
 * @returns Response with camelCase data
 */
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

/**
 * Get all guest book entries for a specific invitation
 * @param invitationId - Invitation ID
 * @returns Guest book entries in camelCase
 */
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

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Example 1: Insert message
const result = await insertMessages({
  invitationId: '4022abcd-30d6-4c34-9166-004ae5a8d2de',
  guestName: 'John Doe',
  attendanceStatus: 'ATTENDING',
  guestCount: 2,
  message: 'Selamat menempuh hidup baru!',
  ipAddress: '192.168.1.1', // optional
});

if (result.success) {
  console.log('✅ Success:', result.data);
  // {
  //   guestId: "xxx",
  //   invitationId: "xxx",
  //   guestName: "John Doe",
  //   attendanceStatus: "ATTENDING",
  //   guestCount: 2,
  //   message: "Selamat menempuh hidup baru!",
  //   ipAddress: "192.168.1.1",
  //   createdAt: "2025-12-09T..."
  // }
} else {
  console.error('❌ Error:', result.error);
}

// Example 2: Get guest book
const result = await getGuestBook('4022abcd-30d6-4c34-9166-004ae5a8d2de');

if (result.success) {
  console.log('📋 Messages:', result.data);
  // [
  //   {
  //     guestId: "xxx",
  //     invitationId: "xxx",
  //     guestName: "John Doe",
  //     attendanceStatus: "ATTENDING",
  //     guestCount: 2,
  //     message: "Selamat!",
  //     ipAddress: "192.168.1.1",
  //     createdAt: "2025-12-09T..."
  //   },
  //   ...
  // ]
  
  result.data.forEach((msg: any) => {
    console.log(`${msg.guestName}: ${msg.message}`);
  });
}

// Example 3: Usage in React component
import { insertMessages, getGuestBook } from '@/queries';

function GuestBookComponent({ invitationId }: { invitationId: string }) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const fetchMessages = async () => {
      const result = await getGuestBook(invitationId);
      if (result.success && result.data) {
        setMessages(result.data);
      }
    };
    fetchMessages();
  }, [invitationId]);
  
  const handleSubmit = async (name: string, message: string) => {
    const result = await insertMessages({
      invitationId,
      guestName: name,
      attendanceStatus: 'ATTENDING',
      guestCount: 1,
      message,
    });
    
    if (result.success) {
      // Refresh messages
      const updated = await getGuestBook(invitationId);
      if (updated.success && updated.data) {
        setMessages(updated.data);
      }
    }
  };
  
  return (
    <div>
      {messages.map((msg: any) => (
        <div key={msg.guestId}>
          <strong>{msg.guestName}</strong>: {msg.message}
        </div>
      ))}
    </div>
  );
}
*/
