import type { Metadata } from 'next';

import BackgroundImage from '@/core/components/shared/background-image';

export const metadata: Metadata = {
  title: 'Games',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative h-dvh flex-center bg-main-image-background">
      <BackgroundImage />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </main>
  );
}
