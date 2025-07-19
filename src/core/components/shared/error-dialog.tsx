'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/core/components/ui/button';
import {
  AnimatedCard,
  CardContent,
  CardTitle,
} from '@/core/components/shared/card';

type TErrorProps = {
  error: Error & { digest?: string };
  onReset: () => void;
};

const ErrorDialog = ({ error, onReset }: TErrorProps) => {
  const router = useRouter();

  return (
    <AnimatedCard>
      <CardTitle>Oops!</CardTitle>
      <CardContent>
        <p className="mb-8 text-center">
          {error?.message || 'Something went wrong.'}
        </p>

        <div className="mt-4 flex flex-wrap max-xs:gap-4 gap-8">
          <Button
            variant="outline"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => onReset()
            }
          >
            Try again
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Previous page
          </Button>
        </div>
      </CardContent>
    </AnimatedCard>
  );
};

ErrorDialog.displayName = 'ErrorDialog';

export default ErrorDialog;
