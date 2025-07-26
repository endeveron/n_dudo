import { Metadata } from 'next';

import { verifyUserId } from '@/core/features/auth/actions';
import OnboardingForm from '@/core/features/auth/components/onboarding-form';
import {
  AnimatedCard,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/core/components/shared/card';
import { SearchParams } from '@/core/types/common';
import { APP_NAME } from '@/core/constants';

export const metadata: Metadata = {
  title: `Onboarding | ${APP_NAME}`,
  description: 'Account creation',
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { t } = await searchParams;
  const userId = t as string;

  if (!userId) throw new Error(`Invalid search param for user's objectId`);

  // Check the validity of the user objectId
  await verifyUserId(userId);

  return (
    <AnimatedCard>
      <CardTitle>Onboarding</CardTitle>
      <CardDescription className="text-muted">
        Email successfully verified
      </CardDescription>
      <CardContent>
        <OnboardingForm userId={userId} />
      </CardContent>
    </AnimatedCard>
  );
}
