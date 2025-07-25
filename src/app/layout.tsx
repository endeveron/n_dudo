import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
// import localFont from 'next/font/local';

import { Toaster } from '@/core/components/ui/sonner';
import { Providers } from '@/core/context/providers';
import '@/core/globals.css';

export const metadata: Metadata = {
  title: 'Games',
  applicationName: 'Games',
  description: 'Games',
  openGraph: {
    title: 'Games',
    description: '',
    siteName: 'Games',
    type: 'website',
    images: [
      {
        url: 'https://games-livid-one.vercel.app/icons/icon.svg',
        width: 1024,
        height: 1024,
      },
    ],
  },
  icons: {
    icon: {
      url: 'https://games-livid-one.vercel.app/favicon.ico',
      type: 'image/image/ico',
    },
  },
};

export const viewport: Viewport = {
  interactiveWidget: 'resizes-content',
  viewportFit: 'cover',
};

const interSans = Inter({
  variable: '--font-inter-sans',
  subsets: ['latin'],
  display: 'swap',
});

// const googleSans = localFont({
//   variable: '--font-google-sans',
//   src: [
//     {
//       path: '../core/fonts/GoogleSans-Regular.woff2',
//       weight: '400',
//       style: 'normal',
//     },
//     {
//       path: '../core/fonts/GoogleSans-Medium.woff2',
//       weight: '500',
//       style: 'normal',
//     },
//     {
//       path: '../core/fonts/GoogleSans-Bold.woff2',
//       weight: '700',
//       style: 'normal',
//     },
//   ],
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        // className={`${interSans.variable} ${googleSans.variable} antialiased`}
        className={`${interSans.variable} antialiased`}
      >
        <Providers>
          <div className="layout">{children}</div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
