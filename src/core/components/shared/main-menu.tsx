'use client';

import SignOutButton from '@/core/features/auth/components/sign-out-btn';
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
      <DropdownMenuTrigger className="px-2 text-icon cursor-pointer outline-none">
        <MenuIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={24}>
        <DropdownMenuLabel className="my-2 text-sm dark:text-muted leading-none cursor-default">
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
