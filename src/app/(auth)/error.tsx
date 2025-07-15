// Error components must be Client Components
// See https://nextjs.org/docs/app/building-your-application/routing/error-handling
'use client';

import AnimatedAppear from '@/core/components/shared/animated-appear';
import ErrorDialog from '@/core/components/shared/error-dialog';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AnimatedAppear>
      <ErrorDialog error={error} onReset={reset} />
    </AnimatedAppear>
  );
}
