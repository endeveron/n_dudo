import { verifyUserId } from '@/core/actions/auth';
import OnboardingForm from '@/core/components/auth/onboarding-form';
import AnimatedAppear from '@/core/components/shared/animated-appear';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { SearchParams } from '@/core/types/common';

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { t } = await searchParams;
  const userId = t as string;

  if (!userId) throw new Error(`Invalid search param for user's objectId.`);

  // Check the validity of the user objectId
  await verifyUserId(userId);

  return (
    <AnimatedAppear>
      <Card>
        <CardHeader>
          <CardTitle className="my-2 text-3xl">Onboarding</CardTitle>
          <CardDescription className="mb-2">
            Email successfully verified
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingForm userId={userId} />
        </CardContent>
      </Card>
    </AnimatedAppear>
  );
}
