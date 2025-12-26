'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getDataInvitationUser, getProductInvitation } from '@/models';
import Loading from '@/components/ui/Loading';
import GlassesDesign from '@/theme/gold/elegan/elegan-1/main';

export default function Slug() {
  const params = useParams();

  const slugParam = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const slug = slugParam?.toString().toLowerCase();

  const [dataUser, setDataUser] = useState<any>(null);
  const [invitationStatus, setInvitationStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const dataInv = await getDataInvitationUser(slug);
        setDataUser(dataInv);
        setInvitationStatus(dataInv?.invitationStatus);
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
        <Loading />
        {/* <div className="flex items-center justify-center min-h-screen bg-black">
          <h1 className="text-white text-2xl text-center">Loading...</h1>
        </div> */}
      </>
    );
  }

  // Jika tidak ada data (slug salah)
  if (!dataUser) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-white text-2xl mb-4'>Undangan tidak ditemukan</h1>
        </div>
      </div>
    );
  }

  switch (invitationStatus) {
    case 'draft':
      return (
        <div className='min-h-screen bg-black flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-white text-2xl mb-4'>Undanganmu belum aktif</h1>
          </div>
        </div>
      );
      break;

    case 'expired':
      return (
        <div className='min-h-screen bg-black flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-white text-2xl mb-4'>Undanganmu sudah kadaluarsa</h1>
          </div>
        </div>
      );
      break;

    default:
      break;
  }

  const productName = dataUser.product.productName;

  switch (productName) {
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
