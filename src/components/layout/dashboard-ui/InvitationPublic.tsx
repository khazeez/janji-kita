'use client';

import GlassesDesign from '@/theme/gold/elegan/elegan-1/main';
import NetflixDesign from '@/theme/gold/special/index';
import AdatDesign from '@/theme/gold/traditional/main';
import { AllInvitationData } from '@/types/all-invitation-data';

interface Props {
  data: AllInvitationData;
}

function toSnakeCaseData(data: AllInvitationData) {
  const events = data.invitationEvent || [];
  const akadEvent = events.find(e => e.eventType === 'AKAD');
  const resepsiEvent = events.find(e => e.eventType === 'RESEPSI');
  const gift = data.invitationGift;

  const groomBanks = gift?.invitationGiftBank
    ?.filter(b => b.owner === 'GROOM')
    ?.map(b => ({
      bank_name: b.account?.[0]?.bank_name || '',
      account_number: b.account?.[0]?.account_number || '',
      account_holder: b.account?.[0]?.account_holder || '',
    })) || [];

  const brideBanks = gift?.invitationGiftBank
    ?.filter(b => b.owner === 'BRIDE')
    ?.map(b => ({
      bank_name: b.account?.[0]?.bank_name || '',
      account_number: b.account?.[0]?.account_number || '',
      account_holder: b.account?.[0]?.account_holder || '',
    })) || [];

  const groomWallets = gift?.invitationGiftWallet
    ?.filter(w => w.owner === 'GROOM')
    ?.map(w => ({
      wallet_name: w.address?.[0]?.wallet_name || '',
      wallet_number: w.address?.[0]?.wallet_number || '',
      wallet_holder: w.address?.[0]?.wallet_holder || '',
    })) || [];

  const brideWallets = gift?.invitationGiftWallet
    ?.filter(w => w.owner === 'BRIDE')
    ?.map(w => ({
      wallet_name: w.address?.[0]?.wallet_name || '',
      wallet_number: w.address?.[0]?.wallet_number || '',
      wallet_holder: w.address?.[0]?.wallet_holder || '',
    })) || [];

  return {
    data_id: data.invitationDataUser?.dataId || '',
    invitation_id: data.invitationId,
    invitation_link: data.invitationUrl,
    groom_full_name: data.invitationDataUser?.groomFullName || '',
    groom_nick_name: data.invitationDataUser?.groomNickName || '',
    groom_parent_name: data.invitationDataUser?.groomParentName || '',
    groom_instagram: data.invitationDataUser?.groomInstagram || '',
    groom_photo_url: data.invitationDataUser?.groomPhotoUrl || '',
    bride_full_name: data.invitationDataUser?.brideFullName || '',
    bride_nick_name: data.invitationDataUser?.brideNickName || '',
    bride_parent_name: data.invitationDataUser?.brideParentName || '',
    bride_instagram: data.invitationDataUser?.brideInstagram || '',
    bride_photo_url: data.invitationDataUser?.bridePhotoUrl || '',
    gallery_photos: data.invitationDataUser?.galleryPhotos || [],
    akad_datetime: akadEvent?.startTime || '',
    akad_location: akadEvent?.location || '',
    akad_address: akadEvent?.locationDetail || '',
    akad_maps_url: akadEvent?.mapsUrl || '',
    resepsi_datetime: resepsiEvent?.startTime || '',
    resepsi_location: resepsiEvent?.location || '',
    resepsi_address: resepsiEvent?.locationDetail || '',
    resepsi_maps_url: resepsiEvent?.mapsUrl || '',
    gift_address: gift?.address || '',
    groom_bank_accounts: groomBanks,
    bride_bank_accounts: brideBanks,
    groom_wallets: groomWallets,
    bride_wallets: brideWallets,
    love_story: data.invitationDataUser?.loveStory?.map((s: any) => s.text || '').join('\n\n') || '',
    is_deleted: false,
    created_at: data.createdAt || '',
    updated_at: data.updatedAt || '',
    deleted_at: undefined,
  };
}

export default function InvitationPublic({ data }: Props) {
  const { invitationStatus, product } = data;

  if (invitationStatus === 'draft') {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <h1 className='text-white text-2xl'>Undanganmu belum aktif</h1>
      </div>
    );
  }

  if (invitationStatus === 'expired') {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <h1 className='text-white text-2xl'>Undanganmu sudah kadaluarsa</h1>
      </div>
    );
  }

  switch (product.productName) {
    case 'Glasses':
      return <GlassesDesign data={data} />;

    case 'special':
      return <NetflixDesign data={toSnakeCaseData(data)} />;

    case 'Adat':
    case 'Traditional':
      return <AdatDesign data={data} />;

    default:
      return (
        <div className='min-h-screen bg-black flex items-center justify-center'>
          <h1 className='text-white text-2xl'>Invalid Product</h1>
        </div>
      );
  }
}
