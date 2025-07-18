'use client';

import { usePathname } from 'next/navigation';

import MainMenu from '@/core/components/shared/main-menu';

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
    <div className="topbar">
      {title || heading ? (
        <div className="text-2xl font-bold text-accent leading-none">
          {title || heading}
        </div>
      ) : null}
      <div />
      <MainMenu email={email} />
    </div>
  );
};

export default Topbar;
