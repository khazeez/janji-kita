'use client';
import Invitation from '@/components/layout/dashboard-ui/Invitation';
import { useUserInvitations, useCurrentUser } from '@/hooks/useData';

export default function Invitations() {
  const { data: user, isLoading: loadingUser } = useCurrentUser();
  const { data: invitations, isLoading: loadingInvitations } = useUserInvitations(user?.id);

  if (loadingUser || loadingInvitations) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <Invitation data={data || []} />;
}
