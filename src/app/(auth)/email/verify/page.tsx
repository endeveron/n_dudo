import GenerateTokenButton from '@/core/features/auth/components/generate-token-button';
import {
  AnimatedCard,
  CardContent,
  CardTitle,
} from '@/core/components/shared/card';
import { SearchParams } from '@/core/types/common';

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
