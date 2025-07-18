'use client';

import SignOutButton from '@/core/components/auth/sign-out-btn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/core/components/ui/dropdown-menu';
import MenuIcon from '~/public/icons/ui/menu.svg';

export interface MainMenuProps {
  email?: string | null;
}

const MainMenu = ({ email }: MainMenuProps) => {
  if (!email) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-2 text-accent cursor-pointer outline-none">
        <MenuIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={24}>
        <DropdownMenuLabel className="my-2 text-sm text-muted/70 dark:text-accent dark:text-shadow-xs leading-none cursor-default">
          {email}
        </DropdownMenuLabel>
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MainMenu;
