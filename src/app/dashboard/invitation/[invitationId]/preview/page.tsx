'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getDataInvitationUser } from '@/models';
import Loading from '@/components/ui/Loading';
import GlassesDesign from '@/theme/gold/elegan/elegan-1/main';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { getDataInvitationUserById } from '@/models/invitations';

export default function Slug() {
  const params = useParams();

  const slugParam = Array.isArray(params?.invitationId)
    ? params.invitationId[0]
    : params?.invitationId;

  const slug = slugParam?.toString().toLowerCase();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchAll = async () => {
      try {
        const user = await getCurrentUser();
        const dataInv = await getDataInvitationUserById(slug);

        setCurrentUser(user);
        setInvitation(dataInv);
      } catch {
        setInvitation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [slug]);

  if (loading) {
    return <Loading />;
  }

  if (!invitation) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center text-white'>
        Data invitation tidak ditemukan
      </div>
    );
  }

  /**
   * ⚠️ Client-side ownership check (UX ONLY)
   * BUKAN security
   */
  if (currentUser && invitation.userId !== currentUser.id) {
    return (
      <div className='min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4'>
        <h1>Bukan undangan anda</h1>
        <Link href='/dashboard' className='underline'>
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  const productName = invitation?.product?.productName;

  switch (productName) {
    case 'Glasses':
      return <GlassesDesign data={invitation} />;
    default:
      return (
        <div className='min-h-screen bg-black flex items-center justify-center text-white'>
          Invalid Product
        </div>
      );
  }
}
