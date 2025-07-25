import GenerateTokenButton from '@/core/features/auth/components/generate-token-button';
import {
  AnimatedCard,
  CardContent,
  CardTitle,
} from '@/core/components/shared/card';
import { emailErrors } from '@/core/data/errors';
import { SearchParams } from '@/core/types/common';
import { getErrorMessageFromSearchParams } from '@/core/utils/error';

export default async function EmailErrorPage({
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
    <AnimatedCard>
      <CardTitle>Oops!</CardTitle>
      <CardContent>
        <p className="-mt-2 text-center">{errorMessage}</p>

        <div className="flex-center">
          <GenerateTokenButton
            email={email}
            className="mt-6"
            btnTitle="Generate a new token"
            variant="accent"
          />
        </div>
      </CardContent>
    </AnimatedCard>
  );
}
