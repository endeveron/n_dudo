'use client';

import { useEffect, useState } from 'react';

type ScreenSizeAlertProps = {
  minWidth?: number;
  minHeight?: number;
};

const ScreenSizeAlert = ({
  minWidth = 410,
  minHeight = 410,
}: ScreenSizeAlertProps) => {
  const [isTooSmall, setIsTooSmall] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsTooSmall(
        window.innerWidth < minWidth || window.innerHeight < minHeight
      );
    };

    checkSize();
    window.addEventListener('resize', checkSize);

    return () => {
      window.removeEventListener('resize', checkSize);
    };
  }, [minWidth, minHeight]);

  if (!isTooSmall) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-2xl z-40  cursor-default">
      <div className="max-w-96 flex-center flex-col gap-4 p-8 rounded-xl bg-card">
        <h3 className="title text-3xl">Small screen</h3>
        <div className="space-y-2 text-sm leading-relaxed text-center">
          <p>
            Try turning the device or switching to
            <br />a larger device for a better experience
          </p>
          {/* {window.innerWidth} x {window.innerHeight} */}
        </div>
      </div>
    </div>
  );
};

export default ScreenSizeAlert;
