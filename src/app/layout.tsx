import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Janjikita Art - Wedding Invitation',
  description: 'Pilihan terbaik untuk moment spesial anda',
  icons: {
    icon: '/wedding3.jpg',
  },
  openGraph: {
    title: 'Janjikita Art - Wedding Invitation',
    description: 'Pilihan terbaik untuk moment spesial anda',
    url: 'https://janjikita.art',
    siteName: 'JanjiKita',
    images: [
      {
        url: 'https://janjikita.art/wedding3.jpg',
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
    title: 'Janjikita Art',
    description: 'Pilihan terbaik untuk moment spesial anda',
    images: ['https://janjikita.art/wedding3.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='id'>
      <head>
        {/* Google Analytics */}
        <Script
          src='https://www.googletagmanager.com/gtag/js?id=G-TX735CEGWH'
          strategy='afterInteractive'
        />
        <Script id='google-analytics' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TX735CEGWH');
          `}
        </Script>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
