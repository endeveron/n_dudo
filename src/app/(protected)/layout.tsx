import BackgroundImage from '@/core/components/shared/background-image';
import Topbar from '@/core/components/shared/topbar';
import { PremiumProvider } from '@/core/features/premium/context';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PremiumProvider>
      <main className="main">
        <BackgroundImage />

        <div className="main_content">
          <Topbar />

          {/* Content area, scrollable */}
          <div className="w-full flex-center flex-col flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </main>
    </PremiumProvider>
  );
}
