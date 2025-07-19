'use client';

import { usePathname } from 'next/navigation';

import MainMenu from '@/core/components/shared/main-menu';
import AnimatedAppear from '@/core/components/shared/animated-appear';

type TopbarProps = {
  email?: string | null;
  title?: string;
};

const Topbar = ({ email, title }: TopbarProps) => {
  const path = usePathname();
  // Remove the first character, replace all hyphens with spaces and capitalize the first letter: "/game-name" => "Game name"
  const heading = path
    .slice(1)
    .replace(/-/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());

  return (
    <AnimatedAppear className="fixed left-1/2 -translate-x-1/2 h-14 w-full max-w-[640px] mx-auto flex items-center justify-between px-4 rounded-b-xl bg-card border-card-border border-1 cursor-default z-50">
      {title || heading ? (
        <div className="text-2xl font-bold text-accent leading-none">
          {title || heading}
        </div>
      ) : null}
      <div />
      <MainMenu email={email} />
    </AnimatedAppear>
  );
};

export default Topbar;
