'use client';

import { useParams } from 'next/navigation';
import dummyWeddingData from '@/data/dummyData';
import { dummyInvitation } from '@/data/dummy2';
import NetflixDesign from '@/templates/gold/special';
import GlassesDesign from '@/templates/gold/elegan/elegan-1/main';

export default function Slug() {
  const params = useParams();

  // Pastikan slug selalu berupa string (bukan array)
  const slugParam = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const slug = slugParam?.toString().toLowerCase();

  const dummySlug = dummyInvitation.invitationUrl?.toLowerCase();

  // Debug
  console.log('Current slug:', slug);
  console.log('Expected slug:', dummySlug);

  if (!slug) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <h1 className='text-white text-2xl'>Loading...</h1>
      </div>
    );
  }

  if (slug !== dummySlug) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-white text-2xl mb-4'>
            Wedding Invitation Not Found
          </h1>
        </div>
      </div>
    );
  }

  switch (dummyInvitation.productId) {
    case 'Inkjlsd':
      return <NetflixDesign data={dummyWeddingData} />;
      break;
    case 'prod-001':
      return <GlassesDesign data={dummyInvitation} />;
    default:
      break;
  }
}
