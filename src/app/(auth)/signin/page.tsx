import SignInForm from '@/core/components/auth/signin-form';
import AnimatedAppear from '@/core/components/shared/animated-appear';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';

export default async function Page() {
  return (
    <AnimatedAppear>
      <>
        <Card>
          <CardHeader>
            <CardTitle className="my-2 text-3xl">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <SignInForm />
          </CardContent>
        </Card>
      </>
    </AnimatedAppear>
  );
}
