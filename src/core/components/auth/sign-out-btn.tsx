'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';

import LoadingIcon from '@/core/components/shared/loading-icon';

const SignOutButton = () => {
  const [pending, setPending] = useState(false);

  const handleClick = () => {
    setPending(true);
    signOut();
  };
  return (
    <div onClick={handleClick}>
      {/* {pending ? <LoadingIcon className="scale-75" /> : ''} */}
      {pending ? (
        <LoadingIcon className="scale-75" />
      ) : (
        <span className="cursor-pointer">Sign Out</span>
        // <LoadingIcon className="scale-75" />
      )}
    </div>
    // <div
    //   onClick={handleClick}
    //   className={cn(
    //     'scale-75 opacity-55 dark:opacity-70 hover:opacity-100 dark:hover:opacity-100 transition-opacity cursor-pointer',
    //     {
    //       'opacity-100': pending,
    //     }
    //   )}
    //   title="Sign out"
    // >
    //   <div className="w-6 h-6 flex-center">
    //     {pending ? <LoadingIcon /> : <LogoutIcon />}
    //   </div>
    // </div>
  );
};

export default SignOutButton;
