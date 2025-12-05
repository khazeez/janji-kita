'use client';

import { useParams } from 'next/navigation';
import dummyWeddingData from '@/data/dummyData';
import NetflixDesign from '@/templates/gold/special';

export default function Slug() {
  const params = useParams();

  // Pastikan slug selalu berupa string (bukan array)
  const slugParam = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const slug = slugParam?.toString().toLowerCase();

  const dummySlug = dummyWeddingData.invitation_link?.toLowerCase();

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

  switch (dummyWeddingData.invitation_id) {
    case 'Inkjlsd':
      return <NetflixDesign data={dummyWeddingData} />;
      break;

    default:
      break;
  }
}
