import SignUpForm from '@/core/components/auth/signup-form';
import { AnimatedCard, CardTitle } from '@/core/components/shared/card';

export default async function Page() {
  return (
    <AnimatedCard>
      <CardTitle>Sign Up</CardTitle>
      <SignUpForm />
    </AnimatedCard>
  );
}
