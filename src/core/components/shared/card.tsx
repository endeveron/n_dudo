'use client';

import { forwardRef, ReactNode, useState } from 'react';

import { cn } from '@/core/utils/common';
import ToggleIcon from '~/public/icons/ui/chevron.svg';

export interface CardProps {
  children: ReactNode;
  title?: string;
  alignCenter?: boolean;
  className?: string;
  expandable?: boolean;
}

const Card = forwardRef<
  HTMLDivElement,
  CardProps & React.HTMLAttributes<HTMLDivElement>
>(({ children, className, alignCenter, title, expandable, ...props }, ref) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    if (!expandable) return;
    setExpanded((prev) => !prev);
  };

  return (
    <div
      ref={ref}
      className="card flex flex-col w-sm pb-6 px-4 rounded-2xl bg-card shadow-xs"
      {...props}
    >
      {title ? (
        <>
          <div
            className={cn(
              'relative flex justify-between text-sm mt-6 py-2 pl-2 text-accent font-bold leading-none tracking-wide',
              {
                'cursor-pointer': expandable,
              }
            )}
            onClick={handleExpand}
          >
            <div className="-translate-y-[1px]">{title}</div>

            {expandable ? (
              <div className="-translate-x-1">
                <ToggleIcon
                  className={cn(
                    'text-muted transition-transform origin-center',
                    {
                      'rotate-180': expanded,
                    }
                  )}
                />
              </div>
            ) : null}
            <div className="absolute top-0.5 bottom-0.5 -left-4 w-1 rounded-r-xs bg-accent"></div>
          </div>
        </>
      ) : (
        <div className="h-6"></div>
      )}
      <div
        className={cn(
          expandable && 'overflow-hidden',
          expandable && (expanded ? 'h-auto' : 'h-0'),
          className
        )}
      >
        <div
          className={cn(
            'card_content flex flex-col',
            {
              'flex-center': !!alignCenter,
            },
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
});
Card.displayName = 'Card';

export default Card;
