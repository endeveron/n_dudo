import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
// import localFont from 'next/font/local';

import { Toaster } from '@/core/components/ui/sonner';
import { Providers } from '@/core/context/providers';
import '@/core/globals.css';
import BackgroundImage from '@/core/components/shared/background-image';

export const metadata: Metadata = {
  metadataBase: new URL('https://yourapp.com'), // Required for social media images
  title: 'Games',
  applicationName: 'Games',
  description: `Let's play!`,
  keywords: ['Dice games', `Liar's dice`, 'Dudo'],
  creator: 'Endeveron',
  openGraph: {
    title: 'Games',
    description: `Let's play!`,
    siteName: 'Games',
    type: 'website',
    url: 'https://games-livid-one.vercel.app',
    locale: 'en_US',
    images: [
      {
        url: '/images/og-image.png', // 1200x630 recommended
        width: 1200,
        height: 630,
        alt: `Games - Let's play!`,
        type: 'image/png',
      },
      {
        url: '/images/og-image-square.png', // Square version for some platforms
        width: 1200,
        height: 1200,
        alt: `Games - Let's play!`,
        type: 'image/png',
      },
      {
        url: '/icons/icon.svg',
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

  // X (formerly Twitter) Cards
  twitter: {
    site: 'https://games-livid-one.vercel.app',
    card: 'summary_large_image',
    title: 'Games',
    description: `Games - Let's play!`,
    images: ['/twitter-image.png'], // 1200x675
  },

  // Additional meta tags for messaging apps and social platforms
  other: {
    // WhatsApp and general mobile
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Games',

    // Pinterest
    'pinterest-rich-pin': 'true',

    // Generic social media
    robots: 'index, follow',
    googlebot: 'index, follow',

    // For better link previews in messaging apps
    'format-detection': 'telephone=no',
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
        <BackgroundImage />
        <Providers>
          <div className="layout">{children}</div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
