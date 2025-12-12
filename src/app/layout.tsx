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
    icon: '/janjiKitaPutih.png', // ubah favicon default
  },
  openGraph: {
    title: 'JanjiKita',
    description: 'Berbagi moment indah dengan sanak keluarga',
    url: 'https://janjikita.art', // ganti dengan domain kamu
    siteName: 'JanjiKita',
    images: [
      {
        url: '/janjiKitaPutih.png', // 🖼️ gambar preview (pastikan ada di public/og-image.jpg)
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
    images: ['/janjiKitaPutih.png'], // 🖼️ gunakan gambar yang sama
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
