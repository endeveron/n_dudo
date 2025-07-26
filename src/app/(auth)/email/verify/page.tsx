import { Metadata } from 'next';

import {
  AnimatedCard,
  CardContent,
  CardTitle,
} from '@/core/components/shared/card';
import { APP_NAME } from '@/core/constants';
import GenerateTokenButton from '@/core/features/auth/components/generate-token-button';
import { SearchParams } from '@/core/types/common';

export const metadata: Metadata = {
  title: `Verify Email | ${APP_NAME}`,
  description: 'Account creation',
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { e } = await searchParams;
  const email = e as string;

  if (!email) {
    throw new Error('Invalid search param for email');
  }

  return (
    <AnimatedCard>
      <CardTitle>Check your inbox</CardTitle>
      <CardContent>
        <p>
          We&apos;ve sent a link to <strong>{email}</strong>. Please follow the
          instructions to complete your registration.
        </p>
        <p className="mt-6">
          <strong>Don&apos;t see an email?</strong> Check spam folder.
        </p>
        <div className="flex-center">
          <GenerateTokenButton
            email={email}
            className="mt-6"
            btnTitle="Resend verification link"
            variant="outline"
          />
        </div>
      </CardContent>
    </AnimatedCard>
  );
}
