'use client';

import ErrorDialog from '@/core/components/shared/error-dialog';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorDialog error={error} onReset={reset} />;
}
