'use client';

import GlassesDesign from '@/theme/gold/elegan/elegan-1/main';
import { AllInvitationData } from '@/types/all-invitation-data';

interface Props {
  data: AllInvitationData;
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

    default:
      return (
        <div className='min-h-screen bg-black flex items-center justify-center'>
          <h1 className='text-white text-2xl'>Invalid Product</h1>
        </div>
      );
  }
}
