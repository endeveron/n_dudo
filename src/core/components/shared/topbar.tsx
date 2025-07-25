'use client';

import { usePathname } from 'next/navigation';

import MainMenu from '@/core/components/shared/main-menu';
import AnimatedAppear from '@/core/components/shared/animated-appear';
import Premium from '@/core/features/premium/components/premium';
import { useSessionWithRefresh } from '@/core/features/auth/hooks/use-session-with-refresh';

type TopbarProps = {
  title?: string;
};

const Topbar = ({ title }: TopbarProps) => {
  const path = usePathname();
  const { session } = useSessionWithRefresh();

  // Remove the first character, replace all hyphens with spaces and capitalize the first letter: "/game-name" => "Game name"
  const heading = path
    .slice(1)
    .replace(/-/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());

  return (
    <AnimatedAppear className="fixed top-0 left-1/2 -translate-x-1/2 h-14 w-full max-w-[640px] mx-auto flex items-center justify-between px-4 rounded-b-xl bg-card border-card-border border-1 cursor-default z-50">
      <div className="relative w-5">
        {title || heading ? (
          <div className="absolute top-0 left-0 bottom-0 flex-center text-2xl font-bold text-accent leading-none">
            {title || heading}
          </div>
        ) : null}
      </div>

      <Premium />

      <MainMenu email={session?.user.email} />
    </AnimatedAppear>
  );
};

export default Topbar;
