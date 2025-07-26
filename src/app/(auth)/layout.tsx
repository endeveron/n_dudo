import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Games',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="main">{children}</main>;
}
