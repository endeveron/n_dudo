'use client';

import { useEffect, useState } from 'react';

type ScreenSizeAlertProps = {
  minWidth?: number;
  minHeight?: number;
};

const ScreenSizeAlert = ({
  minWidth = 640,
  minHeight = 540,
}: ScreenSizeAlertProps) => {
  const [isTooSmall, setIsTooSmall] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsTooSmall(
        window.innerWidth < minWidth || window.innerHeight < minHeight
      );
    };

    checkSize(); // Initial check
    window.addEventListener('resize', checkSize);

    return () => {
      window.removeEventListener('resize', checkSize);
    };
  }, [minWidth, minHeight]);

  if (!isTooSmall) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl z-40 screen-size-alert">
      <div className="max-w-96 flex-center flex-col gap-4 p-8 rounded-xl bg-card">
        <h2 className="text-3xl text-accent font-bold">Oops!</h2>
        <div className="space-y-2 text-sm leading-relaxed text-center">
          <p>
            Looks like your screen
            <br />
            is a bit too small for this game.
          </p>
          <p>
            Try turning the device or switching to
            <br />a larger device for a better experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScreenSizeAlert;
