'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/core/components/ui/button';

type TSignInButtonProps = React.ComponentPropsWithRef<typeof Button> & {
  title?: string;
};

const SignInButton = (props: TSignInButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    router.push('/signin');
  };

  return (
    <Button
      variant="default"
      onClick={handleClick}
      loading={loading}
      {...props}
      title=""
    >
      {props?.title || 'Join Now'}
    </Button>
  );
};

export default SignInButton;
