import SignUpForm from '@/core/components/auth/signup-form';
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
            <CardTitle className="my-2 text-3xl">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <SignUpForm />
          </CardContent>
        </Card>
      </>
    </AnimatedAppear>
  );
}
