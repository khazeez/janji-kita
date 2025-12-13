import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// 🧠 Metadata global
export const metadata: Metadata = {
  title: 'JanjiKita',
  description: 'Berbagi moment indah dengan sanak keluarga',
  icons: {
    icon: '/wedding3.jpg', // ubah favicon default
  },
  openGraph: {
    title: 'JanjiKita',
    description: 'Berbagi moment indah dengan sanak keluarga',
    url: 'https://janjikita.art',
    siteName: 'JanjiKita',
    images: [
      {
        url: '/wedding3.jpg',
        width: 1200,
        height: 630,
        alt: 'JanjiKita Wedding Invitation',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JanjiKita',
    description: 'Berbagi moment indah dengan sanak keluarga',
    images: ['/wedding3.jpg'], // 🖼️ gunakan gambar yang sama
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='id'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
