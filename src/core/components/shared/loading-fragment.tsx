import LoadingIcon from '@/core/components/shared/loading-icon';
import { cn } from '@/core/utils/common';

const LoadingFragment = () => {
  return (
    <div
      className={cn(
        'loading opacity-0 w-full flex-center bg-background/70 transition-opacity'
      )}
    >
      <LoadingIcon />
    </div>
  );
};

export default LoadingFragment;
