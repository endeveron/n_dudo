import SignInForm from '@/core/features/auth/components/signin-form';
import { AnimatedCard, CardTitle } from '@/core/components/shared/card';

export default async function SigninPage() {
  return (
    <AnimatedCard>
      <CardTitle>Sign In</CardTitle>
      <SignInForm />
    </AnimatedCard>
  );
}
