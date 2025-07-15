'use client';

import { useState, PropsWithChildren, useEffect } from 'react';

import CloseIcon from '~/public/icons/ui/close.svg';
import LoadingIcon from '~/public/icons/ui/loading.svg';
import LockIcon from '~/public/icons/ui/lock.svg';

import { cn } from '@/core/utils/common';

type DraggableWindowProps = PropsWithChildren & {
  className?: string;
  isLoading?: boolean;
  isOpen?: boolean;
  title?: string;
  onClose?: () => void;
};

const PopupWindow = ({
  className,
  isLoading,
  isOpen,
  title,
  children,
  onClose,
}: DraggableWindowProps) => {
  const [isShown, setIsShown] = useState(false);

  const closeWindow = () => {
    setIsShown(false);
    if (onClose) onClose();
  };

  useEffect(() => {
    setIsShown(!!isOpen);
  }, [isOpen]);

  if (!isShown) return null;

  return (
    <div className="fixed inset-0 flex-center z-30">
      {/* Drawer */}
      <div
        // onClick={closeWindow}
        className="fixed inset-0 pointer-none backdrop-blur-2xl z-10"
      ></div>

      {/* Window */}
      <div
        // ref={windowRef}
        className={cn(
          `bg-card border border-border rounded-2xl select-none overflow-hidden z-20 transition-all`,
          className
        )}
      >
        {/* Header */}
        <div className="relative flex h-10 border-b border-border dark:bg-white/2">
          <div className="px-8 flex-center flex-1 text-sm text-system tracking-wide">
            {title ? (
              <>
                <LockIcon className="opacity-80 mr-0.5" />
                {title}
              </>
            ) : (
              'Please wait'
            )}
          </div>
          <div
            onClick={closeWindow}
            className="absolute right-0 h-10 w-10 flex-center cursor-pointer"
          >
            <CloseIcon className="text-icon scale-60 opacity-70 hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Content */}
        <div className="relative min-h-[200px]">
          {isLoading ? (
            <div className="absolute inset-0 flex-center flex-1 opacity-80">
              <LoadingIcon className="animate-spin" />
            </div>
          ) : null}
          <div
            className={cn(`opacity-0 transition-opacity`, {
              'opacity-100': !isLoading,
            })}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupWindow;
