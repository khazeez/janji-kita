import { notFound } from 'next/navigation';
import { getDataInvitationUser } from '@/models';
import InvitationPublic from '@/components/layout/dashboard-ui/InvitationPublic';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic metadata
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // Fetch data untuk metadata
  const data = await getDataInvitationUser(slug.toLowerCase());
  console.log(data);
  

  if (!data) {
    return {
      title: 'Invitation Not Found',
      description: 'The invitation you are looking for does not exist.',
    };
  }

  return {
    title: `${data.invitationDataUser.brideNickName} & ${data.invitationDataUser.groomNickName} - Wedding Invitation`,
    description: `You're invited to the wedding of ${data.invitationDataUser.brideNickName} and ${data.invitationDataUser.groomNickName}`,
    openGraph: {
      title: `${data.invitationDataUser.brideNickName} & ${data.invitationDataUser.groomNickName} - Wedding Invitation`,
      description: `You're invited to the wedding of ${data.invitationDataUser.brideNickName} and ${data.invitationDataUser.groomNickName}`,
      images: data.invitationDataUser.galleryPhotos
        ? [data.invitationDataUser.galleryPhotos[0]]
        : [],
    },
  };
}

export default async function InvitationPublicPage({ params }: PageProps) {
  const { slug } = await params;

  // Validasi slug
  if (!slug || slug.trim() === '') {
    notFound();
  }

  // Fetch data
  const data = await getDataInvitationUser(slug.toLowerCase());

  // Jika data tidak ditemukan, trigger 404
  if (!data) {
    notFound();
  }

  return <InvitationPublic data={data} />;
}
