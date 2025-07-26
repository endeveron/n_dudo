import { Metadata } from 'next';

import { AnimatedCard, CardTitle } from '@/core/components/shared/card';
import { APP_NAME } from '@/core/constants';
import SignInForm from '@/core/features/auth/components/signin-form';

export const metadata: Metadata = {
  title: `Sign In | ${APP_NAME}`,
  description: 'Authentication',
};

export default async function SigninPage() {
  return (
    <AnimatedCard>
      <CardTitle>Sign In</CardTitle>
      <SignInForm />
    </AnimatedCard>
  );
}
