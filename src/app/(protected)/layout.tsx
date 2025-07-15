import { redirect } from 'next/navigation';

import BackgroundImage from '@/core/components/shared/background-image';
import Topbar from '@/core/components/shared/topbar';
import { auth } from '~/auth';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) return redirect('/sign-in');

  return (
    <main className="relative h-dvh flex-center bg-main-image-background">
      <BackgroundImage />

      {/* Content */}
      <div className="relative w-full flex flex-col h-dvh min-h-dvh max-h-dvh z-20">
        <Topbar email={session?.user.email} />
        {/* Content area, scrollable */}
        <div className="flex-center flex-col flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </main>
  );
}
