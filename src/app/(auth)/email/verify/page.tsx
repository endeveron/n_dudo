import GenerateTokenButton from '@/core/components/auth/generate-token-button';
import AnimatedAppear from '@/core/components/shared/animated-appear';
import DialogCard from '@/core/components/shared/dialog-card';
import { SearchParams } from '@/core/types/common';

export default async function Page({
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
    <AnimatedAppear>
      <DialogCard title="Great, now verify email">
        <p>
          Check your inbox at <strong>{email}</strong> and click the button
          inside to complete your registration.
        </p>
        <p className="my-2">
          <strong>Don&apos;t see an email?</strong> Check spam folder.
        </p>
        <GenerateTokenButton
          email={email}
          className="mt-6 mb-4"
          btnTitle="Resend verification link"
          variant="outline"
        />
      </DialogCard>
    </AnimatedAppear>
  );
}
