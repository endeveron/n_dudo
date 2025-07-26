import { Metadata } from 'next';

import SignUpForm from '@/core/features/auth/components/signup-form';
import { AnimatedCard, CardTitle } from '@/core/components/shared/card';
import { APP_NAME } from '@/core/constants';

export const metadata: Metadata = {
  title: `Sign Up | ${APP_NAME}`,
  description: 'Account creation',
};

export default async function SignupPage() {
  return (
    <AnimatedCard>
      <CardTitle>Sign Up</CardTitle>
      <SignUpForm />
    </AnimatedCard>
  );
}
