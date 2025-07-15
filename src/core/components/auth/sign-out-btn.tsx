'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';

import LoadingIcon from '@/core/components/shared/loading-icon';
import LogoutIcon from '~/public/icons/auth/logout.svg';
import { cn } from '@/core/utils/common';

const SignOutButton = () => {
  const [pending, setPending] = useState(false);

  const handleClick = () => {
    setPending(true);
    signOut();
  };
  return (
    <div
      onClick={handleClick}
      className={cn(
        'scale-75 opacity-60 hover:opacity-100 transition-opacity cursor-pointer',
        {
          'opacity-100': pending,
        }
      )}
      title="Sign out"
    >
      {pending ? (
        <div className="w-6 h-6 flex-center">
          <LoadingIcon />
        </div>
      ) : (
        <div className="w-6 h-6 flex-center">
          <LogoutIcon />
        </div>
      )}
    </div>
  );
};

export default SignOutButton;
