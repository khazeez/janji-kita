'use client';
import { useEffect, useState } from 'react';
import Invitation from '@/components/layout/dashboard-ui/Invitation';
import { getDataInvitationUserByUserId } from '@/models/invitations';
import supabase from '@/lib/supabase/client';

export default function Invitations() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        throw new Error('User Unauthorized');
      }

      const invitations = await getDataInvitationUserByUserId(session.user.id);
      setData(invitations);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return null;

  return <Invitation data={data} />;
}
