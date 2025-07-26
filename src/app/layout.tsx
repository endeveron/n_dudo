import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Toaster } from '@/core/components/ui/sonner';
import { Providers } from '@/core/context/providers';
import '@/core/globals.css';
import BackgroundImage from '@/core/components/shared/background-image';

export const metadata: Metadata = {
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
        url: 'https://games-livid-one.vercel.app/images/og-image.png',
        width: 1200,
        height: 630,
        alt: `Games - Let's play!`,
        type: 'image/png',
      },
      {
        url: 'https://games-livid-one.vercel.app/images/og-image-square.png',
        width: 1200,
        height: 1200,
        alt: `Games - Let's play!`,
        type: 'image/png',
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
    images: ['https://games-livid-one.vercel.app/images/twitter-image.png'], // 1200x675
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${interSans.variable} antialiased`}>
        <BackgroundImage />
        <Providers>
          <div className="layout">{children}</div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
