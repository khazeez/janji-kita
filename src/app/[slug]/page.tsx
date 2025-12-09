'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getDataInvitationUser, getProductInvitation } from '@/queries';
import Loading from '@/components/ui/Loading'
import NetflixDesign from '@/templates/gold/special';
import GlassesDesign from '@/templates/gold/elegan/elegan-1/main';

export default function Slug() {
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
        setDataUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <>
      {/* <Loading /> */}
      <h1>Loading...</h1>
      </>
    );
  }

  // Jika tidak ada data (slug salah)
  if (!dataUser) {
    console.log("INIIIIIIII",dataUser)
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-white text-2xl mb-4'>
            Wedding Invitation Not Found
          </h1>
        </div>
      </div>
    );
  } else {
    console.log('INIIIIIIII', dataUser);
  }

  // Ambil nama produk dari relasi Supabase
  const productName = dataUser.product.productName;
  console.log('INIIII YAAA',productName);

  switch (productName) {
    case 'Inkjlsd':
      return <NetflixDesign data={dataUser} />;
    case 'Glasses':
      return <GlassesDesign data={dataUser} />;
    default:
      return (
        <div className='min-h-screen bg-black flex items-center justify-center'>
          <h1 className='text-white text-2xl'>Invalid Product </h1>
        </div>
      );
  }
}
