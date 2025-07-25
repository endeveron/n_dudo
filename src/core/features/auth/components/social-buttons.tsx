'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

import FormLoading from '@/core/components/shared/form-loading';
import { Button } from '@/core/components/ui/button';
import { useErrorHandler } from '@/core/hooks/error';
import { SocialProvider } from '@/core/features/auth/types';
import { DEFAULT_REDIRECT } from '@/core/constants';

const SocialButtons = () => {
  const { toastError } = useErrorHandler();
  const [isPending, setPending] = useState(false);

  const handleClick = async (provider: SocialProvider) => {
    try {
      setPending(true);
      await signIn(provider, {
        callbackUrl: DEFAULT_REDIRECT,
      });
    } catch (err: unknown) {
      toastError(err);
      setPending(false);
    }
  };

  return (
    <div className="social-buttons relative flex flex-col gap-4">
      <p className="text-center text-sm">or</p>
      <Button
        onClick={() => handleClick(SocialProvider.google)}
        type="button"
        variant="outline"
      >
        Sign In with Google
      </Button>
      <FormLoading isPending={isPending} />
    </div>
  );
};

export default SocialButtons;
