'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/core/components/ui/button';

type TErrorProps = {
  error: Error & { digest?: string };
  onReset: () => void;
};

const ErrorDialog = ({ error, onReset }: TErrorProps) => {
  const router = useRouter();

  return (
    <div className="error-dialog card rounded-xl w-full max-w-xl flex flex-col items-center p-4 m-auto cursor-default">
      <div className="min-w-96 p-8 rounded-2xl bg-card">
        <h2 className="text-5xl font-bold text-accent cursor-default">Oops!</h2>
        <p className="py-6 font-medium">
          {error?.message || 'Something went wrong.'}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap max-xs:gap-4 gap-8">
        <Button
          variant="accent"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => onReset()
          }
        >
          Try again
        </Button>
        <Button variant="secondary" onClick={() => router.back()}>
          Previous page
        </Button>
      </div>
    </div>
  );
};

ErrorDialog.displayName = 'ErrorDialog';

export default ErrorDialog;
