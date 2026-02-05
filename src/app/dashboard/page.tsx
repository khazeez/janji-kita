'use client';
import { useEffect, useState } from 'react';
import Invitation from '@/components/layout/dashboard-ui/Invitation';
import { getDataInvitationUserByUserId } from '@/models/invitations';
import supabase from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Invitations() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        router.push('/sign-in');
        return;
      }

      try {
        const invitations = await getDataInvitationUserByUserId(session.user.id);
        setData(invitations || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  if (loading) return(
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
       <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return <Invitation data={data || []}  trx={data}/>;
}
