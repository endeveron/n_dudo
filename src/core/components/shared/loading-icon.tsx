'use client';

import { cn } from '@/core/utils/common';

type TLoadingIconProps = {
  size?: number;
  thickness?: number;
  className?: string;
};

const LoadingIcon = ({
  className,
  size = 24,
  thickness = 2,
}: TLoadingIconProps) => {
  return (
    <div className={cn('loading-icon', className)}>
      <div
        className="border-2 border-accent border-t-transparent rounded-full animate-spin"
        style={{ width: size, height: size, borderWidth: thickness }}
      />
    </div>
  );
};

export default LoadingIcon;
