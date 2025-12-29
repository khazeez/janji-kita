// app/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getDataInvitationUser } from '@/models';
import InvitationPublic from '@/components/layout/dashboard-ui/InvitationPublic'

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function InvitationPublicPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const data = await getDataInvitationUser(slug.toLowerCase());

  if (!data) {
    notFound();
  }

  return <InvitationPublic data={data} />;
}
