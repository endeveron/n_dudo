import SignInForm from '@/core/components/auth/signin-form';
import { AnimatedCard, CardTitle } from '@/core/components/shared/card';

export default async function Page() {
  return (
    <AnimatedCard>
      <CardTitle>Sign In</CardTitle>
      <SignInForm />
    </AnimatedCard>
  );
}
