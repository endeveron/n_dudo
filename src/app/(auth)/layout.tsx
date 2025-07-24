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
    <main className="main">
      <BackgroundImage />

      <div className="main_content">{children}</div>
    </main>
  );
}
