// app/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getDataInvitationUser, getDataInvitationUserById } from '@/models';
import InvitationCustomer from '@/components/layout/dashboard-ui/InvitationCustomer';

interface PageProps {
  params: Promise<{
    invitationId: string;
  }>;
}

export default async function InvitationPublicPage({ params }: PageProps) {
  const { invitationId } = await params;

  if (!invitationId) {
    notFound();
  }

  const data = await getDataInvitationUserById(invitationId);

  if (!data) {
    notFound();
  }

  return <InvitationCustomer data={data} />;
}
