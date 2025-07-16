'use client';

import { usePathname } from 'next/navigation';

import SignOutButton from '@/core/components/auth/sign-out-btn';

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
        <div className="ml-1 -translate-y-0.5 text-2xl font-bold text-accent leading-none">
          {title || heading}
        </div>
      ) : null}
      <div />
      {email ? (
        <div className="flex items-center gap-2">
          <div className="-translate-y-[1px] text-sm text-muted/70 dark:text-accent dark:text-shadow-xs leading-none">
            {email}
          </div>
          <SignOutButton />
        </div>
      ) : null}
    </div>
  );
};

export default Topbar;
