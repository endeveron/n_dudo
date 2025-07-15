import GenerateTokenButton from '@/core/components/auth/generate-token-button';
import AnimatedAppear from '@/core/components/shared/animated-appear';
import DialogCard from '@/core/components/shared/dialog-card';
import { emailErrors } from '@/core/data/errors';
import { SearchParams } from '@/core/types/common';
import { getErrorMessageFromSearchParams } from '@/core/utils/error';

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { e, c } = await searchParams;
  const email = e as string;
  const errCodeStr = c as string;

  if (!email || !errCodeStr) {
    throw new Error('Invalid search params');
  }

  const errorMessage = getErrorMessageFromSearchParams(
    errCodeStr as string,
    emailErrors
  );

  return (
    <AnimatedAppear>
      <DialogCard title={`Oops! ${errorMessage}`}>
        <GenerateTokenButton email={email} />
      </DialogCard>
    </AnimatedAppear>
  );
}
