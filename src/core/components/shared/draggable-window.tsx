'use client';

import { cn } from '@/core/utils/common';
import { useRef, useState, useEffect, PropsWithChildren } from 'react';

type DraggableWindowProps = PropsWithChildren & {
  title?: string;
  width?: number;
  height?: number;
};

const DraggableWindow = ({
  title,
  children,
  width = 380,
  height = 200,
}: DraggableWindowProps) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 24, y: 24 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [collapsed, setCollapsed] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging || collapsed) return;

      let newX = e.clientX - offset.x;
      let newY = e.clientY - offset.y;

      // Clamp position to prevent window from going outside the viewport
      newX = Math.max(0, Math.min(newX, window.innerWidth - width));
      newY = Math.max(0, Math.min(newY, window.innerHeight - height));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => setDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [collapsed, dragging, height, offset, width]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (collapsed) return;
    e.preventDefault(); // prevent text selection
    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDragging(true);
  };

  const collapseWindow = () => {
    setCollapsed(true);
    setShowContent(false);
  };

  const restoreWindow = () => {
    setCollapsed(false);
    setTimeout(() => {
      setShowContent(true);
    }, 50);
  };

  if (collapsed) {
    return (
      <div
        onClick={restoreWindow}
        className="fixed top-6 left-6 w-10 h-10 rounded-2xl border border-border bg-card flex-center cursor-pointer z-20"
        title="Restore"
      ></div>
    );
  }

  return (
    <div
      ref={windowRef}
      className="absolute bg-card/98 border border-border rounded-2xl select-none overflow-hidden z-20"
      style={{
        left: position.x,
        top: position.y,
        width,
        height,
      }}
    >
      {/* Draggable Header */}
      <div
        className="relative flex header h-10 border-b border-border cursor-move bg-white/2"
        onMouseDown={handleMouseDown}
      >
        {title ? (
          <div
            className={cn(
              `opacity-0 flex-center flex-1 text-sm text-muted/60 transition-opacity`,
              {
                'opacity-100': showContent,
              }
            )}
          >
            {title}
          </div>
        ) : null}

        <div
          onClick={collapseWindow}
          className="absolute top-0 left-0 h-10 w-10 flex-center text-sm text-muted/80 font-medium cursor-pointer"
          title="Collapse"
        >
          &mdash;
        </div>
      </div>
      {/* Content */}
      <div
        className={cn('opacity-0 p-4 transition-opacity', {
          'opacity-100': showContent,
        })}
      >
        {children}
      </div>
    </div>
  );
};

export default DraggableWindow;
