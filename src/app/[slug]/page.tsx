'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getDataInvitationUser } from '@/queries';
import Loading from '@/components/ui/Loading';
import NetflixDesign from '@/templates/gold/special';
import GlassesDesign from '@/templates/gold/elegan/elegan-1/main';

// ❌ Hapus pemanggilan manual generateMetadata()
// karena Next.js akan otomatis memanggilnya dari metadata.ts

export default function SlugPage() {
  const params = useParams();
  const slugParam = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const slug = slugParam?.toString().toLowerCase();

  const [dataUser, setDataUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const dataInv = await getDataInvitationUser(slug);
        setDataUser(dataInv);
      } catch (err) {
        console.error('Error fetching data:', err);
        setDataUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) return <Loading />;

  if (!dataUser) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <h1 className='text-white text-2xl'>Wedding Invitation Not Found</h1>
      </div>
    );
  }

  const productName = dataUser.product?.productName;

  switch (productName) {
    case 'Inkjlsd':
      return <NetflixDesign data={dataUser} />;
    case 'Glasses':
      return <GlassesDesign data={dataUser} />;
    default:
      return (
        <div className='min-h-screen bg-black flex items-center justify-center'>
          <h1 className='text-white text-2xl'>Invalid Product</h1>
        </div>
      );
  }
}
