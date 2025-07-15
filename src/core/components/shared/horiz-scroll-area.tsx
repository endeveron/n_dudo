'use client';

import { cn } from '@/core/utils/common';
import { PropsWithChildren, useCallback, useEffect, useRef } from 'react';

type HorizScrollAreaProps = PropsWithChildren & {
  className: string;
  itemsNumber?: number;
  minItemsNumberToEnableScroll?: number;
};

const HorizScrollArea = ({
  children,
  className,
  itemsNumber,
  minItemsNumberToEnableScroll,
}: HorizScrollAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (
        !scrollRef.current ||
        (itemsNumber &&
          minItemsNumberToEnableScroll &&
          itemsNumber < minItemsNumberToEnableScroll)
      ) {
        return;
      }

      // Only prevent default if we're doing horizontal scrolling
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        scrollRef.current.scrollLeft += e.deltaY * 2; // Adjust multiplier for scroll speed
      }
    },
    [itemsNumber, minItemsNumberToEnableScroll]
  );

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        `horizontal-scroll overflow-x-auto scrollbar-hide whitespace-nowrap scroll-smooth`,
        className
      )}
      style={{
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE 10+
        overscrollBehaviorX: 'contain',
        WebkitOverflowScrolling: 'touch', // For smooth scrolling on iOS
      }}
    >
      {children}

      <style jsx>{`
        .horizontal-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        .horizontal-scroll {
          -ms-overflow-style: none;
        }
      `}</style>
    </div>
  );
};

export default HorizScrollArea;
