'use client';

import { NavbarItem as TNavbarItem } from '@/core/types/common';
import { cn } from '@/core/utils/common';
import { ReactElement } from 'react';

type NavbarItemProps = TNavbarItem & {
  icon: ReactElement;
  title: string;
  onClick: (path?: string) => void;
  pathname?: string;
  isPending?: boolean;
};

const NavbarItem = ({
  icon,
  path,
  title,
  pathname,
  onClick,
  isPending,
}: NavbarItemProps) => {
  const handleClick = () => {
    if (path === pathname) return;
    onClick(path);
  };

  const isActiveState = path ? path === pathname : isPending;
  const isNormalState = path ? path !== pathname : !isPending;

  return (
    <div
      onClick={handleClick}
      className={cn(`w-10 flex-center flex-col transition-opacity`, {
        'opacity-100 text-accent': isActiveState,
        'opacity-50 hover:opacity-100 cursor-pointer': isNormalState,
      })}
    >
      {icon}
      <div
        className={cn(
          `mt-1 text-[8px] font-bold tracking-wider uppercase cursor-default opacity-80 no-select`,
          {
            'text-accent': isActiveState,
            'text-muted': isNormalState,
          }
        )}
      >
        {title}
      </div>
    </div>
  );
};

export default NavbarItem;
