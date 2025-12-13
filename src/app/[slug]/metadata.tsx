import { getDataInvitationUser } from "@/queries";
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const data = await getDataInvitationUser(params.slug);

    return {
      title: `${data?.invitationDataUser.groomNickName} & ${data?.invitationDataUser.brideNickName} | JanjiKita`,
      description: `Undangan pernikahan ${data?.invitationDataUser.groomNickName} & ${data?.invitationDataUser.brideNickName}.`,
      openGraph: {
        title: `${data?.invitationDataUser.groomNickName} & ${data?.invitationDataUser.brideNickName}`,
        description: 'Berbagi moment indah dengan sanak keluarga',
        url: `https://janjikita.art/${params.slug}`,
        siteName: 'JanjiKita',
        images: [
          {
            url:
              data?.invitationDataUser.groomFullName ||
              'https://janjikita.art/janjiKitaPutih.png',
            width: 1200,
            height: 630,
            alt: `${data?.invitationDataUser.groomFullName} & ${data?.invitationDataUser.brideFullName}`,
          },
        ],
        locale: 'id_ID',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${data?.invitationDataUser.groomFullName} & ${data?.invitationDataUser.brideFullName}`,
        description: 'Berbagi moment indah dengan sanak keluarga',
        images: [data?.invitationDataUser.brideFullName || 'https://janjikita.art/imam39.png'],
      },
    };
  } catch (err) {
    return {
      title: 'Undangan Tidak Ditemukan | JanjiKita',
      description: 'Maaf, undangan yang Anda cari tidak tersedia.',
    };
  }
}